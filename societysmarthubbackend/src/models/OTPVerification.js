import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED"],
      default: "PENDING",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// TTL index to automatically delete expired records
otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPVerification = mongoose.model("OTPVerification", otpVerificationSchema);

export default OTPVerification;
