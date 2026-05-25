import mongoose from "mongoose";

const { Schema } = mongoose;

const NoticeSchema = new Schema(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    // type / priority
    category: {
      type: String,
      enum: ["alert", "urgent", "general", "event", "maintenance"],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // media
    imageUrls: [{ type: String, trim: true }],
    attachmentUrls: [{ type: String, trim: true }],

    // visibility window — kb se kb tk dikhegi
    visibleFrom: { type: Date, required: true, default: Date.now },
    visibleUntil: { type: Date, required: true },

    // top/pinned notice — hmesha top pe dikhegi
    isPinned: { type: Boolean, default: false },

    // audience
    targetAudience: {
      type: String,
      enum: ["all", "owners", "tenants"],
      default: "all",
    },

    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// --- Indexes ---
NoticeSchema.index({ society: 1, isActive: 1, visibleFrom: -1 });
NoticeSchema.index({ society: 1, isPinned: 1 });

export default mongoose.model("Notice", NoticeSchema);
