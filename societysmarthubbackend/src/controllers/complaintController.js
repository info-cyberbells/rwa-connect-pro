import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import { attachBaseUrl, attachBaseUrlToArray } from "../utils/addBaseUrl.js";
import { logActivity } from "../utils/logActivity.js";
import { createNotification } from "./notificationController.js"; // [NEW] Import notification utility

const COMPLAINT_IMG_FIELDS = { single: [], array: ["imageUrls"] };

// ─── USER: Submit a new complaint ────────────────────────────────────────────
export async function createComplaint(req, res, next) {
  try {
    const society = req.user.society;
    if (!society) {
      return res.status(403).json({ message: "You must be assigned to a society" });
    }

    const { type, priority, title, location, preferredVisitTime, description } = req.body;

    if (!type || !title) {
      return res.status(400).json({ message: "type and title are required" });
    }

    // Get image paths from uploaded files
    const imageUrls = req.files
      ? req.files.map((f) => `/${f.path.replace(/\\/g, "/")}`)
      : [];

    const complaint = await Complaint.create({
      society,
      submittedBy: req.user.id,
      type,
      priority: priority || "low",
      title,
      location,
      preferredVisitTime,
      description,
      imageUrls,
    });

    const populated = await Complaint.findById(complaint._id)
      .populate("submittedBy", "name email unit.flatNumber unit.towerBlock");

    const result = attachBaseUrl(req, populated, COMPLAINT_IMG_FIELDS.single, COMPLAINT_IMG_FIELDS.array);

    logActivity({
      userId: req.user.id,
      societyId: society,
      action: "complaint_submitted",
      description: `Complaint submitted: "${title}" (${type}, ${priority || "low"} priority).`,
      refId: complaint._id,
      refModel: "Complaint",
      meta: { type, priority: priority || "low", title },
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint: result });
  } catch (error) {
    next(error);
  }
}

// ─── USER: Get own complaints ────────────────────────────────────────────────
export async function getMyComplaints(req, res, next) {
  try {
    const society = req.user.society;
    if (!society) {
      return res.status(403).json({ message: "No society assigned" });
    }

    const { status, type } = req.query;
    const filter = { society, submittedBy: req.user.id };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 });

    const result = attachBaseUrlToArray(req, complaints, COMPLAINT_IMG_FIELDS.single, COMPLAINT_IMG_FIELDS.array);
    res.json({ count: result.length, complaints: result });
  } catch (error) {
    next(error);
  }
}

// ─── USER: Get single complaint (own only) ───────────────────────────────────
export async function getComplaintById(req, res, next) {
  try {
    const society = req.user.society;
    const { complaintId } = req.params;

    const filter = { _id: complaintId, society };
    // Regular user can only see their own complaint
    if (req.user.role === "user") {
      filter.submittedBy = req.user.id;
    }

    const complaint = await Complaint.findOne(filter)
      .populate("submittedBy", "name email unit.flatNumber unit.towerBlock");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const result = attachBaseUrl(req, complaint, COMPLAINT_IMG_FIELDS.single, COMPLAINT_IMG_FIELDS.array);
    res.json({ complaint: result });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Get all complaints for society ───────────────────────────────────
export async function getAllComplaints(req, res, next) {
  try {
    const society = req.user.society;
    if (!society) {
      return res.status(403).json({ message: "Admin must be assigned to a society" });
    }

    const { status, type, priority, page = 1, limit = 20 } = req.query;
    const filter = { society };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("submittedBy", "name email unit.flatNumber unit.towerBlock")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Complaint.countDocuments(filter),
    ]);

    const result = attachBaseUrlToArray(req, complaints, COMPLAINT_IMG_FIELDS.single, COMPLAINT_IMG_FIELDS.array);
    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      complaints: result,
    });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Update complaint status / assign / remarks ───────────────────────
export async function updateComplaintStatus(req, res, next) {
  try {
    const society = req.user.society;
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({ _id: complaintId, society });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const { status, assignedTo, adminRemarks } = req.body;

    if (status) {
      const validStatuses = ["open", "in_progress", "resolved", "closed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `status must be one of: ${validStatuses.join(", ")}` });
      }
      complaint.status = status;
      if (status === "resolved" && !complaint.resolvedAt) {
        complaint.resolvedAt = new Date();
      }
    }

    if (assignedTo !== undefined) complaint.assignedTo = assignedTo || {};
    if (adminRemarks !== undefined) complaint.adminRemarks = adminRemarks;

    await complaint.save();

    // [NEW] Trigger notification for the user who submitted the complaint
    if (status) {
      await createNotification({
        recipient: complaint.submittedBy,
        society,
        title: "Complaint Update",
        message: `Your complaint "${complaint.title}" status has been updated to "${status}".`,
        category: "complaint",
        type: status === "resolved" ? "success" : "info",
        link: "/member/complaints",
      }).catch(err => console.error("Notification Error:", err));
    }

    const updated = await Complaint.findById(complaint._id)
      .populate("submittedBy", "name email unit.flatNumber unit.towerBlock");

    const result = attachBaseUrl(req, updated, COMPLAINT_IMG_FIELDS.single, COMPLAINT_IMG_FIELDS.array);
    res.json({ message: "Complaint updated successfully", complaint: result });
  } catch (error) {
    next(error);
  }
}

// ─── ADMIN: Stats — open/resolved counts, by type breakdown ─────────────────
export async function getComplaintStats(req, res, next) {
  try {
    const society = req.user.society;
    if (!society) {
      return res.status(403).json({ message: "Admin must be assigned to a society" });
    }

    const societyId = new mongoose.Types.ObjectId(society);

    const [statusCounts, typeCounts] = await Promise.all([
      Complaint.aggregate([
        { $match: { society: societyId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Complaint.aggregate([
        { $match: { society: societyId } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
    ]);

    // Format into readable objects
    const byStatus = {};
    for (const s of statusCounts) byStatus[s._id] = s.count;

    const byType = {};
    for (const t of typeCounts) byType[t._id] = t.count;

    res.json({
      byStatus: {
        open: byStatus.open || 0,
        in_progress: byStatus.in_progress || 0,
        resolved: byStatus.resolved || 0,
        closed: byStatus.closed || 0,
      },
      byType,
    });
  } catch (error) {
    next(error);
  }
}
