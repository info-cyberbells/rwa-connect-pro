import Staff from "../models/Staff.js";
import StaffAttendance from "../models/StaffAttendance.js";
import crypto from "crypto"; // For generating unique ID
import mongoose from "mongoose";

export const createStaff = async (req, res) => {
  try {
    const {
      staffName,
      mobileNumber,
      role,
      flatNumber,
      vehicleNumber,
      photo,
      guardId,
    } = req.body;

    const existingStaff = await Staff.findOne({ mobileNumber });

    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: "Staff already exists",
      });
    }

    // [MODULE-A]: Generate a Unique ID for Digital ID Card & QR Code
    // Format: SSH-XXXX (where XXXX is a random hex string)
    const uniqueId = `SSH-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // [MODULE-C]: Handle document uploads
    const documentArray = [];
    if (req.files) {
      if (req.files.aadharCard) {
        documentArray.push({
          docType: "Aadhar Card",
          docUrl: `/uploads/staff/documents/${req.files.aadharCard[0].filename}`,
        });
      }
      if (req.files.policeVerification) {
        documentArray.push({
          docType: "Police Verification",
          docUrl: `/uploads/staff/documents/${req.files.policeVerification[0].filename}`,
        });
      }
    }

    const newStaff = await Staff.create({
      society: req.user.society,
      staffName,
      mobileNumber,
      role,
      flatNumber,
      vehicleNumber,
      photo,
      guardId,
      uniqueId, // [MODULE-A]: Save the generated ID
      documents: documentArray, // [MODULE-C]: Save document paths
      isVerified: false, // [MODULE-C]: Default to unverified
    });

    return res.status(201).json({
      success: true,
      message: "Staff created successfully with Digital ID",
      data: newStaff,
    });
  } catch (error) {
    console.error("Create Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating staff",
      error: error.message,
    });
  }
};

export const searchStaff = async (req, res) => {
  try {
    const { phone, name } = req.query;

    let query = {
      society: req.user.society,
    };

    if (phone) {
      query.mobileNumber = phone;
    }

    if (name) {
      query.staffName = {
        $regex: name,
        $options: "i",
      };
    }

    const staffList = await Staff.find(query).lean();

    const today = new Date().toISOString().split("T")[0];

    const todayAttendance = await StaffAttendance.find({
      society: req.user.society,
      date: today,
    }).lean();

    const updatedStaff = staffList.map((staff) => {
      const attendance = todayAttendance.find(
        (item) => item.staff.toString() === staff._id.toString(),
      );

      return {
        ...staff,
        todayLog: attendance || null,
      };
    });

    if (!updatedStaff.length) {
      return res.status(404).json({
        success: false,
        message: "No staff found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff fetched successfully",
      totalStaff: updatedStaff.length,
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Search Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while searching staff",
      error: error.message,
    });
  }
};

export const staffEntry = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    const staff = await Staff.findOne({
      _id: staffId,
      society: req.user.society,
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    if (staff.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "This staff is blocked by admin",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    let attendance = await StaffAttendance.findOne({
      staff: staffId,
      society: req.user.society,
      date: today,
    });

    if (attendance?.entryTime) {
      return res.status(400).json({
        success: false,
        message: "Entry already marked today",
      });
    }

    if (!attendance) {
      attendance = await StaffAttendance.create({
        society: req.user.society,
        staff: staffId,
        entryTime: new Date(),
        date: today,
      });
    } else {
      attendance.entryTime = new Date();
      await attendance.save();
    }

    return res.status(200).json({
      success: true,
      message: "Staff entry marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Staff Entry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while marking staff entry",
      error: error.message,
    });
  }
};

export const staffExit = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    const staff = await Staff.findOne({
      _id: staffId,
      society: req.user.society,
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const attendance = await StaffAttendance.findOne({
      staff: staffId,
      society: req.user.society,
      date: today,
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "Please mark entry first",
      });
    }

    if (attendance.exitTime) {
      return res.status(400).json({
        success: false,
        message: "Exit already marked today",
      });
    }

    attendance.exitTime = new Date();

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Staff exit marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Staff Exit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while marking staff exit",
      error: error.message,
    });
  }
};

export const staffLogs = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // [MODULE-A]: Sort by createdAt: -1 to show newest staff at the top
    const staffList = await Staff.find({
      society: req.user.society,
    }).sort({ createdAt: -1 }).lean();

    const attendanceList = await StaffAttendance.find({
      society: req.user.society,
      date: today,
    }).lean();

    const updatedLogs = staffList.map((staff) => {
      const attendance = attendanceList.find(
        (item) => item.staff.toString() === staff._id.toString(),
      );

      return {
        ...staff,
        todayLog: attendance || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Staff logs fetched successfully",
      totalLogs: updatedLogs.length,
      data: updatedLogs,
    });
  } catch (error) {
    console.error("Staff Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching staff logs",
      error: error.message,
    });
  }
};
export const getStaffAttendanceHistory = async (req, res) => {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    const history = await StaffAttendance.find({
      staff: staffId,
      society: req.user.society,
    })
      .populate("staff", "staffName role flatNumber photo")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Staff attendance history fetched successfully",
      totalHistory: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Get Staff Attendance History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching staff attendance history",
      error: error.message,
    });
  }
};

export const blockStaff = async (req, res) => {
  try {
    const { staffId, blockedReason, blockedBy } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    if (!blockedReason) {
      return res.status(400).json({
        success: false,
        message: "Blocked reason is required",
      });
    }

    const staff = await Staff.findOne({
      _id: staffId,
      society: req.user.society,
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    if (staff.status === "Blocked") {
      return res.status(400).json({
        success: false,
        message: "Staff is already blocked",
      });
    }

    staff.status = "Blocked";
    staff.blockedReason = blockedReason;
    staff.blockedBy = blockedBy || null;
    staff.blockedAt = new Date();

    await staff.save();

    return res.status(200).json({
      success: true,
      message: "Staff blocked successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Block Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while blocking staff",
      error: error.message,
    });
  }
};

export const unblockStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    const staff = await Staff.findOne({
      _id: staffId,
      society: req.user.society,
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    if (staff.status === "Active") {
      return res.status(400).json({
        success: false,
        message: "Staff is already active",
      });
    }

    staff.status = "Active";
    staff.blockedReason = "";
    staff.blockedBy = null;
    staff.blockedAt = null;

    await staff.save();

    return res.status(200).json({
      success: true,
      message: "Staff unblocked successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Unblock Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while unblocking staff",
      error: error.message,
    });
  }
};

export const blockedStaffList = async (req, res) => {
  try {
    const blockedStaff = await Staff.find({
      status: "Blocked",
      society: req.user.society,
    }).sort({
      blockedAt: -1,
    });

    if (!blockedStaff.length) {
      return res.status(404).json({
        success: false,
        message: "No blocked staff found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blocked staff fetched successfully",
      totalBlockedStaff: blockedStaff.length,
      data: blockedStaff,
    });
  } catch (error) {
    console.error("Blocked Staff List Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching blocked staff",
      error: error.message,
    });
  }
};

// ==============================
// [MODULE-A]: MARK ATTENDANCE VIA QR SCAN
// ==============================
export const markAttendanceByQR = async (req, res) => {
  try {
    const { uniqueId } = req.body; 

    if (!uniqueId) {
      return res.status(400).json({
        success: false,
        message: "Unique QR ID is required",
      });
    }

    // 1. Find Staff by Unique ID (Case-insensitive)
    const staff = await Staff.findOne({
      uniqueId: { $regex: new RegExp(`^${uniqueId}$`, "i") },
      society: req.user.society,
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR Code. Staff not found in your society.",
      });
    }

    // 2. Check if Blocked
    if (staff.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: `Access Denied: ${staff.staffName} is blocked.`,
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // 3. Find today's attendance log
    let attendance = await StaffAttendance.findOne({
      staff: staff._id,
      society: req.user.society,
      date: today,
    });

    let action = "";

    if (!attendance) {
      // Create Entry Log
      attendance = await StaffAttendance.create({
        society: req.user.society,
        staff: staff._id,
        entryTime: new Date(),
        date: today,
      });
      action = "ENTRY";
    } else if (!attendance.exitTime) {
      // Mark Exit
      attendance.exitTime = new Date();
      await attendance.save();
      action = "EXIT";
    } else {
      return res.status(400).json({
        success: false,
        message: "Attendance already completed (Entry & Exit) for today.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${action} marked successfully for ${staff.staffName}`,
      data: {
        staffName: staff.staffName,
        role: staff.role,
        action,
        time: action === "ENTRY" ? attendance.entryTime : attendance.exitTime,
      },
    });
  } catch (error) {
    console.error("QR Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during QR scanning",
      error: error.message,
    });
  }
};

// ==============================
// [MODULE-C]: VERIFY STAFF DOCUMENTS
// ==============================
export const verifyStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    const staff = await Staff.findOne({
      _id: staffId,
      society: req.user.society,
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    // [MODULE-C]: If documents are uploaded during verification, add them
    if (req.files) {
      const documentArray = staff.documents || [];
      if (req.files.aadharCard) {
        documentArray.push({
          docType: "Aadhar Card",
          docUrl: `/uploads/staff/documents/${req.files.aadharCard[0].filename}`,
        });
      }
      if (req.files.policeVerification) {
        documentArray.push({
          docType: "Police Verification",
          docUrl: `/uploads/staff/documents/${req.files.policeVerification[0].filename}`,
        });
      }
      staff.documents = documentArray;
    }

    staff.isVerified = true;
    staff.verifiedBy = new mongoose.Types.ObjectId(req.user.id); 
    staff.verifiedAt = new Date();

    await staff.save();

    // Fetch and populate verifiedBy to show Admin Name and Email
    const updatedStaff = await Staff.findById(staff._id).populate("verifiedBy", "name email");

    return res.status(200).json({
      success: true,
      message: `${staff.staffName} has been verified successfully`,
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Verify Staff Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying staff",
      error: error.message,
    });
  }
};

