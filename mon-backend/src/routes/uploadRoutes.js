const express = require("express");
const router = express.Router();
const {
  uploadCV,
  uploadProfile,
  getFile,
} = require("../controllers/uploadController");
const { protect } = require("../middleware/auth");
const {
  uploadCV: uploadCVMiddleware,
  uploadProfile: uploadProfileMiddleware,
  handleUploadError,
} = require("../middleware/upload");

// All routes are protected
router.use(protect);

// Upload routes
router.post("/cv", uploadCVMiddleware, uploadCV, handleUploadError);
router.post(
  "/profile",
  uploadProfileMiddleware,
  uploadProfile,
  handleUploadError
);

// File retrieval routes
router.get("/:type/:filename", getFile);

module.exports = router;

