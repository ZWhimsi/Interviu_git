const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../controllers/contactController");

// Rate limiting for contact form (prevent spam)
const rateLimit = require("express-rate-limit");

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many contact requests from this IP, please try again later.",
});

// @route   POST /api/contact
// @desc    Send contact form email
// @access  Public
router.post("/", contactLimiter, sendContactEmail);

module.exports = router;

