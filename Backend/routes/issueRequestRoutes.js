const express=require("express");
const router=express.Router();

const {createIssueRequest,
   getAllIssueRequests,
}=require("../controllers/issueRequestController");
const {protect}=require("../middleware/authMiddleware");

router.post("/",protect,createIssueRequest);
router.get("/", protect, getAllIssueRequests);
module.exports=router;