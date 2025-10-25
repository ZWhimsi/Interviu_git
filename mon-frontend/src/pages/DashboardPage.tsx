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
import FeatureIcon from "../components/FeatureIcon";
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
  const [isChangingRole, setIsChangingRole] = useState(false);

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
          const profileData = data.data;

          // Ensure availableRoles has a default value
          if (
            !profileData.availableRoles ||
            profileData.availableRoles.length === 0
          ) {
            profileData.availableRoles = ["interviewer"];
          }

          setProfile(profileData);
          const roleToSet =
            profileData.currentRole ||
            profileData.availableRoles[0] ||
            "interviewer";
          setCurrentRole(roleToSet);

          console.log("Profile loaded with roles:", profileData.availableRoles);
          console.log("Initial role set to:", roleToSet);
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
    // Don't process if already changing or same role
    if (isChangingRole || newRole === currentRole) {
      console.log(
        "Role change skipped:",
        isChangingRole ? "already changing" : "same role"
      );
      return;
    }

    console.log("Role change requested:", newRole);

    // Store previous role for potential revert
    const previousRole = currentRole;

    // Set loading state and update UI
    setIsChangingRole(true);
    setCurrentRole(newRole);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentRole: newRole,
          availableRoles: profile?.availableRoles || [newRole],
        }),
      });

      if (!response.ok) {
        // Revert on error
        console.error("Failed to update role:", response.status);
        setCurrentRole(previousRole); // Revert to previous role
      } else {
        console.log("Role updated successfully to:", newRole);
        // Update profile with new role
        if (profile) {
          setProfile({ ...profile, currentRole: newRole });
        }
      }
    } catch (error) {
      console.error("Error updating role:", error);
      // Revert on error
      setCurrentRole(previousRole);
    } finally {
      setIsChangingRole(false);
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

  // Feature cards - Dynamic based on role
  const interviewerFeatures = [
    {
      iconType: "target" as const,
      title: "Start Practice Interview",
      description:
        "Practice with AI-powered interview questions tailored to your target role",
      action: startNewInterview,
      buttonText: "Start Now",
    },
    {
      iconType: "document" as const,
      title: "Analyze Your CV",
      description:
        "Get instant compatibility scores and optimization suggestions",
      action: () => (window.location.href = "/cv-analysis"),
      buttonText: "Analyze CV",
    },
    {
      iconType: "chart" as const,
      title: "View Your Progress",
      description: "Track your interview performance and improvement over time",
      action: () => alert("Progress dashboard coming soon!"),
      buttonText: "View Stats",
    },
    {
      iconType: "book" as const,
      title: "Learning Resources",
      description:
        "Access curated courses and materials to improve your skills",
      action: () => alert("Learning resources coming soon!"),
      buttonText: "Explore",
    },
  ];

  const recruiterFeatures = [
    {
      iconType: "search" as const,
      title: "Candidate Search",
      description:
        "Find and filter candidates based on skills, experience, and cultural fit",
      action: () => alert("Candidate search coming soon!"),
      buttonText: "Search",
    },
    {
      iconType: "document" as const,
      title: "CV Database",
      description:
        "Access and manage your organization's talent pool and applications",
      action: () => alert("CV database coming soon!"),
      buttonText: "Browse",
    },
    {
      iconType: "user" as const,
      title: "Interview Templates",
      description:
        "Create and manage standardized interview questions and assessments",
      action: () => alert("Interview templates coming soon!"),
      buttonText: "Manage",
    },
    {
      iconType: "chart" as const,
      title: "Recruitment Analytics",
      description:
        "Track hiring metrics, pipeline health, and team performance",
      action: () => alert("Recruitment analytics coming soon!"),
      buttonText: "View Reports",
    },
  ];

  // Select features based on current role
  const features =
    currentRole === "recruiter" ? recruiterFeatures : interviewerFeatures;

  // Debug log to verify feature switching
  console.log("Current role:", currentRole);
  console.log("Features count:", features.length);

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
        isChangingRole={isChangingRole}
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
              {currentRole === "recruiter"
                ? "Ready to find your next top talent? Choose an action below to get started."
                : "Ready to ace your next interview? Choose an action below to get started."}
            </p>
            {profile.availableRoles.length > 1 && (
              <p className="role-indicator">
                Currently viewing as:{" "}
                <strong>
                  {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                </strong>
              </p>
            )}

            <div
              className="dashboard-features-grid"
              key={`features-${currentRole}`}
            >
              {features.map((feature, index) => (
                <div
                  key={`${currentRole}-${index}`}
                  className="dashboard-feature-card"
                  onClick={feature.action}
                >
                  <div className="dashboard-feature-icon">
                    <FeatureIcon
                      type={feature.iconType}
                      size={32}
                      color="white"
                    />
                  </div>
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
