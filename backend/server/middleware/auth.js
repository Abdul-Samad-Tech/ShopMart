import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ACCESS_COOKIE, clearAuthCookie } from '../utils/cookies.js';
import { getJwtSecret } from '../utils/secrets.js';

function readToken(req) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  const cookie = req.cookies?.[ACCESS_COOKIE];
  return cookie || null;
}

async function userFromToken(token) {
  const decoded = jwt.verify(token, getJwtSecret());
  return User.findById(decoded.id).select('-password');
}

export const protect = async (req, res, next) => {
  try {
    const token = readToken(req);
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    const user = await userFromToken(token);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch {
    clearAuthCookie(res);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = readToken(req);
    req.user = token ? await userFromToken(token) : null;
  } catch {
    req.user = null;
  }
  next();
};
