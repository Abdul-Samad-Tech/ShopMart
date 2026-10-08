import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from '../server/config/db.js';
import { assertProductionSecrets } from '../server/utils/secrets.js';
import { verifyMailConnection } from '../server/services/mail.js';
import { ensureDemoUsers } from '../server/utils/ensureDemoUsers.js';
import { isValidGeminiKey, getEnvApiKey } from '../server/services/gemini.js';
import productRoutes from '../server/routes/products.js';
import contentRoutes from '../server/routes/content.js';
import authRoutes from '../server/routes/auth.js';
import userRoutes from '../server/routes/users.js';
import orderRoutes from '../server/routes/orders.js';
import testimonialRoutes from '../server/routes/testimonials.js';
import notificationRoutes from '../server/routes/notifications.js';
import promoRoutes from '../server/routes/promo.js';
import adminRoutes from '../server/routes/admin.js';
import chatRoutes from '../server/routes/chat.js';
import contactRoutes from '../server/routes/contact.js';
import ghostCartRoutes from '../server/routes/ghostCarts.js';
import reviewRoutes from '../server/routes/reviews.js';
import promoCodeRoutes from '../server/routes/promoCodes.js';
import giftCardRoutes from '../server/routes/giftCards.js';
import loyaltyCardRoutes from '../server/routes/loyaltyCards.js';
import supplierFormRoutes from '../server/routes/supplierForm.js';
import careerFormRoutes from '../server/routes/careerForm.js';
import categoryRoutes from '../server/routes/categories.js';
import blogRoutes from '../server/routes/blog.js';
import eventRoutes from '../server/routes/events.js';
import brandRoutes from '../server/routes/brands.js';
import storeRoutes from '../server/routes/stores.js';

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

if (isProd) app.set('trust proxy', 1);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Try again in a few minutes.' },
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Try again in 15 minutes.' },
});

const STRICT_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/auth/send-otp',
  '/api/auth/verify-otp',
  '/api/auth/reset-password',
  '/api/contact',
  '/api/chat',
  '/api/chat/validate-key',
]);

app.use(helmet());
app.use(compression());
app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      const clientUrl = process.env.CLIENT_URL;
      const localhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
      if (!isProd && localhost.test(origin)) {
        callback(null, true);
        return;
      }
      if (clientUrl && origin === clientUrl) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  const avatarUpdate = req.method === 'PATCH' && req.path === '/api/users/me';
  return express.json({ limit: avatarUpdate ? '700kb' : '100kb' })(req, res, next);
});

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  if (STRICT_PATHS.has(req.path)) return strictLimiter(req, res, next);
  return generalLimiter(req, res, next);
});

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
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Origin not allowed' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large' });
  }
  console.error(err?.message || 'Server error');
  const message = isProd ? 'Server error' : err?.message || 'Server error';
  res.status(500).json({ message });
});

let isDBConnected = false;

const connectIfNeeded = async () => {
  if (!isDBConnected) {
    try {
      await connectDB();
      isDBConnected = true;
      if (process.env.NODE_ENV !== 'production') {
        await ensureDemoUsers();
      }
      await verifyMailConnection();
      
      const envKey = getEnvApiKey();
      if (isValidGeminiKey(envKey)) {
        console.log('[gemini] API key loaded from environment');
      } else {
        console.warn('[gemini] No valid GEMINI_API_KEY in environment');
      }
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
    }
  }
};

// For Vercel serverless
const handler = async (req, res) => {
  await connectIfNeeded();
  return app(req, res);
};

export default handler;