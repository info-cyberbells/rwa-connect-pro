import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
  deviceInfo: {
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
});

RefreshTokenSchema.index({ token: 1 }, { unique: true });

export default mongoose.model("RefreshToken", RefreshTokenSchema);
