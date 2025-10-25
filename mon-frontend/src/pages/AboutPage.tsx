/**
 * About Page - Company Information
 *
 * Purpose: Tell company story, mission, values, team
 * Sections: Hero, Mission, Story, Team Highlights, Values Grid
 *
 * Architecture: PageHeader + Gradient Hero + Content sections + Footer
 * Dark Mode: NO (public page, always light)
 * Brand Colors: Hero gradient, benefit checkmarks violet (#5639FE)
 *
 * @module AboutPage
 */

import "./AboutPage.css";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import FeatureIcon from "../components/FeatureIcon";
import "../components/Footer.css";
import "../components/PageHeader.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      <PageHeader />
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About InterviU</h1>
          <p className="about-hero-subtitle">
            Empowering job seekers with AI-driven interview preparation
          </p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-mission">
          <div className="about-section-container">
            <h2>Our Mission</h2>
            <p>
              At InterviU, we believe everyone deserves the confidence and
              skills to ace their dream job interview. Our mission is to
              democratize access to professional interview coaching through
              cutting-edge AI technology.
            </p>
            <p>
              We're here to help thousands of candidates transform their
              interview performance and land positions at top companies
              worldwide.
            </p>
          </div>
        </section>

        <section className="about-story">
          <div className="about-section-container">
            <h2>Our Story</h2>
            <p>
              Founded in 2024, InterviU was born from a simple observation:
              traditional interview preparation is expensive, time-consuming,
              and often inaccessible to those who need it most.
            </p>
            <p>
              Our founder, experienced technologist who've conducted of
              interviews at leading tech companies, combined their expertise
              with advanced AI to create a platform that provides personalized,
              scalable interview coaching for everyone.
            </p>
            <p>
              What started as a project to help friends prepare for interviews
              has evolved into a comprehensive platform trusted by job seekers
              worldwide.
            </p>
          </div>
        </section>

        <section className="about-team">
          <div className="about-section-container">
            <h2>Built with Heart</h2>
            <p>
              Our team combines deep expertise in artificial intelligence,
              software engineering, and talent acquisition. We understand both
              sides of the interview table.
            </p>
            <div className="team-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">
                  <FeatureIcon type="check" size={16} />
                </span>
                <span>Expert team in AI and machine learning</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">
                  <FeatureIcon type="check" size={16} />
                </span>
                <span>Extensive experience in tech recruitment</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">
                  <FeatureIcon type="check" size={16} />
                </span>
                <span>Proven track record in interview coaching</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-values">
          <div className="about-section-container">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <FeatureIcon type="target" size={48} color="white" />
                </div>
                <h3>Excellence</h3>
                <p>
                  We strive for the highest quality in our AI models and user
                  experience.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <FeatureIcon type="handshake" size={48} color="white" />
                </div>
                <h3>Accessibility</h3>
                <p>
                  Professional interview coaching should be available to
                  everyone, everywhere.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <FeatureIcon type="rocket" size={48} color="white" />
                </div>
                <h3>Innovation</h3>
                <p>
                  We continuously improve our AI to provide the most effective
                  preparation tools.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <FeatureIcon type="podium" size={48} color="white" />
                </div>
                <h3>Empowerment</h3>
                <p>
                  We empower candidates with the skills and confidence to
                  succeed in any interview.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
