const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateCurrentRole,
} = require("../controllers/profileController");
const { protect } = require("../middleware/auth");

// All routes are protected
router.use(protect);

// Profile routes
router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/role", updateCurrentRole);

module.exports = router;

