const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOTPEmail = require("../utils/sendEmail");

// ======================================================
// GENERATE JWT
// ======================================================

const generateToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ======================================================
// SEND TOKEN IN COOKIE
// ======================================================

const sendToken = (res, userId, role) => {
  const token = generateToken(userId, role);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

// ======================================================
// SIGNUP
// ======================================================

const signup = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      email,
      password,
      avatar,
    } = req.body;

    // Check required fields
    if (!name || !rollNo || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, roll number, email and password",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Only SKIT email allowed
    if (!normalizedEmail.endsWith("@skit.ac.in")) {
      return res.status(400).json({
        success: false,
        message: "Only college email is allowed",
      });
    }

    // Normalize roll number
    const normalizedRollNo = rollNo.toUpperCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { rollNo: normalizedRollNo },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "User with this email or roll number already exists",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires in 10 minutes
    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Create user
    const user = await User.create({
      name: name.trim(),
      rollNo: normalizedRollNo,
      email: normalizedEmail,
      password,
      avatar: avatar || "",

      // User can never choose admin during signup
      role: "user",

      isVerified: false,

      otp,
      otpExpires,
    });

    // Send OTP to SKIT email
    await sendOTPEmail(normalizedEmail, otp);

    return res.status(201).json({
      success: true,
      message:
        "Account created. OTP sent to your college email.",
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during signup",
    });
  }
};

// ======================================================
// VERIFY OTP
// ======================================================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // OTP and otpExpires have select:false
    // so explicitly select them
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Check OTP expiry
    if (
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check OTP
    if (user.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP correct
    user.isVerified = true;

    // Remove OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
    });
  }
};

// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    // ==================================================
    // ADMIN LOGIN
    // ==================================================

    if (role === "admin") {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      if (
        email !== process.env.ADMIN_ID ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }

      sendToken(res, "admin", "admin");

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        user: {
          id: "admin",
          email: process.env.ADMIN_ID,
          name: "Admin",
          role: "admin",
          isVerified: true,
        },
      });
    }

    // ==================================================
    // NORMAL USER LOGIN
    // ==================================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Password is select:false in User.js
    // So explicitly select it
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Make sure this is a normal user
    if (user.role !== "user") {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    // Check password
    const isPasswordCorrect =
      await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your college email first",
      });
    }

    // Generate JWT
    sendToken(
      res,
      user._id.toString(),
      user.role
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================

const getMe = async (req, res) => {
  try {
    // ==================================================
    // ADMIN
    // ==================================================

    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        user: {
          id: "admin",
          email: process.env.ADMIN_ID,
          name: "Admin",
          role: "admin",
          isVerified: true,
        },
      });
    }

    // ==================================================
    // NORMAL USER
    // ==================================================

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// LOGOUT
// ======================================================

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  signup,
  verifyOTP,
  login,
  getMe,
  logout,
};