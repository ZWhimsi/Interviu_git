const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Protect routes - Middleware to verify JWT token
 */
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  // If no token in header, check cookies (if using cookies)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    logger.warn("No authorization token provided");
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = await User.findById(decoded.id);

    // If user doesn't exist anymore
    if (!req.user) {
      logger.warn(`User with ID ${decoded.id} no longer exists`);
      return res.status(401).json({
        success: false,
        error: "User no longer exists",
      });
    }

    next();
  } catch (error) {
    logger.error(`JWT verification error: ${error.message}`);
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(
        `User ${
          req.user ? req.user._id : "unknown"
        } attempted to access restricted route`
      );
      return res.status(403).json({
        success: false,
        error: "Not authorized to access this route",
      });
    }
    next();
  };
};
