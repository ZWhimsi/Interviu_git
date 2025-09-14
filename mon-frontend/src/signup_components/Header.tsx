import { useState, useEffect } from "react";
import "./Header.css";

export default function Header() {
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

  // Determine if we're on the sign-in or sign-up page
  const isSignInPage = currentPath === "/signin";
  const isSignUpPage = currentPath === "/signup";

  return (
    <header
      className={`header-container ${
        scrollDirection === "down" ? "scroll-down" : "scroll-up"
      }`}
    >
      <a href="/" className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 84 180" xmlns="http://www.w3.org/2000/svg">
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
      </a>

      {/* Conditional Sign In/Sign Up Button */}
      <a
        href={isSignInPage ? "/signup" : isSignUpPage ? "/signin" : "/signin"}
        className="header-auth-button"
      >
        {isSignInPage ? "Sign Up" : isSignUpPage ? "Sign In" : "Sign In"}
      </a>
    </header>
  );
}
