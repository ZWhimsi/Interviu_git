// src/App.tsx
import { useState, useEffect } from "react";
import { DarkModeProvider } from "./context/DarkModeContext";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInpage";
import "./App.css";

export default function App() {
  // Simple client-side routing
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle navigation and browser back/forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Update page title based on current path
    const updatePageTitle = () => {
      let pageTitle = "InterviU - Ace Your Next Interview";

      switch (currentPath) {
        case "/signin":
          pageTitle = "Sign In | InterviU";
          break;
        default:
          pageTitle = "InterviU - Ace Your Next Interview";
      }

      document.title = pageTitle;
    };

    // Call updatePageTitle immediately and on path change
    updatePageTitle();

    // Listen for popstate events (browser back/forward)
    window.addEventListener("popstate", handleLocationChange);

    // Custom navigation function for internal links
    const handleNavigation = (event: MouseEvent) => {
      // Only handle clicks on anchor tags
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.hasAttribute("target") &&
        anchor.getAttribute("href") !== "#"
      ) {
        event.preventDefault();
        const url = new URL(anchor.href);
        const newPath = url.pathname;

        // Update URL without full page reload
        window.history.pushState({}, "", newPath);
        setCurrentPath(newPath);

        // Scroll to top on navigation
        window.scrollTo(0, 0);
      }
    };

    // Add click event listener for navigation
    document.addEventListener("click", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("click", handleNavigation);
    };
  }, [currentPath]);

  // Simple routing logic
  const renderPage = () => {
    switch (currentPath) {
      case "/signin":
        return <SignInPage />;
      default:
        return <LandingPage />;
    }
  };

  return <DarkModeProvider>{renderPage()}</DarkModeProvider>;
}
