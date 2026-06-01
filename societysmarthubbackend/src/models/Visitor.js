// models/Visitor.js

import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true,
      trim: true,
    },

    visitorPhone: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleNumber: {
      type: String,
      trim: true,
      default: "",
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    visitDate: {
      type: String,
      required: true,
    },

    visitTime: {
      type: String,
      required: true,
    },

    flatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    entryTime: {
      type: Date,
      default: null,
    },

    exitTime: {
      type: Date,
      default: null,
    },

    approvedByGuard: {
      type: Boolean,
      default: false,
    },

    // CHANGED: System-generated verification code (Required)
    verificationCode: {
      type: String,
      required: true, 
    },
  },
  {
    timestamps: true,
  },
);

visitorSchema.index({ society: 1, flatNumber: 1 });

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
