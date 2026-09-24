const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    minStock: {
      type: Number,
      required: true,
      min: 0
    },

    location: {
      type: String,
      default: "IoT Lab",
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Component", componentSchema);