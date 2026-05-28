import Visitor from "../models/Visitor.js";
import User from "../models/user.js";

// ==============================
// CREATE VISITOR
// ==============================

export const createVisitor = async (req, res) => {
  try {
    const {
      visitorName,
      visitorPhone,
      vehicleNumber,
      purpose,
      visitDate,
      visitTime,
      flatNumber,
      memberId,
    } = req.body;

    let finalMemberId = memberId;
    let finalFlatNumber = flatNumber;

    // SECURE: If user is a regular resident, enforce their own data
    if (req.user.role === "user") {
      finalMemberId = req.user.id;
      
      // Fetch user's actual flat number to prevent spoofing
      const user = await User.findById(req.user.id);
      if (user && user.unit && user.unit.flatNumber) {
        finalFlatNumber = user.unit.flatNumber;
      }
    }

    // Generate a unique 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    console.log(`Generating visitor for phone: ${visitorPhone}, Code: ${verificationCode}`);

    const newVisitor = await Visitor.create({
      society: req.user.society,
      visitorName,
      visitorPhone,
      vehicleNumber,
      purpose,
      visitDate,
      visitTime,
      flatNumber: finalFlatNumber,
      memberId: finalMemberId,
      verificationCode,
    });

    // Explicitly add verificationCode to the response data to ensure it's returned
    const responseData = newVisitor.toObject();
    responseData.verificationCode = verificationCode;

    return res.status(201).json({
      success: true,
      message: "Visitor created successfully",
      verificationCode, // Top-level for easy access
      data: responseData,
    });
  } catch (error) {
    console.error("Create Visitor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating visitor",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ==============================
// APPROVE VISITOR
// ==============================

export const approveVisitor = async (req, res) => {
  try {
    // SECURE_FLOW: Guard must provide the code given by the visitor
    const { visitorId, codeEnteredByGuard } = req.body;

    if (!visitorId || !codeEnteredByGuard) {
      return res.status(400).json({
        success: false,
        message: "Visitor ID and Verification Code are required",
      });
    }

    const visitor = await Visitor.findOne({
      _id: visitorId,
      society: req.user.society,
    });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    // Already Approved Check
    if (visitor.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Visitor already approved",
      });
    }

    // Already Rejected Check
    if (visitor.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Rejected visitor cannot be approved",
      });
    }

    // SECURE_FLOW: Verify if the code matches
    if (visitor.verificationCode !== codeEnteredByGuard) {
      return res.status(400).json({
        success: false,
        message: "Invalid Verification Code. Access Denied!",
      });
    }

    visitor.status = "Approved";
    visitor.approvedByGuard = true;
    visitor.entryTime = new Date();

    await visitor.save();

    return res.status(200).json({
      success: true,
      message: "Visitor approved successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("Approve Visitor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while approving visitor",
      error: error.message,
    });
  }
};

// ==============================
// REJECT VISITOR
// ==============================

export const rejectVisitor = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: "Visitor ID is required",
      });
    }

    const visitor = await Visitor.findOne({
      _id: visitorId,
      society: req.user.society,
    });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    // Already Rejected Check
    if (visitor.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Visitor already rejected",
      });
    }

    // Already Approved Check
    if (visitor.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Approved visitor cannot be rejected",
      });
    }

    visitor.status = "Rejected";

    await visitor.save();

    return res.status(200).json({
      success: true,
      message: "Visitor rejected successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("Reject Visitor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while rejecting visitor",
      error: error.message,
    });
  }
};

// ==============================
// VISITOR EXIT
// ==============================

export const visitorExit = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: "Visitor ID is required",
      });
    }

    const visitor = await Visitor.findOne({
      _id: visitorId,
      society: req.user.society,
    });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    // Exit Already Marked
    if (visitor.exitTime) {
      return res.status(400).json({
        success: false,
        message: "Visitor exit already marked",
      });
    }

    visitor.exitTime = new Date();

    await visitor.save();

    return res.status(200).json({
      success: true,
      message: "Visitor exit marked successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("Visitor Exit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while marking visitor exit",
      error: error.message,
    });
  }
};

// ==============================
// VISITOR HISTORY
// ==============================
export const visitorHistory = async (req, res) => {
  try {
    const { flatNumber } = req.params;

    let query = {
      society: req.user.society,
    };

    // SECURE: If user is a regular resident, only show their flat's history
    if (req.user.role === "user") {
      const user = await User.findById(req.user.id);
      if (user && user.unit && user.unit.flatNumber) {
        query.flatNumber = user.unit.flatNumber;
      } else {
        return res.status(400).json({
          success: false,
          message: "Unit information not found for your account",
        });
      }
    } else {
      // For Admin/Guard, use the provided flatNumber or "all"
      if (flatNumber && flatNumber.toLowerCase() !== "all") {
        query.flatNumber = flatNumber;
      }
    }

    // SECURE_FLOW: Mask verification code if the user is a Guard
    let projection = {};
    if (req.user.role === "guard") {
      projection = { verificationCode: 0 };
    }

    const visitors = await Visitor.find(query, projection).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Visitor history fetched successfully",
      totalVisitors: visitors.length,
      data: visitors,
    });
  } catch (error) {
    console.error("Visitor History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching visitor history",
      error: error.message,
    });
  }
};
