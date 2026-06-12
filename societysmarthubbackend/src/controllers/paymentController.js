import Payment from "../models/Payment.js";
import Charge from "../models/Charge.js";
import User from "../models/user.js";
import { attachBaseUrl, attachBaseUrlToArray } from "../utils/addBaseUrl.js";
import { logActivity } from "../utils/logActivity.js";
import { createNotification } from "./notificationController.js"; // [NEW] Import notification utility

const PAYMENT_FIELDS = { single: ["paymentScreenshotUrl"], array: [] };

// ─── USER: Submit payment for a charge ─────────────────────────────
export async function submitPayment(req, res, next) {
  try {
    const { chargeId, transactionId } = req.body;
    const userId = req.user.id;
    const userSociety = req.user.society;

    // Get screenshot path from uploaded file
    const paymentScreenshotUrl = req.file
      ? `/${req.file.path.replace(/\\/g, "/")}`
      : null;

    if (!chargeId || !transactionId || !paymentScreenshotUrl) {
      return res.status(400).json({
        message: "chargeId, transactionId, and paymentScreenshot file are required",
      });
    }

    // verify charge exists and is for this user
    const charge = await Charge.findOne({
      _id: chargeId,
      society: userSociety,
      isActive: true,
      $or: [
        { appliedTo: "all" },
        { targetUsers: userId },
      ],
    });

    if (!charge) {
      return res.status(404).json({ message: "Charge not found or not applicable to you" });
    }

    // check if already paid and approved
    const existingApproved = await Payment.findOne({
      charge: chargeId,
      user: userId,
      status: "approved",
    });

    if (existingApproved) {
      return res.status(400).json({
        message: "You have already paid this charge and it's approved",
      });
    }

    // check if there's a pending payment already
    const existingPending = await Payment.findOne({
      charge: chargeId,
      user: userId,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({
        message: "You already have a pending payment for this charge. Wait for admin review.",
      });
    }

    const payment = await Payment.create({
      society: userSociety,
      charge: chargeId,
      user: userId,
      amount: charge.amount,
      transactionId,
      paymentScreenshotUrl,
      status: "pending",
    });

    const populated = await Payment.findById(payment._id)
      .populate("charge", "title category amount")
      .populate("user", "name email");

    const result = attachBaseUrl(req, populated, PAYMENT_FIELDS.single, PAYMENT_FIELDS.array);

    logActivity({
      userId,
      societyId: userSociety,
      action: "payment_submitted",
      description: `Payment submitted for "${charge.title}" of ₹${charge.amount}.`,
      refId: payment._id,
      refModel: "Payment",
      meta: { transactionId, amount: charge.amount, chargeTitle: charge.title },
    });

    res.status(201).json({
      message: "Payment submitted successfully. Waiting for admin approval.",
      payment: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── USER: Get my payment history ──────────────────────────────────
export async function getMyPayments(req, res, next) {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate("charge", "title category amount dueDate proofImageUrl")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    const result = attachBaseUrlToArray(req, payments, PAYMENT_FIELDS.single, PAYMENT_FIELDS.array);
    res.json({
      count: result.length,
      payments: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Get all payments for society ───────────────────────────
export async function getAllPayments(req, res, next) {
  try {
    const adminSociety = req.user.society;
    const { status, chargeId } = req.query;

    if (!adminSociety) {
      return res.status(403).json({ message: "Admin must be assigned to a society" });
    }

    const filter = { society: adminSociety };
    if (status) filter.status = status;
    if (chargeId) filter.charge = chargeId;

    const payments = await Payment.find(filter)
      .populate("charge", "title category amount")
      .populate("user", "name email phone unit.flatNumber unit.towerBlock")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    const result = attachBaseUrlToArray(req, payments, PAYMENT_FIELDS.single, PAYMENT_FIELDS.array);
    res.json({
      count: result.length,
      payments: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Review (approve/reject) a payment ─────────────────────
export async function reviewPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const { status, rejectionReason } = req.body;
    const adminSociety = req.user.society;

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "status must be 'approved' or 'rejected'",
      });
    }

    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({
        message: "rejectionReason is required when rejecting a payment",
      });
    }

    const payment = await Payment.findOne({
      _id: paymentId,
      society: adminSociety,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({
        message: `Payment is already ${payment.status}. Cannot review again.`,
      });
    }

    payment.status = status;
    payment.reviewedBy = req.user.id;
    payment.reviewedAt = new Date();
    if (rejectionReason) payment.rejectionReason = rejectionReason;

    await payment.save();

    const updated = await Payment.findById(payment._id)
      .populate("charge", "title category amount")
      .populate("user", "name email phone unit.flatNumber unit.towerBlock")
      .populate("reviewedBy", "name email");

    const result = attachBaseUrl(req, updated, PAYMENT_FIELDS.single, PAYMENT_FIELDS.array);

    // Log activity on the user whose payment was reviewed
    logActivity({
      userId: payment.user,
      societyId: adminSociety,
      action: status === "approved" ? "payment_approved" : "payment_rejected",
      description:
        status === "approved"
          ? `Payment of ₹${payment.amount} was approved by admin.`
          : `Payment of ₹${payment.amount} was rejected. Reason: ${rejectionReason}.`,
      refId: payment._id,
      refModel: "Payment",
      meta: { amount: payment.amount, ...(rejectionReason && { rejectionReason }) },
    });

    // [NEW] Trigger notification for the user
    await createNotification({
      recipient: payment.user,
      society: adminSociety,
      title: status === "approved" ? "Payment Approved" : "Payment Rejected",
      message: status === "approved" 
        ? `Your payment of ₹${payment.amount} for "${updated.charge.title}" has been approved.`
        : `Your payment of ₹${payment.amount} for "${updated.charge.title}" was rejected. Reason: ${rejectionReason}`,
      category: "payment",
      type: status === "approved" ? "success" : "error",
      link: "/member/payments",
    }).catch(err => console.error("Notification Error:", err));

    res.json({
      message: `Payment ${status} successfully`,
      payment: result,
    });
  } catch (error) {
    next(error);
  }
}
