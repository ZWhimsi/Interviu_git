/**
 * Dashboard Page - Main Application Interface (Post-Login)
 *
 * Purpose: Central hub after authentication
 * Features:
 *   - Welcome screen with user name
 *   - 4 feature cards (Practice Interview, Analyze CV, Progress, Learning)
 *   - Sidebar with interview history and navigation
 *   - Role-based feature display
 *
 * Architecture: Sidebar (dark themed) + Main content area
 * Dark Mode: Fully supported
 * Brand Colors: #5639FE, #66E8FD, #5E91FE (gradient)
 *
 * @module DashboardPage
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "./DashboardPage.css";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * User profile data from backend
 */
interface UserProfile {
  id: string;
  name: string;
  email: string;
  experience: string;
  field: string;
  cvPath: string;
  profilePicturePath: string;
  availableRoles: string[]; // ['interviewer', 'recruiter']
  currentRole: string;
  isProfileComplete: boolean;
}

/**
 * Interview session metadata (mockup - will be real data)
 */
interface Interview {
  id: string;
  title: string;
  date: string;
  company?: string;
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeInterview, setActiveInterview] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string>("");

  // Mock interviews (replace with real API later)
  const [interviews] = useState<Interview[]>([
    { id: "1", title: "Software Engineer at Google", date: "2 hours ago" },
    { id: "2", title: "Product Manager at Meta", date: "Yesterday" },
    { id: "3", title: "Data Scientist at Netflix", date: "2 days ago" },
  ]);

  // Load user profile
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
          setProfile(data.data);
          setCurrentRole(
            data.data.currentRole ||
              data.data.availableRoles[0] ||
              "interviewer"
          );
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleRoleChange = async (newRole: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/profile/role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentRole: newRole }),
      });

      if (response.ok) {
        setCurrentRole(newRole);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleHome = () => {
    window.location.href = "/dashboard";
  };

  const handleSettings = () => {
    window.location.href = "/user-profile";
  };

  const startNewInterview = () => {
    // TODO: Navigate to interview simulator
    alert("Interview simulator coming soon!");
  };

  const features = [
    {
      icon: "🎯",
      title: "Start Practice Interview",
      description:
        "Practice with AI-powered interview questions tailored to your target role",
      action: startNewInterview,
      buttonText: "Start Now",
    },
    {
      icon: "📄",
      title: "Analyze Your CV",
      description:
        "Get instant compatibility scores and optimization suggestions",
      action: () => (window.location.href = "/cv-analysis"),
      buttonText: "Analyze CV",
    },
    {
      icon: "📊",
      title: "View Your Progress",
      description: "Track your interview performance and improvement over time",
      action: () => alert("Progress dashboard coming soon!"),
      buttonText: "View Stats",
    },
    {
      icon: "🎓",
      title: "Learning Resources",
      description:
        "Access curated courses and materials to improve your skills",
      action: () => alert("Learning resources coming soon!"),
      buttonText: "Explore",
    },
  ];

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h2>Unable to load profile</h2>
          <p>Please try refreshing the page.</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Sidebar Component */}
      <Sidebar
        userName={profile.name}
        userEmail={profile.email}
        interviews={interviews}
        activeInterview={activeInterview}
        currentRole={currentRole}
        availableRoles={profile.availableRoles}
        onInterviewSelect={setActiveInterview}
        onNewInterview={startNewInterview}
        onRoleChange={handleRoleChange}
        onSettings={handleSettings}
        onLogout={handleLogout}
        onHome={handleHome}
      />

      {/* Main Content */}
      <main className="dashboard-main">
        {activeInterview ? (
          // Active Interview View (TODO: Build interview interface)
          <div className="interview-view">
            <div className="interview-container">
              <h2>Interview View - Coming Soon</h2>
              <p>Interview ID: {activeInterview}</p>
              <button onClick={() => setActiveInterview(null)}>
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          // Welcome Screen with Features
          <div className="welcome-screen">
            <img src="/logo.svg" alt="InterviU" className="welcome-logo" />
            <h1 className="welcome-title">
              Welcome back, {profile.name.split(" ")[0]}!
            </h1>
            <p className="welcome-subtitle">
              Ready to ace your next interview? Choose an action below to get
              started.
            </p>

            <div className="dashboard-features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="dashboard-feature-card"
                  onClick={feature.action}
                >
                  <div className="dashboard-feature-icon">{feature.icon}</div>
                  <h3 className="dashboard-feature-title">{feature.title}</h3>
                  <p className="dashboard-feature-description">
                    {feature.description}
                  </p>
                  <button className="dashboard-feature-button">
                    <span>{feature.buttonText}</span>
                    <span className="button-arrow">→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
