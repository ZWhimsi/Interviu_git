/**
 * Progress Service
 *
 * Purpose: Track and report CV analysis progress in real-time
 *
 * @module progressService
 */

const EventEmitter = require("events");
const logger = require("../utils/logger");

class ProgressTracker extends EventEmitter {
  constructor() {
    super();
    this.progress = new Map();
  }

  /**
   * Initialize progress for a new analysis
   */
  initProgress(analysisId) {
    const steps = [
      {
        id: "upload",
        name: "Processing CV file",
        percentage: 0,
        status: "pending",
      },
      {
        id: "ats",
        name: "Checking ATS compatibility",
        percentage: 10,
        status: "pending",
      },
      {
        id: "parsing",
        name: "Parsing CV and job description",
        percentage: 20,
        status: "pending",
      },
      {
        id: "keywords",
        name: "Extracting keywords (10+ per category)",
        percentage: 35,
        status: "pending",
      },
      {
        id: "embeddings",
        name: "Generating contextual embeddings",
        percentage: 50,
        status: "pending",
      },
      {
        id: "similarity",
        name: "Calculating similarity scores",
        percentage: 65,
        status: "pending",
      },
      {
        id: "recommendations",
        name: "Generating recommendations",
        percentage: 80,
        status: "pending",
      },
      {
        id: "suggestions",
        name: "Creating improvement suggestions",
        percentage: 90,
        status: "pending",
      },
      {
        id: "complete",
        name: "Analysis complete",
        percentage: 100,
        status: "pending",
      },
    ];

    this.progress.set(analysisId, {
      steps,
      currentStep: 0,
      percentage: 0,
      startTime: Date.now(),
    });

    return analysisId;
  }

  /**
   * Update progress for a specific step
   */
  updateProgress(analysisId, stepId, details = null) {
    const analysis = this.progress.get(analysisId);
    if (!analysis) {
      logger.warn(`[Progress] Analysis ID ${analysisId} not found for update.`);
      return;
    }

    const stepIndex = analysis.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) {
      logger.warn(`[Progress] Unknown step ID: ${stepId} for ${analysisId}`);
      return;
    }

    // Update current step status
    analysis.steps[stepIndex].status = "in_progress";

    // Mark previous steps as completed
    for (let i = 0; i < stepIndex; i++) {
      analysis.steps[i].status = "completed";
    }

    analysis.currentStep = stepIndex;
    analysis.percentage = analysis.steps[stepIndex].percentage;

    // Add details if provided
    if (details) {
      analysis.steps[stepIndex].details = details;
    }

    // Emit progress event for this specific analysisId
    const progressData = {
      currentStep: analysis.steps[stepIndex],
      percentage: analysis.percentage,
      message: analysis.steps[stepIndex].name,
      details: details || {},
      completed: false,
      timestamp: Date.now(),
    };

    logger.info(
      `[Progress] Emitting event for ${analysisId}: ${JSON.stringify(
        progressData
      )}`
    );
    this.emit(analysisId, progressData);

    logger.info(
      `Progress [${analysisId}]: ${stepId} - ${analysis.percentage}%`
    );
  }

  /**
   * Mark step as completed
   */
  completeStep(analysisId, stepId, results = null) {
    const analysis = this.progress.get(analysisId);
    if (!analysis) return;

    const stepIndex = analysis.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) return;

    analysis.steps[stepIndex].status = "completed";
    if (results) {
      analysis.steps[stepIndex].results = results;
    }

    // Emit completion event
    this.emit(analysisId, {
      currentStep: analysis.steps[stepIndex],
      percentage: analysis.steps[stepIndex].percentage,
      message: analysis.steps[stepIndex].name,
      details: results || {},
      completed: stepId === "complete",
      timestamp: Date.now(),
    });

    // Auto-advance to next step if not the last one
    if (stepIndex < analysis.steps.length - 1) {
      const nextStep = analysis.steps[stepIndex + 1];
      this.updateProgress(analysisId, nextStep.id);
    }
  }

  /**
   * Get current progress
   */
  getProgress(analysisId) {
    const analysis = this.progress.get(analysisId);
    if (!analysis) return null;

    return {
      percentage: analysis.percentage,
      currentStep: analysis.steps[analysis.currentStep],
      allSteps: analysis.steps,
      elapsedTime: Date.now() - analysis.startTime,
    };
  }

  /**
   * Clean up completed analysis
   */
  cleanupProgress(analysisId) {
    this.progress.delete(analysisId);
  }
}

// Create singleton instance
const progressTracker = new ProgressTracker();

module.exports = progressTracker;
