/**
 * Feature Icon Component
 *
 * Purpose: Reusable icon system with gradient support
 * Method: SVG-based with InterviU brand gradient
 *
 * Gradient: Violet (#5639FE) → Cyan (#66E8FD) → Bleu ciel (#5E91FE)
 *
 * @module FeatureIcon
 */

interface FeatureIconProps {
  type:
    | "target"
    | "document"
    | "chart"
    | "book"
    | "checkmark"
    | "alert"
    | "error"
    | "search"
    | "trophy"
    | "user"
    | "upload"
    | "rocket"
    | "email"
    | "settings"
    | "briefcase"
    | "home"
    | "logout"
    | "check"
    | "handshake"
    | "podium";
  size?: number;
  className?: string;
  color?: "gradient" | "white";
}

export default function FeatureIcon({
  type,
  size = 32,
  className = "",
  color = "gradient",
}: FeatureIconProps) {
  // Define all icon paths
  const iconPaths = {
    // Target icon - Practice Interview
    target: (
      <g>
        <circle cx="12" cy="12" r="10" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="6" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="2" />
      </g>
    ),

    // Document icon - CV Analysis
    document: (
      <g>
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          strokeWidth="2"
          fill="none"
        />
        <polyline points="14,2 14,8 20,8" strokeWidth="2" fill="none" />
        <line x1="12" y1="18" x2="12" y2="12" strokeWidth="2" />
        <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" />
      </g>
    ),

    // Chart icon - Progress and Analytics (growth bars)
    chart: (
      <g>
        <rect x="3" y="16" width="4" height="5" strokeWidth="2" fill="none" />
        <rect x="10" y="12" width="4" height="9" strokeWidth="2" fill="none" />
        <rect x="17" y="8" width="4" height="13" strokeWidth="2" fill="none" />
      </g>
    ),

    // Book icon - Learning Resources (open book with pages)
    book: (
      <g>
        <path
          d="M4 4.5v14a1.5 1.5 0 0 0 1.5 1.5h6.5v-13c0-1.5-1-3-3-3H4z"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 4.5v14a1.5 1.5 0 0 1-1.5 1.5H12v-13c0-1.5 1-3 3-3h5z"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="12"
          y1="7"
          x2="12"
          y2="20"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="8"
          x2="9"
          y2="8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="11"
          x2="9"
          y2="11"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="15"
          y1="8"
          x2="18"
          y2="8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="15"
          y1="11"
          x2="18"
          y2="11"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    ),

    // Checkmark - Success
    checkmark: (
      <g>
        <circle cx="12" cy="12" r="10" strokeWidth="2" fill="none" />
        <path
          d="M9 12l2 2 4-4"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ),

    // Alert - Warning
    alert: (
      <g>
        <path d="M12 2L2 22h20L12 2z" strokeWidth="2" fill="none" />
        <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
        <circle cx="12" cy="17" r="1" />
      </g>
    ),

    // Error - X mark
    error: (
      <g>
        <circle cx="12" cy="12" r="10" strokeWidth="2" fill="none" />
        <line
          x1="15"
          y1="9"
          x2="9"
          y2="15"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="9"
          y1="9"
          x2="15"
          y2="15"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    ),

    // Search - Magnifying glass
    search: (
      <g>
        <circle cx="11" cy="11" r="8" strokeWidth="2" fill="none" />
        <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),

    // Trophy - Achievement (simplified)
    trophy: (
      <g>
        <path
          d="M8 2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2M16 2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 2h8v9a4 4 0 0 1-8 0V2z"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15v7M8 22h8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ),

    // User - Profile
    user: (
      <g>
        <circle cx="12" cy="8" r="5" strokeWidth="2" fill="none" />
        <path d="M20 21a8 8 0 1 0-16 0" strokeWidth="2" fill="none" />
      </g>
    ),

    // Upload - File upload
    upload: (
      <g>
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          strokeWidth="2"
          fill="none"
        />
        <polyline points="17,8 12,3 7,8" strokeWidth="2" fill="none" />
        <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" />
      </g>
    ),

    // Rocket - Launch
    rocket: (
      <g>
        <path
          d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
          strokeWidth="2"
          fill="none"
        />
      </g>
    ),

    // Email - Contact
    email: (
      <g>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          strokeWidth="2"
          fill="none"
        />
        <path d="M3 7l9 6 9-6" strokeWidth="2" fill="none" />
      </g>
    ),

    // Settings - Gear
    settings: (
      <g>
        <circle cx="12" cy="12" r="3" strokeWidth="2" fill="none" />
        <path
          d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    ),

    // Briefcase - Work/Interview
    briefcase: (
      <g>
        <rect
          x="4"
          y="8"
          width="16"
          height="12"
          rx="2"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          strokeWidth="2"
          fill="none"
        />
        <path d="M12 12v4" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),

    // Home - Dashboard
    home: (
      <g>
        <path
          d="M3 12l9-9 9 9"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 10v10a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V10"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ),

    // Logout - Exit door
    logout: (
      <g>
        <path
          d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="16,17 21,12 16,7"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="21"
          y1="12"
          x2="9"
          y2="12"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ),

    // Simple check mark (no circle)
    check: (
      <g>
        <polyline
          points="4,12 10,18 20,6"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ),

    // Handshake - Collaboration and accessibility (two people icon)
    handshake: (
      <g>
        <circle cx="8" cy="7" r="3" strokeWidth="2" fill="none" />
        <path
          d="M2 21v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="16" cy="7" r="3" strokeWidth="2" fill="none" />
        <path
          d="M22 21v-4a4 4 0 0 0-4-4h-4"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    ),

    // Podium - Empowerment and achievement (simple version)
    podium: (
      <g>
        <rect x="9" y="6" width="6" height="14" strokeWidth="2" fill="none" />
        <rect x="2" y="12" width="6" height="8" strokeWidth="2" fill="none" />
        <rect x="16" y="10" width="6" height="10" strokeWidth="2" fill="none" />
        <line
          x1="1"
          y1="20"
          x2="23"
          y2="20"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    ),
  };

  const strokeColor =
    color === "white" ? "white" : `url(#iconGradient-${type})`;
  const fillColor = color === "white" ? "white" : `url(#iconGradient-${type})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {color === "gradient" && (
        <defs>
          <linearGradient
            id={`iconGradient-${type}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#5639FE" />
            <stop offset="50%" stopColor="#66E8FD" />
            <stop offset="100%" stopColor="#5E91FE" />
          </linearGradient>
        </defs>
      )}
      <g stroke={strokeColor} fill={fillColor}>
        {iconPaths[type]}
      </g>
    </svg>
  );
}
