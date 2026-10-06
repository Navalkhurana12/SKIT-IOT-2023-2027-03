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
const getAllIssueRequests = async (req, res) => {
  try {
    const requests = await IssueRequest.find()
      .populate("component", "name category quantity")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Issue requests fetched successfully",
      requests,
    });

  } catch (error) {
    console.error("Get Issue Requests Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const approveIssueRequest=async(req,res)=>{
  try{
    const{id}=req.params;
    const issueRequest=await IssueRequest.findById(id);


     if (!issueRequest) {
      return res.status(404).json({
        message: "Issue request not found",
      });
    }
    if(issueRequest.status!=="pending"){
      return res.status(400).json({
        message:`request is already ${issueRequest.status}`,
      });
    }

    const component=await Component.findById(issueRequest.component);

    if(!component){
      return res.status(404).json({
        message:"component not found",
      })
    }
    if (component.quantity < issueRequest.quantity) {
      return res.status(400).json({
        message: `Only ${component.quantity} components are available`,
      });
    }
     
    component.quantity -= issueRequest.quantity;
    await component.save();

    const now=new Date();
    
    const dueDate=new Date();
    dueDate.setDate(dueDate.getDate()+30);

    issueRequest.status="approved";
    issueRequest.approvedAt=now;
    issueRequest.approvedBy = req.user._id;
    issueRequest.issuedAt = now;
    issueRequest.dueDate = dueDate;

    await issueRequest.save();
     res.status(200).json({
      message: "Issue request approved successfully",
      issueRequest,
    });
  }
  catch(error){
    console.error("Approve Issue Request Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

const rejectIssueRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    // Find request
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

    // Rejection reason required
    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    // Update request
    issueRequest.status = "rejected";
    issueRequest.rejectedAt = new Date();
    issueRequest.rejectionReason = rejectionReason.trim();

    await issueRequest.save();

    res.status(200).json({
      message: "Issue request rejected successfully",
      issueRequest,
    });

  } catch (error) {
    console.error("Reject Issue Request Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const returnIssueRequest= async(req,res)=>{
  try{
    const {id}=req.params;

    const issueRequest=await IssueRequest.findById(id);
    if(!issueRequest){
      return res.status(404).json({
        message:"Issue request not found",
      });
    }
    if(issueRequest.status!=="approved"){
      return res.status(400).json({
        message:`Request cannot be returned because it is ${issueRequest.status}`,
      });
    }
    const component = await Component.findById(issueRequest.component);

    if(!component){
      return res.status(404).json({
        message:"component not found"
      })
    }
    component.quantity+=issueRequest.quantity;

     await component.save();

     issueRequest.status="returned";
     issueRequest.returnedAt=new Date();

     await issueRequest.save();
     return res.status(200).json({
      message:"Component returned successfully",
      issueRequest,
     });

  }
  catch(error){
    console.error("return Issue request error",error);
    res.status(500).json({
      message:"Server error",
      error:error.message,
    })
  }
}
module.exports = {
  createIssueRequest,
   getAllIssueRequests,
   approveIssueRequest,
   rejectIssueRequest,
    returnIssueRequest,
};