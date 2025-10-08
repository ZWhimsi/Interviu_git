/**
 * OAuth Callback Page - Authentication Flow Handler
 *
 * Purpose: Handle redirect after OAuth authentication (Google, Microsoft)
 * Flow:
 *   1. Extract token from URL query params (?token=xxx&newUser=true)
 *   2. Store token in localStorage
 *   3. Fetch user data with token
 *   4. Redirect to /profile (new user) or /dashboard (existing)
 *
 * Display: Loading spinner only (transition page)
 * Error Handling: Redirect to /signin if token missing or invalid
 *
 * Architecture: Simple centered loader
 * Dark Mode: NO (transition page, always light)
 *
 * @module AuthCallbackPage
 */

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthCallbackPage.css";

export default function AuthCallbackPage() {
  const { setUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Extract token from URL query params
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const isNewUser = params.get("newUser") === "true";

      if (token) {
        // Store token
        localStorage.setItem("authToken", token);

        // Fetch user data
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);

            // Redirect based on profile completion
            if (isNewUser || !userData.user.isProfileComplete) {
              window.location.href = "/profile";
            } else {
              window.location.href = "/dashboard";
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          window.location.href = "/signin";
        }
      } else {
        // No token found, redirect to sign in
        window.location.href = "/signin";
      }
    };

    handleOAuthCallback();
  }, [setUser]);

  return (
    <div className="auth-callback-page">
      <div className="callback-loading">
        <div className="loading-spinner"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}
