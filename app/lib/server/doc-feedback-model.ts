import mongoose, { Schema } from 'mongoose';

const DocFeedbackSchema = new Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, index: true },
    helpful: { type: Boolean, required: true },
    userAgent: { type: String, default: '' },
    source: { type: String, default: 'docs-web' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

DocFeedbackSchema.index({ slug: 1, createdAt: -1 });

export const DocFeedbackModel =
  mongoose.models.DocFeedback || mongoose.model('DocFeedback', DocFeedbackSchema);
