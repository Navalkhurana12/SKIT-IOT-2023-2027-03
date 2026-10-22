
const mongoose = require("mongoose");
const IssueRequest = require("../models/IssueRequest");
const Component = require("../models/Component");

// ================= CUSTOM ERROR =================

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ================= CREATE ISSUE REQUEST =================

const createIssueRequest = async (req, res) => {
  try {
    const { items, reason } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      throw new AppError(
        "Items and a valid reason are required",
        400
      );
    }

    if (items.length > 50) {
      throw new AppError(
        "Maximum 50 different components allowed",
        400
      );
    }

    if (!req.user || !req.user._id) {
      throw new AppError("Authentication required", 401);
    }

    if (
      !req.user.name ||
      !req.user.rollNo ||
      !req.user.phone
    ) {
      throw new AppError(
        "Complete student profile is required",
        400
      );
    }

    const validatedItems = [];
    const componentIds = new Set();

    for (const item of items) {
      if (!item || typeof item !== "object") {
        throw new AppError("Invalid cart item", 400);
      }

      const { component, quantity } = item;

      if (
        typeof component !== "string" ||
        !mongoose.isValidObjectId(component)
      ) {
        throw new AppError(
          "Valid component ID is required",
          400
        );
      }

      if (
        typeof quantity !== "number" ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
      ) {
        throw new AppError(
          "Quantity must be a positive integer",
          400
        );
      }

      const componentId = component.toLowerCase();

      if (componentIds.has(componentId)) {
        throw new AppError(
          "Same component cannot appear twice in the cart",
          400
        );
      }

      componentIds.add(componentId);

      const componentData =
        await Component.findById(component);

      if (!componentData) {
        throw new AppError("Component not found", 404);
      }

      if (componentData.quantity < quantity) {
        throw new AppError(
          `Only ${componentData.quantity} ${componentData.name} available`,
          400
        );
      }

      validatedItems.push({
        component: componentData._id,
        componentName: componentData.name,
        quantity,
      });
    }

    const issueRequest = await IssueRequest.create({
      user: req.user._id,
      name: req.user.name,
      rollNo: req.user.rollNo,
      phone: req.user.phone,
      items: validatedItems,
      reason: reason.trim(),
    });

    return res.status(201).json({
      message: "Issue request submitted successfully",
      issueRequest,
    });
  } catch (error) {
    console.error("Create Issue Request Error:", error);

    return res.status(error.statusCode || 500).json({
      message:
        error.statusCode
          ? error.message
          : "Server error while creating issue request",
    });
  }
};

// ================= GET ALL ISSUE REQUESTS =================
// This endpoint must be admin-protected in routes.

const getAllIssueRequests = async (req, res) => {
  try {
    const requests = await IssueRequest.find()
      .populate("items.component", "name category quantity")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Issue requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get All Issue Requests Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GET MY ISSUE REQUESTS =================
// Student can only see their own requests.

const getMyIssueRequests = async (req, res) => {
  try {
    const requests = await IssueRequest.find({
      user: req.user._id,
    })
      .populate("items.component", "name category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Your issue requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get My Issue Requests Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= APPROVE ISSUE REQUEST =================
// All stock deductions and request changes happen in one
// MongoDB transaction.

const approveIssueRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid issue request ID", 400);
    }

    let approvedRequest;

    await session.withTransaction(async () => {
      const issueRequest = await IssueRequest.findById(id)
        .session(session);

      if (!issueRequest) {
        throw new AppError(
          "Issue request not found",
          404
        );
      }

      if (issueRequest.status !== "pending") {
        throw new AppError(
          `Request is already ${issueRequest.status}`,
          400
        );
      }

      if (
        !Array.isArray(issueRequest.items) ||
        issueRequest.items.length === 0
      ) {
        throw new AppError(
          "Request has no components",
          400
        );
      }

      // Deduct stock conditionally.
      // If any item has insufficient stock, throw an error.
      // The transaction will roll back every prior deduction.

      for (const item of issueRequest.items) {
        const updatedComponent =
          await Component.findOneAndUpdate(
            {
              _id: item.component,
              quantity: { $gte: item.quantity },
            },
            {
              $inc: { quantity: -item.quantity },
            },
            {
              new: true,
              session,
              runValidators: true,
            }
          );

        if (!updatedComponent) {
          const exists = await Component.exists({
            _id: item.component,
          }).session(session);

          if (!exists) {
            throw new AppError(
              `${item.componentName} not found`,
              404
            );
          }

          throw new AppError(
            `Insufficient stock for ${item.componentName}`,
            400
          );
        }
      }

      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 30);

      issueRequest.status = "approved";
      issueRequest.approvedAt = now;
      issueRequest.approvedBy = String(
        req.user._id
      );
      issueRequest.issuedAt = now;
      issueRequest.dueDate = dueDate;

      await issueRequest.save({ session });

      approvedRequest = issueRequest;
    });

    return res.status(200).json({
      message: "Issue request approved successfully",
      issueRequest: approvedRequest,
    });
  } catch (error) {
    console.error("Approve Issue Request Error:", error);

    return res.status(error.statusCode || 500).json({
      message:
        error.statusCode
          ? error.message
          : "Server error while approving request",
    });
  } finally {
    await session.endSession();
  }
};

// ================= REJECT ISSUE REQUEST =================

const rejectIssueRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid issue request ID", 400);
    }

    if (
      typeof rejectionReason !== "string" ||
      !rejectionReason.trim()
    ) {
      throw new AppError(
        "Rejection reason is required",
        400
      );
    }

    // Conditional update prevents two admins from
    // rejecting/processing the same pending request.

    const issueRequest =
      await IssueRequest.findOneAndUpdate(
        {
          _id: id,
          status: "pending",
        },
        {
          $set: {
            status: "rejected",
            rejectedAt: new Date(),
            rejectionReason: rejectionReason.trim(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!issueRequest) {
      const existing = await IssueRequest.findById(id);

      if (!existing) {
        throw new AppError(
          "Issue request not found",
          404
        );
      }

      throw new AppError(
        `Request is already ${existing.status}`,
        400
      );
    }

    return res.status(200).json({
      message: "Issue request rejected successfully",
      issueRequest,
    });
  } catch (error) {
    console.error("Reject Issue Request Error:", error);

    return res.status(error.statusCode || 500).json({
      message:
        error.statusCode
          ? error.message
          : "Server error while rejecting request",
    });
  }
};

// ================= RETURN ISSUE REQUEST =================
// Stock restoration and status update are atomic.

const returnIssueRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid issue request ID", 400);
    }

    let returnedRequest;

    await session.withTransaction(async () => {
      const issueRequest = await IssueRequest.findById(id)
        .session(session);

      if (!issueRequest) {
        throw new AppError(
          "Issue request not found",
          404
        );
      }

      if (issueRequest.status !== "approved") {
        throw new AppError(
          `Request cannot be returned because it is ${issueRequest.status}`,
          400
        );
      }

      if (
        !Array.isArray(issueRequest.items) ||
        issueRequest.items.length === 0
      ) {
        throw new AppError(
          "Request has no components",
          400
        );
      }

      // Validate every referenced component before restoration.

      for (const item of issueRequest.items) {
        const exists = await Component.exists({
          _id: item.component,
        }).session(session);

        if (!exists) {
          throw new AppError(
            `${item.componentName} not found`,
            404
          );
        }
      }

      // Restore every component's stock.

      for (const item of issueRequest.items) {
        await Component.updateOne(
          { _id: item.component },
          {
            $inc: { quantity: item.quantity },
          },
          { session }
        );
      }

      issueRequest.status = "returned";
      issueRequest.returnedAt = new Date();

      await issueRequest.save({ session });

      returnedRequest = issueRequest;
    });

    return res.status(200).json({
      message: "All components returned successfully",
      issueRequest: returnedRequest,
    });
  } catch (error) {
    console.error("Return Issue Request Error:", error);

    return res.status(error.statusCode || 500).json({
      message:
        error.statusCode
          ? error.message
          : "Server error while returning components",
    });
  } finally {
    await session.endSession();
  }
};

// ================= GET OVERDUE ISSUE REQUESTS =================
// This endpoint must be admin-protected in routes.

const getOverdueIssueRequests = async (req, res) => {
  try {
    const today = new Date();

    const overdueRequests = await IssueRequest.find({
      status: "approved",
      dueDate: { $lt: today },
    })
      .populate("items.component", "name category quantity")
      .sort({ dueDate: 1 });

    return res.status(200).json({
      message: "Overdue issue requests fetched successfully",
      count: overdueRequests.length,
      requests: overdueRequests,
    });
  } catch (error) {
    console.error("Get Overdue Issue Requests Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* ========== STUDENT USAGE REPORT ========== */

const getStudentUsageReport = async (req, res) => {
  try {
    const today = new Date();

    const requests = await IssueRequest.find()
      .select(
        "name rollNo phone items reason status requestedAt approvedAt issuedAt dueDate returnedAt"
      )
      .populate("items.component", "name category")
      .sort({ rollNo: 1, createdAt: -1 })
      .lean();

    const studentsMap = new Map();

    for (const request of requests) {
      const key = request.rollNo;

      if (!studentsMap.has(key)) {
        studentsMap.set(key, {
          name: request.name,
          rollNo: request.rollNo,
          phone: request.phone,
          totalRequests: 0,
          approvedRequests: 0,
          returnedRequests: 0,
          overdueRequests: 0,
          components: [],
        });
      }

      const student = studentsMap.get(key);

      student.totalRequests++;

      const isOverdue =
        request.status === "approved" &&
        request.dueDate &&
        new Date(request.dueDate) < today;

      if (request.status === "approved") {
        student.approvedRequests++;
      }

      if (request.status === "returned") {
        student.returnedRequests++;
      }

      if (isOverdue) {
        student.overdueRequests++;
      }

      for (const item of request.items || []) {
        student.components.push({
          requestId: request._id,
          componentId: item.component?._id || item.component || null,
          componentName:
            item.componentName ||
            item.component?.name ||
            "Deleted component",
          category: item.component?.category || null,
          quantity: item.quantity,
          status: request.status,
          requestedAt: request.requestedAt,
          issuedAt: request.issuedAt || null,
          dueDate: request.dueDate || null,
          returnedAt: request.returnedAt || null,
          isOverdue: Boolean(isOverdue),
        });
      }
    }

    const students = Array.from(studentsMap.values());

    return res.status(200).json({
      message: "Student usage report fetched successfully",
      summary: {
        totalStudents: students.length,
        totalRequests: requests.length,
        overdueRequests: requests.filter(
          (request) =>
            request.status === "approved" &&
            request.dueDate &&
            new Date(request.dueDate) < today
        ).length,
      },
      students,
    });
  } catch (error) {
    console.error("Student Usage Report Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// ================= EXPORT =================

module.exports = {
  createIssueRequest,
  getAllIssueRequests,
  getMyIssueRequests,
  approveIssueRequest,
  rejectIssueRequest,
  returnIssueRequest,
  getOverdueIssueRequests,
  getStudentUsageReport,
};

