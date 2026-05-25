import mongoose from "mongoose";

const DeactivationRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    society: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    reason: {
      type: String,
      enum: ["moving_out", "property_sold", "rental_period_ended", "service_issue", "other"],
      required: true,
    },
    additionalDetails: { type: String, trim: true },
    forwardingAddress: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    adminRemarks: { type: String, trim: true },
  },
  { timestamps: true }
);

// Ek user ka sirf ek pending request ho sakta hai
DeactivationRequestSchema.index({ user: 1, status: 1 });

export default mongoose.model("DeactivationRequest", DeactivationRequestSchema);
