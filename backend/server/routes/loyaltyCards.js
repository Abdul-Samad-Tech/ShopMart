import express from 'express';
import LoyaltyCard from '../models/LoyaltyCard.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { sendLoyaltyCardActivatedEmail } from '../services/mail.js';

const router = express.Router();

// Generate random card number
const generateCardNumber = () => {
  return 'LC' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Get all loyalty cards (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const loyaltyCards = await LoyaltyCard.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(loyaltyCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's loyalty card
router.get('/my', protect, async (req, res) => {
  try {
    let loyaltyCard = await LoyaltyCard.findOne({ user: req.user._id });
    
    if (!loyaltyCard) {
      // Create new loyalty card for user
      loyaltyCard = new LoyaltyCard({
        cardNumber: generateCardNumber(),
        user: req.user._id,
        tier: 'Silver',
        points: 0,
        pointsBalance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        issuedDate: new Date(),
        lastActivity: new Date()
      });
      await loyaltyCard.save();
      
      // Update user with loyalty card
      await User.findByIdAndUpdate(req.user._id, {
        loyaltyCard: loyaltyCard._id
      });
    }
    
    res.json(loyaltyCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single loyalty card
router.get('/:id', protect, async (req, res) => {
  try {
    const loyaltyCard = await LoyaltyCard.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!loyaltyCard) {
      return res.status(404).json({ message: 'Loyalty card not found' });
    }
    
    // Check if user owns this card or is admin
    if (
      req.user.role !== 'admin' &&
      loyaltyCard.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(loyaltyCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create loyalty card (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { userId, tier, points } = req.body;
    
    const loyaltyCard = new LoyaltyCard({
      cardNumber: generateCardNumber(),
      user: userId,
      tier: tier || 'Silver',
      points: points || 0,
      pointsBalance: points || 0,
      totalEarned: points || 0,
      issuedDate: new Date(),
      lastActivity: new Date()
    });
    
    await loyaltyCard.save();
    
    // Update user with loyalty card
    await User.findByIdAndUpdate(userId, {
      loyaltyCard: loyaltyCard._id
    });
    
    res.status(201).json(loyaltyCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add points to loyalty card
router.post('/:id/add-points', protect, async (req, res) => {
  try {
    const { points, description, orderId } = req.body;
    
    const loyaltyCard = await LoyaltyCard.findById(req.params.id);
    
    if (!loyaltyCard) {
      return res.status(404).json({ message: 'Loyalty card not found' });
    }
    
    // Check if user owns this card or is admin
    if (
      req.user.role !== 'admin' &&
      loyaltyCard.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await loyaltyCard.addPoints(points, description, orderId);
    
    res.json(loyaltyCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Redeem points from loyalty card
router.post('/:id/redeem-points', protect, async (req, res) => {
  try {
    const { points, description, orderId } = req.body;
    
    const loyaltyCard = await LoyaltyCard.findById(req.params.id);
    
    if (!loyaltyCard) {
      return res.status(404).json({ message: 'Loyalty card not found' });
    }
    
    // Check if user owns this card or is admin
    if (
      req.user.role !== 'admin' &&
      loyaltyCard.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await loyaltyCard.redeemPoints(points, description, orderId);
    
    res.json(loyaltyCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get loyalty card transactions
router.get('/:id/transactions', protect, async (req, res) => {
  try {
    const loyaltyCard = await LoyaltyCard.findById(req.params.id);
    
    if (!loyaltyCard) {
      return res.status(404).json({ message: 'Loyalty card not found' });
    }
    
    // Check if user owns this card or is admin
    if (
      req.user.role !== 'admin' &&
      loyaltyCard.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(loyaltyCard.transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user's own loyalty card status
router.patch('/my', protect, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    let loyaltyCard = await LoyaltyCard.findOne({ user: req.user._id });
    
    if (!loyaltyCard) {
      return res.status(404).json({ message: 'Loyalty card not found' });
    }
    
    const wasInactive = !loyaltyCard.isActive;
    loyaltyCard.isActive = isActive !== undefined ? isActive : loyaltyCard.isActive;
    await loyaltyCard.save();
    
    // Send email notification when card is activated
    if (wasInactive && loyaltyCard.isActive) {
      const user = await User.findById(req.user._id);
      sendLoyaltyCardActivatedEmail({
        name: user.name,
        email: user.email,
        cardNumber: loyaltyCard.cardNumber,
        tier: loyaltyCard.tier,
        pointsBalance: loyaltyCard.pointsBalance
      });
    }
    
    res.json(loyaltyCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update loyalty card (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const loyaltyCard = await LoyaltyCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!loyaltyCard) {
      return res.status(404).json({ message: 'Loyalty card not found' });
    }
    res.json(loyaltyCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete loyalty card (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const loyaltyCard = await LoyaltyCard.findByIdAndDelete(req.params.id);
    if (!loyaltyCard) {
      return res.status(404).json({ message: 'Loyalty card not found' });
    }
    // Remove from user
    await User.findByIdAndUpdate(loyaltyCard.user, {
      $unset: { loyaltyCard: '' }
    });
    res.json({ message: 'Loyalty card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
