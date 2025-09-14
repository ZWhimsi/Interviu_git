import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  experience: string;
  field: string;
  cvPath: string;
  profilePicturePath: string;
  availableRoles: string[];
  currentRole: string;
  isProfileComplete: boolean;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    field: "",
    availableRoles: [] as string[],
  });

  // File upload state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.data);
          setFormData({
            name: data.data.name || "",
            experience: data.data.experience || "",
            field: data.data.field || "",
            availableRoles: data.data.availableRoles || [],
          });

          // If profile is already complete, redirect to dashboard
          if (data.data.isProfileComplete) {
            window.location.href = "/dashboard";
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      availableRoles: prev.availableRoles.includes(role)
        ? prev.availableRoles.filter((r) => r !== role)
        : [...prev.availableRoles, role],
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cv" | "profile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "cv") {
        setCvFile(file);
      } else {
        setProfilePicture(file);
      }
      // Auto upload the file
      await uploadFile(file, type);
    }
  };

  const uploadFile = async (file: File, type: "cv" | "profile") => {
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append(type, file);
      formData.append("fileType", type);

      const response = await fetch(`http://localhost:5000/api/upload/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`${type.toUpperCase()} uploaded successfully!`);
        // Reload profile data to get updated file paths without redirecting
        const token = localStorage.getItem("authToken");
        const profileResponse = await fetch(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfileData(profileData.data);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Failed to upload ${type}`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setError(`Failed to upload ${type}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.data);
        setSuccess("Profile updated successfully!");

        // If profile is now complete, redirect to dashboard
        if (data.data.isProfileComplete) {
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="logo-container">
            <img src="/logo.svg?v=2" alt="InterviU Logo" className="logo" />
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <h1>Complete Your Profile</h1>
          <p className="profile-subtitle">
            Help us understand your background to provide personalized features
          </p>

          {/* Error/Success Messages */}
          {error && <div className="profile-error">{error}</div>}
          {success && <div className="profile-success">{success}</div>}

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Your full name"
            />
          </div>

          {/* Experience Field */}
          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g., 5 years in software development"
            />
          </div>

          {/* Field Field */}
          <div className="form-group">
            <label htmlFor="field">Field</label>
            <input
              type="text"
              id="field"
              name="field"
              value={formData.field}
              onChange={handleInputChange}
              placeholder="e.g., Technology, Marketing, Finance"
            />
          </div>

          {/* CV Upload */}
          <div className="form-group">
            <label htmlFor="cv">
              CV <span className="required">*</span>
            </label>
            <div className="file-upload-area">
              <input
                type="file"
                id="cv"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, "cv")}
                className="file-input"
              />
              <div className="file-upload-content">
                <div className="file-upload-icon">📄</div>
                <p>Drop your CV here or click to browse</p>
                <span className="file-format">PDF only</span>
                {cvFile && (
                  <p className="selected-file">Selected: {cvFile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="profilePicture"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, "profile")}
                className="file-input"
              />
              <div className="file-upload-content">
                <div className="file-upload-icon">🖼️</div>
                <p>Drop your photo here or click to browse</p>
                <span className="file-format">PNG, JPG, JPEG</span>
                {profilePicture && (
                  <p className="selected-file">
                    Selected: {profilePicture.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label>
              Role <span className="required">*</span>
            </label>
            <div className="role-selection">
              <div
                className={`role-option ${
                  formData.availableRoles.includes("recruiter")
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleRoleToggle("recruiter")}
              >
                <input
                  type="checkbox"
                  checked={formData.availableRoles.includes("recruiter")}
                  onChange={() => handleRoleToggle("recruiter")}
                />
                <span>Recruiter</span>
              </div>
              <div
                className={`role-option ${
                  formData.availableRoles.includes("interviewer")
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleRoleToggle("interviewer")}
              >
                <input
                  type="checkbox"
                  checked={formData.availableRoles.includes("interviewer")}
                  onChange={() => handleRoleToggle("interviewer")}
                />
                <span>Interviewer</span>
              </div>
            </div>
            <p className="role-note">
              You can select both roles. This will determine the features
              available to you.
            </p>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={isSaving || formData.availableRoles.length === 0}
            >
              {isSaving ? "Saving..." : "Complete Profile"}
            </button>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
