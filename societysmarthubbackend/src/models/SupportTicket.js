import mongoose from "mongoose";

const { Schema } = mongoose;

const SupportTicketSchema = new Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    raisedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["payment", "technical", "access_issue", "feature_request", "other"],
      default: "technical",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        senderRole: {
          type: String,
          enum: ["superadmin", "society_admin"],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        isInternal: {
          type: Boolean,
          default: false, // Internal notes only visible to Super Admin
        },
        attachments: [String],
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    lastReadByAdmin: {
      type: Date,
      default: Date.now,
    },
    lastReadBySuperAdmin: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Auto-generate Ticket ID before validation
SupportTicketSchema.pre("validate", async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model("SupportTicket").countDocuments();
    this.ticketId = `SH-${2000 + count + 1}`;
  }
  next();
});

// Indexes
SupportTicketSchema.index({ society: 1, status: 1 });
SupportTicketSchema.index({ status: 1 });

export default mongoose.model("SupportTicket", SupportTicketSchema);
