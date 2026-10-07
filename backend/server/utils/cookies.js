import { getJwtSecret } from './secrets.js';
import jwt from 'jsonwebtoken';

export const ACCESS_COOKIE = 'access_token';

export function jwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRES || '7d';
}

function durationToMs(value) {
  const match = String(value).trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const scale = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return amount * scale[unit];
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: durationToMs(jwtExpiresIn()),
  };
}

export function signAccessToken(userId) {
  return jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: jwtExpiresIn() });
}

export function setAuthCookie(res, token) {
  res.cookie(ACCESS_COOKIE, token, authCookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(ACCESS_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}
