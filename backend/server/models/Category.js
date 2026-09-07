import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    href: { type: String, default: '/products' },
    icon: { type: String, default: '' },
  },
  { _id: true }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    href: { type: String, default: '/products' },
    itemCount: { type: String, default: '' },
    subCategories: [subCategorySchema],
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('Category', categorySchema);
