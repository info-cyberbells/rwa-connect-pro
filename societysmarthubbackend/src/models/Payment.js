import mongoose from "mongoose";

const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    charge: {
      type: Schema.Types.ObjectId,
      ref: "Charge",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // UPI transaction ID — jo payment ke baad milti hai
    transactionId: {
      type: String,
      required: true,
      trim: true,
    },

    // payment screenshot — UPI payment ka screenshot
    paymentScreenshotUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // admin review status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // admin jo review karega
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// --- Indexes ---
PaymentSchema.index({ society: 1, status: 1, createdAt: -1 });
PaymentSchema.index({ charge: 1, user: 1 });
PaymentSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Payment", PaymentSchema);
