import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./UserProfilePage.css";

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

export default function UserProfilePage() {
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
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

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

  const handleFileChange = (
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
    }
  };

  const uploadFile = async (file: File, type: "cv" | "profile") => {
    setUploadingFile(type);
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
        // Reload profile data to get updated file paths
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Failed to upload ${type}`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setError(`Failed to upload ${type}`);
    } finally {
      setUploadingFile(null);
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
      <div className="user-profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="logo-container">
            <img src="/logo.svg" alt="InterviU Logo" className="logo" />
          </div>
          <div className="profile-actions">
            <button
              className="dashboard-button"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Dashboard
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-picture-section">
              {profileData?.profilePicturePath ? (
                <img
                  src={`http://localhost:5000/api/upload/profile/${profileData.profilePicturePath}`}
                  alt="Profile"
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <span>👤</span>
                </div>
              )}
              <div className="file-upload-area small">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => handleFileChange(e, "profile")}
                  className="file-input"
                />
                <div className="file-upload-content">
                  <span>📷</span>
                  <p>Change Photo</p>
                </div>
              </div>
              {profilePicture && (
                <button
                  className="upload-button"
                  onClick={() => uploadFile(profilePicture, "profile")}
                  disabled={uploadingFile === "profile"}
                >
                  {uploadingFile === "profile"
                    ? "Uploading..."
                    : "Upload Photo"}
                </button>
              )}
            </div>

            <div className="profile-info">
              <h3>{profileData?.name || "User"}</h3>
              <p>{profileData?.email}</p>
              <div className="current-role">
                <span className="role-badge">{profileData?.currentRole}</span>
              </div>
            </div>
          </div>

          <div className="profile-main">
            <h1>Edit Profile</h1>
            <p className="profile-subtitle">
              Update your information and preferences
            </p>

            {/* Error/Success Messages */}
            {error && <div className="profile-error">{error}</div>}
            {success && <div className="profile-success">{success}</div>}

            <form className="profile-form" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                <label htmlFor="cv">CV</label>
                <div className="cv-section">
                  {profileData?.cvPath ? (
                    <div className="current-cv">
                      <span>📄</span>
                      <span>Current CV: {profileData.cvPath}</span>
                      <a
                        href={`http://localhost:5000/api/upload/cv/${profileData.cvPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-cv-link"
                      >
                        View CV
                      </a>
                    </div>
                  ) : (
                    <div className="no-cv">No CV uploaded</div>
                  )}

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

                  {cvFile && (
                    <button
                      className="upload-button"
                      onClick={() => uploadFile(cvFile, "cv")}
                      disabled={uploadingFile === "cv"}
                    >
                      {uploadingFile === "cv" ? "Uploading..." : "Upload CV"}
                    </button>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label>Available Roles</label>
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
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
