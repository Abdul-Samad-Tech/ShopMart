import mongoose from 'mongoose';
import { toJSONTransform } from '../utils/jsonTransform.js';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
      index: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: toJSONTransform }
);

contactMessageSchema.index({ createdAt: -1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
