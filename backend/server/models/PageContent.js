import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: String,
    order: { type: Number, default: 0 },
    type: { type: String, enum: ['hero', 'text', 'image', 'grid', 'stats', 'cta', 'form'], default: 'text' }
  },
  { _id: true }
);

const pageContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g., 'brands', 'store-locator', 'blog'
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    heroImage: String,
    sections: [sectionSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('PageContent', pageContentSchema);
