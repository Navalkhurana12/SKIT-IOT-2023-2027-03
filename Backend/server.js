const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config({ override: true });

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const componentRoutes = require("./routes/componentRoutes");
const issueRequestRoutes = require("./routes/issueRequestRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/components", componentRoutes);
app.use("/api/issue-requests", issueRequestRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "IoT Inventory API is running",
  });
});

// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});