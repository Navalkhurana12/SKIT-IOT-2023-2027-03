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
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      default: 0
    },

    minStock: {
      type: Number,
      default: 5
    },

    location: {
      type: String,
      default: "IoT Lab"
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      url: {
        type: String,
        default: ""
      },
      publicId: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Component", componentSchema);