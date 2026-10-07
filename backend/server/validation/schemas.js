import { z } from 'zod';

const email = z.string().trim().email('Enter a valid email').max(160);
const password = z.string().min(6, 'Password must be at least 6 characters').max(128);

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required').max(128),
});

export const googleSchema = z.object({
  credential: z.string().trim().min(20, 'Google credential missing').max(8000),
});

export const sendOtpSchema = z.object({
  email,
});

export const verifyOtpSchema = z.object({
  email,
  otp: z.string().trim().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const resetPasswordSchema = z.object({
  email,
  newPassword: password,
});

const orderItemSchema = z.object({
  product: z.string().trim().max(40).optional(),
  name: z.string().trim().min(1, 'Item name is required').max(200),
  price: z.number().finite().nonnegative(),
  quantity: z.number().int().positive().max(99),
  image: z.string().max(2000).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Cart is empty').max(100),
  shipping: z.object({
    firstName: z.string().trim().max(80).optional().default(''),
    lastName: z.string().trim().max(80).optional().default(''),
    email,
    phone: z.string().trim().max(30).optional().default(''),
    address: z.string().trim().max(300).optional().default(''),
    city: z.string().trim().max(80).optional().default(''),
    state: z.string().trim().max(80).optional().default(''),
    zipCode: z.string().trim().max(20).optional().default(''),
    country: z.string().trim().max(80).optional().default(''),
    paymentMethod: z.string().trim().max(40).optional(),
  }),
  paymentMethod: z.string().trim().max(40).optional(),
  promoCode: z.string().trim().max(40).optional().default(''),
  subtotal: z.number().finite().nonnegative().optional(),
  discount: z.number().finite().nonnegative().optional(),
  shippingCost: z.number().finite().nonnegative().optional(),
  tax: z.number().finite().nonnegative().optional(),
  total: z.number().finite().nonnegative().optional(),
  useLoyaltyPoints: z.boolean().optional(),
  loyaltyPointsToRedeem: z.number().int().nonnegative().max(1_000_000).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80),
  email,
  subject: z.string().trim().min(2, 'Subject is required').max(160),
  message: z.string().trim().min(5, 'Message is required').max(4000),
});

const chatTurnSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(4000),
});

export const chatSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(4000),
  history: z.array(chatTurnSchema).max(20).optional(),
  apiKey: z.string().trim().max(200).optional(),
});

export const chatKeySchema = z.object({
  apiKey: z.string().trim().min(1, 'API key is required').max(200),
});

export const promoSchema = z.object({
  code: z.string().trim().min(1, 'Promo code is required').max(40),
  subtotal: z.number().finite().nonnegative().optional(),
});

export const promoCodeValidateSchema = z.object({
  code: z.string().trim().min(1, 'Promo code is required').max(40),
  orderAmount: z.number().finite().nonnegative().optional(),
  category: z.string().trim().max(80).optional(),
});
