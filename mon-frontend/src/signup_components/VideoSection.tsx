import { useState, useEffect } from "react";
import "./VideoSection.css";

export default function VideoSection() {
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
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    const section = document.querySelector(".video-section-container");
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
    <div className={`video-section-container ${isInView ? "fade-in" : ""}`}>
      <h2 className="video-section-title">See How It Works</h2>
      <p className="video-section-description">
        Watch our quick demo to learn how InterviU helps you ace your next
        interview.
      </p>

      <div className="video-section-video-wrapper hover-lift">
        <div className="video-play-overlay">
          <div className="play-button">
            <div className="play-icon"></div>
          </div>
        </div>
        <div className="video-duration">2:45</div>
        <video
          className="video-section-video"
          controls
          poster="/api/placeholder/800/450"
          aria-label="Demo video showing how InterviU works"
        >
          <source src="your-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <button className="video-section-button hover-lift">
        Try it free for 14 days
      </button>
    </div>
  );
}
