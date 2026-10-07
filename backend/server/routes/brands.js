import express from 'express';
import Brand from '../models/Brand.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Get all brands (public)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, featured, active } = req.query;
    const query = {};
    
    if (featured === 'true') query.featured = true;
    if (active === 'true') query.active = true;
    
    const brands = await Brand.find(query)
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Brand.countDocuments(query);
    
    res.json({
      brands,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single brand by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create brand (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update brand (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete brand (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
