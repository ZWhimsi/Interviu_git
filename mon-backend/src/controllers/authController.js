const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      logger.warn(`Registration attempted with existing email: ${email}`);
      return res.status(400).json({
        success: false,
        error: "Email already in use",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = user.getSignedJwtToken();

    logger.info(`New user registered: ${email}`);

    // Return token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    logger.error(`Error in register: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server error during registration",
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      logger.warn(`Failed login attempt for user: ${email}`);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Update last login time
    await user.updateLastLogin();

    logger.info(`User logged in: ${email}`);

    // Return token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error(`Error in login: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server error during login",
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    logger.error(`Error in getMe: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  // If using cookies
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

/**
 * Helper function to send JWT token response
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ||
        30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Make cookie secure in production
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};
