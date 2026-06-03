import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    society: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true, index: true },
    action: {
      type: String,
      enum: [
        "joined_society",
        "login",
        "profile_updated",
        "password_changed",
        "payment_submitted",
        "payment_approved",
        "payment_rejected",
        "complaint_submitted",
        "complaint_status_updated",
        "vehicle_added",
        "vehicle_removed",
        "deactivation_requested",
        "deactivation_cancelled",
        "account_activated",
        "account_deactivated",
        "password_reset",
      ],
      required: true,
    },
    description: { type: String, required: true },
    // Optional reference IDs for deep linking
    refId: { type: mongoose.Schema.Types.ObjectId },
    refModel: { type: String, enum: ["Payment", "Complaint", "DeactivationRequest"] },
    // Extra details (e.g. receipt/transaction id, vehicle number, etc.)
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Compound index for efficient admin queries: society + user + date
activityLogSchema.index({ society: 1, user: 1, createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
