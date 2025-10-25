// src/App.tsx
import { useState, useEffect } from "react";
import { DarkModeProvider } from "./context/DarkModeContext";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInpage";
import SignUpPage from "./pages/SignUpPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import DashboardPage from "./pages/DashboardPage";
import CVAnalysisPage from "./pages/CVAnalysisPage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import "./App.css";

export default function App() {
  // Simple client-side routing
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle navigation and browser back/forward buttons
  useEffect(() => {
    // Force scroll to top on path change
    window.scrollTo(0, 0);

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    // Update page title based on current path
    const updatePageTitle = () => {
      let pageTitle = "InterviU - Ace Your Next Interview";

      switch (currentPath) {
        case "/signin":
          pageTitle = "Sign In | InterviU";
          break;
        case "/signup":
          pageTitle = "Sign Up | InterviU";
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
      case "/signup":
        return <SignUpPage />;
      case "/auth/callback":
        return <AuthCallbackPage />;
      case "/profile":
        return <ProfilePage />;
      case "/user-profile":
        return <UserProfilePage />;
      case "/dashboard":
        return <DashboardPage />;
      case "/cv-analysis":
        return <CVAnalysisPage />;
      case "/about":
        return <AboutPage />;
      case "/features":
        return <FeaturesPage />;
      case "/pricing":
        return <PricingPage />;
      case "/contact":
        return <ContactPage />;
      case "/privacy":
        return <PrivacyPage />;
      case "/terms":
        return <TermsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <DarkModeProvider>
      <AuthProvider>
        <div
          id="app-container"
          style={{ minHeight: "100vh", background: "inherit" }}
        >
          {renderPage()}
        </div>
      </AuthProvider>
    </DarkModeProvider>
  );
}
