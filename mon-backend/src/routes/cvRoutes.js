/**
 * CV Analysis Routes
 * 
 * Purpose: API endpoints for CV analysis functionality
 * Authentication: All routes require JWT (protect middleware)
 * 
 * Endpoints:
 *   POST /analyze    - Analyze CV against job description
 *   GET  /history    - Get user's past analyses
 *   GET  /analysis/:id - Get specific analysis details
 * 
 * @module cvRoutes
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/auth");
const {
  analyzeCV,
  getCVHistory,
  getCVAnalysis,
} = require("../controllers/cvController");

// File upload configuration (temporary storage for analysis)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/cv/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = req.user.id + "_" + Date.now();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for CV analysis"));
    }
  },
});

// All routes require authentication
router.use(protect);

// CV Analysis routes
router.post("/analyze", upload.single("cv"), analyzeCV);
router.get("/history", getCVHistory);
router.get("/analysis/:id", getCVAnalysis);

module.exports = router;
