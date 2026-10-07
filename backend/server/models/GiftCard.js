import mongoose from 'mongoose';

const giftCardSchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    amount: { type: Number, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, default: 'PKR' },
    status: { type: String, enum: ['active', 'expired', 'redeemed', 'blocked'], default: 'active' },
    issuedDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who bought it
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who received it (if gifted)
    recipientEmail: String,
    recipientName: String,
    message: String,
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    transactions: [
      {
        amount: Number,
        type: { type: String, enum: ['credit', 'debit'] },
        description: String,
        date: { type: Date, default: Date.now },
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

giftCardSchema.index({ purchaser: 1 });
giftCardSchema.index({ recipient: 1 });
giftCardSchema.index({ expiryDate: 1 });

export default mongoose.model('GiftCard', giftCardSchema);
