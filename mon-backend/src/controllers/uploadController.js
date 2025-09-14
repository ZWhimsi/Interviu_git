const User = require("../models/User");
const logger = require("../utils/logger");
const path = require("path");
const fs = require("fs");

/**
 * @desc    Upload CV file
 * @route   POST /api/upload/cv
 * @access  Private
 */
exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      logger.error("CV upload failed: No file received");
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const userId = req.user.id;
    const filePath = req.file.path;
    const fileName = req.file.filename;

    // Update user's CV path
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cvPath: fileName },
      { new: true }
    );

    // Check if profile is now complete
    const isComplete =
      updatedUser.name &&
      updatedUser.experience &&
      updatedUser.field &&
      updatedUser.cvPath &&
      updatedUser.availableRoles.length > 0;

    await User.findByIdAndUpdate(userId, {
      isProfileComplete: Boolean(isComplete),
    });

    logger.info(`CV uploaded for user: ${updatedUser.email}`);

    res.status(200).json({
      success: true,
      data: {
        fileName: fileName,
        filePath: filePath,
        message: "CV uploaded successfully",
      },
    });
  } catch (error) {
    logger.error(`Error in uploadCV: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to upload CV",
    });
  }
};

/**
 * @desc    Upload profile picture
 * @route   POST /api/upload/profile
 * @access  Private
 */
exports.uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      logger.error("Profile upload failed: No file received");
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const userId = req.user.id;
    const filePath = req.file.path;
    const fileName = req.file.filename;

    // Delete old profile picture if exists
    const user = await User.findById(userId);
    if (user.profilePicturePath) {
      const oldFilePath = path.join(
        __dirname,
        "../../uploads/profile",
        user.profilePicturePath
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update user's profile picture path
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicturePath: fileName },
      { new: true }
    );

    logger.info(`Profile picture uploaded for user: ${updatedUser.email}`);

    res.status(200).json({
      success: true,
      data: {
        fileName: fileName,
        filePath: filePath,
        message: "Profile picture uploaded successfully",
      },
    });
  } catch (error) {
    logger.error(`Error in uploadProfile: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to upload profile picture",
    });
  }
};

/**
 * @desc    Get uploaded file
 * @route   GET /api/upload/:type/:filename
 * @access  Private
 */
exports.getFile = async (req, res) => {
  try {
    const { type, filename } = req.params;
    const userId = req.user.id;

    // Validate file type
    if (!["cv", "profile"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid file type",
      });
    }

    // Check if user has access to this file
    const user = await User.findById(userId);
    const fileField = type === "cv" ? "cvPath" : "profilePicturePath";

    if (user[fileField] !== filename) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const filePath = path.join(__dirname, "../../uploads", type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
    };

    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
    res.sendFile(filePath);
  } catch (error) {
    logger.error(`Error in getFile: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve file",
    });
  }
};
