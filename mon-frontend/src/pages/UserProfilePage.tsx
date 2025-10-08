/**
 * Settings Page - User Account Management (Post-Login)
 *
 * Purpose: Allow users to manage profile, account, and preferences
 * Tabs: Profile (name, experience, field) | Account (email, password, delete) | Preferences (dark mode, notifications)
 *
 * Architecture: Header (Dashboard button + Logo + Logout) + Tabs + Content
 * Dark Mode: Fully supported
 * CSS Classes: `.settings-*` (modular, no conflicts)
 *
 * @module UserProfilePage
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import "./UserProfilePage.css";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface ProfileData {
  id: string;
  name: string;
  email: string;
  experience: string;
  field: string;
  cvPath: string;
  profilePicturePath: string;
  availableRoles: string[];
  currentRole: string;
  isProfileComplete: boolean;
}

export default function UserProfilePage() {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "profile" | "account" | "preferences"
  >("profile");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    field: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.data);
          setFormData({
            name: data.data.name || "",
            experience: data.data.experience || "",
            field: data.data.field || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to update profile");
      }
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* Header with Navigation */}
      <div className="settings-header">
        <button
          className="back-button"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Dashboard
        </button>
        <div className="header-logo">
          <img src="/logo.svg" alt="InterviU" />
          <span>InterviU</span>
        </div>
        <button className="logout-button-header" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="settings-main-full">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>

          {/* Tabs */}
          <div className="settings-tabs">
            <button
              className={`tab-button ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`tab-button ${
                activeTab === "account" ? "active" : ""
              }`}
              onClick={() => setActiveTab("account")}
            >
              Account
            </button>
            <button
              className={`tab-button ${
                activeTab === "preferences" ? "active" : ""
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              Preferences
            </button>
          </div>

          {/* Messages */}
          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}

          {/* Tab Content */}
          <div className="settings-content">
            {activeTab === "profile" && (
              <div className="tab-panel">
                <h2>Profile Information</h2>

                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 years in software development"
                  />
                </div>

                <div className="form-group">
                  <label>Field</label>
                  <input
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology, Marketing, Finance"
                  />
                </div>

                <button
                  className="save-button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {activeTab === "account" && (
              <div className="tab-panel">
                <h2>Account Settings</h2>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData?.email || ""}
                    disabled
                    className="disabled-input"
                  />
                  <p className="field-note">Email cannot be changed</p>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <button className="secondary-button">Change Password</button>
                  <p className="field-note">
                    Update your password to keep your account secure
                  </p>
                </div>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <p>Once you delete your account, there is no going back.</p>
                  <button className="danger-button">Delete Account</button>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="tab-panel">
                <h2>Preferences</h2>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Dark Mode</h3>
                    <p>Toggle dark mode for better viewing at night</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={toggleDarkMode}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Email Notifications</h3>
                    <p>Receive email updates about your interviews</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Interview Reminders</h3>
                    <p>Get reminded before scheduled practice sessions</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
