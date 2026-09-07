import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const ghostCartItemSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    category: String,
  },
  { _id: false }
);

const ghostCartSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    items: [ghostCartItemSchema],
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('GhostCart', ghostCartSchema);
