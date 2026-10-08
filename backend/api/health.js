import mongoose from 'mongoose';
import connectDB from '../server/config/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const dbReady = mongoose.connection.readyState === 1;
    res.status(dbReady ? 200 : 503).json({ ok: dbReady, db: dbReady });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}