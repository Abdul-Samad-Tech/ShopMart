import express from 'express';
import Notification from '../models/Notification.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const filter = req.user
      ? { $or: [{ user: req.user.id }, { broadcast: true }] }
      : { broadcast: true };

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(30);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/read', protect, async (req, res) => {
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true },
    { new: true }
  );
  if (!n) return res.status(404).json({ message: 'Not found' });
  res.json(n);
});

router.patch('/read-all', protect, async (req, res) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
  res.json({ success: true });
});

export default router;
