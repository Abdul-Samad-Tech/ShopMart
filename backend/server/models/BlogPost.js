import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    author: { type: String },
    category: { type: String },
    tags: [{ type: String }],
    image: { type: String },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

blogPostSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model('BlogPost', blogPostSchema);
