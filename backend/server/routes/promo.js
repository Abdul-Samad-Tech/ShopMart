import express from 'express';

const router = express.Router();

const PROMO_CODES = {
  LUXURY10: { type: 'percent', discount: 10, label: '10% off luxury picks' },
  GOLD50: { type: 'fixed', discount: 50, minSubtotal: 100, label: '$50 off orders $100+' },
  WELCOME15: { type: 'percent', discount: 15, label: '15% welcome discount' },
  SHIPHUB: { type: 'percent', discount: 5, label: '5% member savings' },
};

router.post('/validate', (req, res) => {
  const code = String(req.body.code || '')
    .trim()
    .toUpperCase();
  const subtotal = Number(req.body.subtotal) || 0;

  const promo = PROMO_CODES[code];
  if (!promo) {
    return res.status(400).json({ message: 'Invalid or expired promo code' });
  }

  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return res.status(400).json({
      message: `Minimum order $${promo.minSubtotal} required for this code`,
    });
  }

  res.json({
    code,
    type: promo.type,
    discount: promo.discount,
    label: promo.label,
  });
});

export default router;
