import { useState, useEffect } from "react";
import VideoSection from "../signup_components/VideoSection";
import SignUpForm from "../signup_components/SignUpForm";
import SocialSignUpButtons from "../signup_components/SocialSignUpButtons";
import "./HeroSection.css";

export default function HeroSection() {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Once visible, stop observing
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    const section = document.querySelector(".hero-section");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section className={`hero-section ${isInView ? "fade-in" : ""}`}>
      <div className="hero-section-container">
        <div className="hero-section-content">
          <h1 className="hero-section-title">
            Ace Your Next Interview with Confidence
          </h1>
          <p className="hero-section-description">
            InterviU helps you prepare, practice, and perfect your interview
            skills with personalized AI coaching and real-time feedback.
          </p>
        </div>

        <div className="hero-section-columns">
          <div className="hero-section-video-column">
            <VideoSection />
          </div>
          <div className="hero-section-form-column">
            <SignUpForm />
            <div className="hero-section-social-buttons">
              <SocialSignUpButtons />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
