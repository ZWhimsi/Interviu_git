/**
 * Sign In Page - Authentication
 *
 * Purpose: User login with email/password or OAuth
 * Methods: Email/Password, Google OAuth, Microsoft OAuth
 *
 * Flow: Login → Check profile complete → Redirect to /profile or /dashboard
 *
 * Architecture: PageHeader + Centered form + Footer
 * Dark Mode: NO (public page, always light)
 * Background: Gradient (#f5f7fa → #c3cfe2)
 *
 * @module SignInPage
 */

import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import "../components/PageHeader.css";
import "../components/Footer.css";
import SocialAuthButtons from "../components/SocialAuthButtons";
import { useAuth } from "../context/AuthContext";
import "./SignInPage.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const { login, isLoading, error, clearError } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors: { email?: string; password?: string } = {};
    clearError();

    // Validate email
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    }

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and attempt login
    setErrors({});

    try {
      await login(email, password);
      // Reset form on success
      setEmail("");
      setPassword("");

      // Check profile completion status and redirect accordingly
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data.isProfileComplete) {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/profile";
          }
        } else {
          // Fallback to profile page if we can't check status
          window.location.href = "/profile";
        }
      } catch (profileError) {
        console.error("Error checking profile status:", profileError);
        // Fallback to profile page
        window.location.href = "/profile";
      }
    } catch (error: any) {
      // Error is handled by the auth context
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="signin-page">
      <PageHeader />

      <main className="signin-page-content">
        <div className="signin-container">
          <div className="signin-header">
            <h1 className="signin-title">Welcome Back</h1>
          </div>
          <p className="signin-subtitle">Sign in to your InterviU account</p>

          {/* API Error Display */}
          {error && <div className="signin-api-error">{error}</div>}

          <form
            className={`signin-form ${
              Object.keys(errors).length > 0 ? "form-error" : ""
            }`}
            onSubmit={handleSubmit}
          >
            <div className="signin-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <div className="signin-error" id="email-error">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="signin-form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="2"
                        y1="2"
                        x2="22"
                        y2="22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="signin-error" id="password-error">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="signin-form-footer">
              <div className="signin-remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className="signin-forgot">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={`signin-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Social auth buttons */}
          <div className="signin-social-buttons">
            <SocialAuthButtons mode="signin" />
          </div>

          <div className="signin-register">
            Don't have an account? <a href="/signup">Sign Up</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
