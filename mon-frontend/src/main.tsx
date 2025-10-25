import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent flash by applying dark mode class immediately
const storedDarkMode = localStorage.getItem("darkMode");
if (storedDarkMode === "true") {
  document.body.classList.add("dark-mode");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
