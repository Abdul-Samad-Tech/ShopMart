import express from 'express';
import GiftCard from '../models/GiftCard.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { sendGiftCardPurchaseEmail } from '../services/mail.js';

const router = express.Router();

// Generate random card number
const generateCardNumber = () => {
  return 'GC' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Generate random PIN
const generatePIN = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Get all gift cards (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const giftCards = await GiftCard.find()
      .populate('purchaser', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });
    res.json(giftCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's gift cards
router.get('/my', protect, async (req, res) => {
  try {
    const giftCards = await GiftCard.find({
      $or: [
        { purchaser: req.user._id },
        { recipient: req.user._id }
      ],
      status: 'active'
    }).sort({ createdAt: -1 });
    res.json(giftCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single gift card
router.get('/:id', protect, async (req, res) => {
  try {
    const giftCard = await GiftCard.findById(req.params.id)
      .populate('purchaser', 'name email')
      .populate('recipient', 'name email');
    
    if (!giftCard) {
      return res.status(404).json({ message: 'Gift card not found' });
    }
    
    // Check if user owns this card or is admin
    if (
      req.user.role !== 'admin' &&
      giftCard.purchaser._id.toString() !== req.user._id.toString() &&
      giftCard.recipient?._id?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(giftCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create gift card (purchase)
router.post('/', protect, async (req, res) => {
  try {
    const { amount, recipientEmail, recipientName, message } = req.body;
    
    const giftCard = new GiftCard({
      cardNumber: generateCardNumber(),
      pin: generatePIN(),
      amount,
      balance: amount,
      issuedDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
      purchaser: req.user._id,
      recipientEmail,
      recipientName,
      message,
      status: 'active'
    });
    
    await giftCard.save();
    
    // Add to user's gift cards
    await User.findByIdAndUpdate(req.user._id, {
      $push: { giftCards: giftCard._id }
    });
    
    // If recipient email matches a user, assign to them
    if (recipientEmail) {
      const recipient = await User.findOne({ email: recipientEmail.toLowerCase() });
      if (recipient) {
        giftCard.recipient = recipient._id;
        await giftCard.save();
        await User.findByIdAndUpdate(recipient._id, {
          $push: { giftCards: giftCard._id }
        });
      }
    }
    
    // Send email notification to purchaser
    const purchaser = await User.findById(req.user._id);
    sendGiftCardPurchaseEmail({
      name: purchaser.name,
      email: purchaser.email,
      cardNumber: giftCard.cardNumber,
      amount: giftCard.amount,
      recipientEmail: giftCard.recipientEmail,
      recipientName: giftCard.recipientName
    });
    
    res.status(201).json(giftCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Check gift card balance
router.post('/:id/check-balance', protect, async (req, res) => {
  try {
    const { cardNumber, pin } = req.body;
    
    const giftCard = await GiftCard.findOne({
      cardNumber: cardNumber.toUpperCase(),
      pin: pin.toUpperCase(),
      status: 'active'
    });
    
    if (!giftCard) {
      return res.status(404).json({ message: 'Invalid gift card or PIN' });
    }
    
    if (new Date() > giftCard.expiryDate) {
      giftCard.status = 'expired';
      await giftCard.save();
      return res.status(400).json({ message: 'Gift card has expired' });
    }
    
    res.json({
      cardNumber: giftCard.cardNumber,
      balance: giftCard.balance,
      amount: giftCard.amount,
      expiryDate: giftCard.expiryDate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Redeem gift card
router.post('/:id/redeem', protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    const giftCard = await GiftCard.findById(req.params.id);
    
    if (!giftCard) {
      return res.status(404).json({ message: 'Gift card not found' });
    }
    
    if (giftCard.status !== 'active') {
      return res.status(400).json({ message: 'Gift card is not active' });
    }
    
    if (new Date() > giftCard.expiryDate) {
      giftCard.status = 'expired';
      await giftCard.save();
      return res.status(400).json({ message: 'Gift card has expired' });
    }
    
    if (giftCard.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Deduct amount
    giftCard.balance -= amount;
    giftCard.transactions.push({
      amount: -amount,
      type: 'debit',
      description: 'Redeemed for order',
      order: orderId,
      date: new Date()
    });
    
    if (giftCard.balance === 0) {
      giftCard.status = 'redeemed';
    }
    
    await giftCard.save();
    
    res.json({
      success: true,
      balance: giftCard.balance,
      message: `PKR ${amount} redeemed successfully`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update gift card (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const giftCard = await GiftCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!giftCard) {
      return res.status(404).json({ message: 'Gift card not found' });
    }
    res.json(giftCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete gift card (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const giftCard = await GiftCard.findByIdAndDelete(req.params.id);
    if (!giftCard) {
      return res.status(404).json({ message: 'Gift card not found' });
    }
    // Remove from users' gift cards
    await User.updateMany(
      { giftCards: req.params.id },
      { $pull: { giftCards: req.params.id } }
    );
    res.json({ message: 'Gift card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
