import mongoose from "mongoose";

const staffAttendanceSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
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

    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("StaffAttendance", staffAttendanceSchema);
