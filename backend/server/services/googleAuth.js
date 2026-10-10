import crypto from 'crypto';
import User from '../models/User.js';
import { sendWelcomeEmail } from './mail.js';
import { verifyGoogleIdToken } from './verifyGoogleToken.js';

export async function authenticateGoogleCredential(credential) {
  const clientId = String(
    process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || ''
  ).trim();

  if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
    console.error('[Google Auth] Missing or invalid CLIENT_ID:', clientId);
    throw new Error('Google Sign-In is not configured on the server');
  }

  let payload;
  try {
    payload = await verifyGoogleIdToken(credential, clientId);
  } catch (err) {
    const msg = String(err.message || err);
    if (msg.includes('jwt expired')) {
      throw new Error('Google session expired. Please try again.');
    }
    if (msg.includes('jwt not active') || msg.includes('nbf')) {
      throw new Error(
        'System clock is out of sync. Windows: Settings → Time → Set time automatically, then retry.'
      );
    }
    throw new Error(msg.includes('audience') ? 'Google app misconfigured (wrong Client ID).' : msg);
  }

  if (!payload?.email) {
    throw new Error('Google account email not available');
  }

  const email = payload.email.toLowerCase();
  const googleId = payload.sub;
  let isNewUser = false;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    if (!user.googleId) user.googleId = googleId;
    if (user.authProvider !== 'local') user.authProvider = 'google';
    if (payload.picture && !user.avatar) user.avatar = payload.picture;
    if (payload.name && user.name !== payload.name) user.name = payload.name;
    user.logActivity('google_login', {});
    await user.save({ validateBeforeSave: false });
  } else {
    isNewUser = true;
    user = await User.create({
      name: payload.name || email.split('@')[0],
      email,
      googleId,
      authProvider: 'google',
      avatar: payload.picture || '',
      password: crypto.randomBytes(32).toString('hex'),
    });
    user.logActivity('google_register', { email });
    await user.save({ validateBeforeSave: false });
  }

  if (isNewUser) {
    sendWelcomeEmail(user);
  }

  return { user, isNewUser };
}

export function isGoogleConfigured() {
  const raw = String(process.env.GOOGLE_CLIENT_ID || '').trim();
  return Boolean(raw && raw.includes('.apps.googleusercontent.com'));
}
