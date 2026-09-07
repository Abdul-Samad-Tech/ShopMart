import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import ContactMessage from '../models/ContactMessage.js';
import PromoCode from '../models/PromoCode.js';
import GiftCard from '../models/GiftCard.js';
import LoyaltyCard from '../models/LoyaltyCard.js';
import PageContent from '../models/PageContent.js';
import Category from '../models/Category.js';
import CareerApplication from '../models/CareerApplication.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { sendOrderDeliveredEmail } from '../services/mail.js';

const router = express.Router();
router.use(protect, adminOnly);

router.get('/stats', async (_req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totals, revenueAgg, ordersByStatus, recentOrders, salesByDay, contactStats] = await Promise.all([
      Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      ]),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('user', 'name email')
        .lean(),
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Promise.all([
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ status: 'new' }),
      ]),
    ]);

    const [users, products, orders, ordersLast30] = totals;
    const [contactMessages, unreadMessages] = contactStats;
    const revenue = revenueAgg[0]?.revenue || 0;

    res.json({
      users,
      products,
      orders,
      ordersLast30,
      contactMessages,
      unreadMessages,
      revenue,
      ordersByStatus: ordersByStatus.map((s) => ({ status: s._id, count: s.count })),
      salesByDay: salesByDay.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
      recentOrders: recentOrders.map((o) => ({
        ...o,
        id: o._id?.toString(),
        userName: o.user?.name,
        userEmail: o.user?.email,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const [products, orderedProductIds] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).limit(limit).lean(),
      Order.distinct('items.product'),
    ]);
    const orderedSet = new Set(
      orderedProductIds.filter(Boolean).map((id) => id.toString())
    );
    res.json(
      products.map((p) => {
        const id = p._id?.toString();
        return {
          ...p,
          id,
          hasOrders: orderedSet.has(id),
          isActive: p.isActive !== false,
        };
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/products/:id/status', async (req, res) => {
  try {
    const isActive = Boolean(req.body?.isActive);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({
      ...product.toObject(),
      id: product._id?.toString(),
      isActive: product.isActive !== false,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const orderCount = await Order.countDocuments({
      'items.product': req.params.id,
    });
    if (orderCount > 0) {
      return res.status(400).json({
        message:
          'This product has been ordered and cannot be deleted. Set it inactive instead.',
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .lean();
    res.json(
      orders.map((o) => ({
        ...o,
        id: o._id?.toString(),
        userName: o.user?.name,
        userEmail: o.user?.email,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const previous = await Order.findById(req.params.id);
    if (!previous) return res.status(404).json({ message: 'Order not found' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (status === 'delivered' && previous.status !== 'delivered' && order.user) {
      sendOrderDeliveredEmail(order.user, order);
    }

    const plain = order.toObject ? order.toObject() : order;
    res.json({
      ...plain,
      id: plain._id?.toString(),
      userName: order.user?.name,
      userEmail: order.user?.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(100).lean();
    res.json(users.map((u) => ({ ...u, id: u._id?.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ ...userResponse, id: user._id?.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.password = password;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const userResponse = user.toObject();
    res.json({ ...userResponse, id: user._id?.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 200);
    const status = req.query.status;
    const filter = status && status !== 'all' ? { status } : {};
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .lean();
    res.json(
      messages.map((m) => ({
        ...m,
        id: m._id?.toString(),
        userName: m.user?.name,
        userEmail: m.user?.email,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/messages/:id', async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id).populate('user', 'name email');
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    if (msg.status === 'new') {
      msg.status = 'read';
      await msg.save();
    }
    const plain = msg.toObject();
    res.json({
      ...plain,
      id: plain._id?.toString(),
      userName: msg.user?.name,
      userEmail: msg.user?.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/messages/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'read', 'replied'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    const plain = msg.toObject();
    res.json({
      ...plain,
      id: plain._id?.toString(),
      userName: msg.user?.name,
      userEmail: msg.user?.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Promo Codes CRUD
router.get('/promo-codes', async (_req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/promo-codes', async (req, res) => {
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

router.put('/promo-codes/:id', async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { ...req.body, code: req.body.code?.toUpperCase() },
      { new: true, runValidators: true }
    );
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.json(promoCode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/promo-codes/:id', async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Gift Cards CRUD
router.get('/gift-cards', async (_req, res) => {
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

router.put('/gift-cards/:id', async (req, res) => {
  try {
    const giftCard = await GiftCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!giftCard) return res.status(404).json({ message: 'Gift card not found' });
    res.json(giftCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/gift-cards/:id', async (req, res) => {
  try {
    const giftCard = await GiftCard.findByIdAndDelete(req.params.id);
    if (!giftCard) return res.status(404).json({ message: 'Gift card not found' });
    await User.updateMany(
      { giftCards: req.params.id },
      { $pull: { giftCards: req.params.id } }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Loyalty Cards CRUD
router.get('/loyalty-cards', async (_req, res) => {
  try {
    const loyaltyCards = await LoyaltyCard.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(loyaltyCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/loyalty-cards', async (req, res) => {
  try {
    const generateCardNumber = () => 'LC' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const loyaltyCard = new LoyaltyCard({
      cardNumber: generateCardNumber(),
      ...req.body
    });
    await loyaltyCard.save();
    
    await User.findByIdAndUpdate(req.body.user, {
      loyaltyCard: loyaltyCard._id
    });
    
    res.status(201).json(loyaltyCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/loyalty-cards/:id', async (req, res) => {
  try {
    const loyaltyCard = await LoyaltyCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!loyaltyCard) return res.status(404).json({ message: 'Loyalty card not found' });
    res.json(loyaltyCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/loyalty-cards/:id', async (req, res) => {
  try {
    const loyaltyCard = await LoyaltyCard.findByIdAndDelete(req.params.id);
    if (!loyaltyCard) return res.status(404).json({ message: 'Loyalty card not found' });
    await User.findByIdAndUpdate(loyaltyCard.user, {
      $unset: { loyaltyCard: '' }
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Page Content CRUD
router.get('/page-content', async (_req, res) => {
  try {
    const pages = await PageContent.find().sort({ key: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/page-content/:key', async (req, res) => {
  try {
    const page = await PageContent.findOne({ key: req.params.key });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/page-content', async (req, res) => {
  try {
    const page = new PageContent(req.body);
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/page-content/:key', async (req, res) => {
  try {
    const page = await PageContent.findOneAndUpdate(
      { key: req.params.key },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    res.json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/page-content/:key', async (req, res) => {
  try {
    const page = await PageContent.findOneAndDelete({ key: req.params.key });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Category CRUD
router.get('/categories', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Career Applications CRUD
router.get('/career-applications', async (_req, res) => {
  try {
    const applications = await CareerApplication.find()
      .sort({ appliedDate: -1 })
      .lean();
    res.json(applications.map(app => ({ ...app, id: app._id?.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/career-applications/:id', async (req, res) => {
  try {
    const application = await CareerApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/career-applications/:id', async (req, res) => {
  try {
    const application = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        reviewedDate: req.body.status && req.body.status !== 'pending' ? new Date() : undefined,
        reviewedBy: req.user.id
      },
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/career-applications/:id', async (req, res) => {
  try {
    const application = await CareerApplication.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
