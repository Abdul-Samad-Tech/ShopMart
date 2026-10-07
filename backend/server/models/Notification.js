import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    broadcast: { type: Boolean, default: false },
    type: { type: String, enum: ['info', 'success', 'warning', 'promo', 'order'], default: 'info' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

export default mongoose.model('Notification', notificationSchema);
