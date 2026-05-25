import { body, validationResult } from "express-validator";

export const createVisitorValidation = [
  body("visitorName").notEmpty().withMessage("Visitor name is required"),

  body("visitorPhone")
    .notEmpty()
    .withMessage("Visitor phone is required")
    .isMobilePhone()
    .withMessage("Invalid mobile number"),

  body("purpose").notEmpty().withMessage("Purpose is required"),

  body("visitDate").notEmpty().withMessage("Visit date is required"),

  body("visitTime").notEmpty().withMessage("Visit time is required"),

  body("flatNumber").notEmpty().withMessage("Flat number is required"),

  body("memberId").notEmpty().withMessage("Member ID is required"),
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
