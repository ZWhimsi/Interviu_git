const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../middleware/validation");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", registerValidationRules(), validate, register);
router.post("/login", loginValidationRules(), validate, login);

// Protected routes
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);

module.exports = router;
