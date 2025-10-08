const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        experience: user.experience,
        field: user.field,
        cvPath: user.cvPath,
        profilePicturePath: user.profilePicturePath,
        availableRoles: user.availableRoles,
        currentRole: user.currentRole,
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    logger.error(`Error in getProfile: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, experience, field, availableRoles, isProfileComplete } =
      req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;

    if (experience !== undefined) updateData.experience = experience;
    if (field !== undefined) updateData.field = field;
    if (availableRoles !== undefined) {
      updateData.availableRoles = availableRoles;
      // If current role is not in available roles, set to first available role
      if (
        availableRoles.length > 0 &&
        !availableRoles.includes(req.user.currentRole)
      ) {
        updateData.currentRole = availableRoles[0];
      }
    }

    // Only process isProfileComplete if it's explicitly provided and is a boolean
    if (
      isProfileComplete !== undefined &&
      typeof isProfileComplete === "boolean"
    ) {
      updateData.isProfileComplete = isProfileComplete;
    }

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Check if profile is complete (MANDATORY: Name + CV + at least one role)
    const isComplete =
      updatedUser.name &&
      updatedUser.cvPath &&
      updatedUser.availableRoles.length > 0;
    updatedUser.isProfileComplete = Boolean(isComplete);
    await updatedUser.save();

    logger.info(`Profile updated for user: ${updatedUser.email}`);

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        experience: updatedUser.experience,
        field: updatedUser.field,
        cvPath: updatedUser.cvPath,
        profilePicturePath: updatedUser.profilePicturePath,
        availableRoles: updatedUser.availableRoles,
        currentRole: updatedUser.currentRole,
        isProfileComplete: updatedUser.isProfileComplete,
      },
    });
  } catch (error) {
    logger.error(`Error in updateProfile: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server error during profile update",
    });
  }
};

/**
 * @desc    Update user's current role
 * @route   PUT /api/profile/role
 * @access  Private
 */
exports.updateCurrentRole = async (req, res) => {
  try {
    const { currentRole } = req.body;

    if (!currentRole || !["recruiter", "interviewer"].includes(currentRole)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role. Must be 'recruiter' or 'interviewer'",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user.availableRoles.includes(currentRole)) {
      return res.status(400).json({
        success: false,
        error: "You don't have access to this role",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { currentRole },
      { new: true }
    );

    logger.info(
      `Role changed to ${currentRole} for user: ${updatedUser.email}`
    );

    res.status(200).json({
      success: true,
      data: {
        currentRole: updatedUser.currentRole,
        availableRoles: updatedUser.availableRoles,
      },
    });
  } catch (error) {
    logger.error(`Error in updateCurrentRole: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server error during role update",
    });
  }
};
