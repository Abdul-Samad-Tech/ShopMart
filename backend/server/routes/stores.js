import express from 'express';
import Store from '../models/Store.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Get all stores (public)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, featured, active, city } = req.query;
    const query = {};
    
    if (featured === 'true') query.featured = true;
    if (active === 'true') query.active = true;
    if (city) query.city = city;
    
    const stores = await Store.find(query)
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Store.countDocuments(query);
    
    res.json({
      stores,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single store by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create store (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update store (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete store (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
