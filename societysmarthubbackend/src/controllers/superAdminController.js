import Society from "../models/Society.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { attachBaseUrl, attachBaseUrlToArray } from "../utils/addBaseUrl.js";

const SALT_ROUNDS = 12;
const SOCIETY_IMG_FIELDS = { single: ["logoUrl"], array: [] };
const USER_IMG_FIELDS = { single: ["profilePicUrl", "kyc.governmentIdUrl", "kyc.addressProofUrl"], array: [] };

// SuperAdmin creates a new society
export async function createSociety(req, res, next) {
  try {
    const {
      name, address, contactEmail, contactPhone,
      totalUnits, totalFloors, totalTowers, settings,
    } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Society name and address are required" });
    }

    const existing = await Society.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Society with this name already exists" });
    }

    // Get logo path from uploaded file
    const logoUrl = req.file
      ? `/${req.file.path.replace(/\\/g, "/")}`
      : null;

    const society = await Society.create({
      name,
      address: typeof address === "string" ? JSON.parse(address) : address,
      contactEmail,
      contactPhone,
      totalUnits,
      totalFloors,
      totalTowers,
      logoUrl,
      settings: typeof settings === "string" ? JSON.parse(settings) : settings,
      createdBy: req.user.id,
    });

    const result = attachBaseUrl(req, society, SOCIETY_IMG_FIELDS.single, SOCIETY_IMG_FIELDS.array);
    res.status(201).json({
      message: "Society created successfully",
      society: result,
    });
  } catch (error) {
    next(error);
  }
}

// SuperAdmin creates an admin for a specific society
export async function createAdminForSociety(req, res, next) {
  try {
    const {
      name, email, phone, password, societyId,
      kyc, address, designation, flatNumber, towerBlock,
    } = req.body;

    if (!name || !email || !phone || !password || !societyId) {
      return res.status(400).json({
        message: "name, email, phone, password, and societyId are required",
      });
    }

    // Parse kyc if it's a string (from FormData)
    const parsedKyc = typeof kyc === "string" ? JSON.parse(kyc) : kyc;

    // KYC mandatory for society_admin — prevents fraud
    if (!parsedKyc || !parsedKyc.aadhaarNumber || !parsedKyc.panNumber) {
      return res.status(400).json({
        message: "kyc.aadhaarNumber and kyc.panNumber are required for society admin",
      });
    }

    // Check if society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Get KYC document paths from uploaded files
    const governmentIdUrl = req.files?.governmentIdDoc?.[0]
      ? `/${req.files.governmentIdDoc[0].path.replace(/\\/g, "/")}`
      : null;
    const addressProofUrl = req.files?.addressProofDoc?.[0]
      ? `/${req.files.addressProofDoc[0].path.replace(/\\/g, "/")}`
      : null;

    // Parse address if string
    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

    // Create society admin
    const pwdHash = await bcrypt.hash(password, SALT_ROUNDS);
    const admin = await User.create({
      name,
      email,
      phone,
      passwordHash: pwdHash,
      role: "society_admin",
      society: societyId,
      kyc: {
        aadhaarNumber: parsedKyc.aadhaarNumber,
        panNumber: parsedKyc.panNumber,
        governmentIdUrl,
        addressProofUrl,
        verified: false,
      },
      address: parsedAddress,
      designation,
      flatNumber,
      towerBlock,
      isActive: true,
    });

    res.status(201).json({
      message: "Society admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        society: admin.society,
        designation: admin.designation,
        kyc: { verified: admin.kyc.verified },
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

// SuperAdmin can list all societies
export async function getAllSocieties(req, res, next) {
  try {
    const societies = await Society.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const result = attachBaseUrlToArray(req, societies, SOCIETY_IMG_FIELDS.single, SOCIETY_IMG_FIELDS.array);
    res.json({
      count: result.length,
      societies: result,
    });
  } catch (error) {
    next(error);
  }
}

// SuperAdmin can get a specific society details
export async function getSocietyDetails(req, res, next) {
  try {
    const { societyId } = req.params;

    const society = await Society.findById(societyId)
      .populate("createdBy", "name email");

    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    // Get all admins and users for this society
    const users = await User.find({ society: societyId })
      .select("-passwordHash")
      .sort({ role: 1, createdAt: -1 });

    const societyResult = attachBaseUrl(req, society, SOCIETY_IMG_FIELDS.single, SOCIETY_IMG_FIELDS.array);
    const usersResult = attachBaseUrlToArray(req, users, USER_IMG_FIELDS.single, USER_IMG_FIELDS.array);

    res.json({
      society: societyResult,
      users: {
        count: usersResult.length,
        list: usersResult,
      },
    });
  } catch (error) {
    next(error);
  }
}

// SuperAdmin can deactivate/activate any user
export async function toggleUserStatus(req, res, next) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({ message: "Cannot modify superadmin status" });
    }

    user.isActive = !user.isActive;
    await user.save();

    const updated = await User.findById(user._id)
      .select("-passwordHash")
      .populate("society", "name slug");

    const result = attachBaseUrl(req, updated, USER_IMG_FIELDS.single, USER_IMG_FIELDS.array);
    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: result,
    });
  } catch (error) {
    next(error);
  }
}
