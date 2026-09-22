const express = require("express");
const cors = require("cors");
require("dotenv").config({ override: true });

const componentRoutes = require("./routes/componentRoutes");
const authRoutes = require("./routes/authRoutes");
const { MongodbConfig } = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "IoT Inventory API is running"
  });
});

app.use("/api/components", componentRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`The server is running on PORT ${PORT}`);
  MongodbConfig();
});