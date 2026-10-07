import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { toJSONTransform } from '../utils/jsonTransform.js';

const activitySchema = new mongoose.Schema(
  {
    action: String,
    meta: mongoose.Schema.Types.Mixed,
    at: { type: Date, default: Date.now },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    googleId: { type: String, sparse: true, unique: true },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    activityLog: [activitySchema],
    promoCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' }],
    giftCards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard' }],
    loyaltyCard: { type: mongoose.Schema.Types.ObjectId, ref: 'LoyaltyCard' },
    resetOTP: { type: String, select: false },
    resetOTPExpiry: { type: Date, select: false },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'Pakistan' }
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: true }
    }
  },
  { timestamps: true, toJSON: toJSONTransform }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function compare(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.logActivity = function log(action, meta = {}) {
  this.activityLog.unshift({ action, meta });
  if (this.activityLog.length > 50) this.activityLog = this.activityLog.slice(0, 50);
};

export default mongoose.model('User', userSchema);
