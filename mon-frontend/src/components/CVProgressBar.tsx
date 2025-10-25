import React, { useEffect, useState } from "react";
import "./CVProgressBar.css";

interface ProgressStep {
  id: string;
  name: string;
  percentage: number;
  status: "pending" | "in_progress" | "completed";
  details?: any;
}

interface CVProgressBarProps {
  analysisId: string | null;
  onComplete?: () => void;
}

export default function CVProgressBar({
  analysisId,
  onComplete,
}: CVProgressBarProps) {
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<ProgressStep | null>(null);
  const [steps, setSteps] = useState<ProgressStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analysisId) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    const eventSource = new EventSource(
      `http://localhost:5000/api/progress/stream/${analysisId}?token=${encodeURIComponent(
        token
      )}`
    );

    eventSource.onmessage = (event) => {
      console.log("SSE received:", event.data);
      const data = JSON.parse(event.data);
      setProgress(data.percentage || 0);
      setCurrentStep(data.currentStep || null);
      // Don't set steps from SSE, we'll get them from the backend

      if (data.completed) {
        eventSource.close();
        onComplete && onComplete();
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setError("Failed to connect to progress updates. Please try again.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [analysisId, onComplete]);

  if (error) {
    return <div className="progress-error">{error}</div>;
  }

  if (!currentStep && !error) {
    return (
      <div className="cv-progress-bar-container">
        <div className="progress-header">
          <p className="progress-message">Initializing analysis...</p>
          <span className="progress-percentage">0%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "0%" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-progress-container">
      <div className="progress-header">
        <h3>Analyzing Your CV</h3>
        <span className="progress-percentage">{progress}%</span>
      </div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="progress-current-step">
        <div className="step-icon">
          {currentStep.status === "completed" ? "✓" : "⏳"}
        </div>
        <div className="step-info">
          <div className="step-name">{currentStep.name}</div>
          {currentStep.details?.message && (
            <div className="step-details">{currentStep.details.message}</div>
          )}
        </div>
      </div>

      <div className="progress-steps-list">
        {steps.map((step, index) => (
          <div key={step.id} className={`progress-step ${step.status}`}>
            <div className="step-connector" />
            <div className="step-dot">
              {step.status === "completed" ? "✓" : index + 1}
            </div>
            <div className="step-label">{step.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
