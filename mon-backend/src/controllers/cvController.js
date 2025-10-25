/**
 * CV Analysis Controller
 *
 * Purpose: Orchestrate complete CV analysis pipeline
 * Steps:
 *   0. Check ATS format compatibility
 *   1. Parse CV + Job with LLM
 *   2. Extract keywords (reduce noise)
 *   3. Generate embeddings (9 total)
 *   4. Calculate similarities + scores
 *   5. Generate intelligent recommendations
 *   6. Analyze terms with tested suggestions
 *
 * Response: Complete analysis with scores, recommendations, suggestions
 *
 * @module cvController
 */

const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const CVAnalysis = require("../models/CVAnalysis");
const User = require("../models/User");
const logger = require("../utils/logger");

// Service dependencies
const {
  generateEmbedding,
  cosineSimilarity,
  generateBatchEmbeddings, // Currently unused but kept for future optimization
} = require("../services/embeddingService");
const {
  parseCVWithLLM,
  parseJobWithLLM,
} = require("../services/llmParsingService");
const { analyzeTermsAndSuggest } = require("../services/termAnalysisService");
const {
  generateIntelligentRecommendations,
} = require("../services/recommendationService");
const {
  extractCVKeywords,
  extractJobKeywords,
} = require("../services/keywordExtractionService");
const { checkATSFriendliness } = require("../services/atsCheckerService");
const {
  generateAllGroupEmbeddings,
} = require("../services/groupEmbeddingService");
const progressTracker = require("../services/progressService");
const {
  performCrossAttentionAnalysis,
  performAblationStudy,
} = require("../services/attentionAnalysisService");
const { validateCompleteAnalysis } = require("../services/validationService");

// Constants
const MIN_JOB_DESCRIPTION_LENGTH = 50;
const MIN_CV_TEXT_LENGTH = 100;

/**
 * Analyze CV against job description - Main endpoint
 *
 * @route   POST /api/cv/analyze
 * @access  Private (requires JWT)
 *
 * @body {File} cv - PDF file (optional if useProfileCV=true)
 * @body {string} jobDescription - Job description text (min 50 chars)
 * @body {string} jobTitle - Job title (optional)
 * @body {boolean} useProfileCV - Use CV from user profile
 *
 * @returns {Object} Complete analysis with scores, recommendations, suggestions
 */
exports.analyzeCV = async (req, res) => {
  const startTime = Date.now();

  try {
    const { jobDescription, jobTitle, useProfileCV } = req.body;
    const userId = req.user.id;
    const analysisId = `${userId}_${Date.now()}`;

    // Initialize progress tracking
    progressTracker.initProgress(analysisId);

    // Send analysis ID to client
    res.setHeader("X-Analysis-ID", analysisId);

    // Validation
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: "Job description must be at least 50 characters",
      });
    }

    let cvText = "";

    // Option 1: Use uploaded CV file
    if (req.file) {
      logger.info(`Parsing uploaded CV for user: ${req.user.email}`);
      progressTracker.updateProgress(analysisId, "upload", {
        fileName: req.file.originalname,
      });

      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      cvText = pdfData.text;

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      progressTracker.completeStep(analysisId, "upload");
    }
    // Option 2: Use profile CV
    else if (useProfileCV === "true") {
      logger.info(`Using profile CV for user: ${req.user.email}`);
      const user = await User.findById(userId);

      if (!user.cvPath) {
        return res.status(400).json({
          success: false,
          error: "No CV found in profile. Please upload one.",
        });
      }

      // Parse profile CV
      const cvPath = path.join(__dirname, "../../uploads/cv", user.cvPath);
      const dataBuffer = fs.readFileSync(cvPath);
      const pdfData = await pdfParse(dataBuffer);
      cvText = pdfData.text;
    } else {
      return res.status(400).json({
        success: false,
        error: "Please upload a CV or select 'Use Profile CV'",
      });
    }

    // Validate extracted text
    if (!cvText || cvText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        error:
          "Could not extract text from CV. Please ensure it's a valid PDF with text content.",
      });
    }

    logger.info(
      `CV parsed successfully. Text length: ${cvText.length} characters`
    );

    // Create analysis record (processing status)
    const analysis = await CVAnalysis.create({
      userId,
      cvText,
      jobDescription: jobDescription.trim(),
      jobTitle: jobTitle || "Untitled Position",
      analysisStatus: "processing",
    });

    // STEP 0: Check ATS-Friendliness (FORMAT analysis)
    logger.info("--- FEATURE A: ATS Format Check ---");
    progressTracker.updateProgress(analysisId, "ats");

    const atsCheck = await checkATSFriendliness(cvText);
    analysis.atsAnalysis = {
      score: atsCheck.atsScore,
      issues: atsCheck.issues,
      recommendations: atsCheck.recommendations,
      explanations: atsCheck.explanations,
    };
    analysis.scores.atsScore = atsCheck.atsScore;
    logger.info(`[FEATURE A] ATS Score: ${atsCheck.atsScore}/100`);
    logger.info(`[FEATURE A] Issues: ${atsCheck.issues.length}`);

    progressTracker.completeStep(analysisId, "ats", {
      score: atsCheck.atsScore,
    });

    // STEP 1: Parse CV and Job using LLM (intelligent extraction)
    logger.info("Parsing CV and job description with LLM...");
    progressTracker.updateProgress(analysisId, "parsing");

    const [cvSections, jobSections] = await Promise.all([
      parseCVWithLLM(cvText),
      parseJobWithLLM(jobDescription),
    ]);

    // Log parsed sections for debugging
    logger.info("=== PARSED CV SECTIONS ===");
    logger.info(
      `Hard Skills: ${String(cvSections.hardSkills || "").substring(0, 200)}...`
    );
    logger.info(
      `Soft Skills: ${String(cvSections.softSkills || "").substring(0, 200)}...`
    );
    logger.info(
      `Experience: ${String(cvSections.experience || "").substring(0, 200)}...`
    );
    logger.info(
      `Education: ${String(cvSections.education || "").substring(0, 200)}...`
    );

    progressTracker.completeStep(analysisId, "parsing");

    // STEP 2: Extract KEY KEYWORDS (Original approach)
    logger.info("Extracting key keywords...");
    progressTracker.updateProgress(analysisId, "keywords", {
      message: "Extracting keywords",
    });

    // Extract keywords using original approach
    const [cvKeywords, jobKeywords] = await Promise.all([
      extractCVKeywords(cvSections, cvText),
      extractJobKeywords(jobSections, jobDescription),
    ]);

    logger.info(
      `CV: ${cvKeywords.hardSkills.length} hard, ${cvKeywords.softSkills.length} soft, ${cvKeywords.experience.length} exp, ${cvKeywords.education.length} edu`
    );

    progressTracker.completeStep(analysisId, "keywords", {
      cvCount: cvKeywords.hardSkills.length + cvKeywords.softSkills.length,
      jobCount: jobKeywords.hardSkills.length + jobKeywords.softSkills.length,
    });

    // STEP 3: Generate GROUP EMBEDDINGS (contextual signal)
    logger.info("Generating enhanced group embeddings...");
    progressTracker.updateProgress(analysisId, "embeddings", {
      message: "Creating contextual embeddings from grouped keywords",
    });

    // Use the new group embedding service for better context
    // Use original CV text for experience and education if no keywords found
    const cvKeywordsForEmbedding = { ...cvKeywords };
    if (
      !cvKeywordsForEmbedding.experience ||
      cvKeywordsForEmbedding.experience.length === 0
    ) {
      logger.info(
        "No CV experience keywords found, using original CV text for experience embedding"
      );
      cvKeywordsForEmbedding.experience = [cvSections.experience];
    }
    if (
      !cvKeywordsForEmbedding.education ||
      cvKeywordsForEmbedding.education.length === 0
    ) {
      logger.info(
        "No CV education keywords found, using original CV text for education embedding"
      );
      cvKeywordsForEmbedding.education = [cvSections.education];
    }

    const [cvEmbeddings, jobEmbeddings] = await Promise.all([
      generateAllGroupEmbeddings(cvKeywordsForEmbedding),
      generateAllGroupEmbeddings(jobKeywords),
    ]);

    // Add full text embeddings
    cvEmbeddings.full = await generateEmbedding(cvText);
    jobEmbeddings.full = await generateEmbedding(jobDescription);

    progressTracker.completeStep(analysisId, "embeddings");

    analysis.embeddings = {
      cv: cvEmbeddings.full,
      job: jobEmbeddings.full,
    };

    // STEP 4: Cross-Attention Analysis (SOTA V2)
    progressTracker.updateProgress(analysisId, "similarity", {
      message: "Performing cross-attention analysis between CV and Job",
    });

    // Perform advanced cross-attention analysis
    const attentionResults = await performCrossAttentionAnalysis(
      cvSections,
      jobSections,
      cvKeywords,
      jobKeywords
    );

    // Use attention-based scores instead of simple cosine similarity
    const similarities = {
      hardSkills: attentionResults.alignmentScores.hardSkills / 100,
      softSkills: attentionResults.alignmentScores.softSkills / 100,
      experience: attentionResults.alignmentScores.experience / 100,
      education: attentionResults.alignmentScores.education / 100,
      overall: attentionResults.alignmentScores.overall / 100,
    };

    // Store attention analysis results
    analysis.attentionMatrix = attentionResults.attentionMatrix;
    analysis.gapAnalysis = attentionResults.gapAnalysis;

    progressTracker.completeStep(analysisId, "similarity", {
      overallScore: attentionResults.alignmentScores.overall,
      attentionGaps: attentionResults.gapAnalysis.gaps.length,
      opportunities: attentionResults.gapAnalysis.opportunities.length,
    });

    // Log detailed comparison for debugging
    logger.info("=== SCORE CALCULATION DEBUG ===");
    logger.info(
      `CV Keywords counts: Hard=${cvKeywords.hardSkills.length}, Soft=${cvKeywords.softSkills.length}, Exp=${cvKeywords.experience.length}, Edu=${cvKeywords.education.length}`
    );
    logger.info(
      `Job Keywords counts: Hard=${jobKeywords.hardSkills.length}, Soft=${jobKeywords.softSkills.length}, Exp=${jobKeywords.experience.length}, Edu=${jobKeywords.education.length}`
    );
    logger.info(`CV Keywords: ${JSON.stringify(cvKeywords)}`);
    logger.info(`Job Keywords: ${JSON.stringify(jobKeywords)}`);

    logger.info(
      `Keyword Similarities - Hard:${(similarities.hardSkills * 100).toFixed(
        1
      )}% Soft:${(similarities.softSkills * 100).toFixed(1)}%`
    );

    // STEP 5: Pure attention-based scores (no hardcodes, no fallbacks)
    const scores = {
      hardSkills: Math.round(similarities.hardSkills * 100),
      softSkills: Math.round(similarities.softSkills * 100),
      education: Math.round(similarities.education * 100),
      experience: Math.round(similarities.experience * 100),
      overall: Math.round(similarities.overall * 100),
    };

    logger.info(`=== FINAL SCORES ===`);
    logger.info(`Hard Skills: ${scores.hardSkills}%`);
    logger.info(`Soft Skills: ${scores.softSkills}%`);
    logger.info(`Experience: ${scores.experience}%`);
    logger.info(`Education: ${scores.education}%`);
    logger.info(`Overall: ${scores.overall}%`);
    analysis.scores = scores;

    // CLINICAL VALIDATION - Ensure system precision
    logger.info("Performing clinical validation of complete analysis...");
    validateCompleteAnalysis({
      cvSections,
      jobSections,
      cvKeywords,
      jobKeywords,
      cvEmbeddings,
      jobEmbeddings,
      attentionMatrix: analysis.attentionMatrix,
      scores,
    });

    // STEP 4: Identify strengths and weaknesses
    const { strengths, weaknesses } = identifyStrengthsWeaknesses(
      cvText,
      jobDescription,
      scores
    );
    analysis.strengths = strengths;
    analysis.weaknesses = weaknesses;

    // STEP 6: Generate INTELLIGENT recommendations with Ablation Studies
    logger.info(
      "Generating intelligent recommendations with ablation studies..."
    );
    progressTracker.updateProgress(analysisId, "recommendations", {
      message: "Performing ablation studies to identify key improvements",
    });

    // Perform ablation studies for each category
    const ablationResults = {};
    for (const category of [
      "hardSkills",
      "softSkills",
      "experience",
      "education",
    ]) {
      if (scores[category] < 70) {
        // Only for low-scoring categories
        ablationResults[category] = await performAblationStudy(
          cvKeywords,
          jobKeywords,
          category
        );
      }
    }

    // Generate recommendations based on ablation results
    const recommendations = await generateIntelligentRecommendations(
      cvKeywords,
      jobKeywords,
      scores,
      strengths,
      weaknesses,
      cvText,
      jobDescription
    );

    // Add REAL actionable recommendations from ablation studies
    const actionableRecommendations = [];
    for (const [category, ablationData] of Object.entries(ablationResults)) {
      if (ablationData.actionableRecommendations) {
        actionableRecommendations.push(
          ...ablationData.actionableRecommendations
        );
      }
    }

    // Generate actionable recommendations from ablation results
    const ablationRecommendations =
      generateAblationRecommendations(ablationResults);
    analysis.recommendations = [...recommendations, ...ablationRecommendations];
    analysis.actionableRecommendations = actionableRecommendations;
    analysis.ablationResults = ablationResults;

    progressTracker.completeStep(analysisId, "recommendations", {
      count: analysis.recommendations.length,
      ablationInsights: Object.keys(ablationResults).length,
    });

    // STEP 7: Analyze individual terms with TESTED suggestions
    logger.info("Analyzing terms and testing suggestions...");
    progressTracker.updateProgress(analysisId, "suggestions");

    const termAnalysis = await analyzeTermsAndSuggest(
      cvKeywords,
      jobKeywords,
      jobEmbeddings
    );
    analysis.termAnalysis = termAnalysis;

    progressTracker.completeStep(analysisId, "suggestions", {
      count: termAnalysis.suggestions ? termAnalysis.suggestions.length : 0,
    });

    // Mark as completed
    const processingTime = Date.now() - startTime;
    analysis.processingTime = processingTime;
    analysis.analysisStatus = "completed";

    await analysis.save();

    logger.info(
      `CV analysis completed in ${processingTime}ms for user: ${req.user.email}`
    );

    // Mark analysis as complete
    progressTracker.updateProgress(analysisId, "complete");
    progressTracker.completeStep(analysisId, "complete", {
      totalTime: processingTime,
    });

    res.status(200).json({
      success: true,
      data: {
        analysisId: analysis._id,
        scores: analysis.scores,
        atsAnalysis: analysis.atsAnalysis, // NEW: ATS format check
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
        actionableRecommendations: analysis.actionableRecommendations,
        termAnalysis: analysis.termAnalysis,
        processingTime,
      },
    });
  } catch (error) {
    logger.error(`Error in CV analysis: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to analyze CV. Please try again.",
    });
  }
};

/**
 * @desc    Get user's CV analysis history
 * @route   GET /api/cv/history
 * @access  Private
 */
exports.getCVHistory = async (req, res) => {
  try {
    const analyses = await CVAnalysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-cvText -embeddings"); // Don't send full text

    res.status(200).json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    logger.error(`Error fetching CV history: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analysis history",
    });
  }
};

/**
 * @desc    Get specific CV analysis
 * @route   GET /api/cv/analysis/:id
 * @access  Private
 */
exports.getCVAnalysis = async (req, res) => {
  try {
    const analysis = await CVAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure user owns this analysis
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: "Analysis not found",
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    logger.error(`Error fetching CV analysis: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analysis",
    });
  }
};

// ========================================
// HELPER FUNCTIONS - Analysis
// ========================================

/**
 * Identify strengths and weaknesses based on scores
 */
function identifyStrengthsWeaknesses(cvText, jobDescription, scores) {
  const strengths = [];
  const weaknesses = [];

  // Analyze each dimension with more specific feedback
  if (scores.hardSkills >= 80) {
    strengths.push(
      "Excellent technical skills alignment with job requirements"
    );
  } else if (scores.hardSkills >= 60) {
    strengths.push("Good technical skills foundation");
  } else if (scores.hardSkills < 40) {
    weaknesses.push(
      "Significant technical skills gap - consider adding relevant technologies"
    );
  }

  if (scores.softSkills >= 80) {
    strengths.push("Strong soft skills presentation matches job needs");
  } else if (scores.softSkills >= 60) {
    strengths.push("Adequate soft skills coverage");
  } else if (scores.softSkills < 40) {
    weaknesses.push(
      "Soft skills need more emphasis - highlight leadership, communication, teamwork"
    );
  }

  if (scores.experience >= 80) {
    strengths.push("Experience level strongly matches position requirements");
  } else if (scores.experience >= 60) {
    strengths.push("Relevant experience background");
  } else if (scores.experience < 40) {
    weaknesses.push(
      "Experience level may not meet job expectations - consider highlighting transferable skills"
    );
  }

  if (scores.education >= 80) {
    strengths.push(
      "Educational qualifications align well with job requirements"
    );
  } else if (scores.education >= 60) {
    strengths.push("Educational background is relevant");
  } else if (scores.education < 40) {
    weaknesses.push(
      "Educational qualifications need more emphasis or relevant certifications"
    );
  }

  // Overall assessment
  if (scores.overall >= 80) {
    strengths.push("Strong overall match with job requirements");
  } else if (scores.overall < 50) {
    weaknesses.push(
      "Significant gap between CV and job requirements - consider targeted improvements"
    );
  }

  return { strengths, weaknesses };
}

/**
 * Generate recommendations based on ablation study results
 */
function generateAblationRecommendations(ablationResults) {
  const recommendations = [];

  for (const [category, ablationData] of Object.entries(ablationResults)) {
    if (
      !ablationData ||
      !ablationData.results ||
      ablationData.results.length === 0
    )
      continue;

    const results = ablationData.results;

    // Find the most impactful missing keywords
    const missingKeywords = results.filter(
      (r) => r.type === "missing" && r.impact > 15
    );
    if (missingKeywords.length > 0) {
      const topMissing = missingKeywords.slice(0, 2);
      recommendations.push(
        `Add ${topMissing
          .map((k) => `"${k.keyword}"`)
          .join(" and ")} to your ${category} section for +${Math.max(
          ...topMissing.map((k) => k.impact)
        )}% improvement`
      );
    }

    // Find negative impact keywords to remove
    const negativeKeywords = results.filter(
      (r) => r.significance === "negative" && r.impact < -10
    );
    if (negativeKeywords.length > 0) {
      const topNegative = negativeKeywords.slice(0, 1);
      recommendations.push(
        `Consider removing or rephrasing "${
          topNegative[0].keyword
        }" from your ${category} section (currently causing -${Math.abs(
          topNegative[0].impact
        )}% impact)`
      );
    }
  }

  return recommendations;
}

// Old generic recommendation function removed
// Now using generateIntelligentRecommendations from recommendationService
