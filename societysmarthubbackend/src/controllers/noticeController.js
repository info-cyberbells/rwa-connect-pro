import Notice from "../models/Notice.js";
import { attachBaseUrl, attachBaseUrlToArray } from "../utils/addBaseUrl.js";
import { createNotification } from "./notificationController.js"; // [NEW] Import notification utility

const NOTICE_FIELDS = { single: [], array: ["imageUrls", "attachmentUrls"] };

// Society Admin creates a notice
export async function createNotice(req, res, next) {
  try {
    const {
      title, description, category, priority,
      visibleFrom, visibleUntil,
      isPinned, targetAudience,
    } = req.body;

    const society = req.user.society;
    if (!society) {
      return res.status(403).json({ message: "Admin must be assigned to a society" });
    }

    if (!title || !description || !visibleUntil) {
      return res.status(400).json({
        message: "title, description, and visibleUntil are required",
      });
    }

    const from = visibleFrom ? new Date(visibleFrom) : new Date();
    const until = new Date(visibleUntil);

    if (until <= from) {
      return res.status(400).json({
        message: "visibleUntil must be after visibleFrom",
      });
    }

    // Get file paths from uploaded files
    const imageUrls = req.files?.images
      ? req.files.images.map((f) => `/${f.path.replace(/\\/g, "/")}`)
      : [];
    const attachmentUrls = req.files?.attachments
      ? req.files.attachments.map((f) => `/${f.path.replace(/\\/g, "/")}`)
      : [];

    const notice = await Notice.create({
      society,
      title,
      description,
      category,
      priority,
      imageUrls,
      attachmentUrls,
      visibleFrom: from,
      visibleUntil: until,
      isPinned: isPinned || false,
      targetAudience,
      createdBy: req.user.id,
    });

    const result = attachBaseUrl(req, notice, NOTICE_FIELDS.single, NOTICE_FIELDS.array);

    // [NEW] Trigger broadcast notification for the target audience
    await createNotification({
      sender: req.user.id,
      society: req.user.society,
      title: "New Notice: " + title,
      message: description.length > 100 ? description.substring(0, 100) + "..." : description,
      category: "notice",
      type: "info",
      targetAudience: targetAudience || "all",
      link: "/member/notices",
    }).catch(err => console.error("Notification Error:", err));

    res.status(201).json({
      message: "Notice created successfully",
      notice: result,
    });
  } catch (error) {
    next(error);
  }
}

// Get all notices for the user's society (pinned first, then latest)
export async function getNotices(req, res, next) {
  try {
    const society = req.user.society;
    if (!society) {
      return res.status(403).json({ message: "No society assigned" });
    }

    const { category } = req.query;

    const filter = { society, isActive: true };

    if (category) {
      filter.category = category;
    }

    const notices = await Notice.find(filter)
      .populate("createdBy", "name email")
      .sort({ isPinned: -1, createdAt: -1 });

    const result = attachBaseUrlToArray(req, notices, NOTICE_FIELDS.single, NOTICE_FIELDS.array);
    res.json({ count: result.length, notices: result });
  } catch (error) {
    next(error);
  }
}

// Get single notice by ID
export async function getNoticeById(req, res, next) {
  try {
    const society = req.user.society;
    const { noticeId } = req.params;

    const notice = await Notice.findOne({ _id: noticeId, society })
      .populate("createdBy", "name email");

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    const result = attachBaseUrl(req, notice, NOTICE_FIELDS.single, NOTICE_FIELDS.array);
    res.json({ notice: result });
  } catch (error) {
    next(error);
  }
}

// Update notice
export async function updateNotice(req, res, next) {
  try {
    const society = req.user.society;
    const { noticeId } = req.params;

    const notice = await Notice.findOne({ _id: noticeId, society });
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    const allowedFields = [
      "title", "description", "category", "priority",
      "visibleFrom", "visibleUntil",
      "isPinned", "targetAudience",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        notice[field] = req.body[field];
      }
    }

    // Handle new file uploads — append to existing or replace
    if (req.files?.images && req.files.images.length > 0) {
      const newImageUrls = req.files.images.map((f) => `/${f.path.replace(/\\/g, "/")}`);
      notice.imageUrls = newImageUrls;
    }
    if (req.files?.attachments && req.files.attachments.length > 0) {
      const newAttachmentUrls = req.files.attachments.map((f) => `/${f.path.replace(/\\/g, "/")}`);
      notice.attachmentUrls = newAttachmentUrls;
    }

    // re-validate date range if either date changed
    if (notice.visibleUntil <= notice.visibleFrom) {
      return res.status(400).json({
        message: "visibleUntil must be after visibleFrom",
      });
    }

    await notice.save();

    const updated = await Notice.findById(notice._id)
      .populate("createdBy", "name email");

    const result = attachBaseUrl(req, updated, NOTICE_FIELDS.single, NOTICE_FIELDS.array);
    res.json({ message: "Notice updated successfully", notice: result });
  } catch (error) {
    next(error);
  }
}

// Soft delete notice
export async function deleteNotice(req, res, next) {
  try {
    const society = req.user.society;
    const { noticeId } = req.params;

    const notice = await Notice.findOne({ _id: noticeId, society });
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    notice.isActive = false;
    await notice.save();

    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// Toggle pin status
export async function togglePin(req, res, next) {
  try {
    const society = req.user.society;
    const { noticeId } = req.params;

    const notice = await Notice.findOne({ _id: noticeId, society });
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    notice.isPinned = !notice.isPinned;
    await notice.save();

    const result = attachBaseUrl(req, notice, NOTICE_FIELDS.single, NOTICE_FIELDS.array);
    res.json({
      message: `Notice ${notice.isPinned ? "pinned" : "unpinned"} successfully`,
      notice: result,
    });
  } catch (error) {
    next(error);
  }
}
