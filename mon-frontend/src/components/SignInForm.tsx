import "./SignInForm.css";

export default function SignInForm() {
  return (
    <div className="sign-in-form-container">
      <h2 className="sign-in-form-title">Sign In</h2>

      <label className="sign-in-form-label">
        Email
        <input
          type="email"
          placeholder="your.email@example.com"
          className="sign-in-form-input"
        />
      </label>

      <label className="sign-in-form-label">
        Password
        <input
          type="password"
          placeholder="********"
          className="sign-in-form-input"
        />
      </label>

      <button type="submit" className="sign-in-form-button">
        Sign In
      </button>
    </div>
  );
}
