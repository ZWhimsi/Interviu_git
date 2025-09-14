const multer = require("multer");
const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories for different file types
const cvDir = path.join(uploadsDir, "cv");
const profileDir = path.join(uploadsDir, "profile");

if (!fs.existsSync(cvDir)) {
  fs.mkdirSync(cvDir, { recursive: true });
}

if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

// File filter function for CV uploads
const cvFileFilter = (req, file, cb) => {
  const allowedMimes = ["application/pdf"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.error(`Invalid CV file type: ${file.mimetype}`);
    const error = new Error(
      `Invalid file type. Allowed types: ${allowedMimes.join(", ")}`
    );
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

// File filter function for profile picture uploads
const profileFileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.error(`Invalid profile picture file type: ${file.mimetype}`);
    const error = new Error(
      `Invalid file type. Allowed types: ${allowedMimes.join(", ")}`
    );
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

// Storage configuration for CV uploads
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId_timestamp.extension
    const userId = req.user?.id || "unknown";
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${userId}_${timestamp}${extension}`;
    cb(null, filename);
  },
});

// Storage configuration for profile picture uploads
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId_timestamp.extension
    const userId = req.user?.id || "unknown";
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${userId}_${timestamp}${extension}`;
    cb(null, filename);
  },
});

// Multer configuration for CV uploads
const uploadCV = multer({
  storage: cvStorage,
  fileFilter: cvFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("cv");

// Multer configuration for profile picture uploads
const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: profileFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("profile");

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  logger.error(`Upload error: ${error.message}`, {
    error: error.code,
    stack: error.stack,
  });

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size too large. Maximum size is 5MB.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: "Unexpected file field.",
      });
    }
  }

  if (error.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  res.status(500).json({
    success: false,
    error: "File upload failed",
  });
};

module.exports = {
  uploadCV,
  uploadProfile,
  handleUploadError,
};
