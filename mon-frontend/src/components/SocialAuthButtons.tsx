import React from "react";
import "./SocialAuthButtons.css";

interface SocialAuthButtonsProps {
  mode: "signup" | "signin";
}

export default function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const handleGoogleAuth = () => {
    console.log(`Google ${mode}`);
    // Implement Google Auth logic
  };

  const handleAppleAuth = () => {
    console.log(`Apple ${mode}`);
    // Implement Apple Auth logic
  };

  const handleMicrosoftAuth = () => {
    console.log(`Microsoft ${mode}`);
    // Implement Microsoft Auth logic
  };

  const actionText = mode === "signup" ? "Sign up" : "Sign in";

  return (
    <div className="social-auth-buttons-container">
      <div className="social-auth-divider">or {actionText} with</div>

      <button
        className="social-auth-button auth-google"
        onClick={handleGoogleAuth}
        aria-label={`${actionText} with Google`}
      >
        <div className="social-auth-icon">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path
                fill="#4285F4"
                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
              />
              <path
                fill="#34A853"
                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
              />
              <path
                fill="#FBBC05"
                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
              />
              <path
                fill="#EA4335"
                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
              />
            </g>
          </svg>
        </div>
        <span className="social-auth-button-text">
          {actionText} with Google
        </span>
      </button>

      <button
        className="social-auth-button auth-apple"
        onClick={handleAppleAuth}
        aria-label={`${actionText} with Apple`}
      >
        <div className="social-auth-icon">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="appleGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5639FE" />
                <stop offset="100%" stopColor="#66E8FD" />
              </linearGradient>
            </defs>
            <path
              fill="url(#appleGradient)"
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"
            />
          </svg>
        </div>
        <span className="social-auth-button-text">{actionText} with Apple</span>
      </button>

      <button
        className="social-auth-button auth-microsoft"
        onClick={handleMicrosoftAuth}
        aria-label={`${actionText} with Microsoft`}
      >
        <div className="social-auth-icon">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="1" y="1" width="10" height="10" fill="#f25022" />
            <rect x="1" y="13" width="10" height="10" fill="#00a4ef" />
            <rect x="13" y="1" width="10" height="10" fill="#7fba00" />
            <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
          </svg>
        </div>
        <span className="social-auth-button-text">
          {actionText} with Microsoft
        </span>
      </button>
    </div>
  );
}
