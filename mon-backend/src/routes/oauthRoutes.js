const express = require("express");
const router = express.Router();
const { passport, msalClient } = require("../config/passport");
const User = require("../models/User");
const logger = require("../utils/logger");

// Helper function to send token response
const sendTokenResponse = (user, res) => {
  const token = user.getSignedJwtToken();

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      authProvider: user.authProvider,
    },
  });
};

// ========================================
// GOOGLE OAuth Routes
// ========================================
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/signin?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = req.user.getSignedJwtToken();

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=google`
      );
    } catch (error) {
      logger.error(`Google callback error: ${error.message}`);
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
    }
  }
);

// ========================================
// APPLE OAuth Routes
// ========================================
router.post(
  "/apple",
  passport.authenticate("apple", {
    scope: ["name", "email"],
    session: false,
  })
);

router.post(
  "/apple/callback",
  passport.authenticate("apple", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/signin?error=apple_auth_failed`,
  }),
  (req, res) => {
    try {
      const token = req.user.getSignedJwtToken();
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=apple`
      );
    } catch (error) {
      logger.error(`Apple callback error: ${error.message}`);
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
    }
  }
);

// ========================================
// MICROSOFT OAuth Routes
// ========================================
router.get("/microsoft", (req, res) => {
  if (!msalClient) {
    return res.status(500).json({
      success: false,
      error: "Microsoft OAuth not configured",
    });
  }

  const authUrl = msalClient.getAuthCodeUrl({
    scopes: ["user.read", "email", "profile"],
    redirectUri: `${process.env.BACKEND_URL}/api/auth/microsoft/callback`,
  });

  authUrl
    .then((url) => res.redirect(url))
    .catch((error) => {
      logger.error(`Microsoft auth URL error: ${error.message}`);
      res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=microsoft_auth_failed`
      );
    });
});

router.get("/microsoft/callback", async (req, res) => {
  try {
    if (!msalClient) {
      throw new Error("Microsoft OAuth not configured");
    }

    const { code } = req.query;

    if (!code) {
      throw new Error("No authorization code received");
    }

    // Exchange code for token
    const tokenResponse = await msalClient.acquireTokenByCode({
      code,
      scopes: ["user.read", "email", "profile"],
      redirectUri: `${process.env.BACKEND_URL}/api/auth/microsoft/callback`,
    });

    // Get user info from Microsoft Graph
    const fetch = require("node-fetch");
    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });

    const profile = await graphResponse.json();

    logger.info(
      `Microsoft OAuth callback for: ${
        profile.mail || profile.userPrincipalName
      }`
    );

    const email = profile.mail || profile.userPrincipalName;
    const name = profile.displayName;
    const microsoftId = profile.id;

    // Check if user exists by Microsoft ID
    let user = await User.findOne({ microsoftId });

    if (user) {
      await user.updateLastLogin();
    } else {
      // Check if user exists by email (link account)
      user = await User.findOne({ email });

      if (user) {
        user.microsoftId = microsoftId;
        user.authProvider = "microsoft";
        await user.save();
        logger.info(`Linked Microsoft account to existing user: ${email}`);
      } else {
        // Create new user
        user = await User.create({
          name,
          email,
          microsoftId,
          authProvider: "microsoft",
        });
        logger.info(`New user created via Microsoft OAuth: ${email}`);
      }
    }

    const token = user.getSignedJwtToken();
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=microsoft`
    );
  } catch (error) {
    logger.error(`Microsoft callback error: ${error.message}`);
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
  }
});

module.exports = router;


