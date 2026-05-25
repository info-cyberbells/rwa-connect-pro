import mongoose from "mongoose";

const { Schema } = mongoose;

const ChargeSchema = new Schema(
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
      trim: true,
      maxlength: 2000,
    },

    // charge type
    category: {
      type: String,
      enum: ["maintenance", "event", "fine", "penalty", "other"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    dueDate: {
      type: Date,
    },

    // proof image — admin uploads for fines (e.g. wrong parking photo)
    proofImageUrl: {
      type: String,
      trim: true,
    },

    // kisko apply hoga — sabko ya specific users ko
    appliedTo: {
      type: String,
      enum: ["all", "specific"],
      default: "all",
    },

    // specific users — jab appliedTo = "specific"
    targetUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // unit type filter — e.g. maintenance sirf 1BHK walo ke liye
    unitType: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK", "4BHK", "studio", "penthouse", "shop", "office"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// --- Indexes ---
ChargeSchema.index({ society: 1, isActive: 1, createdAt: -1 });
ChargeSchema.index({ society: 1, category: 1 });
ChargeSchema.index({ targetUsers: 1 });

export default mongoose.model("Charge", ChargeSchema);
