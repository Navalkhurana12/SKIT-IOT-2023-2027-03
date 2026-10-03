const IssueRequest = require("../models/IssueRequest");
const Component = require("../models/Component");

const createIssueRequest = async (req, res) => {
  try {
    const { component, quantity, reason } = req.body;

    // Check required fields
    if (!component || !quantity || !reason) {
      return res.status(400).json({
        message: "Component, quantity and reason are required",
      });
    }

    // Find component
    const componentData = await Component.findById(component);

    if (!componentData) {
      return res.status(404).json({
        message: "Component not found",
      });
    }

    // Check quantity
    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // Check available stock
    if (componentData.quantity < quantity) {
      return res.status(400).json({
        message: `Only ${componentData.quantity} components are available`,
      });
    }

    // Create issue request
    const issueRequest = await IssueRequest.create({
      user: req.user._id,
      name: req.user.name,
      rollNo: req.user.rollNo,
      phone: req.user.phone,

      component: componentData._id,
      componentName: componentData.name,

      quantity,
      reason,
    });

    res.status(201).json({
      message: "Issue request submitted successfully",
      issueRequest,
    });

  } catch (error) {
    console.error("Create Issue Request Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllIssueRequests=async(req,res)=>{
  try{
    const requests=await IssueRequest.find()
    .populate("user","name rollNo email phone")
    .populate("component","name categroy quantity");
    
    res.status(200).json({
      message:"Issue requests fetched succesfully",
      requests,
    });

  }
  catch(error){
    console.error("Get Issue Requests Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
module.exports = {
  createIssueRequest,
  getAllIssueRequests,
};