import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import LoyaltyCard from '../models/LoyaltyCard.js';
import PromoCode from '../models/PromoCode.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createOrderSchema } from '../validation/schemas.js';
import { 
  sendOrderConfirmationEmail, 
  sendLoyaltyPointsEarnedEmail,
  sendPromoCodeAppliedEmail,
  sendGiftCardPurchaseEmail
} from '../services/mail.js';

const router = express.Router();

const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SH${timestamp}${random}`;
};

const formatOrderId = (order) => {
  return order.orderId || (order.id || order._id?.toString())?.slice(-6).toUpperCase() || '';
};

router.post('/', optionalAuth, validateBody(createOrderSchema), async (req, res) => {
  try {
    const { items, shipping, paymentMethod, subtotal, tax, total, discount, shippingCost, promoCode, useLoyaltyPoints, loyaltyPointsToRedeem } =
      req.body;

    if (!req.user && !shipping?.phone?.trim()) {
      return res.status(400).json({ message: 'Phone number is required for guest checkout' });
    }

    const guestEmail = shipping.email.trim().toLowerCase();
    const isGuest = !req.user;

    const order = await Order.create({
      orderId: generateOrderId(),
      user: req.user?.id,
      isGuest,
      guestEmail: isGuest ? guestEmail : undefined,
      items,
      shipping,
      paymentMethod,
      subtotal,
      discount: discount || 0,
      shippingCost: shippingCost ?? 0,
      promoCode: promoCode || '',
      tax,
      total,
      status: 'processing',
    });

    if (req.user) {
      await Notification.create({
        user: req.user.id,
        type: 'order',
        title: 'Order confirmed',
        message: `Your order #${formatOrderId(order)} is being prepared.`,
        link: '/dashboard',
      });

      const user = await User.findById(req.user.id);
      sendOrderConfirmationEmail(user, order);

      // Handle loyalty points redemption
      if (useLoyaltyPoints && loyaltyPointsToRedeem > 0) {
        let loyaltyCard = await LoyaltyCard.findOne({ user: req.user.id });
        
        if (!loyaltyCard || !loyaltyCard.isActive) {
          return res.status(400).json({ message: 'Loyalty card is not active' });
        }
        
        if (loyaltyCard.pointsBalance < loyaltyPointsToRedeem) {
          return res.status(400).json({ message: 'Insufficient loyalty points balance' });
        }
        
        await loyaltyCard.redeemPoints(loyaltyPointsToRedeem, 'Points redeemed for order', order._id);
      }

      // Add loyalty points (1 point per PKR 100 spent) - only if not paying with points
      if (!useLoyaltyPoints) {
        const pointsEarned = Math.floor(total / 100);
        // Always add at least 1 point for any purchase
        const finalPointsEarned = pointsEarned > 0 ? pointsEarned : 1;
        
        let loyaltyCard = await LoyaltyCard.findOne({ user: req.user.id });
        
        if (!loyaltyCard) {
          // Create loyalty card if doesn't exist
          const generateCardNumber = () => 'LC' + Math.random().toString(36).substring(2, 10).toUpperCase();
          loyaltyCard = new LoyaltyCard({
            cardNumber: generateCardNumber(),
            user: req.user.id,
            tier: 'Silver',
            points: 0,
            pointsBalance: 0,
            totalEarned: 0,
            totalRedeemed: 0,
            issuedDate: new Date(),
            lastActivity: new Date()
          });
          await loyaltyCard.save();
          await User.findByIdAndUpdate(req.user.id, { loyaltyCard: loyaltyCard._id });
        }

        await loyaltyCard.addPoints(finalPointsEarned, 'Points earned from order', order._id);
        
        // Send loyalty points email
        sendLoyaltyPointsEarnedEmail({
          name: user.name,
          email: user.email,
          points: finalPointsEarned,
          newBalance: loyaltyCard.pointsBalance,
          tier: loyaltyCard.tier
        });
      }

      // Send promo code email if used
      if (promoCode && discount > 0) {
        sendPromoCodeAppliedEmail({
          name: user.name,
          email: user.email,
          code: promoCode,
          discount: discount
        });

        // Increment promo code usage
        await PromoCode.findOneAndUpdate(
          { code: promoCode.toUpperCase() },
          { $inc: { usedCount: 1 } }
        );
      }
    } else {
      sendOrderConfirmationEmail(
        {
          email: guestEmail,
          name: [shipping.firstName, shipping.lastName].filter(Boolean).join(' ') || 'Customer',
        },
        order
      );
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/track/:id', async (req, res) => {
  try {
    const email = req.query.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: 'Email is required to view this order' });
    }

    let order = await Order.findOne({ orderId: req.params.id });
    if (!order && /^[a-f\d]{24}$/i.test(req.params.id)) {
      order = await Order.findById(req.params.id);
    }
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const orderEmail = (order.guestEmail || order.shipping?.email || '').toLowerCase();
    if (orderEmail !== email) {
      return res.status(403).json({ message: 'Email does not match this order' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
