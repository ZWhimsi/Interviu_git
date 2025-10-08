/**
 * Contact Page - Contact Form + Info
 *
 * Purpose: Allow users to contact team via email form
 * Backend: Sends email to contact@interviu.fr via Nodemailer
 *
 * Form Fields: Name, Email, Subject, Message
 * Validation: All required, email format check
 * Rate Limit: Backend handles (prevent spam)
 *
 * CSS Classes: `.contact-form-group` (modular, no conflicts with Settings)
 *
 * Architecture: PageHeader + Gradient Hero + 2-column (Form + Contact Info) + Footer
 * Dark Mode: NO (public page, always light)
 * Brand Colors: Hero gradient, submit button gradient
 *
 * @module ContactPage
 */

import { useState } from "react";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "../components/Footer.css";
import "../components/PageHeader.css";
import "./ContactPage.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset status
    setSubmitStatus({ type: null, message: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Your message has been sent successfully!",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Contact form error:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Network error. Please try again or email us at contact@interviu.fr",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <PageHeader />
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p className="contact-hero-subtitle">
            Have questions? We're here to help.
          </p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p>
              Fill out the form and our team will get back to you within 24
              hours.
            </p>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>contact@interviu.fr</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="method-icon">💬</div>
                <div>
                  <h4>Live Chat</h4>
                  <p>Available 9am-5pm EST</p>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Success/Error Messages */}
            {submitStatus.type && (
              <div className={`submit-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <div className="contact-form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="contact-form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="contact-form-group">
              <label>Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: "" });
                }}
                className={errors.subject ? "error" : ""}
              />
              {errors.subject && (
                <span className="error-text">{errors.subject}</span>
              )}
            </div>

            <div className="contact-form-group">
              <label>Message *</label>
              <textarea
                rows={6}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: "" });
                }}
                className={errors.message ? "error" : ""}
              />
              {errors.message && (
                <span className="error-text">{errors.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
