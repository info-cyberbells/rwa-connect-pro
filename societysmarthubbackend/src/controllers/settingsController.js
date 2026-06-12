import SystemSettings from "../models/SystemSettings.js";
import Plan from "../models/Plan.js";
import RefreshToken from "../models/RefreshToken.js";
import User from "../models/user.js";
import { attachBaseUrl } from "../utils/addBaseUrl.js";
import { createNotification } from "./notificationController.js";

const SETTINGS_IMG_FIELDS = { single: ["logoUrl"], array: [] };

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Returns the singleton SystemSettings doc, creates it if missing
async function getOrCreateSettings() {
  let settings = await SystemSettings.findOne();
  if (!settings) settings = await SystemSettings.create({});
  return settings;
}

// ─── Platform Config ──────────────────────────────────────────────────────────

// GET /api/superadmin/settings/platform
export async function getPlatformConfig(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    const result = attachBaseUrl(req, settings, SETTINGS_IMG_FIELDS.single, SETTINGS_IMG_FIELDS.array);
    res.json({ settings: result });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/superadmin/settings/platform
export async function updatePlatformConfig(req, res, next) {
  try {
    const { platformName, supportEmail } = req.body;
    const settings = await getOrCreateSettings();

    if (platformName) settings.platformName = platformName;
    if (supportEmail) settings.supportEmail = supportEmail;
    if (req.file) {
      settings.logoUrl = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    await settings.save();
    const result = attachBaseUrl(req, settings, SETTINGS_IMG_FIELDS.single, SETTINGS_IMG_FIELDS.array);
    res.json({ message: "Platform config updated successfully", settings: result });
  } catch (error) {
    next(error);
  }
}

// ─── Notification Rules ───────────────────────────────────────────────────────

// PATCH /api/superadmin/settings/notifications
export async function updateNotificationRules(req, res, next) {
  try {
    const { newSocietyRegistration, paymentFailureAlerts, systemHealthUpdates } = req.body;
    const settings = await getOrCreateSettings();

    if (newSocietyRegistration) {
      if (newSocietyRegistration.email !== undefined)
        settings.notificationRules.newSocietyRegistration.email = newSocietyRegistration.email;
      if (newSocietyRegistration.push !== undefined)
        settings.notificationRules.newSocietyRegistration.push = newSocietyRegistration.push;
    }
    if (paymentFailureAlerts) {
      if (paymentFailureAlerts.email !== undefined)
        settings.notificationRules.paymentFailureAlerts.email = paymentFailureAlerts.email;
      if (paymentFailureAlerts.push !== undefined)
        settings.notificationRules.paymentFailureAlerts.push = paymentFailureAlerts.push;
    }
    if (systemHealthUpdates) {
      if (systemHealthUpdates.email !== undefined)
        settings.notificationRules.systemHealthUpdates.email = systemHealthUpdates.email;
      if (systemHealthUpdates.push !== undefined)
        settings.notificationRules.systemHealthUpdates.push = systemHealthUpdates.push;
    }

    settings.markModified("notificationRules");
    await settings.save();
    res.json({ message: "Notification rules updated successfully", notificationRules: settings.notificationRules });
  } catch (error) {
    next(error);
  }
}

// ─── Subscription Plans ───────────────────────────────────────────────────────

// GET /api/superadmin/settings/plans
export async function getPlans(req, res, next) {
  try {
    const plans = await Plan.find().sort({ pricePerYear: 1 });
    res.json({ count: plans.length, plans });
  } catch (error) {
    next(error);
  }
}

// POST /api/superadmin/settings/plans
export async function createPlan(req, res, next) {
  try {
    const { name, description, maxUnits, pricePerYear, features, isPopular } = req.body;

    if (!name || pricePerYear === undefined) {
      return res.status(400).json({ message: "name and pricePerYear are required" });
    }

    const plan = await Plan.create({
      name,
      description,
      maxUnits: maxUnits || null,
      pricePerYear,
      features: typeof features === "string" ? JSON.parse(features) : (features || []),
      isPopular: isPopular === true || isPopular === "true",
    });

    // Notify all admins about new platform offering
    await createNotification({
      sender: req.user.id,
      title: "New Subscription Plan Available",
      message: `A new plan "${name}" has been added. Upgrade now for better society management!`,
      category: "general",
      targetAudience: "admins",
      type: "info",
      link: "/admin/subscription",
      isRead: false
    }).catch(err => console.error("Plan Create Notify Error:", err));

    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/superadmin/settings/plans/:planId
export async function updatePlan(req, res, next) {
  try {
    const { planId } = req.params;
    const { name, description, maxUnits, pricePerYear, features, isPopular, isActive } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (name !== undefined) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (maxUnits !== undefined) plan.maxUnits = maxUnits || null;
    if (pricePerYear !== undefined) plan.pricePerYear = pricePerYear;
    if (features !== undefined) plan.features = typeof features === "string" ? JSON.parse(features) : features;
    if (isPopular !== undefined) plan.isPopular = isPopular === true || isPopular === "true";
    if (isActive !== undefined) plan.isActive = isActive === true || isActive === "true";

    await plan.save();

    // Notify about plan upgrades
    await createNotification({
      sender: req.user.id,
      title: "Plan Features Updated",
      message: `The subscription plan "${plan.name}" has been upgraded with new features. Check it out now!`,
      category: "general",
      targetAudience: "admins",
      type: "success",
      link: "/admin/subscription",
      isRead: false
    }).catch(err => console.error("Plan Update Notify Error:", err));

    res.json({ message: "Plan updated successfully", plan });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/superadmin/settings/plans/:planId
export async function deletePlan(req, res, next) {
  try {
    const { planId } = req.params;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await plan.deleteOne();
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// ─── Active Sessions ──────────────────────────────────────────────────────────

// GET /api/superadmin/settings/sessions
export async function getActiveSessions(req, res, next) {
  try {
    const currentToken = req.cookies?.refreshToken || null;

    const sessions = await RefreshToken.find({
      user: req.user.id,
      revoked: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    const result = sessions.map((s) => ({
      sessionId: s._id,
      ip: s.deviceInfo?.ip || "unknown",
      userAgent: s.deviceInfo?.userAgent || "unknown",
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: currentToken ? s.token === currentToken : false,
    }));

    res.json({ count: result.length, sessions: result });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/superadmin/settings/sessions/:sessionId
export async function revokeSession(req, res, next) {
  try {
    const { sessionId } = req.params;

    const session = await RefreshToken.findOne({
      _id: sessionId,
      user: req.user.id,
      revoked: false,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found or already revoked" });
    }

    // Prevent revoking current session via this endpoint
    const currentToken = req.cookies?.refreshToken || null;
    if (currentToken && session.token === currentToken) {
      return res.status(400).json({ message: "Cannot revoke current session. Use logout instead." });
    }

    session.revoked = true;
    await session.save();
    res.json({ message: "Session revoked successfully" });
  } catch (error) {
    next(error);
  }
}

// ─── Security Info ────────────────────────────────────────────────────────────

// GET /api/superadmin/settings/security
export async function getSecurityInfo(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("name email lastLoginAt createdAt isActive");
    if (!user) return res.status(404).json({ message: "User not found" });

    const activeSessionsCount = await RefreshToken.countDocuments({
      user: req.user.id,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });

    res.json({
      adminId: user._id,
      name: user.name,
      email: user.email,
      lastLoginAt: user.lastLoginAt,
      memberSince: user.createdAt,
      activeSessionsCount,
      securityLevel: activeSessionsCount > 2 ? "moderate" : "enhanced",
    });
  } catch (error) {
    next(error);
  }
}
