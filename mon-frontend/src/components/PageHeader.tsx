import "./PageHeader.css";

export default function PageHeader() {
  return (
    <header className="page-header-clean">
      <a href="/" className="brand-block">
        <img src="/logo.svg" alt="InterviU" />
        <span>InterviU</span>
      </a>
    </header>
  );
}

