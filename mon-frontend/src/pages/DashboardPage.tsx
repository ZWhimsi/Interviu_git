import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import "./DashboardPage.css";

interface UserProfile {
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

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [isOfferActive, setIsOfferActive] = useState(true);

  // Load user profile data
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
            data.data.currentRole || data.data.availableRoles[0] || ""
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
        if (profile) {
          setProfile({ ...profile, currentRole: newRole });
        }
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const navigateToProfile = () => {
    window.location.href = "/user-profile";
  };

  // Dynamic features based on role
  const getRoleFeatures = () => {
    if (currentRole === "recruiter") {
      return [
        {
          icon: "CV",
          title: "View CVs",
          description:
            "Review and analyze candidate resumes and qualifications",
          buttonText: "View CVs",
        },
        {
          icon: "MT",
          title: "Setup Meeting",
          description:
            "Schedule and coordinate interview sessions with candidates",
          buttonText: "Schedule",
        },
        {
          icon: "EV",
          title: "Evaluate",
          description: "Assess candidate performance and make hiring decisions",
          buttonText: "Evaluate",
        },
        {
          icon: "HR",
          title: "Hire",
          description: "Manage the hiring process and candidate onboarding",
          buttonText: "Hire",
        },
      ];
    } else {
      return [
        {
          icon: "PR",
          title: "Prepare",
          description: "Prepare interview questions and evaluation criteria",
          buttonText: "Prepare",
        },
        {
          icon: "IN",
          title: "Interview",
          description: "Conduct structured interviews with candidates",
          buttonText: "Start Interview",
        },
        {
          icon: "RT",
          title: "Rate",
          description: "Rate candidate performance and provide feedback",
          buttonText: "Rate",
        },
        {
          icon: "RP",
          title: "Report",
          description: "Generate interview reports and recommendations",
          buttonText: "Generate Report",
        },
      ];
    }
  };

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
          <p>Please try refreshing the page or contact support.</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/logo.svg" alt="InterviU Logo" className="sidebar-logo" />
            <h1>InterviU</h1>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-title">
              <span className="nav-title-text">Offers</span>
            </div>
            <ul className="nav-list">
              <li className="nav-item new-offer">
                <button className="new-offer-btn">
                  <span className="nav-item-text">+ New Offer</span>
                </button>
              </li>
              <li className="nav-item">
                <span className="nav-item-text">Offer 1</span>
              </li>
              <li className="nav-item">
                <span className="nav-item-text">Offer 2</span>
              </li>
              <li className="nav-item">
                <span className="nav-item-text">Offer 3</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="role-switcher">
            <span className="role-label">Role</span>
            <div className="role-buttons">
              {profile.availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`role-btn ${currentRole === role ? "active" : ""}`}
                  title={role.charAt(0).toUpperCase() + role.slice(1)}
                >
                  <span className="role-btn-text">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="footer-actions">
            <button onClick={navigateToProfile} className="footer-action-btn">
              <span className="btn-text">Settings</span>
            </button>
            <button onClick={handleLogout} className="footer-action-btn logout">
              <span className="btn-text">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Offer Section */}
          <div className="offer-section">
            <div className="offer-header">
              <h3 className="offer-title">Current Offer</h3>
              <div className="status-toggle-container">
                <div className="apple-toggle">
                  <input
                    type="checkbox"
                    id="status-toggle"
                    className="toggle-input"
                    checked={isOfferActive}
                    onChange={(e) => setIsOfferActive(e.target.checked)}
                  />
                  <label htmlFor="status-toggle" className="toggle-label">
                    <span className="toggle-slider"></span>
                    <span className="toggle-text">
                      {isOfferActive ? "Active" : "Not Active"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid - 2x2 Layout */}
          <div className="features-grid">
            {getRoleFeatures().map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    <div className="icon-container">
                      <span className="icon-symbol">{feature.icon}</span>
                    </div>
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                </div>
                <p className="feature-description">{feature.description}</p>
                <button className="feature-button">
                  <span className="button-text">{feature.buttonText}</span>
                  <div className="button-arrow">→</div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
