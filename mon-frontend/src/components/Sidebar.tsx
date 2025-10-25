import { useState } from "react";
import FeatureIcon from "./FeatureIcon";
import "./Sidebar.css";

interface SidebarProps {
  userName: string;
  userEmail: string;
  interviews: Array<{ id: string; title: string; date: string }>;
  activeInterview: string | null;
  currentRole: string;
  availableRoles: string[];
  isChangingRole?: boolean;
  onInterviewSelect: (id: string) => void;
  onNewInterview: () => void;
  onRoleChange: (role: string) => void;
  onSettings: () => void;
  onLogout: () => void;
  onHome: () => void;
}

export default function Sidebar({
  userName,
  userEmail,
  interviews,
  activeInterview,
  currentRole,
  availableRoles,
  isChangingRole = false,
  onInterviewSelect,
  onNewInterview,
  onRoleChange,
  onSettings,
  onLogout,
  onHome,
}: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside className="dashboard-sidebar">
      {/* Header with Logo */}
      <div className="sidebar-header">
        <div className="sidebar-brand" onClick={onHome}>
          <img src="/logo.svg" alt="InterviU" className="sidebar-logo" />
          <span className="sidebar-title">InterviU</span>
        </div>
      </div>

      {/* New Interview Button */}
      <button className="new-interview-btn" onClick={onNewInterview}>
        <span className="btn-icon">+</span>
        <span className="btn-text">New Interview</span>
      </button>

      {/* Role Switcher (if multiple roles) */}
      {availableRoles.length > 1 && (
        <div className="role-switcher">
          <span className="role-label">Role:</span>
          <div className="role-buttons">
            {availableRoles.map((role) => (
              <button
                key={role}
                className={`role-btn ${currentRole === role ? "active" : ""} ${
                  isChangingRole ? "loading" : ""
                }`}
                onClick={() => onRoleChange(role)}
                disabled={isChangingRole}
              >
                {isChangingRole && currentRole === role ? (
                  <span className="loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                ) : (
                  role.charAt(0).toUpperCase() + role.slice(1)
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interview History */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Recent Interviews</div>
        <ul className="nav-list">
          {interviews.map((interview) => (
            <li key={interview.id} className="nav-item">
              <button
                className={`nav-item-btn ${
                  activeInterview === interview.id ? "active" : ""
                }`}
                onClick={() => onInterviewSelect(interview.id)}
              >
                <span className="interview-icon">
                  <FeatureIcon type="briefcase" size={16} />
                </span>
                <div className="interview-info">
                  <span className="interview-title">{interview.title}</span>
                  <span className="interview-date">{interview.date}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {interviews.length === 0 && (
          <div className="empty-state">
            No interviews yet. Start your first one!
          </div>
        )}
      </nav>

      {/* User Menu Footer */}
      <div className="sidebar-footer">
        <div
          className="user-menu"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <p className="user-name">{userName}</p>
            <p className="user-email">{userEmail}</p>
          </div>
          <span className="menu-icon">⋮</span>
        </div>

        {/* Dropdown */}
        {showUserMenu && (
          <div className="user-dropdown">
            <button className="dropdown-item" onClick={onHome}>
              <span className="dropdown-icon">
                <FeatureIcon type="home" size={16} />
              </span>
              <span>Home</span>
            </button>
            <button className="dropdown-item" onClick={onSettings}>
              <span className="dropdown-icon">
                <FeatureIcon type="settings" size={16} />
              </span>
              <span>Settings</span>
            </button>
            <button className="dropdown-item logout" onClick={onLogout}>
              <span className="dropdown-icon">
                <FeatureIcon type="logout" size={16} />
              </span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
