import Header from "../components/Header";
import VideoSection from "../components/VideoSection";
import SignInForm from "../components/SignInForm";
import SocialSignUpButtons from "../components/SocialSignUpButtons";
import Footer from "../components/Footer";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <Header />
      </header>
      <main className="landing-page-main">
        <section className="landing-page-video-section">
          <VideoSection />
        </section>
        <aside className="landing-page-form-section">
          <div className="landing-page-form-container">
            <SignInForm />
            <SocialSignUpButtons />
          </div>
        </aside>
      </main>
      <footer className="landing-page-footer">
        <Footer />
      </footer>
    </div>
  );
}
