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
      required: true,
      trim: true,
    },

    flatNumber: {
      type: String,
      required: true,
      trim: true,
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

    // [MODULE-A]: Unique ID for QR code generation (e.g., ST-ABC123)
    uniqueId: {
      type: String,
      unique: true,
      sparse: true,
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
  },
  {
    timestamps: true,
  },
);

staffSchema.index({ society: 1, mobileNumber: 1 });

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
