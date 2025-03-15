import "./SocialSignUpButtons.css";

export default function SocialSignUpButtons() {
  return (
    <div className="social-signup-buttons-container">
      <button className="social-signup-button">
        <span className="social-signup-button-text">Sign up with Google</span>
      </button>
      <button className="social-signup-button">
        <span className="social-signup-button-text">Sign up with Apple</span>
      </button>
      <button className="social-signup-button">
        <span className="social-signup-button-text">
          Sign up with Microsoft
        </span>
      </button>
    </div>
  );
}
