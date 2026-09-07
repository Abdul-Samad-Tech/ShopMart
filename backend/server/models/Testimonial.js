import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    avatar: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    quote: { type: String, required: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('Testimonial', testimonialSchema);
