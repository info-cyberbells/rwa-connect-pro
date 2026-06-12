import User from "../models/user.js";
import Society from "../models/Society.js";
import DeactivationRequest from "../models/DeactivationRequest.js";
import Complaint from "../models/Complaint.js";
import Payment from "../models/Payment.js";
import ActivityLog from "../models/ActivityLog.js";
import bcrypt from "bcryptjs";
import { attachBaseUrl, attachBaseUrlToArray } from "../utils/addBaseUrl.js";
import { logActivity } from "../utils/logActivity.js";

const SALT_ROUNDS = 12;
const USER_IMG_FIELDS = {
  single: [
    "profilePicUrl",
    "kyc.governmentIdUrl",
    "kyc.addressProofUrl",
    "idProof.documentUrl",
  ],
  array: [],
};
const SOCIETY_IMG_FIELDS = { single: ["logoUrl"], array: [] };

// Society Admin Dashboard Stats
export async function getDashboardStats(req, res, next) {
  try {
    const adminSociety = req.user.society;

    if (!adminSociety) {
      return res
        .status(403)
        .json({ message: "Admin must be assigned to a society" });
    }

    // 1. Total Residents
    const totalResidents = await User.countDocuments({ 
      society: adminSociety, 
      role: "user" 
    });

    // 2. Maintenance Collected (Approved payments only)
    const paymentStats = await Payment.aggregate([
      { $match: { society: adminSociety, status: "approved" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const maintenanceCollected = paymentStats.length > 0 ? paymentStats[0].totalAmount : 0;

    // 3. Active Complaints (Open or In Progress)
    const activeComplaints = await Complaint.countDocuments({
      society: adminSociety,
      status: { $in: ["open", "in_progress"] }
    });

    // 4. Recent Activity (Last 5 logs)
    const recentActivity = await ActivityLog.find({ society: adminSociety })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalResidents,
        maintenanceCollected,
        activeComplaints,
      },
      recentActivity
    });
  } catch (error) {
    next(error);
  }
}

// Society Admin can create users in their society
export async function createUser(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      unit,
      familyMembers,
      vehicles,
      idProof,
      guardDetails,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "name, email, phone, and password are required",
      });
    }

    // Only allow user and guard roles
    const allowedRoles = ["user", "guard"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Parse unit if string (from FormData)
    const parsedUnit = typeof unit === "string" ? JSON.parse(unit) : unit;

    // Unit validation ONLY for normal users
    if (
      (role === "user" || !role) &&
      (!parsedUnit ||
        !parsedUnit.flatNumber ||
        !parsedUnit.towerBlock ||
        !parsedUnit.ownershipType)
    ) {
      return res.status(400).json({
        message:
          "unit.flatNumber, unit.towerBlock, and unit.ownershipType are required",
      });
    }

    // Society admin can only create users in their own society
    const adminSociety = req.user.society;

    if (!adminSociety) {
      return res.status(403).json({
        message: "Admin must be assigned to a society",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Parse vehicles if string
    const parsedVehicles = vehicles
      ? typeof vehicles === "string"
        ? JSON.parse(vehicles)
        : vehicles
      : [];

    // Parse idProof if string
    const parsedIdProof = idProof
      ? typeof idProof === "string"
        ? JSON.parse(idProof)
        : idProof
      : undefined;

    // ID proof upload
    const idProofDocUrl = req.file
      ? `/${req.file.path.replace(/\\/g, "/")}`
      : null;

    // Password hash
    const pwdHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user / guard
    const user = await User.create({
      name,
      email,
      phone,

      passwordHash: pwdHash,

      role: role || "user",

      society: adminSociety,

      // User fields
      unit: role === "user" || !role ? parsedUnit : undefined,

      familyMembers: role === "user" ? familyMembers : undefined,

      vehicles: role === "user" ? parsedVehicles : [],

      idProof: parsedIdProof
        ? {
            ...parsedIdProof,
            documentUrl: idProofDocUrl,
          }
        : idProofDocUrl
          ? {
              documentUrl: idProofDocUrl,
            }
          : undefined,

      // Guard fields
      guardDetails:
        role === "guard"
          ? {
              employeeId: guardDetails?.employeeId,

              shift: guardDetails?.shift,

              joiningDate: new Date(),
            }
          : undefined,

      isActive: true,
    });

    const result = attachBaseUrl(
      req,
      user,
      USER_IMG_FIELDS.single,
      USER_IMG_FIELDS.array,
    );

    // Activity logs
    if (role === "guard") {
      logActivity({
        userId: user._id,
        societyId: adminSociety,
        action: "guard_created",
        description: `Guard account created for ${name}.`,
      });
    } else {
      logActivity({
        userId: user._id,
        societyId: adminSociety,
        action: "joined_society",
        description: `Membership approved for ${parsedUnit.towerBlock}, Flat ${parsedUnit.flatNumber}.`,
        meta: {
          flatNumber: parsedUnit.flatNumber,
          towerBlock: parsedUnit.towerBlock,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message:
        role === "guard"
          ? "Guard created successfully"
          : "User created successfully",
      user: result,
    });
  } catch (error) {
    next(error);
  }
}
// Society Admin can list all users in their society
export async function getSocietyUsers(req, res, next) {
  try {
    // If superadmin, allow passing societyId via query
    const targetSocietyId = (req.user.role === 'superadmin' || req.user.role === 'super-admin') 
      ? req.query.societyId 
      : req.user.society;

    if (!targetSocietyId) {
      return res
        .status(400)
        .json({ message: "Society ID is required" });
    }

    const users = await User.find({ society: targetSocietyId, role: "user" })
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    const result = attachBaseUrlToArray(
      req,
      users,
      USER_IMG_FIELDS.single,
      USER_IMG_FIELDS.array,
    );
    res.json({
      success: true,
      count: result.length,
      users: result,
      data: result // Added for frontend compatibility
    });
  } catch (error) {
    next(error);
  }
}

// Society Admin can get details of a specific user in their society
export async function getUserDetails(req, res, next) {
  try {
    const { userId } = req.params;
    const adminSociety = req.user.society;

    const user = await User.findOne({
      _id: userId,
      society: adminSociety,
    }).select("-passwordHash");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in your society" });
    }

    const result = attachBaseUrl(
      req,
      user,
      USER_IMG_FIELDS.single,
      USER_IMG_FIELDS.array,
    );
    res.json({ user: result });
  } catch (error) {
    next(error);
  }
}

// Society Admin can update user details in their society
export async function updateUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { name, email, phone, unit, familyMembers, vehicles, idProof } =
      req.body;
    const adminSociety = req.user.society;

    const user = await User.findOne({ _id: userId, society: adminSociety });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in your society" });
    }

    if (user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Cannot modify admin or superadmin users" });
    }

    const updates = {};

    // Check email uniqueness if changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updates.email = email;
    }

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (familyMembers !== undefined) updates.familyMembers = familyMembers;

    // Partial unit update
    const parsedUnit = typeof unit === "string" ? JSON.parse(unit) : unit;
    if (parsedUnit) {
      const allowedUnitFields = [
        "flatNumber",
        "towerBlock",
        "floor",
        "type",
        "areaSqFt",
        "ownershipType",
        "ownerName",
        "ownerPhone",
        "parkingSlots",
        "moveInDate",
      ];
      for (const field of allowedUnitFields) {
        if (parsedUnit[field] !== undefined) {
          updates[`unit.${field}`] = parsedUnit[field];
        }
      }
    }

    // Replace vehicles array if provided
    if (vehicles !== undefined) {
      updates.vehicles =
        typeof vehicles === "string" ? JSON.parse(vehicles) : vehicles;
    }

    // Update idProof fields
    const parsedIdProof = idProof
      ? typeof idProof === "string"
        ? JSON.parse(idProof)
        : idProof
      : null;
    if (parsedIdProof) {
      if (parsedIdProof.type !== undefined)
        updates["idProof.type"] = parsedIdProof.type;
      if (parsedIdProof.number !== undefined)
        updates["idProof.number"] = parsedIdProof.number;
    }
    if (req.file) {
      updates["idProof.documentUrl"] = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    await User.updateOne({ _id: userId }, updates);

    const updated = await User.findById(userId)
      .select("-passwordHash")
      .populate("society", "name slug");

    const result = attachBaseUrl(
      req,
      updated,
      USER_IMG_FIELDS.single,
      USER_IMG_FIELDS.array,
    );
    res.json({ message: "User updated successfully", user: result });
  } catch (error) {
    next(error);
  }
}

// Society Admin can add a vehicle to a user
export async function addVehicle(req, res, next) {
  try {
    const { userId } = req.params;
    const { type, model, vehicleNumber } = req.body;
    const adminSociety = req.user.society;

    if (!type) {
      return res.status(400).json({ message: "Vehicle type is required" });
    }

    const user = await User.findOne({
      _id: userId,
      society: adminSociety,
      role: role || "user",
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in your society" });
    }

    user.vehicles.push({ type, model, vehicleNumber });
    await user.save();

    logActivity({
      userId,
      societyId: adminSociety,
      action: "vehicle_added",
      description: `New vehicle added: ${model || type}${vehicleNumber ? ` (${vehicleNumber})` : ""}.`,
      meta: { type, model, vehicleNumber },
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicles: user.vehicles,
    });
  } catch (error) {
    next(error);
  }
}

// Society Admin can remove a vehicle from a user
export async function removeVehicle(req, res, next) {
  try {
    const { userId, vehicleId } = req.params;
    const adminSociety = req.user.society;

    const user = await User.findOne({
      _id: userId,
      society: adminSociety,
      role: role || "user",
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in your society" });
    }

    const vehicleIndex = user.vehicles.findIndex(
      (v) => v._id.toString() === vehicleId,
    );
    if (vehicleIndex === -1) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const removedVehicle = user.vehicles[vehicleIndex];
    user.vehicles.splice(vehicleIndex, 1);
    await user.save();

    logActivity({
      userId,
      societyId: adminSociety,
      action: "vehicle_removed",
      description: `Vehicle removed: ${removedVehicle.model || removedVehicle.type}${removedVehicle.vehicleNumber ? ` (${removedVehicle.vehicleNumber})` : ""}.`,
      meta: {
        type: removedVehicle.type,
        model: removedVehicle.model,
        vehicleNumber: removedVehicle.vehicleNumber,
      },
    });

    res.json({
      message: "Vehicle removed successfully",
      vehicles: user.vehicles,
    });
  } catch (error) {
    next(error);
  }
}

// Society Admin can deactivate/activate users in their society
export async function toggleUserStatus(req, res, next) {
  try {
    const { userId } = req.params;
    const adminSociety = req.user.society;

    const user = await User.findOne({
      _id: userId,
      society: adminSociety,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in your society" });
    }

    if (user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Cannot modify status of admin users" });
    }

    const newStatus = !user.isActive;
    await User.updateOne({ _id: userId }, { isActive: newStatus });

    const updated = await User.findById(userId)
      .select("-passwordHash")
      .populate("society", "name slug");

    const result = attachBaseUrl(
      req,
      updated,
      USER_IMG_FIELDS.single,
      USER_IMG_FIELDS.array,
    );

    logActivity({
      userId,
      societyId: adminSociety,
      action: newStatus ? "account_activated" : "account_deactivated",
      description: `Account was ${newStatus ? "activated" : "deactivated"} by admin.`,
    });

    res.json({
      message: `User ${newStatus ? "activated" : "deactivated"} successfully`,
      user: result,
    });
  } catch (error) {
    next(error);
  }
}

// Society Admin: get all deactivation requests in their society
export async function getDeactivationRequests(req, res, next) {
  try {
    const adminSociety = req.user.society;
    const { status } = req.query; // optional filter: pending, approved, rejected

    const filter = { society: adminSociety };
    if (status) filter.status = status;

    const requests = await DeactivationRequest.find(filter)
      .populate("user", "name email phone unit")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ count: requests.length, requests });
  } catch (error) {
    next(error);
  }
}

// Society Admin: approve or reject a deactivation request
export async function reviewDeactivationRequest(req, res, next) {
  try {
    const { requestId } = req.params;
    const { status, adminRemarks } = req.body;
    const adminSociety = req.user.society;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "status must be 'approved' or 'rejected'" });
    }

    const request = await DeactivationRequest.findOne({
      _id: requestId,
      society: adminSociety,
      status: "pending",
    });

    if (!request) {
      return res
        .status(404)
        .json({ message: "Pending request not found in your society" });
    }

    request.status = status;
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    if (adminRemarks) request.adminRemarks = adminRemarks;
    await request.save();

    // If approved → deactivate the user
    if (status === "approved") {
      await User.updateOne({ _id: request.user }, { isActive: false });
    }

    res.json({
      message: `Deactivation request ${status}`,
      request: {
        id: request._id,
        status: request.status,
        reviewedAt: request.reviewedAt,
        adminRemarks: request.adminRemarks,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Society Admin can view their society details
export async function getMySociety(req, res, next) {
  try {
    const adminSociety = req.user.society;

    if (!adminSociety) {
      return res
        .status(403)
        .json({ message: "Admin must be assigned to a society" });
    }

    const society = await Society.findById(adminSociety).populate(
      "createdBy",
      "name email",
    );

    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    const result = attachBaseUrl(
      req,
      society,
      SOCIETY_IMG_FIELDS.single,
      SOCIETY_IMG_FIELDS.array,
    );
    res.json({ society: result });
  } catch (error) {
    next(error);
  }
}
