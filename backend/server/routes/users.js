import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.json(user);
});

router.patch('/me', protect, async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findById(req.user.id);
  if (name) user.name = name;
  if (avatar !== undefined) {
    if (avatar && avatar.length > 600_000) {
      return res.status(400).json({ message: 'Image too large. Use a smaller photo.' });
    }
    user.avatar = avatar;
  }
  user.logActivity('profile_update', { name });
  await user.save();
  res.json(user);
});

router.get('/me/orders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/me/activity', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('activityLog');
  res.json(user.activityLog || []);
});

router.get('/me/wishlist', protect, async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.json(user.wishlist || []);
});

router.post('/me/wishlist/:productId', protect, async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const user = await User.findById(req.user.id);
  const id = product._id.toString();
  const idx = user.wishlist.findIndex((w) => w.toString() === id);
  if (idx >= 0) {
    user.wishlist.splice(idx, 1);
    user.logActivity('wishlist_remove', { productId: id });
  } else {
    user.wishlist.push(product._id);
    user.logActivity('wishlist_add', { productId: id });
  }
  await user.save();
  await user.populate('wishlist');
  res.json(user.wishlist);
});

export default router;
