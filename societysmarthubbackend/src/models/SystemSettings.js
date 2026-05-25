import mongoose from "mongoose";

const SystemSettingsSchema = new mongoose.Schema(
  {
    platformName: { type: String, default: "SocietyHub Pro", trim: true },
    supportEmail: { type: String, default: "support@societyhub.io", trim: true, lowercase: true },
    logoUrl: { type: String, trim: true },
    notificationRules: {
      newSocietyRegistration: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
      },
      paymentFailureAlerts: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
      systemHealthUpdates: {
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("SystemSettings", SystemSettingsSchema);
