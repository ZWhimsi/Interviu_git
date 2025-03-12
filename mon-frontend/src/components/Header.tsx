import React from "react";
import { useDarkModeContext } from "../context/DarkModeContext";
import "./Header.css";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkModeContext();

  return (
    <header className="header-container">
      {/* Left: Dark/Light Mode Toggle */}
      <div className="header-toggle">
        <button onClick={toggleDarkMode} className="header-toggle-button">
          {darkMode ? "Light Mode" : "Night Mode"}
        </button>
      </div>

      {/* Center: Logo and Brand */}
      <div className="header-brand">
        <div className="header-logo" />
        <span className="header-brand-name">InterviU</span>
      </div>
    </header>
  );
}
