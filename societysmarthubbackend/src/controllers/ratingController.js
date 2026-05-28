import Rating from "../models/Rating.js";
import Staff from "../models/Staff.js";
import mongoose from "mongoose";

// ==============================
// ADD OR UPDATE RATING
// ==============================
export const addRating = async (req, res) => {
  try {
    const { staffId, rating, review } = req.body;

    if (!staffId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Staff ID and rating are required",
      });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member ID not found",
      });
    }

    // Check if staff belongs to the same society
    if (staff.society.toString() !== req.user.society?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only rate staff members of your own society",
        debug: {
          staffSociety: staff.society,
          userSociety: req.user.society
        }
      });
    }

    // Create or Update Rating
    const updatedRating = await Rating.findOneAndUpdate(
      { staffId, residentId: req.user.id },
      { 
        rating, 
        review, 
        society: req.user.society 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Re-calculate Average Rating for the Staff
    const stats = await Rating.aggregate([
      { $match: { staffId: new mongoose.Types.ObjectId(staffId) } },
      {
        $group: {
          _id: "$staffId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      staff.averageRating = Math.round(stats[0].avgRating * 10) / 10; // Round to 1 decimal
      staff.totalReviews = stats[0].count;
      await staff.save();
    }

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: updatedRating,
      staffStats: {
        averageRating: staff.averageRating,
        totalReviews: staff.totalReviews
      }
    });
  } catch (error) {
    console.error("Add Rating Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting rating",
      error: error.message,
    });
  }
};

// ==============================
// GET STAFF REVIEWS
// ==============================
export const getStaffReviews = async (req, res) => {
  try {
    const { staffId } = req.params;

    const reviews = await Rating.find({ staffId })
      .populate("residentId", "name photo")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching reviews",
    });
  }
};
