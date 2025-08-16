const { body, validationResult } = require('express-validator');

// Middlewares for validating user registration data

//  Exporting array of validation middlewares for validating user registeration data using express-validator
exports.userRegistrationRules = [


  // Validate username
body("username")
  .isString().withMessage("Username must be a string").bail()
  .notEmpty().withMessage("Username is required").bail()
  .isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 characters").bail()
  .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

  // Validate email
  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  // Validate password
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters").bail()
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter").bail()
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter").bail()
    .matches(/\d/).withMessage("Password must contain at least one digit").bail()
    .trim(),

  // Validate address (optional)
  body("address")
    .optional()
    .isString().withMessage("Address must be a string").bail()
    .escape()
    .isLength({ min: 5, max: 100 }).withMessage("Address must be between 5 and 100 characters long")
    .trim(),

  // Validate confirm_password matches password
  body("confirm_password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  // Validate contact_number (optional)
  body("contact_number")
    .optional()
    .isMobilePhone("any").withMessage("Invalid phone number"),

  // Reject if 'role' is present in request
  body("role")
    .not().exists().withMessage("Role field is not allowed in registration"),

  // Handle validation errors
  //The above validation middlewares (body(...)) don’t send errors immediately 
  // — they just store them in req 

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        user_data: null,
        status: "Error",
        message: "Validation failed",
        errors: errors.array()
      });
    }
    next();
  }
];

//  Exporting array of validation middlewares for validating user login data using express-validator
exports. loginValidationRules = [

    // Validate username
  body("username")
    .notEmpty()
    .withMessage("Username is required"),

  // Validate password
  body("password")
    .notEmpty()
    .withMessage("Password is required")
,

  // Handle validation errors for login
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      user_data: null,
      message: errors.array()[0].msg,
      status: "Error"
    });
  }
  next();
}
];