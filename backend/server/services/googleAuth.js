import crypto from 'crypto';
import User from '../models/User.js';
import { sendWelcomeEmail } from './mail.js';
import { verifyGoogleIdToken } from './verifyGoogleToken.js';

function readGoogleClientId() {
  const clientId = String(
    process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || ''
  ).trim();
  if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
    throw new Error('Google Sign-In is not configured on the server');
  }
  return clientId;
}

async function upsertGoogleUser(profile) {
  const email = profile.email.toLowerCase();
  const googleId = profile.sub;
  let isNewUser = false;
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    if (!user.googleId) user.googleId = googleId;
    if (user.authProvider !== 'local') user.authProvider = 'google';
    if (profile.picture && !user.avatar) user.avatar = profile.picture;
    if (profile.name && user.name !== profile.name) user.name = profile.name;
    user.logActivity('google_login', {});
    await user.save({ validateBeforeSave: false });
  } else {
    isNewUser = true;
    user = await User.create({
      name: profile.name || email.split('@')[0],
      email,
      googleId,
      authProvider: 'google',
      avatar: profile.picture || '',
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

export async function authenticateGoogleCredential(credential) {
  const clientId = readGoogleClientId();

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

  return upsertGoogleUser(payload);
}

export async function authenticateGoogleAccessToken(accessToken) {
  const clientId = readGoogleClientId();
  const infoRes = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
  );
  if (!infoRes.ok) {
    throw new Error('Google sign-in expired. Please try again.');
  }
  const info = await infoRes.json();
  if (info.azp !== clientId && info.aud !== clientId) {
    throw new Error('Google app misconfigured (wrong Client ID).');
  }

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!profileRes.ok) {
    throw new Error('Google account email not available');
  }
  const profile = await profileRes.json();
  if (!profile.email) {
    throw new Error('Google account email not available');
  }
  if (profile.email_verified === false) {
    throw new Error('Google email is not verified');
  }

  return upsertGoogleUser({
    email: profile.email,
    sub: profile.sub || info.sub,
    name: profile.name,
    picture: profile.picture,
  });
}

export function isGoogleConfigured() {
  const raw = String(process.env.GOOGLE_CLIENT_ID || '').trim();
  return Boolean(raw && raw.includes('.apps.googleusercontent.com'));
}
