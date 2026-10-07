import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String },
    image: { type: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

eventSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Event', eventSchema);
