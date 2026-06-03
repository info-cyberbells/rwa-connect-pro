import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Legal", "Society Rules", "Forms", "Financial Reports", "NOC Templates", "Others"],
      default: "Others",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // In bytes
    },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient searching by society and category
documentSchema.index({ society: 1, category: 1, visibility: 1 });
documentSchema.index({ title: "text", description: "text" });

const Document = mongoose.model("Document", documentSchema);

export default Document;
