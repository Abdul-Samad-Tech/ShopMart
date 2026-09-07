import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const navChildSchema = new mongoose.Schema(
  {
    label: String,
    href: String,
    icon: String,
    description: String,
  },
  { _id: true }
);

const navItemSchema = new mongoose.Schema(
  {
    label: String,
    href: String,
    icon: String,
    mega: { type: Boolean, default: false },
    children: [navChildSchema],
    columns: [
      {
        title: String,
        links: [{ label: String, href: String }],
      },
    ],
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const navigationSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    items: [navItemSchema],
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('Navigation', navigationSchema);
