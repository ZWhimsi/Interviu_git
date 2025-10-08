import "./Footer.css";

export default function Footer() {
  return (
    <footer className="simple-footer">
      <div className="footer-content">
        <a href="/" className="footer-brand">
          <img src="/logo.svg" alt="InterviU" className="footer-logo" />
          <span className="footer-brand-name">InterviU</span>
        </a>

        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} InterviU. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

