import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    isGuest: { type: Boolean, default: false },
    guestEmail: { type: String, trim: true, lowercase: true, index: true },
    items: [orderItemSchema],
    shipping: mongoose.Schema.Types.Mixed,
    paymentMethod: String,
    subtotal: Number,
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    promoCode: String,
    tax: Number,
    total: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('Order', orderSchema);
