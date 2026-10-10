import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { assertProductionSecrets } from './utils/secrets.js';
import { verifyMailConnection } from './services/mail.js';
import { ensureDemoUsers } from './utils/ensureDemoUsers.js';
import { isValidGeminiKey, getEnvApiKey } from './services/gemini.js';
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

const start = async () => {
  assertProductionSecrets();
  try {
    await connectDB();
    if (process.env.NODE_ENV !== 'production') {
      await ensureDemoUsers();
      console.log('Demo users ready (development only)');
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
    console.error('Fix MONGODB_URI in .env, then run: npm run dev');
    process.exit(1);
  }

  // Only listen if not running in Vercel serverless environment
  if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  }
};

// For Vercel serverless
const handler = async (req, res) => {
  await connectDB();
  return app(req, res);
};

export default handler;

// Only start the server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  start();
}
