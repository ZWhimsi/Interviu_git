/**
 * Landing Page - Public Marketing Page
 *
 * Purpose: First impression, showcase features, drive signups
 * Sections: Hero, Animated Chat Demo, Features Grid (Candidate/Recruiter toggle)
 *
 * Key Features:
 *   - Animated chat simulation showing CV analysis
 *   - Role toggle (Candidate vs Recruiter) with different features
 *   - 8 animated icons for features
 *   - CTA buttons to Sign Up
 *
 * Architecture: Full-width sections, Footer
 * Dark Mode: NO (always light)
 * Brand Colors: Gradient (#5639FE → #66E8FD → #5E91FE)
 *
 * @module LandingPage
 */

import { useEffect, useState, useRef } from "react";
import "./LandingPage.css";
import Footer from "../components/Footer";
import FeatureIcon from "../components/FeatureIcon";
import "../components/Footer.css";
const logo = "/logo.svg";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [userType, setUserType] = useState<"candidate" | "recruiter">(
    "candidate"
  );
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [chatPhase, setChatPhase] = useState<
    | "bot-typing"
    | "bot-question"
    | "user-typing"
    | "user-response"
    | "analysis"
    | "feedback-typing"
    | "feedback"
    | "bot-improvement-typing"
    | "bot-improvement"
  >("bot-typing");
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const phaseIndexRef = useRef(0);
  const scenarioIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const conversationScenarios = [
    {
      question: "Tell me about a challenging project you worked on...",
      response:
        "I led a team of 5 developers to build a real-time analytics dashboard that reduced data processing time by 60%. We used React, Node.js, and PostgreSQL...",
      responseSegments: [
        { text: "I led a team of 5 developers", rating: "good" },
        { text: " to build a ", rating: "neutral" },
        { text: "real-time analytics dashboard", rating: "good" },
        { text: " that ", rating: "neutral" },
        { text: "reduced data processing time by 60%", rating: "good" },
        { text: ". We used React, Node.js, and PostgreSQL", rating: "bad" },
        { text: "...", rating: "neutral" },
      ],
      botImprovedResponse:
        "I led a cross-functional team of 5 developers to architect and deploy a real-time analytics dashboard that reduced data processing time by 60%, improving user experience and saving $50K annually. I personally designed the React frontend, optimized the Node.js API layer, and implemented PostgreSQL query optimization, resulting in 3x faster load times.",
      feedback: [
        { icon: "check", text: "Great structure!" },
        { icon: "+", text: "Add more metrics" },
      ],
    },
    {
      question: "How do you handle tight deadlines?",
      response:
        "I prioritize tasks using the Eisenhower matrix, communicate early with stakeholders about potential risks, and break large projects into smaller milestones...",
      responseSegments: [
        {
          text: "I prioritize tasks using the Eisenhower matrix",
          rating: "good",
        },
        { text: ", ", rating: "neutral" },
        { text: "communicate early with stakeholders", rating: "good" },
        {
          text: " about potential risks, and break large projects into ",
          rating: "neutral",
        },
        { text: "smaller milestones", rating: "good" },
        { text: "...", rating: "bad" },
      ],
      botImprovedResponse:
        "I prioritize tasks using the Eisenhower matrix and Agile methodologies, maintaining daily standups to communicate progress. When I led a Q4 product launch with a compressed timeline, I broke it into 2-week sprints, identified risks early, and delivered 2 days ahead of schedule with zero critical bugs. I use Jira for tracking and Slack for real-time stakeholder updates.",
      feedback: [
        { icon: "check", text: "Excellent approach!" },
        { icon: "+", text: "Mention specific tools" },
      ],
    },
    {
      question: "Describe a time you failed and what you learned.",
      response:
        "I once missed a critical bug in production. I immediately took responsibility, implemented a fix, and created automated testing to prevent similar issues...",
      responseSegments: [
        { text: "I once missed a critical bug in production", rating: "good" },
        { text: ". I immediately ", rating: "neutral" },
        { text: "took responsibility", rating: "good" },
        { text: ", ", rating: "neutral" },
        { text: "implemented a fix", rating: "bad" },
        { text: ", and ", rating: "neutral" },
        { text: "created automated testing", rating: "good" },
        { text: " to prevent similar issues...", rating: "neutral" },
      ],
      botImprovedResponse:
        "In Q2 2023, I deployed a payment feature with a critical rounding bug that affected 1,200 transactions totaling $3,400. Within 2 hours, I took full ownership, coordinated with our finance team to issue refunds, and implemented a hotfix. I then built a comprehensive E2E test suite covering edge cases and introduced mandatory code reviews for payment logic, reducing production bugs by 85% over the next 6 months.",
      feedback: [
        { icon: "check", text: "Good accountability!" },
        { icon: "+", text: "Quantify the impact" },
      ],
    },
    {
      question: "Why do you want to work here?",
      response:
        "Your company's mission to democratize AI aligns with my passion for making technology accessible. I'm excited about the innovative projects and growth opportunities...",
      responseSegments: [
        { text: "Your company's mission to democratize AI", rating: "good" },
        { text: " aligns with my passion for ", rating: "neutral" },
        { text: "making technology accessible", rating: "good" },
        { text: ". I'm excited about the ", rating: "neutral" },
        { text: "innovative projects and growth opportunities", rating: "bad" },
        { text: "...", rating: "bad" },
      ],
      botImprovedResponse:
        "I'm specifically drawn to your company because of your work on the GPT-4 integration for accessibility features, which I've followed since your TechCrunch article in March. Having built an open-source screen reader that serves 50K users, I'm excited to contribute to your mission of democratizing AI. I'm particularly interested in your upcoming project on multilingual support mentioned in your Q3 roadmap, where my experience with i18n frameworks could add immediate value.",
      feedback: [
        { icon: "check", text: "Shows research!" },
        { icon: "+", text: "Be more specific" },
      ],
    },
  ];

  useEffect(() => {
    // Force scroll to top on page load
    window.scrollTo(0, 0);

    // Select random scenario
    setSelectedScenario(
      Math.floor(Math.random() * conversationScenarios.length)
    );

    // Page load animation
    setIsLoaded(true);
    document.body.classList.add("page-loaded");

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    setTimeout(() => {
      const elementsToObserve = document.querySelectorAll(
        ".feature-card, .cta-section, .section-header"
      );
      elementsToObserve.forEach((el) => observer.observe(el));
    }, 500);

    // Feature carousel auto-rotation
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);

    // Chat conversation sequence timing
    const chatSequence = [
      { phase: "bot-typing", duration: 1200 },
      { phase: "bot-question", duration: 3500 },
      { phase: "user-typing", duration: 2000 },
      { phase: "user-response", duration: 3000 },
      { phase: "analysis", duration: 4000 },
      { phase: "feedback-typing", duration: 1000 },
      { phase: "feedback", duration: 2500 },
      { phase: "bot-improvement-typing", duration: 1500 },
      { phase: "bot-improvement", duration: 12000 },
    ];

    phaseIndexRef.current = 0;
    scenarioIndexRef.current = selectedScenario;

    const advanceChatPhase = () => {
      const currentPhaseData = chatSequence[phaseIndexRef.current];
      setChatPhase(currentPhaseData.phase as typeof chatPhase);

      console.log(
        `Phase: ${currentPhaseData.phase}, Duration: ${
          currentPhaseData.duration
        }ms, Time: ${new Date().toLocaleTimeString()}`
      );

      // Schedule next phase BEFORE incrementing
      const nextPhaseIndex = phaseIndexRef.current + 1;

      if (nextPhaseIndex >= chatSequence.length) {
        // This is the last phase, after its duration, move to next scenario
        timerRef.current = setTimeout(() => {
          console.log("Scenario complete, waiting 3s before next...");
          phaseIndexRef.current = 0;
          scenarioIndexRef.current =
            (scenarioIndexRef.current + 1) % conversationScenarios.length;
          setSelectedScenario(scenarioIndexRef.current);

          // Wait 3s then start next scenario
          timerRef.current = setTimeout(advanceChatPhase, 3000);
        }, currentPhaseData.duration);
      } else {
        // More phases in this scenario, schedule next one
        timerRef.current = setTimeout(() => {
          phaseIndexRef.current = nextPhaseIndex;
          advanceChatPhase();
        }, currentPhaseData.duration);
      }
    };

    // Start chat sequence after a short delay
    initialTimerRef.current = setTimeout(() => {
      advanceChatPhase();
    }, 1500);

    return () => {
      observer.disconnect();
      clearInterval(featureInterval);
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      document.body.classList.remove("page-loaded");
    };
  }, []);

  const candidateFeatures = [
    {
      icon: "cv",
      title: "CV Similarity Score",
      description:
        "Advanced AI analyzes your CV against job descriptions and calculates a precise compatibility score to maximize your chances.",
    },
    {
      icon: "voice",
      title: "Real-Time Voice Interviews",
      description:
        "Practice with AI-powered voice interviews that simulate real conversations and provide instant feedback on your delivery.",
    },
    {
      icon: "ai",
      title: "AI-Powered Gap Analysis",
      description:
        "Our trained AI identifies your skill gaps and enhances your strengths, tailoring preparation to each specific job offer.",
    },
    {
      icon: "library",
      title: "Unlimited Question Library",
      description:
        "Access unlimited interview questions, comprehensive courses, open-ended scenarios with detailed answers and expert reviews.",
    },
  ];

  const recruiterFeatures = [
    {
      icon: "funnel",
      title: "AI-Powered Candidate Screening",
      description:
        "Automate initial candidate screening with our AI that evaluates responses, skills, and cultural fit. Save time while maintaining quality standards in your hiring process.",
    },
    {
      icon: "video",
      title: "Interview Templates & Scorecards",
      description:
        "Create customized interview templates and scoring rubrics for consistent candidate evaluation. Standardize your hiring process across teams and roles.",
    },
    {
      icon: "analytics",
      title: "Candidate Analytics Dashboard",
      description:
        "Track candidate performance, compare results, and make data-driven hiring decisions. Comprehensive analytics help you identify top talent quickly.",
    },
    {
      icon: "schedule",
      title: "Bulk Candidate Management",
      description:
        "Efficiently manage large applicant pools with automated scheduling, bulk invitations, and progress tracking. Scale your recruitment process effortlessly.",
    },
  ];

  const features =
    userType === "candidate" ? candidateFeatures : recruiterFeatures;

  return (
    <div className="landing-page-container">
      <main className="landing-main">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className={`hero-section ${isLoaded ? "loaded" : ""}`}
        >
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-logo">
                <img src={logo} alt="InterviU" className="logo-image" />
              </div>
              <h1 className="hero-title">
                <span className="title-line">Ace Your Next</span>
                <span className="title-line highlight">InterviU</span>
                <span className="title-line">with Confidence</span>
              </h1>
              <p className="hero-description">
                Master interview skills with AI-powered practice sessions,
                real-time feedback, and personalized coaching. Join thousands of
                successful candidates who landed their dream jobs.
              </p>
              <div className="hero-buttons">
                <a href="/signup" className="cta-button primary">
                  Start Free Trial
                </a>
                <a href="/signin" className="cta-button secondary">
                  Sign In
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="interview-mockup">
                <div className="mockup-screen">
                  <div className="screen-content">
                    <div className="interview-interface">
                      {/* Bot Question - Always show after typing phase */}
                      {!["bot-typing"].includes(chatPhase) && (
                        <div className="bot-question-container">
                          <div className="bot-avatar">
                            <img
                              src={logo}
                              alt="AI"
                              className="bot-avatar-img"
                            />
                          </div>
                          <div className="question-bubble">
                            {chatPhase === "bot-question" && (
                              <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            )}
                            {chatPhase !== "bot-question" && (
                              <p>
                                {
                                  conversationScenarios[selectedScenario]
                                    .question
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* User Response - Show after user starts typing */}
                      {[
                        "user-typing",
                        "user-response",
                        "analysis",
                        "feedback-typing",
                        "feedback",
                      ].includes(chatPhase) && (
                        <div className="user-response-container">
                          <div className="response-avatar">You</div>
                          <div className="response-bubble">
                            {chatPhase === "user-typing" && (
                              <div className="response-typing">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            )}
                            {chatPhase === "user-response" && (
                              <p className="response-text">
                                {
                                  conversationScenarios[selectedScenario]
                                    .response
                                }
                              </p>
                            )}
                            {[
                              "analysis",
                              "feedback-typing",
                              "feedback",
                            ].includes(chatPhase) &&
                              conversationScenarios[selectedScenario]
                                .responseSegments && (
                                <p className="response-text">
                                  {conversationScenarios[
                                    selectedScenario
                                  ].responseSegments?.map(
                                    (
                                      segment: { text: string; rating: string },
                                      idx: number
                                    ) => (
                                      <span
                                        key={idx}
                                        className={`text-segment segment-${segment.rating}`}
                                      >
                                        {segment.text}
                                      </span>
                                    )
                                  )}
                                </p>
                              )}
                          </div>
                        </div>
                      )}

                      {/* Analysis Feedback */}
                      {["feedback-typing", "feedback"].includes(chatPhase) && (
                        <div className="feedback-badges">
                          {chatPhase === "feedback-typing" && (
                            <div className="feedback-typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          )}
                          {chatPhase === "feedback" &&
                            conversationScenarios[
                              selectedScenario
                            ].feedback.map((item, index) => (
                              <div key={index} className="feedback-badge">
                                <span className="feedback-icon">
                                  {item.icon === "check" ? (
                                    <FeatureIcon type="check" size={16} />
                                  ) : (
                                    <span>+</span>
                                  )}
                                </span>
                                <span>{item.text}</span>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Bot Improved Response */}
                      {["bot-improvement-typing", "bot-improvement"].includes(
                        chatPhase
                      ) && (
                        <div className="bot-improvement-container">
                          <div className="bot-avatar">
                            <img
                              src={logo}
                              alt="AI"
                              className="bot-avatar-img"
                            />
                          </div>
                          <div className="bot-improvement-bubble">
                            {chatPhase === "bot-improvement-typing" && (
                              <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            )}
                            {chatPhase === "bot-improvement" &&
                              conversationScenarios[selectedScenario]
                                .botImprovedResponse && (
                                <>
                                  <div className="improvement-label">
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                      }}
                                    >
                                      <FeatureIcon type="alert" size={20} />
                                      <span>Improved Answer:</span>
                                    </span>
                                  </div>
                                  <p className="improvement-text">
                                    {
                                      conversationScenarios[selectedScenario]
                                        .botImprovedResponse
                                    }
                                  </p>
                                </>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="features-section">
          <div className="features-container">
            <div className="section-header">
              <h2 className="section-title">Why Choose InterviU?</h2>
              <p className="section-description">
                Experience the future of interview preparation with cutting-edge
                AI technology
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

            <div className="features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`feature-card ${
                    activeFeature === index ? "active" : ""
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="feature-icon">
                    <span className={`icon-${feature.icon}`}>
                      {feature.icon === "voice" && (
                        <span className="voice-bar-3"></span>
                      )}
                    </span>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-glow"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Ace Your Next InterviU?</h2>
              <p className="cta-description">
                Join thousands of successful candidates and start your journey
                to interview mastery today.
              </p>
              <div className="cta-buttons">
                <a href="/signup" className="cta-button primary large">
                  Get Started Free
                </a>
                <a href="/signin" className="cta-button secondary large">
                  Sign In
                </a>
              </div>
            </div>
            <div className="cta-visual">
              <div className="cta-logo-container">
                <img src={logo} alt="InterviU" className="cta-logo" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
