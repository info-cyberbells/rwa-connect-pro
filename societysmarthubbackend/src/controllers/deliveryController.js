// controllers/deliveryController.js

import Delivery from "../models/Delivery.js";

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
    if (!deliveries.length) {
      return res.status(404).json({
        success: false,
        message: "No delivery logs found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Delivery logs fetched successfully",
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
