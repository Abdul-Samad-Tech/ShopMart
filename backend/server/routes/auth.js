import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendWelcomeEmail } from '../services/mail.js';
import { authenticateGoogleCredential } from '../services/googleAuth.js';
import { sendOTPEmail } from '../services/mail.js';
import { protect } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { clearAuthCookie, setAuthCookie, signAccessToken } from '../utils/cookies.js';
import {
  googleSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from '../validation/schemas.js';

const router = express.Router();

const issueSession = (res, status, body) => {
  const token = signAccessToken(body.user._id || body.user.id);
  setAuthCookie(res, token);
  res.status(status).json(body);
};

router.get('/config', (_req, res) => {
  const raw = String(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  const googleClientId =
    raw && !raw.includes('YOUR_CLIENT_ID') && raw.includes('.apps.googleusercontent.com') ? raw : null;
  res.json({
    googleEnabled: Boolean(googleClientId),
    googleClientId,
  });
});

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const normalizedEmail = String(email).toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      if (exists.googleId || exists.authProvider === 'google') {
        return res.status(400).json({
          message: 'This email is already registered with Google. Use “Continue with Google” to sign in.',
        });
      }
      return res.status(400).json({ message: 'Email already registered. Please sign in instead.' });
    }

    const user = await User.create({ name, email: normalizedEmail, password, authProvider: 'local' });
    user.logActivity('register', { email });
    await user.save();

    sendWelcomeEmail(user);

    const safe = await User.findById(user._id);
    issueSession(res, 201, { user: safe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordOk = Boolean(password) && (await user.comparePassword(password));
    if (!passwordOk) {
      if (user.googleId) {
        return res.status(401).json({
          message: 'Use “Continue with Google” for this email, or run npm run users:reset after npm run seed.',
        });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    user.logActivity('login', {});
    await user.save({ validateBeforeSave: false });

    const safe = await User.findById(user._id);
    issueSession(res, 200, { user: safe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/google', validateBody(googleSchema), async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential missing' });
    }

    const { user, isNewUser } = await authenticateGoogleCredential(credential);
    const safe = await User.findById(user._id);

    issueSession(res, 200, {
      user: safe,
      isNewUser,
      message: isNewUser ? 'Welcome! Check your inbox for a welcome email.' : undefined,
    });
  } catch (err) {
    console.error('[auth/google]', err.message);
    res.status(401).json({ message: err.message || 'Google sign-in failed' });
  }
});

// Send OTP for password reset
router.post('/send-otp', validateBody(sendOtpSchema), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // For security, don't reveal if email exists
      return res.json({ message: 'If the email exists, an OTP will be sent' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    await user.save({ validateBeforeSave: false });

    // Send OTP email
    await sendOTPEmail(user.email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('[auth/send-otp]', err.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', validateBody(verifyOtpSchema), async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+resetOTP +resetOTPExpiry');

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.resetOTP || !user.resetOTPExpiry) {
      return res.status(400).json({ message: 'No OTP requested. Please request a new OTP.' });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.resetOTPExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('[auth/verify-otp]', err.message);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Reset password
router.post('/reset-password', validateBody(resetPasswordSchema), async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password +resetOTP +resetOTPExpiry');

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify OTP was used (optional security check)
    if (!user.resetOTP || !user.resetOTPExpiry) {
      return res.status(400).json({ message: 'Please verify OTP first' });
    }

    if (new Date() > user.resetOTPExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('[auth/reset-password]', err.message);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

export default router;
