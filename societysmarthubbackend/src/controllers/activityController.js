import ActivityLog from "../models/ActivityLog.js";
import User from "../models/user.js";

/**
 * GET /api/admin/users/:userId/activity
 * Returns paginated activity log for a specific user in the admin's society.
 * Supports optional ?type= filter and ?page= / ?limit= pagination.
 */
export async function getUserActivity(req, res, next) {
  try {
    const { userId } = req.params;
    const adminSociety = req.user.society;
    const { type, page = 1, limit = 30 } = req.query;

    // Verify the user belongs to this society
    const user = await User.findOne({ _id: userId, society: adminSociety, role: "user" }).select("name email unit");
    if (!user) {
      return res.status(404).json({ message: "User not found in your society" });
    }

    const filter = { user: userId, society: adminSociety };
    if (type) filter.action = type;

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ActivityLog.countDocuments(filter),
    ]);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        flatNumber: user.unit?.flatNumber,
        towerBlock: user.unit?.towerBlock,
      },
      activities: logs.map((log) => ({
        id: log._id,
        action: log.action,
        description: log.description,
        meta: log.meta,
        refId: log.refId,
        refModel: log.refModel,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}
