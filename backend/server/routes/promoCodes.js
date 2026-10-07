import express from 'express';
import PromoCode from '../models/PromoCode.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { validateBody } from '../middleware/validate.js';
import { promoCodeValidateSchema } from '../validation/schemas.js';

const router = express.Router();

// Get all promo codes (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get active promo codes (public)
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const promoCodes = await PromoCode.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: { $gt: 0 } },
        { usageLimit: null }
      ]
    }).sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single promo code
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    res.json(promoCode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Validate promo code (public)
router.post('/validate', validateBody(promoCodeValidateSchema), async (req, res) => {
  try {
    const { code, orderAmount, category } = req.body;
    const now = new Date();
    
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });
    
    if (!promoCode) {
      return res.status(400).json({ message: 'Invalid or expired promo code' });
    }
    
    if (promoCode.usedCount >= promoCode.usageLimit) {
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }
    
    if (orderAmount && orderAmount < promoCode.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount is ${promoCode.minOrderAmount}` 
      });
    }
    
    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = orderAmount * (promoCode.discountValue / 100);
    } else {
      discount = promoCode.discountValue;
    }
    
    if (promoCode.maxDiscountAmount && discount > promoCode.maxDiscountAmount) {
      discount = promoCode.maxDiscountAmount;
    }
    
    res.json({
      valid: true,
      discount,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      description: promoCode.description
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create promo code (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const promoCode = new PromoCode({
      ...req.body,
      code: req.body.code.toUpperCase(),
      createdBy: req.user._id
    });
    await promoCode.save();
    res.status(201).json(promoCode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update promo code (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { ...req.body, code: req.body.code?.toUpperCase() },
      { new: true, runValidators: true }
    );
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    res.json(promoCode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete promo code (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    res.json({ message: 'Promo code deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment usage count (internal use)
router.post('/:id/use', async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { $inc: { usedCount: 1 } },
      { new: true }
    );
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    res.json(promoCode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
