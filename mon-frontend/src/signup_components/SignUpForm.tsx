import { useState } from "react";
import SocialAuthButtons from "../components/SocialAuthButtons";
import { useAuth } from "../context/AuthContext";
import "./SignUpForm.css";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { register, isLoading, error, clearError } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    clearError();

    // Validate name
    if (!name) {
      newErrors.name = "Name is required";
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Validate password confirmation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and attempt registration
    setErrors({});

    try {
      await register(name, email, password, confirmPassword);
      // Reset form on success
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Redirect to profile completion page
      window.location.href = "/profile";
    } catch (error: any) {
      // Error is handled by the auth context
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="sign-up-container">
      <form
        className={`sign-up-form-container ${
          Object.keys(errors).length > 0 ? "form-error" : ""
        }`}
        onSubmit={handleSubmit}
      >
        <h2 className="sign-up-form-title">Sign Up</h2>

        {/* API Error Display */}
        {error && <div className="sign-up-api-error">{error}</div>}

        <label className="sign-up-form-label">
          Name
          <input
            type="text"
            placeholder="Your name"
            className="sign-up-form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <span className="sign-up-form-error" id="name-error">
              {errors.name}
            </span>
          )}
        </label>

        <label className="sign-up-form-label">
          Email
          <input
            type="email"
            placeholder="your.email@example.com"
            className="sign-up-form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span className="sign-up-form-error" id="email-error">
              {errors.email}
            </span>
          )}
        </label>

        <label className="sign-up-form-label">
          Password
          <input
            type="password"
            placeholder="********"
            className="sign-up-form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            minLength={8}
          />
          {errors.password && (
            <span className="sign-up-form-error" id="password-error">
              {errors.password}
            </span>
          )}
        </label>

        <label className="sign-up-form-label">
          Confirm Password
          <input
            type="password"
            placeholder="********"
            className="sign-up-form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
          />
          {errors.confirmPassword && (
            <span className="sign-up-form-error" id="confirm-password-error">
              {errors.confirmPassword}
            </span>
          )}
        </label>

        <button
          type="submit"
          className={`sign-up-form-button ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="sign-up-form-login-link">
          Already have an account? <a href="/signin">Sign In</a>
        </div>
      </form>

      {/* Social auth buttons */}
      <div className="sign-up-social-buttons">
        <SocialAuthButtons mode="signup" />
      </div>
    </div>
  );
}
