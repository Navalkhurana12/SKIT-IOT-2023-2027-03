const express = require("express");

const router = express.Router();

const {
  addComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
  increaseStock,
  decreaseStock,
  getLowStockComponents,
} = require("../controllers/componentController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ======================================================
// ADD COMPONENT
// ======================================================

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  addComponent
);

// ======================================================
// GET ALL COMPONENTS
// ======================================================

router.get(
  "/",
  protect,
  getAllComponents
);

// ======================================================
// LOW STOCK COMPONENTS
// ======================================================

router.get(
  "/low-stock",
  protect,
  getLowStockComponents
);

// ======================================================
// GET SINGLE COMPONENT
// ======================================================

router.get(
  "/:id",
  protect,
  getComponentById
);

// ======================================================
// UPDATE COMPONENT
// ======================================================

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateComponent
);

// ======================================================
// DELETE COMPONENT
// ======================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteComponent
);

// ======================================================
// INCREASE STOCK
// ======================================================

router.patch(
  "/:id/increase",
  protect,
  adminOnly,
  increaseStock
);

// ======================================================
// DECREASE STOCK
// ======================================================

router.patch(
  "/:id/decrease",
  protect,
  adminOnly,
  decreaseStock
);

module.exports = router;