import mongoose, { Schema } from 'mongoose';

const PublicPageDocSchema = new Schema(
  {
    id: { type: String },
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    content: { type: String, default: '' },
    keywords: { type: [String], default: [] },
    category: { type: String, default: 'GETTING STARTED' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    contentType: { type: String, enum: ['page', 'doc'], default: 'page' },
    sidebar: {
      section: { type: String },
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
    collection: 'publicpages',
    timestamps: true,
    strict: false,
    versionKey: false,
  }
);

export const PublicPageDocModel =
  mongoose.models.PublicPageDoc || mongoose.model('PublicPageDoc', PublicPageDocSchema);
