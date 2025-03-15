import { useEffect, useState } from "react";
import "./Footer.css";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const footer = document.querySelector(".footer-container");
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= windowHeight) {
        setIsVisible(true);
      }
    };

    // Check initially and on scroll
    checkVisibility();
    window.addEventListener("scroll", checkVisibility);

    return () => window.removeEventListener("scroll", checkVisibility);
  }, []);

  return (
    <footer className={`footer-container ${isVisible ? "footer-fade-in" : ""}`}>
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient
                  id="footerLg1"
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
                  id="footerLg2"
                  x1="14.84"
                  y1="168.66"
                  x2="82.91"
                  y2="10.4"
                  xlinkHref="#footerLg1"
                />
                <style>{`
                  .cls-1 { fill: url(#footerLg2); }
                  .cls-2 { fill: url(#footerLg1); }
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
          <span className="footer-brand-name">InterviU</span>
        </div>

        <div className="footer-links">
          <a href="/about" className="footer-link hover-lift">
            About
          </a>
          <a href="/features" className="footer-link hover-lift">
            Features
          </a>
          <a href="/pricing" className="footer-link hover-lift">
            Pricing
          </a>
          <a href="/contact" className="footer-link hover-lift">
            Contact
          </a>
          <a href="/privacy" className="footer-link hover-lift">
            Privacy
          </a>
          <a href="/terms" className="footer-link hover-lift">
            Terms
          </a>
        </div>

        <div className="footer-copyright">
          © {new Date().getFullYear()} InterviU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
