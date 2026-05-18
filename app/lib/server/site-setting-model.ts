import mongoose, { Schema } from 'mongoose';

const SiteSettingSchema = new Schema(
  {
    key: { type: String, required: true, trim: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SiteSettingModel =
  mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);
