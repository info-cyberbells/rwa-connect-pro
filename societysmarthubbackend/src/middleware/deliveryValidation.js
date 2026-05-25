// validations/deliveryValidation.js

import { body, validationResult } from "express-validator";

export const createDeliveryValidation = [
  body("deliveryBoyName")
    .notEmpty()
    .withMessage("Delivery boy name is required"),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone()
    .withMessage("Invalid mobile number"),

  body("companyName").notEmpty().withMessage("Company name is required"),

  body("flatNumber").notEmpty().withMessage("Flat number is required"),
];

export const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  next();
};
