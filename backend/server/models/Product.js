import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    category: { type: String, required: true, index: true },
    brand: { type: String, default: 'ShopHub' },
    image: { type: String, required: true },
    hoverImage: { type: String, default: '' },
    gallery: [String],
    specifications: [{ label: String, value: String }],
    sizes: [String],
    colors: [String],
    features: [String],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    isLuxury: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    popularity: { type: Number, default: 0, index: true },
    stock: { type: Number, default: 100 },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
