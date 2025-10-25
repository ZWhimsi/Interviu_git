import React from "react";
import "./CVAnalysisSkeleton.css";

const CVAnalysisSkeleton: React.FC = () => {
  return (
    <div className="analysis-skeleton">
      {/* Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-subtitle shimmer"></div>
      </div>

      {/* ATS Score Skeleton - matches real format */}
      <div className="skeleton-section">
        <div className="skeleton-section-title shimmer"></div>
        <div className="skeleton-ats-score">
          <div className="skeleton-circle shimmer"></div>
          <div className="skeleton-ats-info">
            <div className="skeleton-ats-text shimmer"></div>
            <div className="skeleton-ats-text short shimmer"></div>
          </div>
        </div>
      </div>

      {/* Scores Grid Skeleton - matches real format */}
      <div className="skeleton-section">
        <div className="skeleton-section-title shimmer"></div>
        <div className="skeleton-scores-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-score-card">
              <div className="skeleton-score-circle shimmer"></div>
              <div className="skeleton-score-label shimmer"></div>
              <div className="skeleton-score-value shimmer"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses Skeleton - matches real format */}
      <div className="skeleton-section">
        <div className="skeleton-section-title shimmer"></div>
        <div className="skeleton-strengths-weaknesses">
          <div className="skeleton-strengths">
            <div className="skeleton-subtitle shimmer"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-list-item shimmer"></div>
            ))}
          </div>
          <div className="skeleton-weaknesses">
            <div className="skeleton-subtitle shimmer"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-list-item shimmer"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Skeleton - matches real format */}
      <div className="skeleton-section">
        <div className="skeleton-section-title shimmer"></div>
        <div className="skeleton-recommendations">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-recommendation-item">
              <div className="skeleton-recommendation-icon shimmer"></div>
              <div className="skeleton-recommendation-text shimmer"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Term Analysis Skeleton - matches real format */}
      <div className="skeleton-section">
        <div className="skeleton-section-title shimmer"></div>
        <div className="skeleton-term-analysis">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-term-item">
              <div className="skeleton-term-header">
                <div className="skeleton-term-name shimmer"></div>
                <div className="skeleton-term-score shimmer"></div>
              </div>
              <div className="skeleton-term-suggestions">
                {[1, 2].map((j) => (
                  <div key={j} className="skeleton-suggestion shimmer"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVAnalysisSkeleton;
