
const express = require("express");
const router = express.Router();

const {
  createIssueRequest,
  getAllIssueRequests,
  getMyIssueRequests,
  approveIssueRequest,
  rejectIssueRequest,
  returnIssueRequest,
  getOverdueIssueRequests,
} = require("../controllers/issueRequestController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Student routes
router.post("/", protect, createIssueRequest);
router.get("/my", protect, getMyIssueRequests);

// Admin routes
router.get("/", protect, adminOnly, getAllIssueRequests);

router.get(
  "/overdue",
  protect,
  adminOnly,
  getOverdueIssueRequests
);

router.patch(
  "/:id/approve",
  protect,
  adminOnly,
  approveIssueRequest
);

router.patch(
  "/:id/reject",
  protect,
  adminOnly,
  rejectIssueRequest
);

router.put(
  "/:id/return",
  protect,
  adminOnly,
  returnIssueRequest
);

module.exports = router;
