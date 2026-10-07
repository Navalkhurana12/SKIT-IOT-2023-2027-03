const mongoose = require("mongoose");

const IssueRequestSchema = new mongoose.Schema(
  {
    // User who requested the component
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User details snapshot
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Component being requested
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Component",
      required: true,
    },

    componentName: {
      type: String,
      required: true,
      trim: true,
    },

    // Number of components requested
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Why user needs the component
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Request status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned"],
      default: "pending",
    },

    // Request / approval information
    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
    },

    approvedBy: {
      type: String,
    },

    rejectedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    // Issue information
    issuedAt: {
      type: Date,
    },

    dueDate: {
      type: Date,
    },

    // Return information
    returnedAt: {
      type: Date,
    },

    // Review after returning component
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },

      comment: {
        type: String,
        trim: true,
      },

      reviewedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("IssueRequest", IssueRequestSchema);