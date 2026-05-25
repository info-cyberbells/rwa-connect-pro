import mongoose from "mongoose";

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
  },
  { _id: false }
);

const SocietySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: { type: AddressSchema, required: true },

    // contact
    contactEmail: { type: String, lowercase: true, trim: true },
    contactPhone: { type: String, trim: true },

    // capacity
    totalUnits: { type: Number, default: 0, min: 0 },
    totalFloors: { type: Number, default: 0, min: 0 },
    totalTowers: { type: Number, default: 0, min: 0 },

    // branding / logo
    logoUrl: { type: String, trim: true },

    // society-level settings (multi-tenant config)
    settings: {
      maintenanceDueDay: { type: Number, default: 1, min: 1, max: 28 },
      currency: { type: String, default: "INR", maxlength: 3 },
      timezone: { type: String, default: "Asia/Kolkata" },
    },

    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// --- Indexes ---
SocietySchema.index({ "address.city": 1, "address.state": 1 });
SocietySchema.index({ createdBy: 1 });

// --- Auto-generate slug from name before validation ---
SocietySchema.pre("validate", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.model("Society", SocietySchema);
