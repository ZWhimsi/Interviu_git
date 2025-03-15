import { useState, useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import "./Header.css";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [scrollDirection, setScrollDirection] = useState("none");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    // Set current path
    setCurrentPath(window.location.pathname);

    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop && st > 50) {
        // Scrolling down
        setScrollDirection("down");
      } else if (st < lastScrollTop || st <= 50) {
        // Scrolling up or at the top
        setScrollDirection("up");
      }
      setLastScrollTop(st <= 0 ? 0 : st);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  // Determine if we're on the sign-in page
  const isSignInPage = currentPath === "/signin";

  return (
    <header
      className={`header-container ${
        scrollDirection === "down" ? "scroll-down" : "scroll-up"
      }`}
    >
      <div className="header-toggle">
        <button
          onClick={toggleDarkMode}
          className="header-toggle-button"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div className="icon-container">
            {darkMode ? (
              /* === Night (Moon) icon === */
              <svg
                className="icon-switch visible"
                width="24"
                height="24"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="nightGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#5639FE" />
                    <stop offset="100%" stopColor="#66E8FD" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#nightGradient)"
                  d="M256,0C114.842,0,0,114.84,0,256s114.842,256,256,256s256-114.84,256-256S397.158,0,256,0z M49.548,256
                  c0-106.934,81.723-195.133,185.993-205.439c-19.463,14.46-36.933,31.648-51.623,51.048c-33.881,44.742-51.79,98.131-51.79,154.391
                  s17.908,109.649,51.788,154.391c14.691,19.4,32.16,36.588,51.623,51.048C131.272,451.133,49.548,362.934,49.548,256z
                  M322.05,451.617C239.038,423.553,181.677,344.181,181.677,256S239.038,88.447,322.05,60.385
                  C403.595,87.99,462.452,165.252,462.452,256S403.595,424.01,322.05,451.617z"
                />
              </svg>
            ) : (
              /* === Day (Sun) icon === */
              <svg
                className="icon-switch visible"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dayGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#5639FE" />
                    <stop offset="100%" stopColor="#66E8FD" />
                  </linearGradient>
                </defs>
                <g
                  stroke="url(#dayGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                >
                  <path d="M12 4V2M12 20V22M6.41421 6.41421L5 5M17.728 17.728L19.1422 19.1422M4 12H2M20 12H22M17.7285 6.41421L19.1427 5M6.4147 17.728L5.00049 19.1422" />
                  <circle cx="12" cy="12" r="5" />
                </g>
              </svg>
            )}
          </div>
        </button>
      </div>

      <a href="/" className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="lg1"
                x1="-17.75"
                y1="154.64"
                x2="50.31"
                y2="-3.62"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="var(--gradient-start)" />
                <stop offset="1" stopColor="var(--gradient-end)" />
              </linearGradient>
              <linearGradient
                id="lg2"
                x1="14.84"
                y1="168.66"
                x2="82.91"
                y2="10.4"
                xlinkHref="#lg1"
              />
              <style>{`
                .cls-1 { fill: url(#lg2); }
                .cls-2 { fill: url(#lg1); }
              `}</style>
            </defs>
            <g>
              <circle className="cls-2" cx="37.25" cy="26.74" r="26.74" />
              <path
                className="cls-1"
                d="M48.27,60.99l-7.47,11.78,11.49,41.86-15.04,15.04-15.04-15.04,11.49-41.86-7.47-11.78
                C9.24,66.24-2.33,83.27.4,101.93l9.58,65.48h54.55l9.58-65.48c2.73-18.67-8.84-35.69-25.84-40.95Z"
              />
            </g>
          </svg>
        </div>
        <span className="header-brand-name">InterviU</span>
      </a>

      {/* Conditional Sign In/Sign Up Button */}
      <a href={isSignInPage ? "/" : "/signin"} className="header-auth-button">
        {isSignInPage ? "Sign Up" : "Sign In"}
      </a>
    </header>
  );
}
