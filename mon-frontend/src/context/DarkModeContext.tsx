import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { isPrivatePage } from "../config/privatePages";

interface DarkModeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export function DarkModeProvider({ children }: { children: ReactNode }) {
  // Get initial dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    // First check localStorage
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return savedMode === "true";
    }

    // Then check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return true;
    }

    // Default to light mode
    return false;
  });

  // Apply dark mode changes with immediate effect
  useEffect(() => {
    // Only apply dark mode on private pages
    if (!isPrivatePage()) {
      // Remove any dark mode classes on public pages
      document.body.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark-mode");
      return;
    }

    // Debug
    console.log("Dark mode state changed:", darkMode);

    // Immediately update without transition for instant feedback
    document.body.style.transition = "none";

    // Remove all transitions temporarily
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.transition = "none";
      }
    });

    // Apply class to body element ONLY (not html)
    // This way we can control which pages get dark mode
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.documentElement.style.backgroundColor = "#01091e";
      document.body.style.backgroundColor = "#01091e";
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.style.backgroundColor = "#f8fafc";
      document.body.style.backgroundColor = "#f8fafc";
    }

    // Save to localStorage
    localStorage.setItem("darkMode", String(darkMode));

    // Force multiple reflows to ensure immediate update
    void document.body.offsetHeight;
    void document.documentElement.offsetHeight;

    // Re-enable transitions after a brief delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.transition = "background-color 0.2s ease";
        // Re-enable transitions for all elements
        allElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.transition = "";
          }
        });
      });
    });
  }, [darkMode]);

  // Toggle function
  const toggleDarkMode = () => {
    console.log("Toggle dark mode called, current state:", darkMode);
    setDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
