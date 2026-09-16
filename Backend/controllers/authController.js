const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const emailRegex = /^b[a-zA-Z0-9._%+-]*@skit\.ac\.in$/;

    if (!emailRegex.test(email)) {
        console.log("Invalid email");
        return res.status(400).json({ message: "Invalid email" });
    } else {
        console.log("Valid email");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};