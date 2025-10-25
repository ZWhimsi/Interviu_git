const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  streamProgress,
  getProgress,
} = require("../controllers/progressController");

// SSE endpoint for real-time progress updates
router.get("/stream/:analysisId", streamProgress);

// Get current progress status
router.get("/:analysisId", protect, getProgress);

module.exports = router;
