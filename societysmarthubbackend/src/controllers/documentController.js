import Document from "../models/Document.js";
import { attachBaseUrl, attachBaseUrlToArray } from "../utils/addBaseUrl.js";

// ==============================
// CREATE DOCUMENT (Admin Only)
// ==============================
export const createDocument = async (req, res) => {
  try {
    const { title, description, category, visibility } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a document file" });
    }

    const newDoc = await Document.create({
      society: req.user.society,
      title,
      description,
      category,
      visibility,
      fileUrl: `/uploads/documents/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: attachBaseUrl(req, newDoc, ["fileUrl"]),
    });
  } catch (error) {
    console.error("Create Document Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==============================
// GET DOCUMENTS (Admin: All, Member: Public)
// ==============================
export const getDocuments = async (req, res) => {
  try {
    const { category, search, visibility } = req.query;

    let query = { society: req.user.society };

    // If member, only show public documents
    if (req.user.role === "user") {
      query.visibility = "Public";
    } else if (visibility) {
      // Admin can filter by visibility
      query.visibility = visibility;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const documents = await Document.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: documents.length,
      data: attachBaseUrlToArray(req, documents, ["fileUrl"]),
    });
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==============================
// UPDATE DOCUMENT (Admin Only)
// ==============================
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, visibility } = req.body;

    const doc = await Document.findOne({ _id: id, society: req.user.society });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    let updateData = { title, description, category, visibility };

    // If a new file is uploaded
    if (req.file) {
      updateData.fileUrl = `/uploads/documents/${req.file.filename}`;
      updateData.fileName = req.file.originalname;
      updateData.fileSize = req.file.size;
    }

    const updatedDoc = await Document.findByIdAndUpdate(id, updateData, { new: true });

    res.json({
      success: true,
      message: "Document updated successfully",
      data: attachBaseUrl(req, updatedDoc, ["fileUrl"]),
    });
  } catch (error) {
    console.error("Update Document Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==============================
// DELETE DOCUMENT (Admin Only)
// ==============================
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Document.findOne({ _id: id, society: req.user.society });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    await Document.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

