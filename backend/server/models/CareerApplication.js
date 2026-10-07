import mongoose from 'mongoose';

const careerApplicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    position: { type: String, required: true },
    experience: { type: String },
    city: { type: String },
    coverLetter: { type: String },
    resume: { type: String }, // File path or URL
    status: { 
      type: String, 
      enum: ['pending', 'under_review', 'shortlisted', 'rejected', 'hired'],
      default: 'pending'
    },
    notes: { type: String },
    appliedDate: { type: Date, default: Date.now },
    reviewedDate: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

careerApplicationSchema.index({ email: 1 });
careerApplicationSchema.index({ position: 1 });
careerApplicationSchema.index({ status: 1 });
careerApplicationSchema.index({ appliedDate: -1 });

export default mongoose.model('CareerApplication', careerApplicationSchema);
