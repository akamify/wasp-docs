import mongoose, { Schema } from 'mongoose';

const DocSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    keywords: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    sidebar: {
      section: { type: String, trim: true },
      sectionOrder: { type: Number, default: 0 },
      itemOrder: { type: Number, default: 0 },
      parentSlug: { type: String, default: null },
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      ogImage: { type: String },
      noIndex: { type: Boolean, default: false },
    },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

DocSchema.index({ slug: 1 }, { unique: true });
DocSchema.index({ status: 1, category: 1, order: 1 });
DocSchema.index({ 'sidebar.sectionOrder': 1, 'sidebar.itemOrder': 1 });

export const DocModel = mongoose.models.Doc || mongoose.model('Doc', DocSchema);
