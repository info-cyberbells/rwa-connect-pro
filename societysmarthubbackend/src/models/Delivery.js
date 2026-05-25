// models/Delivery.js

import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    deliveryBoyName: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
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

    verifiedByGuard: {
      type: Boolean,
      default: true,
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

deliverySchema.index({ society: 1, createdAt: -1 });

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
