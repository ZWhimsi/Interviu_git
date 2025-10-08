/**
 * CV Analysis Model
 *
 * Purpose: Store complete CV analysis results for history and retrieval
 * Indexed by: userId + createdAt for fast user history queries
 *
 * @module CVAnalysis
 */

const mongoose = require("mongoose");

const CVAnalysisSchema = new mongoose.Schema(
  {
    // User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Fast user history queries
    },

    // Original content (stored for re-analysis if needed)
    cvText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobTitle: { type: String, default: "Untitled Position" },

    // Multi-dimensional matching scores (0-100)
    scores: {
      hardSkills: { type: Number, min: 0, max: 100, default: 0 },
      softSkills: { type: Number, min: 0, max: 100, default: 0 },
      education: { type: Number, min: 0, max: 100, default: 0 },
      experience: { type: Number, min: 0, max: 100, default: 0 },
      overall: { type: Number, min: 0, max: 100, default: 0 },
      atsScore: { type: Number, min: 0, max: 100, default: 0 }, // Format compatibility
    },

    // ATS Format Analysis
    atsAnalysis: {
      score: Number,
      issues: [String], // List of format problems
      recommendations: [String], // How to fix format issues
    },

    // Term-level analysis with TESTED suggestions
    termAnalysis: [
      {
        term: String, // CV keyword analyzed
        section: String, // hardSkills | softSkills | experience | education
        impact: String, // positive | neutral | negative
        score: Number, // Similarity score 0-100
        suggestions: [
          {
            term: String, // Alternative suggestion
            reasoning: String, // Why this is better
            expectedImprovement: Number, // Proven delta on overall score
          },
        ],
      },
    ],

    // High-level insights
    strengths: [String], // What candidate does well
    weaknesses: [String], // Areas for improvement
    recommendations: [String], // Specific, actionable advice

    // Cached embeddings (for performance - avoid regenerating)
    embeddings: {
      cv: [Number], // 1536-dim vector
      job: [Number], // 1536-dim vector
    },

    // Processing metadata
    analysisStatus: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    processingTime: Number, // Milliseconds
  },
  {
    timestamps: true, // Auto-add createdAt, updatedAt
    collection: "cvanalyses", // Explicit collection name
  }
);

// Indexes for performance
CVAnalysisSchema.index({ userId: 1, createdAt: -1 }); // User history queries
CVAnalysisSchema.index({ "scores.overall": -1 }); // Top analyses queries

module.exports = mongoose.model("CVAnalysis", CVAnalysisSchema);
