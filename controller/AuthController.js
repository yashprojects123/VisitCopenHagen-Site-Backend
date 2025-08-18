let userModel = require("../model/Auth.model.js");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || "9FXNRIKV58QTN5Qe";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "10FXNRIKV58QTN5Qe";

// Register a new user
let registerUser = async (req, res) => {
  let userData = req.body;
  console.log("Registering user:", userData.username);
  try {

    // Hash passwords
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const hashedConfirmPassword = await bcrypt.hash(userData.confirm_password, 10);

    // Create new user object
    let newUser = new userModel({
      username: userData.username,
      password: hashedPassword,
      confirm_password: hashedConfirmPassword,
      email: userData.email,
      profile_image: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null,
      gender: userData.gender,
      contact_number: userData.contact_number,
      address: userData.address
    });

    await newUser.save();
    console.log("User registered successfully:", newUser.username);
    res.status(201).json({user_data: userData, message: "User registered successfully", status: "Success"});
 } catch (error) {
  console.error("User registration failed:");
 if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
    // Send a specific 409 Conflict status for a unique constraint error
    return res.status(409).json({ user_data:null, message: "Email already exists.", error: error, status: "Error" });
  }
  res.status(500).json({
    user_data: null,
    message: error.message,
    error: error, // You can send full error in dev mode
    status: "Error"
  });
}
};




// User login and token generation
let loginUser = async (req, res) => {
  const {username, password, remember_me} = req.body;

  try {
    // Find user by username
    const user = await userModel.findOne({username});
    console.log(user);
    if (!user) {
      return res.status(401).json({user_data: null, message: "Invalid username or password.", status: "Error"});
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
     console.log("Invalid username or password.");
      return res.status(401).json({user_data: null, message: "Invalid username or password.", status: "Error"});
    }
    // Generate access token (1 hour)
    const accessToken = jwt.sign(
 {
        id: user._id,
        username: user.username,
      },
    JWT_SECRET,
     {expiresIn: "1h"});

    // Generate refresh token (7 or 30 days)
    const refreshToken = jwt.sign( {
        id: user._id,
        username: user.username,
      }, REFRESH_TOKEN_SECRET, {
      expiresIn: remember_me
        ? "30d"
        : "7d"
    });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: remember_me
        ? 30 * 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
    });

    // Send user data and tokens
    res.status(200).json({
      user_data: user,
      accessToken,
      message: "Login successful",
      status: "Success"
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({user_data: null, message: error.message, status: "Error"});
  }
};

// Get all users
let getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find({});
    res.status(200).json({user_data: users, status: "Success"});
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({user_data: null, status: "Error", message: error.message});
  }
};

// Get user by username
let getUserByUsername = async (req, res) => {
  let username = req.query.username;
  console.log("Fetching user by username:", username);
  try {
    let user = await userModel.findOne({username: username});
    if (user) {
      res.status(200).json({user_data: user, status: "Success"});
    } else {
      res.status(404).json({user_data: null, status: "Not Found"});
    }
  } catch (error) {
    console.error("Error fetching user by username:", error);
    res.status(200).json({user_data: user, status: "Error"});
  }
};

// Get user by ID
let getUserById = async (req, res) => {
  let userId = req.params.id;
  console.log("Fetching user by ID:", userId);
  try {
    let user = await userModel.findOne({_id: userId});
    if (user) {
      res.status(200).json({user_data: user, status: "Success", message: "User fetched successfully"});
    } else {
      res.status(404).json({user_data: null, status: "Not Found", message: "User not found"});
    }
  } catch (error) {
    console.error("Error fetching user by Id:", error.message);
    res.status(200).json({user_data: user, status: "Error"});
  }
};

// Check if user is authenticated and refresh token if needed
// const checkAuth = async (req, res) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({isAuthenticated: false, message: "No token provided", status: "Error"});
//     }
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, JWT_SECRET || "Qw8!vZ2@rT7#pL6$eF9^bN4&xS1*oM3%jH5", async (err, decoded) => {
//       if (err && err.name === "TokenExpiredError") {
//         // If access token expired, try to verify refresh token
//         const refreshToken = req.cookies && req.cookies.refreshToken;
//         if (!refreshToken) {
//           return res.status(401).json({isAuthenticated: false, message: "Session expired. Please login again.", status: "Error"});
//         }
//         jwt.verify(refreshToken, REFRESH_TOKEN_SECRET || "R7!kLp2@xV9#zQ4$wT8^nB3&sF6*mJ1%yH0", async (refreshErr, refreshDecoded) => {
//           if (refreshErr) {
//             return res.status(401).json({isAuthenticated: false, message: "Refresh token expired. Please login again.", status: "Error"});
//           }
//           // Generate new access token
//           const newAccessToken = jwt.sign({
//             id: refreshDecoded.id,
//             username: refreshDecoded.username
//           }, JWT_SECRET || "Qw8!vZ2@rT7#pL6$eF9^bN4&xS1*oM3%jH5", {expiresIn: "1h"});

//           // Get user info from DB
//           const user = await userModel.findById(refreshDecoded.id).select("-password -confirm_password");
//           if (!user) {
//             return res.status(401).json({isAuthenticated: false, message: "User not found", status: "Error"});
//           }
//           // Return refreshed token and user info
//           return res.status(200).json({isAuthenticated: true, user, accessToken: newAccessToken, status: "Success", message: "Token refreshed"});
//         });
//         return;
//       } else if (err) {
//         return res.status(401).json({isAuthenticated: false, message: "Invalid or expired token", status: "Error"});
//       }
//       // Get user info from DB
//       const user = await userModel.findById(decoded.id).select("-password -confirm_password");
//       if (!user) {
//         return res.status(401).json({isAuthenticated: false, message: "User not found", status: "Error"});
//       }
//       // Return user info if authenticated
//       return res.status(200).json({isAuthenticated: true, user, status: "Success"});
//     });
//   } catch (error) {
//     return res.status(500).json({isAuthenticated: false, message: error.message, status: "Error"});
//   }
// };

// A separate, clean checkAuth endpoint
const checkAuth = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ isAuthenticated: false, message: "No token provided." });
    }
    const token = authHeader.split(" ")[1];
    
    // Asynchronous version to handle a potentially expired token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        // This is the correct place to handle all errors, including expiration
        return res.status(401).json({ isAuthenticated: false, message: "Invalid or expired token." });
      }
      
      const user = await userModel.findById(decoded.id).select("-password -confirm_password");
      if (!user) {
        return res.status(401).json({ isAuthenticated: false, message: "User not found." });
      }
      
      return res.status(200).json({ isAuthenticated: true, user });
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
};



const refreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ isAuthenticated: false, message: "Refresh token not provided." });
  }
  
  try {
    // Verify the refresh token using its unique secret key
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Generate a new access token using the JWT secret key
    const newAccessToken = jwt.sign({ id: decoded.id, username: decoded.username, role: decoded.role }, JWT_SECRET, { expiresIn: "1h" });
    
    // Send back the new access token
    return res.status(200).json({ isAuthenticated: true, accessToken: newAccessToken });

  } catch (err) {
    // If verification fails, the refresh token is invalid or expired
    console.error("Refresh token verification failed:", err.message);
    res.clearCookie('refreshToken');
    return res.status(401).json({ isAuthenticated: false, message: "Invalid or expired refresh token. Please log in again." });
  }
};

// Exporting all functions
module.exports = {
  registerUser,
  getUserByUsername,
  getAllUsers,
  getUserById,
  loginUser,
  checkAuth,
  refreshToken
};