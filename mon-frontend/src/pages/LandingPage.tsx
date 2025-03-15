import { useEffect } from "react";
import Header from "../signup_components/Header";
import Footer from "../signup_components/Footer";
import HeroSection from "../signup_components/HeroSection";
import "./LandingPage.css";

export default function LandingPage() {
  // Apply fade-in animations when the page loads
  useEffect(() => {
    document.body.classList.add("page-loaded");
    return () => {
      document.body.classList.remove("page-loaded");
    };
  }, []);

  return (
    <div className="landing-page-container">
      <Header />

      <main>
        <HeroSection />

        {/* Additional sections would go here */}
        {/* Features section, testimonials, pricing, etc. */}
      </main>

      <Footer />
    </div>
  );
}
