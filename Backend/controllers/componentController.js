const Component = require("../models/Component");

// GET all components
const getComponents = async (req, res) => {
  try {
    const components = await Component.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: components.length,
      data: components
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET single component
const getComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found"
      });
    }

    res.status(200).json({
      success: true,
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// CREATE component
const createComponent = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      minStock,
      location,
      description
    } = req.body;

    const component = await Component.create({
      name,
      category,
      quantity,
      minStock,
      location,
      description
    });

    res.status(201).json({
      success: true,
      message: "Component created successfully",
      data: component
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE component
const updateComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Component updated successfully",
      data: component
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE component
const deleteComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Component deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  getComponents,
  getComponent,
  createComponent,
  updateComponent,
  deleteComponent
};