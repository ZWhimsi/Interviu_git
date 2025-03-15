import { useState } from "react";
import Header from "../signup_components/Header";
import Footer from "../signup_components/Footer";
import "./SignInPage.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors: { email?: string; password?: string } = {};

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

    // Clear errors and start loading
    setErrors({});
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Reset form on success
      setEmail("");
      setPassword("");
    }, 1500);
  };

  return (
    <div className="signin-page">
      <Header />

      <main className="signin-page-content">
        <div className="signin-container">
          <h1 className="signin-title">Welcome Back</h1>
          <p className="signin-subtitle">Sign in to your InterviU account</p>

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
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
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

          <div className="signin-register">
            Don't have an account? <a href="/">Sign Up</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
