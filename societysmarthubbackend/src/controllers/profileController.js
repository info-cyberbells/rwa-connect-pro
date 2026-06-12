import User from "../models/user.js";
import DeactivationRequest from "../models/DeactivationRequest.js";
import Notice from "../models/Notice.js";
import Charge from "../models/Charge.js";
import Payment from "../models/Payment.js";
import bcrypt from "bcryptjs";
import { attachBaseUrl } from "../utils/addBaseUrl.js";
import { logActivity } from "../utils/logActivity.js";

const SALT_ROUNDS = 12;
const USER_IMG_FIELDS = { single: ["profilePicUrl", "kyc.governmentIdUrl", "kyc.addressProofUrl"], array: [] };

// Member Dashboard Summary
export async function getDashboardSummary(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const societyId = user.society;
    if (!societyId) return res.status(400).json({ message: "User not part of any society" });

    // 1. Fetch Recent Notices (Last 3)
    const recentNotices = await Notice.find({ 
      society: societyId, 
      isActive: true,
      visibleFrom: { $lte: new Date() },
      visibleUntil: { $gte: new Date() }
    })
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(3);

    // 2. Fetch Pending Dues
    // Find all active charges for this society that apply to this user
    const charges = await Charge.find({
      society: societyId,
      isActive: true,
      $or: [
        { appliedTo: "all" },
        { targetUsers: req.user.id }
      ]
    });

    // Find all payments made by this user (including pending/approved)
    const payments = await Payment.find({
      user: req.user.id,
      society: societyId
    });

    // logic: if a charge ID doesn't have an 'approved' payment, it's pending
    const pendingPayments = [];
    let totalPendingAmount = 0;

    for (const charge of charges) {
      const payment = payments.find(p => p.charge.toString() === charge._id.toString());
      
      if (!payment || payment.status === "rejected") {
        pendingPayments.push({
          id: charge._id,
          title: charge.title,
          amount: charge.amount,
          dueDate: charge.dueDate,
          status: "PENDING"
        });
        totalPendingAmount += charge.amount;
      } else if (payment.status === "pending") {
        pendingPayments.push({
          id: charge._id,
          title: charge.title,
          amount: charge.amount,
          dueDate: charge.dueDate,
          status: "AWAITING_VERIFICATION"
        });
        totalPendingAmount += charge.amount;
      } else if (payment.status === "approved") {
        // Only add to list if we want to show paid ones too, or just skip
        // For dashboard dues, we usually show unpaid.
      }
    }

    res.json({
      stats: {
        pendingDues: totalPendingAmount,
        newNoticesCount: recentNotices.length,
      },
      pendingPayments,
      recentNotices
    });
  } catch (error) {
    next(error);
  }
}

// Get my profile (any logged-in user)
export async function getMyProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
      .select("-passwordHash")
      .populate("society", "name slug address contactPhone");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = attachBaseUrl(req, user, USER_IMG_FIELDS.single, USER_IMG_FIELDS.array);
    res.json({ user: result });
  } catch (error) {
    next(error);
  }
}

// Update my profile (any logged-in user)
export async function updateMyProfile(req, res, next) {
  try {
    const { name, phone, familyMembers, language } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (familyMembers !== undefined) updates.familyMembers = familyMembers;
    if (language) updates.language = language;
    if (req.file) updates.profilePicUrl = `/${req.file.path.replace(/\\/g, "/")}`;

    await User.updateOne({ _id: req.user.id }, updates);

    const updated = await User.findById(req.user.id)
      .select("-passwordHash")
      .populate("society", "name slug address contactPhone");

    const result = attachBaseUrl(req, updated, USER_IMG_FIELDS.single, USER_IMG_FIELDS.array);

    if (updated.society) {
      logActivity({
        userId: req.user.id,
        societyId: updated.society,
        action: "profile_updated",
        description: "Profile information was updated.",
        meta: { updatedFields: Object.keys(updates) },
      });
    }

    res.json({ message: "Profile updated successfully", user: result });
  } catch (error) {
    next(error);
  }
}

// Submit deactivation request (user only)
export async function requestDeactivation(req, res, next) {
  try {
    const { reason, additionalDetails, forwardingAddress, contactNumber } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "reason is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.society) {
      return res.status(400).json({ message: "User is not part of any society" });
    }

    // Check if pending request already exists
    const existing = await DeactivationRequest.findOne({
      user: req.user.id,
      status: "pending",
    });
    if (existing) {
      return res.status(400).json({
        message: "You already have a pending deactivation request",
        requestId: existing._id,
      });
    }

    const request = await DeactivationRequest.create({
      user: req.user.id,
      society: user.society,
      reason,
      additionalDetails,
      forwardingAddress,
      contactNumber,
    });

    logActivity({
      userId: req.user.id,
      societyId: user.society,
      action: "deactivation_requested",
      description: `Account deactivation requested. Reason: ${reason}.`,
      refId: request._id,
      refModel: "DeactivationRequest",
      meta: { reason },
    });

    res.status(201).json({
      message: "Deactivation request submitted successfully. Admin will review it.",
      request: {
        id: request._id,
        reason: request.reason,
        status: request.status,
        createdAt: request.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Get my deactivation request status (user only)
export async function getMyDeactivationRequest(req, res, next) {
  try {
    const request = await DeactivationRequest.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("reviewedBy", "name");

    if (!request) {
      return res.status(404).json({ message: "No deactivation request found" });
    }

    res.json({ request });
  } catch (error) {
    next(error);
  }
}

// Cancel pending deactivation request (user only)
export async function cancelDeactivationRequest(req, res, next) {
  try {
    const request = await DeactivationRequest.findOne({
      user: req.user.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "No pending deactivation request found" });
    }

    const cancellingUser = await User.findById(req.user.id).select("society");
    await request.deleteOne();

    if (cancellingUser?.society) {
      logActivity({
        userId: req.user.id,
        societyId: cancellingUser.society,
        action: "deactivation_cancelled",
        description: "Pending account deactivation request was cancelled.",
      });
    }

    res.json({ message: "Deactivation request cancelled successfully" });
  } catch (error) {
    next(error);
  }
}

// Change password (any logged-in user)
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "currentPassword and newPassword are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    if (user.society) {
      logActivity({
        userId: req.user.id,
        societyId: user.society,
        action: "password_changed",
        description: "Account password was changed.",
      });
    }

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
}
