/**
 * Progress Controller
 *
 * Purpose: Provide real-time progress updates via Server-Sent Events (SSE)
 *
 * @module progressController
 */

const progressTracker = require("../services/progressService");
const logger = require("../utils/logger");

/**
 * SSE endpoint for progress updates
 */
exports.streamProgress = (req, res) => {
  const { analysisId } = req.params;
  const token = req.query.token;

  // For SSE, we need to validate the token manually since EventSource can't send headers
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided.");
  }

  // Extract userId from analysisId (format: userId_timestamp)
  const userId = analysisId.split("_")[0];

  // Ensure the analysisId belongs to the user to prevent unauthorized access
  if (!analysisId.startsWith(`${userId}_`)) {
    return res.status(403).send("Forbidden: Invalid analysis ID for user.");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Flush the headers to establish the SSE connection immediately

  logger.info(`[SSE] Client connected for analysisId: ${analysisId}`);

  const sendProgress = (progressData) => {
    logger.info(
      `[SSE] Sending progress data for ${analysisId}: ${JSON.stringify(
        progressData
      )}`
    );
    res.write(`data: ${JSON.stringify(progressData)}\n\n`);
    if (progressData.completed) {
      res.end(); // Close connection when analysis is complete
      logger.info(
        `[SSE] Analysis ${analysisId} completed, closing connection.`
      );
    }
  };

  // Send current progress immediately if available
  const currentProgress = progressTracker.getProgress(analysisId);
  if (currentProgress) {
    sendProgress(currentProgress);
  }

  // Listen for progress updates for this specific analysisId
  logger.info(`[SSE] Setting up listener for ${analysisId}`);
  progressTracker.on(analysisId, sendProgress);

  // Handle client disconnect
  req.on("close", () => {
    progressTracker.off(analysisId, sendProgress);
    logger.info(`[SSE] Client disconnected for analysisId: ${analysisId}`);
  });
};

/**
 * Get current progress status
 */
exports.getProgress = (req, res) => {
  const { analysisId } = req.params;

  const progress = progressTracker.getProgress(analysisId);

  if (!progress) {
    return res.status(404).json({
      success: false,
      error: "Analysis not found or completed",
    });
  }

  res.json({
    success: true,
    data: progress,
  });
};
