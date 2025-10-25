/**
 * Terms of Service Page - Legal Document
 *
 * Purpose: Display terms of service (legal protection)
 * Content: Service usage rules, limitations, liability
 *
 * Architecture: PageHeader + Legal hero + Text content + Footer
 * Dark Mode: NO (public page)
 * CSS: Uses LegalPage.css (shared with Privacy)
 *
 * @module TermsPage
 */

import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "../components/Footer.css";
import "../components/PageHeader.css";
import "./LegalPage.css";

export default function TermsPage() {
  return (
    <div className="legal-page">
      <PageHeader />
      <div className="legal-hero">
        <div className="legal-hero-content">
          <h1>Terms of Service</h1>
          <p className="legal-hero-subtitle">Last updated: October 5, 2025</p>
        </div>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using InterviU, you accept and agree to be bound by
            these Terms of Service. If you do not agree, please do not use our
            services.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. User Accounts</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use our services for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt our services</li>
            <li>Share your account with others</li>
            <li>Scrape or collect data from our platform without permission</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Intellectual Property</h2>
          <p>
            All content, features, and functionality of InterviU are owned by us
            and protected by international copyright, trademark, and other
            intellectual property laws.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Subscription & Payment</h2>
          <ul>
            <li>Subscriptions renew automatically unless cancelled</li>
            <li>Refunds are provided within 30 days of initial purchase</li>
            <li>We reserve the right to change pricing with 30 days notice</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Limitation of Liability</h2>
          <p>
            InterviU is provided "as is" without warranties. We are not liable
            for any indirect, incidental, or consequential damages arising from
            your use of our services.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our services
            immediately, without prior notice, for conduct that violates these
            Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Continued use of InterviU
            after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Contact</h2>
          <p>
            For questions about these Terms, contact us at:{" "}
            <a href="mailto:contact@interviu.fr">contact@interviu.fr</a>
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
