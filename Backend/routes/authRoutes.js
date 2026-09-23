const express = require("express");

const {
  signup,
  verifyOTP,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/verify-otp", verifyOTP);

router.post("/login", login);

router.get("/me", protect, getMe);

router.post("/logout", logout);

module.exports = router;