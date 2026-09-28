const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Admin is environment-based, not stored in MongoDB
      if (decoded.role === "admin") {
        req.user = {
          id: decoded.userId,
          role: "admin",
          email: process.env.ADMIN_EMAIL || "admin@skit.ac.in",
          name: "Admin"
        };

        return next();
      }

      // Normal users are stored in MongoDB
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized, user not found"
        });
      }

      next();

    } catch (error) {
      console.error("JWT ERROR:", error);

      return res.status(401).json({
        message: "Not authorized, token failed"
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token"
    });
  }
};

module.exports = { protect };