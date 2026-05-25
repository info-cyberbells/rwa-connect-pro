import mongoose from "mongoose";

const { Schema } = mongoose;

const ComplaintSchema = new Schema(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    // Who submitted
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Complaint type — matches UI options
    type: {
      type: String,
      enum: ["water_issue", "lift_problem", "security", "cleaning", "parking", "electricity", "other"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    preferredVisitTime: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    imageUrls: [{ type: String, trim: true }],

    // Status lifecycle: open → in_progress → resolved / closed
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },

    // Admin side — external person assigned to fix the issue
    assignedTo: {
      name: { type: String, trim: true, maxlength: 200 },
      contact: { type: String, trim: true, maxlength: 50 },
    },
    adminRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    resolvedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Indexes
ComplaintSchema.index({ society: 1, status: 1, createdAt: -1 });
ComplaintSchema.index({ society: 1, submittedBy: 1, createdAt: -1 });
ComplaintSchema.index({ society: 1, type: 1 });

export default mongoose.model("Complaint", ComplaintSchema);
