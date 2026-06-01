import { body, validationResult } from "express-validator";

export const createStaffValidation = [
  body("staffName").notEmpty().withMessage("Staff name is required").trim(),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone()
    .withMessage("Invalid mobile number")
    .trim(),

  body("role").notEmpty().withMessage("Role is required").trim(),

  body("flatNumber").notEmpty().withMessage("Flat number is required").trim(),
];

export const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("=== VALIDATION FAILED ===");
    console.log("Incoming Body to Validation:", JSON.stringify(req.body, null, 2));
    console.log("Validation Errors:", JSON.stringify(errors.array(), null, 2));

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  next();
};
