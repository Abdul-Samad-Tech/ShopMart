import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const footerSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    description: { type: String, default: '' },
    columns: [
      {
        title: String,
        links: [{ label: String, href: String, external: { type: Boolean, default: false } }],
      },
    ],
    socials: [{ platform: String, url: String, label: String }],
    newsletter: {
      enabled: { type: Boolean, default: true },
      title: String,
      description: String,
    },
    paymentBadges: [String],
    copyright: { type: String, default: '' },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('Footer', footerSchema);
