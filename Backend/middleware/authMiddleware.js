const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Cookie token
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ADMIN
    if (decoded.role === "admin") {
      req.user = {
        _id: "admin",
        userId: "admin",
        name: "Admin",
        email: process.env.ADMIN_ID,
        role: "admin",
        isVerified: true,
      };

      return next();
    }

    // NORMAL USER
    const user = await User.findById(decoded.userId)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("Auth error:", error);

    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

module.exports = { protect };