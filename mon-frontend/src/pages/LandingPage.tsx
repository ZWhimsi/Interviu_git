import Header from "../components/Header";
import VideoSection from "../components/VideoSection";
import SignInForm from "../components/SignInForm";
import SocialSignUpButtons from "../components/SocialSignUpButtons";
import Footer from "../components/Footer";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page-container">
      {/* Top Horizontal Box: Header */}
      <header className="landing-page-header">
        <Header />
      </header>

      {/* Middle Horizontal Box: split into two vertical sections */}
      <main className="landing-page-main">
        {/* Left vertical box: Video Section */}
        <section className="landing-page-video-section">
          <VideoSection />
        </section>

        {/* Right vertical box: SignIn Form & Social SignUp */}
        <aside className="landing-page-form-section">
          <div className="landing-page-form-container">
            <SignInForm />
            <SocialSignUpButtons />
          </div>
        </aside>
      </main>

      {/* Bottom Horizontal Box: Footer */}
      <footer className="landing-page-footer">
        <Footer />
      </footer>
    </div>
  );
}
