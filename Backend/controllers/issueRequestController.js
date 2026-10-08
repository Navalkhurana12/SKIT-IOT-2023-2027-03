const IssueRequest = require("../models/IssueRequest");
const Component = require("../models/Component");

// ================= CREATE ISSUE REQUEST =================
const createIssueRequest = async (req, res) => {
  try {
    const { items, reason } = req.body;

    if (!Array.isArray(items) || items.length === 0 || !reason) {
      return res.status(400).json({
        message: "Items and reason are required",
      });
    }

    const validatedItems = [];
    const componentIds = new Set();

    for (const item of items) {
      const { component, quantity } = item;

      // Check component and quantity
      if (!component || quantity === undefined) {
        return res.status(400).json({
          message: "Component and quantity are required for every item",
        });
      }

      // Quantity must be positive integer
      if (
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          message: "Quantity must be a positive integer",
        });
      }

      // Prevent duplicate component in cart
      if (componentIds.has(component.toString())) {
        return res.status(400).json({
          message: "Same component cannot be added multiple times",
        });
      }

      componentIds.add(component.toString());

      // Find component
      const componentData = await Component.findById(component);

      if (!componentData) {
        return res.status(404).json({
          message: "Component not found",
        });
      }

      // Check stock
      if (componentData.quantity < quantity) {
        return res.status(400).json({
          message: `Only ${componentData.quantity} ${componentData.name} are available`,
        });
      }

      // Save snapshot
      validatedItems.push({
        component: componentData._id,
        componentName: componentData.name,
        quantity: quantity,
      });
    }

    // Create issue request
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

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ================= GET ALL ISSUE REQUESTS =================
const getAllIssueRequests = async (req, res) => {
  try {
    const requests = await IssueRequest.find()
      .populate("items.component", "name category quantity")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Issue requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.error("Get Issue Requests Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ================= APPROVE ISSUE REQUEST =================
const approveIssueRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const issueRequest = await IssueRequest.findById(id);

    if (!issueRequest) {
      return res.status(404).json({
        message: "Issue request not found",
      });
    }

    // Only pending request can be approved
    if (issueRequest.status !== "pending") {
      return res.status(400).json({
        message: `Request is already ${issueRequest.status}`,
      });
    }

    // ================= CHECK ALL STOCK FIRST =================

    const components = [];

    for (const item of issueRequest.items) {
      const component = await Component.findById(item.component);

      if (!component) {
        return res.status(404).json({
          message: `${item.componentName} not found`,
        });
      }

      if (component.quantity < item.quantity) {
        return res.status(400).json({
          message: `Only ${component.quantity} ${component.name} are available`,
        });
      }

      components.push({
        component,
        quantity: item.quantity,
      });
    }

    // ================= DEDUCT STOCK =================

    for (const item of components) {
      item.component.quantity -= item.quantity;

      await item.component.save();
    }

    // ================= UPDATE REQUEST =================

    const now = new Date();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    issueRequest.status = "approved";
    issueRequest.approvedAt = now;
    issueRequest.approvedBy = req.user._id;
    issueRequest.issuedAt = now;
    issueRequest.dueDate = dueDate;

    await issueRequest.save();

    return res.status(200).json({
      message: "Issue request approved successfully",
      issueRequest,
    });
  } catch (error) {
    console.error("Approve Issue Request Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ================= REJECT ISSUE REQUEST =================
const rejectIssueRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const issueRequest = await IssueRequest.findById(id);

    if (!issueRequest) {
      return res.status(404).json({
        message: "Issue request not found",
      });
    }

    // Only pending request can be rejected
    if (issueRequest.status !== "pending") {
      return res.status(400).json({
        message: `Request is already ${issueRequest.status}`,
      });
    }

    // Check rejection reason
    if (
      typeof rejectionReason !== "string" ||
      !rejectionReason.trim()
    ) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    issueRequest.status = "rejected";
    issueRequest.rejectedAt = new Date();
    issueRequest.rejectionReason = rejectionReason.trim();

    await issueRequest.save();

    return res.status(200).json({
      message: "Issue request rejected successfully",
      issueRequest,
    });
  } catch (error) {
    console.error("Reject Issue Request Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ================= RETURN ISSUE REQUEST =================
const returnIssueRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const issueRequest = await IssueRequest.findById(id);

    if (!issueRequest) {
      return res.status(404).json({
        message: "Issue request not found",
      });
    }

    // Only approved request can be returned
    if (issueRequest.status !== "approved") {
      return res.status(400).json({
        message: `Request cannot be returned because it is ${issueRequest.status}`,
      });
    }

    const components = [];

    // Find every component first
    for (const item of issueRequest.items) {
      const component = await Component.findById(item.component);

      if (!component) {
        return res.status(404).json({
          message: `${item.componentName} not found`,
        });
      }

      components.push({
        component,
        quantity: item.quantity,
      });
    }

    // Add stock back
    for (const item of components) {
      item.component.quantity += item.quantity;

      await item.component.save();
    }

    // Update request
    issueRequest.status = "returned";
    issueRequest.returnedAt = new Date();

    await issueRequest.save();

    return res.status(200).json({
      message: "All components returned successfully",
      issueRequest,
    });
  } catch (error) {
    console.error("Return Issue Request Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
const getOverdueIssueRequests = async (req, res) => {
  try {
    const today = new Date();

    const overdueRequests = await IssueRequest.find({
      status: "approved",
      dueDate: {
        $lt: today,
      },
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
      error: error.message,
    });
  }
};


// ================= EXPORT =================

module.exports = {
  createIssueRequest,
  getAllIssueRequests,
  approveIssueRequest,
  rejectIssueRequest,
  returnIssueRequest,
  getOverdueIssueRequests,
};