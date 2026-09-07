import express from 'express';
import crypto from 'crypto';
import GhostCart from '../models/GhostCart.js';

const router = express.Router();

const makeToken = () => crypto.randomBytes(5).toString('hex');

router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const token = makeToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await GhostCart.create({
      token,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        category: i.category,
      })),
      expiresAt,
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.status(201).json({
      token,
      url: `${clientUrl}/cart/shared/${token}`,
      expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:token', async (req, res) => {
  try {
    const cart = await GhostCart.findOne({ token: req.params.token });
    if (!cart) return res.status(404).json({ message: 'Cart link expired or not found' });
    res.json({
      token: cart.token,
      items: cart.items,
      expiresAt: cart.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
