import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

  // Apply dark mode changes
  useEffect(() => {
    // Debug
    console.log("Dark mode state changed:", darkMode);

    // Apply class to html element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage
    localStorage.setItem("darkMode", String(darkMode));

    // Apply transition class for smooth theme changes
    document.body.classList.add("theme-transition");
    const timer = setTimeout(() => {
      document.body.classList.remove("theme-transition");
    }, 400);

    return () => clearTimeout(timer);
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
