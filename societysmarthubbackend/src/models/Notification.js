import mongoose from "mongoose";

const { Schema } = mongoose;

// Notification Schema to handle Single, Broadcast, and System alerts
const NotificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // null if system-generated
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // null for broadcast or if handled by society-wide logic
    },
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: false, // Optional for global system-wide notifications
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["general", "payment", "complaint", "visitor", "notice", "alert"],
      default: "general",
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    //  Target audience for broadcast filtering
    targetAudience: {
      type: String,
      enum: ["all", "owners", "tenants", "guards", "admins", "specific"],
      default: "specific",
    },
    // Link to redirect user to specific page in frontend
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// --- Indexes for better performance ---
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ society: 1, createdAt: -1 });

export default mongoose.model("Notification", NotificationSchema);
