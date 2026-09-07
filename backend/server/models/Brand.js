import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    logo: { type: String },
    description: { type: String },
    website: { type: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

brandSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Brand', brandSchema);
