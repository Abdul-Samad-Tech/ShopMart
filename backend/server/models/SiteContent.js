import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const ctaSchema = new mongoose.Schema(
  {
    label: String,
    href: String,
    variant: { type: String, enum: ['gold', 'primary', 'outline', 'ghost'], default: 'gold' },
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    branding: {
      siteName: { type: String, default: 'ShopMart' },
      tagline: { type: String, default: 'Curated Excellence' },
      logoUrl: { type: String, default: '' },
    },
    hero: {
      eyebrow: { type: String, default: 'Spring Collection 2026' },
      title: { type: String, default: 'Elevate Your' },
      titleAccent: { type: String, default: 'Everyday' },
      subtitle: { type: String, default: '' },
      backgroundType: { type: String, enum: ['image', 'video', 'lottie', 'gradient'], default: 'image' },
      backgroundImage: { type: String, default: '' },
      backgroundVideo: { type: String, default: '' },
      lottieUrl: { type: String, default: '' },
      sideImage: { type: String, default: '' },
      sideCaption: { type: String, default: '' },
      ctas: [ctaSchema],
    },
    theme: {
      defaultMode: { type: String, enum: ['light', 'dark'], default: 'light' },
      allowToggle: { type: Boolean, default: true },
      accents: {
        primary: { type: String, default: '#146B45' },
        gold: { type: String, default: '#9A4E24' },
        charcoal: { type: String, default: '#1C1917' },
        cream: { type: String, default: '#F6F3EC' },
        midnight: { type: String, default: '#121614' },
        slate: { type: String, default: '#5C564E' },
      },
    },
    trustBar: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    about: {
      heroTitle: String,
      heroSubtitle: String,
      story: [String],
      stats: [{ value: String, label: String }],
      values: [{ title: String, description: String }],
    },
    contact: {
      address: [String],
      emails: [String],
      phone: String,
      hours: [String],
    },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('SiteContent', siteContentSchema);
