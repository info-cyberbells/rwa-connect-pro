import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    maxUnits: { type: Number, default: null }, // null = unlimited
    pricePerYear: { type: Number, required: true, min: 0 },
    features: [{ type: String, trim: true }],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);
