const express = require("express");

const {
  getComponents,
  getComponent,
  createComponent,
  updateComponent,
  deleteComponent
} = require("../controllers/componentController");

const router = express.Router();


// GET all components
router.get("/", getComponents);

// GET single component
router.get("/:id", getComponent);

// CREATE component
router.post("/", createComponent);

// UPDATE component
router.put("/:id", updateComponent);

// DELETE component
router.delete("/:id", deleteComponent);


module.exports = router;