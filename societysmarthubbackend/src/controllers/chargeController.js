import Charge from "../models/Charge.js";
import User from "../models/user.js";
import Payment from "../models/Payment.js";
import { attachBaseUrl, attachBaseUrlToArray } from "../utils/addBaseUrl.js";

const CHARGE_FIELDS = { single: ["proofImageUrl"], array: [] };

// ─── ADMIN: Create a new charge ────────────────────────────────────
export async function createCharge(req, res, next) {
  try {
    const {
      title, description, category, amount, dueDate,
      appliedTo, targetUsers, unitType,
    } = req.body;

    if (!title || !category || amount === undefined) {
      return res.status(400).json({
        message: "title, category, and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "amount must be greater than 0" });
    }

    // Get proof image path from uploaded file
    const proofImageUrl = req.file
      ? `/${req.file.path.replace(/\\/g, "/")}`
      : null;

    // fine/penalty ke liye proof image mandatory
    if ((category === "fine" || category === "penalty") && !proofImageUrl) {
      return res.status(400).json({
        message: "proofImage file is required for fine/penalty charges",
      });
    }

    // specific users ke liye targetUsers mandatory
    let parsedTargetUsers = targetUsers;
    if (typeof targetUsers === "string") {
      try { parsedTargetUsers = JSON.parse(targetUsers); } catch { parsedTargetUsers = [targetUsers]; }
    }

    if (appliedTo === "specific" && (!parsedTargetUsers || parsedTargetUsers.length === 0)) {
      return res.status(400).json({
        message: "targetUsers array is required when appliedTo is 'specific'",
      });
    }

    const adminSociety = req.user.society;
    if (!adminSociety) {
      return res.status(403).json({ message: "Admin must be assigned to a society" });
    }

    // verify targetUsers belong to same society
    if (appliedTo === "specific" && parsedTargetUsers && parsedTargetUsers.length > 0) {
      const validUsers = await User.countDocuments({
        _id: { $in: parsedTargetUsers },
        society: adminSociety,
        role: "user",
      });
      if (validUsers !== parsedTargetUsers.length) {
        return res.status(400).json({
          message: "Some target users are invalid or not in your society",
        });
      }
    }

    const charge = await Charge.create({
      society: adminSociety,
      title,
      description,
      category,
      amount,
      dueDate,
      proofImageUrl,
      appliedTo: appliedTo || "all",
      targetUsers: appliedTo === "specific" ? parsedTargetUsers : [],
      unitType,
      createdBy: req.user.id,
    });

    const populated = await Charge.findById(charge._id)
      .populate("targetUsers", "name email unit.flatNumber unit.towerBlock")
      .populate("createdBy", "name email");

    const result = attachBaseUrl(req, populated, CHARGE_FIELDS.single, CHARGE_FIELDS.array);
    res.status(201).json({
      message: "Charge created successfully",
      charge: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Get all charges for society ────────────────────────────
export async function getAllCharges(req, res, next) {
  try {
    const adminSociety = req.user.society;
    const { category, appliedTo } = req.query;

    const filter = { society: adminSociety, isActive: true };
    if (category) filter.category = category;
    if (appliedTo) filter.appliedTo = appliedTo;

    const charges = await Charge.find(filter)
      .populate("targetUsers", "name email unit.flatNumber unit.towerBlock")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    // har charge ke liye payment summary
    const chargesWithPayments = await Promise.all(
      charges.map(async (charge) => {
        const totalPayments = await Payment.countDocuments({ charge: charge._id });
        const approvedPayments = await Payment.countDocuments({
          charge: charge._id,
          status: "approved",
        });
        const pendingPayments = await Payment.countDocuments({
          charge: charge._id,
          status: "pending",
        });

        const chargeData = attachBaseUrl(req, charge, CHARGE_FIELDS.single, CHARGE_FIELDS.array);
        return {
          ...chargeData,
          paymentSummary: {
            total: totalPayments,
            approved: approvedPayments,
            pending: pendingPayments,
            rejected: totalPayments - approvedPayments - pendingPayments,
          },
        };
      })
    );

    res.json({
      count: chargesWithPayments.length,
      charges: chargesWithPayments,
    });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Get single charge detail ───────────────────────────────
export async function getChargeById(req, res, next) {
  try {
    const { chargeId } = req.params;
    const adminSociety = req.user.society;

    const charge = await Charge.findOne({
      _id: chargeId,
      society: adminSociety,
    })
      .populate("targetUsers", "name email phone unit.flatNumber unit.towerBlock")
      .populate("createdBy", "name email");

    if (!charge) {
      return res.status(404).json({ message: "Charge not found" });
    }

    // payments for this charge
    const payments = await Payment.find({ charge: chargeId })
      .populate("user", "name email phone unit.flatNumber unit.towerBlock")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    const chargeResult = attachBaseUrl(req, charge, CHARGE_FIELDS.single, CHARGE_FIELDS.array);
    const paymentResults = attachBaseUrlToArray(req, payments, ["paymentScreenshotUrl"], []);

    res.json({
      charge: chargeResult,
      payments: {
        count: paymentResults.length,
        items: paymentResults,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Update a charge ────────────────────────────────────────
export async function updateCharge(req, res, next) {
  try {
    const { chargeId } = req.params;
    const adminSociety = req.user.society;
    const {
      title, description, category, amount, dueDate,
      appliedTo, targetUsers, unitType,
    } = req.body;

    const charge = await Charge.findOne({
      _id: chargeId,
      society: adminSociety,
      isActive: true,
    });

    if (!charge) {
      return res.status(404).json({ message: "Charge not found" });
    }

    if (title) charge.title = title;
    if (description !== undefined) charge.description = description;
    if (category) charge.category = category;
    if (amount !== undefined) charge.amount = amount;
    if (dueDate !== undefined) charge.dueDate = dueDate;
    if (unitType !== undefined) charge.unitType = unitType;

    // Handle new proof image upload
    if (req.file) {
      charge.proofImageUrl = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    if (appliedTo) {
      charge.appliedTo = appliedTo;
      let parsedTargetUsers = targetUsers;
      if (typeof targetUsers === "string") {
        try { parsedTargetUsers = JSON.parse(targetUsers); } catch { parsedTargetUsers = [targetUsers]; }
      }

      if (appliedTo === "specific" && parsedTargetUsers) {
        // verify users
        const validUsers = await User.countDocuments({
          _id: { $in: parsedTargetUsers },
          society: adminSociety,
          role: "user",
        });
        if (validUsers !== parsedTargetUsers.length) {
          return res.status(400).json({
            message: "Some target users are invalid or not in your society",
          });
        }
        charge.targetUsers = parsedTargetUsers;
      } else if (appliedTo === "all") {
        charge.targetUsers = [];
      }
    }

    await charge.save();

    const updated = await Charge.findById(charge._id)
      .populate("targetUsers", "name email unit.flatNumber unit.towerBlock")
      .populate("createdBy", "name email");

    const result = attachBaseUrl(req, updated, CHARGE_FIELDS.single, CHARGE_FIELDS.array);
    res.json({
      message: "Charge updated successfully",
      charge: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Soft delete a charge ───────────────────────────────────
export async function deleteCharge(req, res, next) {
  try {
    const { chargeId } = req.params;
    const adminSociety = req.user.society;

    const charge = await Charge.findOne({
      _id: chargeId,
      society: adminSociety,
    });

    if (!charge) {
      return res.status(404).json({ message: "Charge not found" });
    }

    charge.isActive = false;
    await charge.save();

    res.json({ message: "Charge deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// ─── USER: Get my charges ──────────────────────────────────────────
export async function getMyCharges(req, res, next) {
  try {
    const userId = req.user.id;
    const userSociety = req.user.society;
    const { category } = req.query;

    // user ka data lao for unitType matching
    const user = await User.findById(userId);

    const filter = {
      society: userSociety,
      isActive: true,
      $or: [
        { appliedTo: "all" },
        { targetUsers: userId },
      ],
    };

    if (category) filter.category = category;

    // unitType filter — agar charge specific unitType ke liye hai
    // to sirf usi type ke users ko dikhega
    let charges = await Charge.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    // unitType matching — filter out charges meant for different unit types
    charges = charges.filter((charge) => {
      if (!charge.unitType) return true; // no unitType = applicable to all
      return user.unit && user.unit.type === charge.unitType;
    });

    // har charge ke liye user ka payment status
    const chargesWithStatus = await Promise.all(
      charges.map(async (charge) => {
        const payment = await Payment.findOne({
          charge: charge._id,
          user: userId,
        }).sort({ createdAt: -1 });

        const chargeData = attachBaseUrl(req, charge, CHARGE_FIELDS.single, CHARGE_FIELDS.array);
        return {
          ...chargeData,
          paymentStatus: payment
            ? {
                status: payment.status,
                paidAt: payment.createdAt,
                transactionId: payment.transactionId,
              }
            : { status: "unpaid" },
        };
      })
    );

    res.json({
      count: chargesWithStatus.length,
      charges: chargesWithStatus,
    });
  } catch (error) {
    next(error);
  }
}

// ─── USER: Get single charge detail ────────────────────────────────
export async function getMyChargeById(req, res, next) {
  try {
    const { chargeId } = req.params;
    const userId = req.user.id;
    const userSociety = req.user.society;

    const charge = await Charge.findOne({
      _id: chargeId,
      society: userSociety,
      isActive: true,
      $or: [
        { appliedTo: "all" },
        { targetUsers: userId },
      ],
    }).populate("createdBy", "name email");

    if (!charge) {
      return res.status(404).json({ message: "Charge not found" });
    }

    // user ke payments for this charge
    const payments = await Payment.find({
      charge: chargeId,
      user: userId,
    }).sort({ createdAt: -1 });

    const chargeResult = attachBaseUrl(req, charge, CHARGE_FIELDS.single, CHARGE_FIELDS.array);
    const paymentResults = attachBaseUrlToArray(req, payments, ["paymentScreenshotUrl"], []);

    res.json({
      charge: chargeResult,
      myPayments: paymentResults,
    });
  } catch (error) {
    next(error);
  }
}
