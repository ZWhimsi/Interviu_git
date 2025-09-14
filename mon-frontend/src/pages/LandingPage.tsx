import { useEffect, useState, useRef } from "react";
import "./LandingPage.css";
import logo from "../assets/react.svg";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const conversationScenarios = [
    {
      question: "Tell me about a challenging project you worked on...",
      response:
        "I led a team of 5 developers to build a real-time analytics dashboard that reduced data processing time by 60%. We used React, Node.js, and PostgreSQL...",
      feedback: [
        { icon: "✓", text: "Great structure!" },
        { icon: "+", text: "Add more metrics" },
      ],
    },
    {
      question: "How do you handle tight deadlines?",
      response:
        "I prioritize tasks using the Eisenhower matrix, communicate early with stakeholders about potential risks, and break large projects into smaller milestones...",
      feedback: [
        { icon: "✓", text: "Excellent approach!" },
        { icon: "+", text: "Mention specific tools" },
      ],
    },
    {
      question: "Describe a time you failed and what you learned.",
      response:
        "I once missed a critical bug in production. I immediately took responsibility, implemented a fix, and created automated testing to prevent similar issues...",
      feedback: [
        { icon: "✓", text: "Good accountability!" },
        { icon: "+", text: "Quantify the impact" },
      ],
    },
    {
      question: "Why do you want to work here?",
      response:
        "Your company's mission to democratize AI aligns with my passion for making technology accessible. I'm excited about the innovative projects and growth opportunities...",
      feedback: [
        { icon: "✓", text: "Shows research!" },
        { icon: "+", text: "Be more specific" },
      ],
    },
  ];

  useEffect(() => {
    // Select random scenario
    setSelectedScenario(
      Math.floor(Math.random() * conversationScenarios.length)
    );

    // Page load animation
    setIsLoaded(true);
    document.body.classList.add("page-loaded");

    // Scroll tracking for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll(
      ".feature-card, .testimonial-card, .cta-section"
    );
    elementsToObserve.forEach((el) => observer.observe(el));

    // Feature carousel auto-rotation
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearInterval(featureInterval);
      document.body.classList.remove("page-loaded");
    };
  }, [conversationScenarios.length]);

  const features = [
    {
      icon: "target",
      title: "AI-Powered Practice",
      description:
        "Get personalized interview questions based on your field and experience level.",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: "analytics",
      title: "Real-Time Feedback",
      description:
        "Receive instant feedback on your answers with detailed analysis and suggestions.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: "progress",
      title: "Track Progress",
      description:
        "Monitor your improvement with detailed analytics and performance metrics.",
      color: "from-orange-500 to-red-600",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content:
        "InterviU helped me land my dream job at Google. The AI feedback was incredibly detailed and actionable.",
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager at Amazon",
      content:
        "The practice sessions were so realistic, I felt completely prepared for my actual interviews.",
      avatar: "MJ",
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist at Microsoft",
      content:
        "I improved my interview skills by 80% in just 2 weeks. The progress tracking kept me motivated.",
      avatar: "ER",
    },
  ];

  return (
    <div className="landing-page-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      <main className="landing-main">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className={`hero-section ${isLoaded ? "loaded" : ""}`}
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
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
                  <span>Start Free Trial</span>
                  <div className="button-shine"></div>
                </a>
                <a href="/signin" className="cta-button secondary">
                  <span>Sign In</span>
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="interview-mockup">
                <div className="mockup-screen">
                  <div className="screen-content">
                    <div className="interview-interface">
                      <div className="question-bubble">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <p>
                          {conversationScenarios[selectedScenario].question}
                        </p>
                      </div>
                      <div className="response-area">
                        <div className="user-response">
                          <div className="response-avatar">U</div>
                          <div className="response-bubble">
                            <p className="response-text">
                              {conversationScenarios[selectedScenario].response}
                            </p>
                            <div className="response-typing">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                        <div className="feedback-panel">
                          {conversationScenarios[selectedScenario].feedback.map(
                            (item, index) => (
                              <div key={index} className="feedback-item">
                                <span className="feedback-icon">
                                  {item.icon}
                                </span>
                                <span>{item.text}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mockup-glow"></div>
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
                    <span className={`icon-${feature.icon}`}></span>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-glow"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="testimonials-section">
          <div className="testimonials-container">
            <div className="section-header">
              <h2 className="section-title">Success Stories</h2>
              <p className="section-description">
                Hear from professionals who transformed their careers with
                InterviU
              </p>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="quote-icon">"</div>
                    <p className="testimonial-text">{testimonial.content}</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">{testimonial.avatar}</div>
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="testimonial-glow"></div>
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
                  <span>Get Started Free</span>
                  <div className="button-shine"></div>
                </a>
                <a href="/signin" className="cta-button secondary large">
                  <span>Sign In</span>
                </a>
              </div>
            </div>
            <div className="cta-visual">
              <div className="success-animation">
                <div className="checkmark">
                  <div className="checkmark-circle"></div>
                  <div className="checkmark-stem"></div>
                  <div className="checkmark-kick"></div>
                </div>
                <div className="success-particles">
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
