/**
 * Features Page - Detailed Product Features
 *
 * Purpose: Showcase detailed features by user role
 * Toggle: Candidate vs Recruiter (different feature sets)
 *
 * Each Feature: Title, Description, Benefits list (with checkmarks)
 * Special: "Coming Soon" section for 1-on-1 Expert Coaching
 *
 * Architecture: PageHeader + Hero + Toggle + Feature cards + Footer
 * Dark Mode: NO (public page, always light)
 * CSS: Inherits from AboutPage.css + own overrides
 *
 * @module FeaturesPage
 */

import { useState } from "react";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "../components/Footer.css";
import "../components/PageHeader.css";
import "./FeaturesPage.css";

export default function FeaturesPage() {
  const [userType, setUserType] = useState<"candidate" | "recruiter">(
    "candidate"
  );

  const candidateFeatures = [
    {
      title: "CV Similarity Score",
      description:
        "Advanced AI analyzes your CV against job descriptions using natural language processing and machine learning algorithms. Get instant compatibility scores with detailed breakdowns of matching skills, keywords, and experience levels to optimize your application.",
      benefits: [
        "Instant compatibility analysis with any job posting",
        "Keyword optimization suggestions for ATS systems",
        "Skills gap identification and recommendations",
        "Industry-specific matching algorithms",
      ],
    },
    {
      title: "Real-Time Voice Interviews",
      description:
        "Practice with our AI interviewer that conducts realistic voice conversations. Receive immediate feedback on your tone, pace, pronunciation, filler words, and content quality to perfect your delivery.",
      benefits: [
        "Natural conversation flow with adaptive questions",
        "Voice quality and tone analysis",
        "Real-time pronunciation coaching",
        "Confidence building through repeated practice",
      ],
    },
    {
      title: "AI-Powered Gap Analysis",
      description:
        "Our intelligent system identifies your skill gaps and creates personalized learning paths. The AI analyzes your responses, compares them to industry standards, and provides targeted recommendations to enhance your strengths for each specific job opportunity.",
      benefits: [
        "Comprehensive skill assessments",
        "Personalized improvement roadmaps",
        "Strength amplification strategies",
        "Job-specific preparation plans",
      ],
    },
    {
      title: "Unlimited Question Library",
      description:
        "Access our extensive collection of interview questions across all industries, roles, and seniority levels. Each question includes expert-crafted answers, evaluation criteria, and detailed feedback to help you master any interview scenario.",
      benefits: [
        "Extensive curated question database",
        "Industry-specific question sets",
        "Expert answer examples and frameworks",
        "Behavioral and technical questions covered",
      ],
    },
  ];

  const recruiterFeatures = [
    {
      title: "AI-Powered Candidate Screening",
      description:
        "Automate initial candidate screening with our AI that evaluates responses, skills, and cultural fit. Save time while maintaining quality standards in your hiring process.",
      benefits: [
        "Automated first-round screening",
        "Skill and competency assessment",
        "Cultural fit analysis",
        "Bias-free evaluation process",
      ],
    },
    {
      title: "Interview Templates & Scorecards",
      description:
        "Create customized interview templates and scoring rubrics for consistent candidate evaluation. Standardize your hiring process across teams and roles.",
      benefits: [
        "Customizable interview frameworks",
        "Standardized scoring systems",
        "Team collaboration tools",
        "Role-specific question sets",
      ],
    },
    {
      title: "Candidate Analytics Dashboard",
      description:
        "Track candidate performance, compare results, and make data-driven hiring decisions. Comprehensive analytics help you identify top talent quickly.",
      benefits: [
        "Performance comparison tools",
        "Skills heatmaps and visualizations",
        "Interview recording and replay",
        "Collaborative team reviews",
      ],
    },
    {
      title: "Bulk Candidate Management",
      description:
        "Efficiently manage large applicant pools with automated scheduling, bulk invitations, and progress tracking. Scale your recruitment process effortlessly.",
      benefits: [
        "Automated interview scheduling",
        "Bulk candidate invitations",
        "Pipeline progress tracking",
        "Integration with ATS systems",
      ],
    },
  ];

  const features =
    userType === "candidate" ? candidateFeatures : recruiterFeatures;

  return (
    <div className="about-page">
      <PageHeader />
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>Features</h1>
          <p className="about-hero-subtitle">
            Everything you need to master your next interview
          </p>

          <div className="user-type-toggle">
            <button
              className={`toggle-btn ${
                userType === "candidate" ? "active" : ""
              }`}
              onClick={() => setUserType("candidate")}
            >
              For Candidates
            </button>
            <button
              className={`toggle-btn ${
                userType === "recruiter" ? "active" : ""
              }`}
              onClick={() => setUserType("recruiter")}
            >
              For Recruiters
            </button>
          </div>
        </div>
      </div>

      <div className="about-content">
        {features.map((feature, index) => (
          <section key={index} className="about-section-container">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
            <div className="feature-benefits">
              {feature.benefits.map((benefit, idx) => (
                <div key={idx} className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="coming-soon-section">
          <div className="about-section-container">
            <h2>Coming Soon: Interview with Real Experts</h2>
            <p>
              Connect with professional interviewers from top companies for
              personalized coaching sessions. Get real-world insights and
              feedback from people who conduct interviews at leading
              organizations.
            </p>
            <div className="coming-soon-card">
              <div className="coming-soon-icon">🎓</div>
              <h3>1-on-1 Expert Coaching</h3>
              <p>
                Book sessions with experienced interviewers from Google, Amazon,
                Microsoft, and other top companies. Practice with the people who
                actually make hiring decisions.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

