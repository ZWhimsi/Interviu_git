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
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      cvText = pdfData.text;

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
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
    const atsCheck = await checkATSFriendliness(cvText);
    analysis.atsAnalysis = {
      score: atsCheck.atsScore,
      issues: atsCheck.issues,
      recommendations: atsCheck.recommendations,
    };
    analysis.scores.atsScore = atsCheck.atsScore;
    logger.info(`[FEATURE A] ATS Score: ${atsCheck.atsScore}/100`);
    logger.info(`[FEATURE A] Issues: ${atsCheck.issues.length}`);

    // STEP 1: Parse CV and Job using LLM (intelligent extraction)
    logger.info("Parsing CV and job description with LLM...");
    const [cvSections, jobSections] = await Promise.all([
      parseCVWithLLM(cvText),
      parseJobWithLLM(jobDescription),
    ]);

    // STEP 2: Extract KEY KEYWORDS ONLY (removes noise)
    logger.info("Extracting key keywords...");
    const [cvKeywords, jobKeywords] = await Promise.all([
      extractCVKeywords(cvSections),
      extractJobKeywords(jobSections),
    ]);

    logger.info(
      `CV: ${cvKeywords.hardSkills.length} hard, ${cvKeywords.softSkills.length} soft, ${cvKeywords.experience.length} exp, ${cvKeywords.education.length} edu`
    );

    // STEP 3: Generate embeddings for KEYWORDS (cleaner signal)
    logger.info("Generating keyword embeddings...");

    const cvEmbeddings = {
      hardSkills: await generateEmbedding(cvKeywords.hardSkills.join(", ")),
      softSkills: await generateEmbedding(cvKeywords.softSkills.join(", ")),
      education: await generateEmbedding(cvKeywords.education.join(", ")),
      experience: await generateEmbedding(cvKeywords.experience.join(", ")),
      full: await generateEmbedding(cvText),
    };

    const jobEmbeddings = {
      hardSkills: await generateEmbedding(jobKeywords.hardSkills.join(", ")),
      softSkills: await generateEmbedding(jobKeywords.softSkills.join(", ")),
      experience: await generateEmbedding(jobKeywords.experience.join(", ")),
      education: await generateEmbedding(jobKeywords.education.join(", ")),
      full: await generateEmbedding(jobDescription),
    };

    analysis.embeddings = {
      cv: cvEmbeddings.full,
      job: jobEmbeddings.full,
    };

    // STEP 4: Calculate keyword-based similarities
    const similarities = {
      hardSkills: cosineSimilarity(
        cvEmbeddings.hardSkills,
        jobEmbeddings.hardSkills
      ),
      softSkills: cosineSimilarity(
        cvEmbeddings.softSkills,
        jobEmbeddings.softSkills
      ),
      experience: cosineSimilarity(
        cvEmbeddings.experience,
        jobEmbeddings.experience
      ),
      education: cosineSimilarity(
        cvEmbeddings.education,
        jobEmbeddings.education
      ),
      overall: cosineSimilarity(cvEmbeddings.full, jobEmbeddings.full),
    };

    logger.info(
      `Keyword Similarities - Hard:${(similarities.hardSkills * 100).toFixed(
        1
      )}% Soft:${(similarities.softSkills * 100).toFixed(1)}%`
    );

    // STEP 5: Calculate scores
    const scores = {
      hardSkills: Math.round(similarities.hardSkills * 100),
      softSkills: Math.round(similarities.softSkills * 100),
      education: Math.round(similarities.education * 100),
      experience: Math.round(similarities.experience * 100),
      overall: Math.round(similarities.overall * 100),
    };
    analysis.scores = scores;

    // STEP 4: Identify strengths and weaknesses
    const { strengths, weaknesses } = identifyStrengthsWeaknesses(
      cvText,
      jobDescription,
      scores
    );
    analysis.strengths = strengths;
    analysis.weaknesses = weaknesses;

    // STEP 6: Generate INTELLIGENT recommendations (LLM-based, uses keywords)
    logger.info("Generating intelligent recommendations...");
    const recommendations = await generateIntelligentRecommendations(
      cvKeywords,
      jobKeywords,
      scores,
      strengths,
      weaknesses
    );
    analysis.recommendations = recommendations;

    // STEP 7: Analyze individual terms with TESTED suggestions
    logger.info("Analyzing terms and testing suggestions...");
    const termAnalysis = await analyzeTermsAndSuggest(
      cvKeywords,
      jobKeywords,
      jobEmbeddings
    );
    analysis.termAnalysis = termAnalysis;

    // Mark as completed
    const processingTime = Date.now() - startTime;
    analysis.processingTime = processingTime;
    analysis.analysisStatus = "completed";

    await analysis.save();

    logger.info(
      `CV analysis completed in ${processingTime}ms for user: ${req.user.email}`
    );

    res.status(200).json({
      success: true,
      data: {
        analysisId: analysis._id,
        scores: analysis.scores,
        atsAnalysis: analysis.atsAnalysis, // NEW: ATS format check
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
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

  // Analyze each dimension
  if (scores.hardSkills >= 70) {
    strengths.push("Strong technical skills match");
  } else if (scores.hardSkills < 50) {
    weaknesses.push("Technical skills need improvement");
  }

  if (scores.softSkills >= 70) {
    strengths.push("Excellent soft skills presentation");
  } else if (scores.softSkills < 50) {
    weaknesses.push("Soft skills could be more prominent");
  }

  if (scores.experience >= 70) {
    strengths.push("Experience level aligns well with requirements");
  } else if (scores.experience < 50) {
    weaknesses.push("Experience level may not meet requirements");
  }

  if (scores.education >= 70) {
    strengths.push("Educational background is relevant");
  } else if (scores.education < 50) {
    weaknesses.push("Educational qualifications need emphasis");
  }

  return { strengths, weaknesses };
}

// Old generic recommendation function removed
// Now using generateIntelligentRecommendations from recommendationService
