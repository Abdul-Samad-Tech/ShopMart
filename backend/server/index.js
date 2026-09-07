import './config/env.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { verifyMailConnection } from './services/mail.js';
import { ensureDemoUsers } from './utils/ensureDemoUsers.js';
import { isGeminiConfigured, getGeminiKeyHint, isValidGeminiKey, getEnvApiKey } from './services/gemini.js';
import productRoutes from './routes/products.js';
import contentRoutes from './routes/content.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import testimonialRoutes from './routes/testimonials.js';
import notificationRoutes from './routes/notifications.js';
import promoRoutes from './routes/promo.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';
import contactRoutes from './routes/contact.js';
import ghostCartRoutes from './routes/ghostCarts.js';
import reviewRoutes from './routes/reviews.js';
import promoCodeRoutes from './routes/promoCodes.js';
import giftCardRoutes from './routes/giftCards.js';
import loyaltyCardRoutes from './routes/loyaltyCards.js';
import supplierFormRoutes from './routes/supplierForm.js';
import careerFormRoutes from './routes/careerForm.js';
import categoryRoutes from './routes/categories.js';
import blogRoutes from './routes/blog.js';
import eventRoutes from './routes/events.js';
import brandRoutes from './routes/brands.js';
import storeRoutes from './routes/stores.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }
      const allowed = process.env.CLIENT_URL || 'http://localhost:5173';
      callback(null, origin === allowed ? origin : allowed);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({ ok: dbReady, db: dbReady });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not connected. Check MONGODB_URI in .env' });
  }
  next();
});

app.use('/api/products', productRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ghost-carts', ghostCartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/gift-cards', giftCardRoutes);
app.use('/api/loyalty-cards', loyaltyCardRoutes);
app.use('/api/supplier-form', supplierFormRoutes);
app.use('/api/career-form', careerFormRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/stores', storeRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

const start = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== 'production') {
      await ensureDemoUsers();
      console.log('Demo users ready: demo@shophub.com / demo123');
    }
    await verifyMailConnection();

    const envKey = getEnvApiKey();
    if (isValidGeminiKey(envKey)) {
      console.log(`[gemini] API key loaded from .env (${getGeminiKeyHint()})`);
    } else {
      console.warn(
        '[gemini] No valid GEMINI_API_KEY in .env — use AIza key in .env OR paste in chat widget setup'
      );
    }
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Fix MONGODB_URI in .env, then run: npm run dev');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
  });
};

start();
