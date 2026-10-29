const streamifier = require("streamifier");

const cloudinary = require("../config/cloudinary");
const Component = require("../models/Component");

// ======================================================
// ADD COMPONENT
// ======================================================

const addComponent = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      minStock,
      location,
      description,
    } = req.body;

    if (
      !name ||
      !category ||
      quantity === undefined ||
      minStock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category, quantity and minStock are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Component image is required",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "skit-iot-inventory/components",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(uploadStream);
    });

    const component = await Component.create({
      name: name.trim(),
      category: category.trim(),
      quantity: Number(quantity),
      minStock: Number(minStock),
      location: location?.trim() || "IoT Lab",
      description: description?.trim() || "",

      image: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Component added successfully",
      component,
    });
  } catch (error) {
    console.error("Add Component Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding component",
    });
  }
};

// ======================================================
// GET ALL COMPONENTS
// ======================================================

const getAllComponents = async (req, res) => {
  try {
    const components = await Component.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: components.length,
      components,
    });
  } catch (error) {
    console.error("Get Components Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching components",
    });
  }
};

// ======================================================
// GET SINGLE COMPONENT
// ======================================================

const getComponentById = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found",
      });
    }

    return res.status(200).json({
      success: true,
      component,
    });
  } catch (error) {
    console.error("Get Component Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching component",
    });
  }
};

// ======================================================
// UPDATE COMPONENT
// ======================================================

const updateComponent = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found",
      });
    }

    const {
      name,
      category,
      quantity,
      minStock,
      location,
      description,
    } = req.body;

    // ----------------------------------------------
    // Update normal fields
    // ----------------------------------------------

    if (name !== undefined) {
      component.name = name.trim();
    }

    if (category !== undefined) {
      component.category = category.trim();
    }

    if (quantity !== undefined) {
      component.quantity = Number(quantity);
    }

    if (minStock !== undefined) {
      component.minStock = Number(minStock);
    }

    if (location !== undefined) {
      component.location = location.trim();
    }

    if (description !== undefined) {
      component.description = description.trim();
    }

    // ----------------------------------------------
    // If new image is provided
    // ----------------------------------------------

    if (req.file) {
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "skit-iot-inventory/components",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(uploadStream);
        }
      );

      // Delete old image from Cloudinary
      if (component.image?.publicId) {
        await cloudinary.uploader.destroy(
          component.image.publicId
        );
      }

      // Save new image
      component.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    await component.save();

    return res.status(200).json({
      success: true,
      message: "Component updated successfully",
      component,
    });
  } catch (error) {
    console.error("Update Component Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating component",
    });
  }
};

// ======================================================
// DELETE COMPONENT
// ======================================================

const deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found",
      });
    }

    // Delete image from Cloudinary
    if (component.image?.publicId) {
      await cloudinary.uploader.destroy(
        component.image.publicId
      );
    }

    // Delete component from MongoDB
    await Component.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Component deleted successfully",
    });
  } catch (error) {
    console.error("Delete Component Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting component",
    });
  }
};

// ======================================================
// INCREASE STOCK
// ======================================================

const increaseStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (
      quantity === undefined ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found",
      });
    }

    component.quantity += Number(quantity);

    await component.save();

    return res.status(200).json({
      success: true,
      message: "Stock increased successfully",
      component,
    });
  } catch (error) {
    console.error("Increase Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while increasing stock",
    });
  }
};

// ======================================================
// DECREASE STOCK
// ======================================================

const decreaseStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (
      quantity === undefined ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found",
      });
    }

    const decreaseAmount = Number(quantity);

    if (decreaseAmount > component.quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    component.quantity -= decreaseAmount;

    await component.save();

    return res.status(200).json({
      success: true,
      message: "Stock decreased successfully",
      component,
    });
  } catch (error) {
    console.error("Decrease Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while decreasing stock",
    });
  }
};

// ======================================================
// GET LOW STOCK COMPONENTS
// ======================================================

const getLowStockComponents = async (req, res) => {
  try {
    const components = await Component.find({
      $expr: {
        $lte: ["$quantity", "$minStock"],
      },
    }).sort({
      quantity: 1,
    });

    return res.status(200).json({
      success: true,
      count: components.length,
      components,
    });
  } catch (error) {
    console.error("Low Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching low stock components",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  addComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
  increaseStock,
  decreaseStock,
  getLowStockComponents,
};