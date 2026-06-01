import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      trim: true,
      default: "Other",
    },

    flatNumber: {
      type: String,
      trim: true,
      default: "N/A",
    },

    staffType: {
      type: String,
      enum: ["Daily", "One-time"],
      default: "Daily",
    },

    vehicleNumber: {
      type: String,
      trim: true,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },

    blockedReason: {
      type: String,
      default: "",
    },

    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    blockedAt: {
      type: Date,
      default: null,
    },

    guardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    entryTime: {
      type: Date,
      default: Date.now,
    },

    exitTime: {
      type: Date,
      default: null,
    },

    // [MODULE-C]: Background Verification (BGV) & Document Vault
    isVerified: {
      type: Boolean,
      default: false,
    },

    documents: [
      {
        docType: { type: String }, // e.g., "Aadhar Card", "Police Clearance"
        docUrl: { type: String },
      },
    ],

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
    // [MODULE-D]: Performance Metrics
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

staffSchema.index({ society: 1, mobileNumber: 1 });

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
