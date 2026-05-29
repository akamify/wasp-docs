import mongoose, { Schema } from 'mongoose';

const DocsSettingSchema = new Schema(
  {
    key: { type: String, required: true, trim: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: 'docssettings',
    timestamps: true,
    versionKey: false,
  }
);

export const DocsSettingModel =
  mongoose.models.DocsSetting || mongoose.model('DocsSetting', DocsSettingSchema);
