let userRoutes = require("express").Router();
// Import image upload middleware
const {upload} = require("../middleware/ImageUploadMiddleware.js");
const UserAuthDataValidation = require("../middleware/UserAuthDataValidation.js");
let {
  registerUser,
  getUserByUsername,
  getAllUsers,
  getUserById,
  loginUser,
  checkAuth
} = require("../controller/AuthController.js");

// API route for registering a new user with profile image upload
userRoutes.post("/register",upload.single("profile_image"), UserAuthDataValidation.userRegistrationRules, registerUser);

// API route for user login
userRoutes.post("/login",UserAuthDataValidation.loginValidationRules, loginUser);

// API route for checking if user is authenticated
userRoutes.get("/check-auth", checkAuth);

// API route for checking if a user exists by username
userRoutes.get("/user-check", getUserByUsername);

// API route for getting all users
userRoutes.get("/users", getAllUsers);

// API route for getting a user by ID
userRoutes.get("/user/:id", getUserById);

module.exports = {
  userRoutes
};