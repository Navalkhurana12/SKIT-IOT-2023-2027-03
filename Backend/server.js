
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config({ override: true });

const { MongodbConfig } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const componentRoutes = require("./routes/componentRoutes");
const issueRequestRoutes = require("./routes/issueRequestRoutes");

const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "https://skit-iot-2023-2027-03-fpys.vercel.app",
    credentials: true,
  })
);
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

// Start server after MongoDB connects
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await MongodbConfig();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
