import ActivityLog from "../models/ActivityLog.js";

/**
 * Log a user activity. Fire-and-forget — errors are silently swallowed
 * so a logging failure never breaks the main request flow.
 *
 * @param {Object} params
 * @param {string} params.userId     - The user whose activity is being logged
 * @param {string} params.societyId  - The society this activity belongs to
 * @param {string} params.action     - Action enum value (see ActivityLog model)
 * @param {string} params.description - Human-readable description shown in the log
 * @param {string} [params.refId]    - Optional ObjectId of related document
 * @param {string} [params.refModel] - Model name for refId ("Payment", "Complaint", etc.)
 * @param {Object} [params.meta]     - Extra details (transactionId, vehicleNumber, etc.)
 */
export async function logActivity({ userId, societyId, action, description, refId, refModel, meta = {} }) {
  try {
    await ActivityLog.create({
      user: userId,
      society: societyId,
      action,
      description,
      ...(refId && { refId }),
      ...(refModel && { refModel }),
      meta,
    });
  } catch (err) {
    // Never let logging break the main flow
    console.error("[ActivityLog] Failed to save activity:", err.message);
  }
}
