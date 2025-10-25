/**
 * CV Analysis Page - Post-Login Feature
 *
 * Purpose: Allow users to analyze their CV against job descriptions
 * Features:
 *   - Upload new CV or use profile CV
 *   - Paste job description
 *   - Get 5-dimensional scoring (Hard, Soft, Education, Experience, Overall)
 *   - ATS format compatibility check
 *   - Term-by-term analysis with tested suggestions
 *   - Intelligent recommendations
 *
 * Architecture: Sidebar + Main content area
 * Dark Mode: Supported (body.dark-mode)
 *
 * @module CVAnalysisPage
 */

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FeatureIcon from "../components/FeatureIcon";
import CVProgressBar from "../components/CVProgressBar";
import CVAnalysisSkeleton from "../components/CVAnalysisSkeleton";
import "./CVAnalysisPage.css";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Single term suggestion with proven improvement
 */
interface TermSuggestion {
  term: string; // Alternative phrasing
  reasoning: string; // Why it's better
  expectedImprovement: number; // Tested delta on overall score
}

/**
 * Analysis of individual CV term vs job requirements
 */
interface TermAnalysis {
  term: string; // CV keyword
  section: string; // Which section (hardSkills, softSkills, etc.)
  impact: "positive" | "negative" | "neutral"; // How it affects match
  score: number; // Similarity score 0-100
  suggestions: TermSuggestion[]; // Proven alternatives
}

/**
 * ATS format compatibility analysis
 */
interface ATSAnalysis {
  score: number; // 0-100 format compatibility
  issues: string[]; // List of problems
  recommendations: string[]; // How to fix
  explanations?: {
    // Detailed explanations
    overall: string;
    sections: string;
    quantifications: string;
    formatting: string;
    keywords: string;
    length: string;
  };
}

/**
 * Complete analysis result from backend
 */
interface AnalysisResult {
  analysisId: string;
  scores: {
    hardSkills: number;
    softSkills: number;
    education: number;
    experience: number;
    overall: number;
    atsScore: number;
  };
  atsAnalysis: ATSAnalysis;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[]; // Tailored to CV + Job
  termAnalysis: TermAnalysis[]; // Up to 15 terms
  processingTime: number;
}

export default function CVAnalysisPage() {
  const [useProfileCV, setUseProfileCV] = useState(true);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    // Validation
    if (!useProfileCV && !cvFile) {
      setError("Please upload a CV or use your profile CV");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError("Job description must be at least 50 characters");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setAnalysisId(null);

    try {
      const formData = new FormData();

      if (useProfileCV) {
        formData.append("useProfileCV", "true");
      } else if (cvFile) {
        formData.append("cv", cvFile);
      }

      formData.append("jobDescription", jobDescription);
      formData.append("jobTitle", jobTitle || "Untitled Position");

      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/cv/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Get analysis ID from response headers
      const responseAnalysisId = response.headers.get("X-Analysis-ID");
      if (responseAnalysisId) {
        setAnalysisId(responseAnalysisId);
      }

      if (response.ok) {
        const data = await response.json();
        setResult(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setError("Failed to analyze CV. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="cv-analysis-page">
      {/* Sidebar */}
      <Sidebar
        userName="User"
        userEmail="user@example.com"
        interviews={[]}
        activeInterview={null}
        currentRole="interviewer"
        availableRoles={["interviewer"]}
        onInterviewSelect={() => {}}
        onNewInterview={() => (window.location.href = "/dashboard")}
        onRoleChange={() => {}}
        onSettings={() => (window.location.href = "/user-profile")}
        onLogout={() => (window.location.href = "/")}
        onHome={() => (window.location.href = "/dashboard")}
      />

      {/* Main Content */}
      <main className="cv-analysis-main">
        <div className="analysis-container">
          <h1 className="analysis-title">CV Analysis</h1>
          <p className="analysis-subtitle">
            Compare your CV against a job description and get detailed insights
          </p>

          {!result ? (
            /* Input Form */
            <div className="analysis-form">
              {/* CV Selection */}
              <div className="form-section">
                <h2>Step 1: Select CV</h2>

                <div className="cv-toggle">
                  <button
                    className={`toggle-option ${useProfileCV ? "active" : ""}`}
                    onClick={() => setUseProfileCV(true)}
                  >
                    Use Profile CV
                  </button>
                  <button
                    className={`toggle-option ${!useProfileCV ? "active" : ""}`}
                    onClick={() => setUseProfileCV(false)}
                  >
                    Upload New CV
                  </button>
                </div>

                {!useProfileCV && (
                  <div className="file-upload-zone">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="file-input"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className="file-upload-label">
                      <div className="upload-icon">
                        <FeatureIcon type="document" size={32} color="white" />
                      </div>
                      <p>
                        {cvFile
                          ? `Selected: ${cvFile.name}`
                          : "Click to upload or drag & drop"}
                      </p>
                      <span className="file-hint">PDF only, max 5MB</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="form-section">
                <h2>Step 2: Job Description</h2>

                <input
                  type="text"
                  placeholder="Job Title (optional)"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="job-title-input"
                />

                <textarea
                  placeholder="Paste the full job description here...

Tip: Copy the complete job posting including:
- Required skills and qualifications
- Responsibilities
- Experience requirements
- Education requirements"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="job-description-input"
                  rows={12}
                />
                <div className="char-count">
                  {jobDescription.length} / 50 characters minimum
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="error-message">{error}</div>}

              {/* Analyze Button */}
              <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={
                  isAnalyzing ||
                  (!useProfileCV && !cvFile) ||
                  jobDescription.length < 50
                }
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing... (20-40s)
                  </>
                ) : (
                  "Analyze CV"
                )}
              </button>

              {/* Progress Bar */}
              {isAnalyzing && (
                <CVProgressBar
                  analysisId={analysisId}
                  onComplete={() => {
                    // Analysis complete callback
                    console.log("Analysis completed");
                  }}
                />
              )}

              {/* Skeleton Loading */}
              {isAnalyzing && !analysisId && <CVAnalysisSkeleton />}
            </div>
          ) : (
            /* Results Display */
            <div className="analysis-results">
              <h2>Analysis Complete!</h2>

              {/* ATS Format Score - FEATURE A */}
              {result.atsAnalysis && (
                <div className="ats-score-section">
                  <h3>ATS Format Compatibility</h3>
                  <div className="ats-score-display">
                    <div className="ats-score-circle">
                      {result.atsAnalysis.score}%
                    </div>
                    <div className="ats-score-info">
                      <p className="ats-score-label">
                        {result.atsAnalysis.explanations?.overall ||
                          (result.atsAnalysis.score >= 80
                            ? "Excellent - Your CV format is ATS-friendly"
                            : result.atsAnalysis.score >= 60
                            ? "Good - Minor improvements needed"
                            : "Needs Work - Format issues detected")}
                      </p>
                      {result.atsAnalysis.issues.length > 0 && (
                        <div className="ats-issues">
                          <strong>Issues:</strong>
                          <ul>
                            {result.atsAnalysis.issues.map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.atsAnalysis.recommendations.length > 0 && (
                        <div className="ats-recs">
                          <strong>Format Improvements:</strong>
                          <ul>
                            {result.atsAnalysis.recommendations.map(
                              (rec, idx) => (
                                <li key={idx}>{rec}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed ATS Explanations */}
                  {result.atsAnalysis.explanations && (
                    <div className="ats-explanations">
                      <h4>Detailed Analysis</h4>
                      <div className="explanation-grid">
                        <div className="explanation-item">
                          <strong>Sections:</strong>
                          <p>{result.atsAnalysis.explanations.sections}</p>
                        </div>
                        <div className="explanation-item">
                          <strong>Quantifications:</strong>
                          <p>
                            {result.atsAnalysis.explanations.quantifications}
                          </p>
                        </div>
                        <div className="explanation-item">
                          <strong>Formatting:</strong>
                          <p>{result.atsAnalysis.explanations.formatting}</p>
                        </div>
                        <div className="explanation-item">
                          <strong>Keywords:</strong>
                          <p>{result.atsAnalysis.explanations.keywords}</p>
                        </div>
                        <div className="explanation-item">
                          <strong>Length:</strong>
                          <p>{result.atsAnalysis.explanations.length}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <h3 className="content-scores-title">Content Match Scores</h3>
              <div className="scores-grid">
                <div className="score-card">
                  <h3>Overall Match</h3>
                  <div className="score-circle">{result.scores.overall}%</div>
                </div>
                <div className="score-card">
                  <h3>Hard Skills</h3>
                  <div
                    className="score-bar"
                    style={{ width: `${result.scores.hardSkills}%` }}
                  ></div>
                  <span>{result.scores.hardSkills}%</span>
                </div>
                <div className="score-card">
                  <h3>Soft Skills</h3>
                  <div
                    className="score-bar"
                    style={{ width: `${result.scores.softSkills}%` }}
                  ></div>
                  <span>{result.scores.softSkills}%</span>
                </div>
                <div className="score-card">
                  <h3>Experience</h3>
                  <div
                    className="score-bar"
                    style={{ width: `${result.scores.experience}%` }}
                  ></div>
                  <span>{result.scores.experience}%</span>
                </div>
                <div className="score-card">
                  <h3>Education</h3>
                  <div
                    className="score-bar"
                    style={{ width: `${result.scores.education}%` }}
                  ></div>
                  <span>{result.scores.education}%</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              {result.strengths && result.strengths.length > 0 && (
                <div className="insights-section">
                  <h3>Strengths</h3>
                  <ul>
                    {result.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.weaknesses && result.weaknesses.length > 0 && (
                <div className="insights-section">
                  <h3>Areas for Improvement</h3>
                  <ul>
                    {result.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="insights-section">
                  <h3>
                    <FeatureIcon type="alert" size={24} />
                    <span>Recommendations</span>
                  </h3>
                  <ul>
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Term Analysis with Suggestions */}
              {result.termAnalysis && result.termAnalysis.length > 0 && (
                <div className="term-analysis-section">
                  <h3>Detailed Term Analysis</h3>
                  <p className="section-hint">
                    Click on a term to see improvement suggestions
                  </p>

                  <div className="terms-grid">
                    {result.termAnalysis.map((item, idx) => (
                      <details key={idx} className={`term-card ${item.impact}`}>
                        <summary className="term-header">
                          <span
                            className={`impact-badge ${item.impact}`}
                          ></span>
                          <span className="term-name">{item.term}</span>
                          <span className="term-score">{item.score}%</span>
                        </summary>

                        {item.suggestions && item.suggestions.length > 0 && (
                          <div className="term-suggestions">
                            <p className="suggestions-title">
                              Better alternatives:
                            </p>
                            {item.suggestions.map((sug, sidx) => (
                              <div key={sidx} className="suggestion-item">
                                <div className="suggestion-term">
                                  <span className="suggestion-icon">→</span>
                                  <strong>{sug.term}</strong>
                                  <span className="improvement-badge">
                                    Overall +{sug.expectedImprovement}%
                                  </span>
                                </div>
                                <p className="suggestion-reason">
                                  {sug.reasoning}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </details>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="new-analysis-button"
                onClick={() => {
                  setResult(null);
                  setJobDescription("");
                  setJobTitle("");
                  setCvFile(null);
                }}
              >
                Analyze Another CV
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
