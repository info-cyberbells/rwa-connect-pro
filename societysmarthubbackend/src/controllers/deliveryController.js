// controllers/deliveryController.js

import Delivery from "../models/Delivery.js";
import User from "../models/user.js"; // [NEW] Import User model
import { createNotification } from "./notificationController.js"; // [NEW] Import notification utility

export const createDelivery = async (req, res) => {
  try {
    const {
      deliveryBoyName,
      mobileNumber,
      companyName,
      flatNumber,
      vehicleNumber,
      guardId,
    } = req.body;
    const newDelivery = await Delivery.create({
      society: req.user.society,
      deliveryBoyName,
      mobileNumber,
      companyName,
      flatNumber,
      vehicleNumber,
      guardId,
    });

    // [NEW] Find residents of the flat and notify them
    const residents = await User.find({
      society: req.user.society,
      "unit.flatNumber": flatNumber,
      role: "user"
    });

    for (const resident of residents) {
      createNotification({
        recipient: resident._id,
        society: req.user.society,
        title: "Delivery at Gate",
        message: `${deliveryBoyName} from ${companyName} is at the gate with a delivery for flat ${flatNumber}.`,
        category: "visitor",
        type: "info",
        link: "/member/deliveries",
      }).catch(err => console.error("Notification Error:", err));
    }

    // [NEW] Trigger notification for GUARDS of the same society
    await createNotification({
      society: req.user.society,
      title: "New Delivery Registered",
      message: `${deliveryBoyName} (${companyName}) has entered for flat ${flatNumber}.`,
      category: "visitor", // [FIX]: Use lowercase 'visitor' for backend filter compatibility
      targetAudience: "guards",
      type: "info",
    }).catch(err => console.error("Guard Notification Error:", err));

    // [NEW] Log Activity
    logActivity({
      userId: req.user.id,
      societyId: req.user.society,
      action: "delivery_registered",
      description: `Delivery from ${companyName} (${deliveryBoyName}) registered for flat ${flatNumber}.`,
      meta: { deliveryId: newDelivery._id, flatNumber }
    });

    return res.status(201).json({
      success: true,
      message: "Delivery entry created successfully",
      data: newDelivery,
    });
  } catch (error) {
    console.error("Create Delivery Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating delivery entry",
      error: error.message,
    });
  }
};

export const deliveryExit = async (req, res) => {
  try {
    const { deliveryId } = req.body;

    if (!deliveryId) {
      return res.status(400).json({
        success: false,
        message: "Delivery ID is required",
      });
    }
    const delivery = await Delivery.findOne({
      _id: deliveryId,
      society: req.user.society,
    });
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery entry not found",
      });
    }
    delivery.exitTime = new Date();
    await delivery.save();
    return res.status(200).json({
      success: true,
      message: "Delivery exit marked successfully",
      data: delivery,
    });
  } catch (error) {
    console.error("Delivery Exit Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while marking delivery exit",
      error: error.message,
    });
  }
};

export const deliveryLogs = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      society: req.user.society,
    }).sort({
      createdAt: -1,
    });
    
    return res.status(200).json({
      success: true,
      message: deliveries.length ? "Delivery logs fetched successfully" : "No delivery logs found",
      totalDeliveries: deliveries.length,
      data: deliveries,
    });
  } catch (error) {
    console.error("Delivery Logs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching delivery logs",
      error: error.message,
    });
  }
};
