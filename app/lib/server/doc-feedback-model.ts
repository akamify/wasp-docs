import mongoose, { Schema } from 'mongoose';

const DocFeedbackSchema = new Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, index: true },
    docTitle: { type: String, default: '' },
    helpful: { type: Boolean, required: true },
    pagePath: { type: String, default: '' },
    visitorId: { type: String, default: '', index: true },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    source: { type: String, default: 'docs-web' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

DocFeedbackSchema.index({ slug: 1, createdAt: -1 });
DocFeedbackSchema.index({ visitorId: 1, slug: 1, createdAt: -1 });

export const DocFeedbackModel =
  mongoose.models.DocFeedback || mongoose.model('DocFeedback', DocFeedbackSchema);
