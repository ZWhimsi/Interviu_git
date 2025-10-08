/**
 * Privacy Policy Page - Legal Document
 *
 * Purpose: Display privacy policy (GDPR compliance)
 * Content: Data collection, usage, storage, user rights
 *
 * Architecture: PageHeader + Legal hero + Text content + Footer
 * Dark Mode: NO (public page)
 * CSS: Uses LegalPage.css (shared with Terms)
 *
 * @module PrivacyPage
 */

import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "../components/Footer.css";
import "../components/PageHeader.css";
import "./LegalPage.css";

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <PageHeader />
      <div className="legal-hero">
        <div className="legal-hero-content">
          <h1>Privacy Policy</h1>
          <p className="legal-hero-subtitle">Last updated: October 5, 2025</p>
        </div>
      </div>

      <div className="legal-content">
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li>Account information (name, email, password)</li>
            <li>Profile information (CV, work history, skills)</li>
            <li>Practice session recordings and transcripts</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our AI interview preparation services</li>
            <li>Analyze your performance and provide personalized feedback</li>
            <li>Send you updates and important service notifications</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Protection & GDPR Compliance</h2>
          <p>
            We are committed to protecting your data in accordance with GDPR and
            international data protection laws:
          </p>
          <ul>
            <li>
              <strong>Right to Access:</strong> You can request a copy of your
              personal data
            </li>
            <li>
              <strong>Right to Deletion:</strong> You can request deletion of
              your account and data
            </li>
            <li>
              <strong>Right to Portability:</strong> You can export your data in
              a structured format
            </li>
            <li>
              <strong>Data Security:</strong> We use industry-standard
              encryption (AES-256)
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with:</p>
          <ul>
            <li>Service providers who help us operate our platform</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2>5. Cookies & Tracking</h2>
          <p>
            We use essential cookies for platform functionality and analytics
            cookies (with your consent) to improve our services.
          </p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>
            For privacy-related questions, contact us at:{" "}
            <a href="mailto:contact@interviu.fr">contact@interviu.fr</a>
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}

