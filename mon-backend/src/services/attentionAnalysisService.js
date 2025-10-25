/**
 * Attention Analysis Service - REAL Pre-trained Models
 *
 * Purpose: Implement REAL cross-attention using pre-trained models
 * Based on PROJECT_ROADMAP.md Phase 3: "Analyse de Similarité Hiérarchique et Attentionnelle"
 *
 * Key Innovation: Using Sentence-BERT and Cross-Encoders for REAL attention
 *
 * @module attentionAnalysisService
 */

const { generateEmbedding, cosineSimilarity } = require("./embeddingService");
const {
  getRealAttentionMatrix,
  getRealAlignmentScores,
  performRealAblationStudy,
} = require("./realAttentionService");
const logger = require("../utils/logger");

/**
 * Cross-Attention Analysis between CV and Job
 *
 * @param {Object} cvSections - CV sections with embeddings
 * @param {Object} jobSections - Job sections with embeddings
 * @param {Array} cvKeywords - CV keywords by category
 * @param {Array} jobKeywords - Job keywords by category
 * @returns {Object} Attention matrix and alignment scores
 */
async function performCrossAttentionAnalysis(
  cvSections,
  jobSections,
  cvKeywords,
  jobKeywords
) {
  try {
    logger.info(
      "Starting REAL cross-attention analysis using pre-trained models..."
    );

    // Use REAL pre-trained models for attention matrix
    const attentionMatrix = await getRealAttentionMatrix(
      cvSections,
      jobSections
    );

    // Calculate REAL alignment scores using keyword-based matching
    const alignmentScores = await getRealAlignmentScores(
      attentionMatrix,
      cvKeywords,
      jobKeywords
    );

    // Identify gaps using REAL attention patterns
    const gapAnalysis = identifyGapsFromAttention(
      attentionMatrix,
      cvKeywords,
      jobKeywords
    );

    logger.info(
      "REAL cross-attention analysis completed using pre-trained models"
    );

    return {
      attentionMatrix,
      alignmentScores,
      gapAnalysis,
      cvSectionEmbeddings: {}, // Not needed with pre-trained models
      jobSectionEmbeddings: {}, // Not needed with pre-trained models
    };
  } catch (error) {
    logger.error(`REAL cross-attention analysis failed: ${error.message}`);
    throw new Error(`Pre-trained attention analysis failed: ${error.message}`);
  }
}

/**
 * Generate embeddings for each section
 */
async function generateSectionEmbeddings(sections) {
  const embeddings = {};

  for (const [sectionName, content] of Object.entries(sections)) {
    if (!content || content.trim().length === 0) {
      throw new Error(
        `Section ${sectionName} is empty - system requires complete data`
      );
    }

    try {
      embeddings[sectionName] = await generateEmbedding(content);
      logger.info(
        `Generated embedding for ${sectionName}: ${content.substring(
          0,
          100
        )}...`
      );
    } catch (error) {
      throw new Error(
        `Failed to generate embedding for ${sectionName}: ${error.message}`
      );
    }
  }

  return embeddings;
}

/**
 * Create attention matrix between CV and Job sections
 * Based on PROJECT_ROADMAP.md: "matrice d'alignement"
 */
function createAttentionMatrix(cvEmbeddings, jobEmbeddings) {
  const matrix = {};

  for (const [cvSection, cvEmbedding] of Object.entries(cvEmbeddings)) {
    if (!cvEmbedding) continue;

    matrix[cvSection] = {};

    for (const [jobSection, jobEmbedding] of Object.entries(jobEmbeddings)) {
      if (!jobEmbedding) continue;

      // Calculate attention weight (similarity score)
      const attentionWeight = cosineSimilarity(cvEmbedding, jobEmbedding);
      matrix[cvSection][jobSection] = attentionWeight;
    }
  }

  logger.info("Attention matrix created");
  return matrix;
}

/**
 * Calculate alignment scores using attention weights
 * Based on PROJECT_ROADMAP.md: "score final pondéré"
 */
function calculateAlignmentScores(attentionMatrix, cvKeywords, jobKeywords) {
  const scores = {
    hardSkills: 0,
    softSkills: 0,
    experience: 0,
    education: 0,
    overall: 0,
  };

  // Section weights (from PROJECT_ROADMAP.md)
  const sectionWeights = {
    hardSkills: 0.35,
    softSkills: 0.25,
    experience: 0.25,
    education: 0.15,
  };

  // Calculate scores for each category
  for (const category of Object.keys(sectionWeights)) {
    const cvSection = category;
    const jobSection = category;

    // Pure attention-based scoring - no fallbacks
    if (
      attentionMatrix[cvSection] &&
      attentionMatrix[cvSection][jobSection] !== undefined
    ) {
      const attentionWeight = attentionMatrix[cvSection][jobSection];
      scores[category] = Math.round(attentionWeight * 100);
    } else {
      // No attention data = no score (system must provide complete data)
      scores[category] = 0;
      logger.warn(
        `No attention data for ${category} - system requires complete embeddings`
      );
    }
  }

  // Calculate weighted overall score
  scores.overall = Math.round(
    scores.hardSkills * sectionWeights.hardSkills +
      scores.softSkills * sectionWeights.softSkills +
      scores.experience * sectionWeights.experience +
      scores.education * sectionWeights.education
  );

  logger.info(`Alignment scores calculated: ${JSON.stringify(scores)}`);
  return scores;
}

/**
 * Pure keyword similarity calculation - no fallbacks
 */
function calculateKeywordBasedSimilarity(cvKeywords, jobKeywords) {
  // System requires complete data - no fallbacks
  if (!cvKeywords || !jobKeywords) {
    throw new Error(
      "Keywords data is missing - system requires complete extraction"
    );
  }

  if (cvKeywords.length === 0 || jobKeywords.length === 0) {
    throw new Error("Empty keywords arrays - system requires non-empty data");
  }

  const cvSet = new Set(cvKeywords.map((k) => k.toLowerCase()));
  const jobSet = new Set(jobKeywords.map((k) => k.toLowerCase()));

  const intersection = new Set([...cvSet].filter((x) => jobSet.has(x)));
  const union = new Set([...cvSet, ...jobSet]);

  const jaccardSimilarity = intersection.size / union.size;
  return Math.round(jaccardSimilarity * 100);
}

/**
 * Identify gaps and opportunities from attention patterns
 * Based on PROJECT_ROADMAP.md: "détection des manques"
 */
function identifyGapsFromAttention(attentionMatrix, cvKeywords, jobKeywords) {
  const gaps = [];
  const opportunities = [];

  // Find sections with low attention weights
  for (const [cvSection, jobAlignments] of Object.entries(attentionMatrix)) {
    const maxAttention = Math.max(...Object.values(jobAlignments));

    if (maxAttention < 0.3) {
      gaps.push({
        cvSection,
        maxAttention: Math.round(maxAttention * 100),
        issue: `Low alignment between ${cvSection} and job requirements`,
      });
    }
  }

  // Find transferable skills (high attention in unexpected sections)
  for (const [cvSection, jobAlignments] of Object.entries(attentionMatrix)) {
    for (const [jobSection, attentionWeight] of Object.entries(jobAlignments)) {
      if (attentionWeight > 0.7 && cvSection !== jobSection) {
        opportunities.push({
          cvSection,
          jobSection,
          attentionWeight: Math.round(attentionWeight * 100),
          opportunity: `Strong ${cvSection} skills could transfer to ${jobSection} requirements`,
        });
      }
    }
  }

  return { gaps, opportunities };
}

/**
 * Ablation Study: Test impact of adding specific keywords
 * Based on PROJECT_ROADMAP.md: "études d'ablation"
 */
async function performAblationStudy(cvKeywords, jobKeywords, targetCategory) {
  logger.info(
    `Performing REAL ablation study for ${targetCategory} using pre-trained models...`
  );

  // Use REAL pre-trained models for ablation study
  return await performRealAblationStudy(
    cvKeywords,
    jobKeywords,
    targetCategory
  );
}

module.exports = {
  performCrossAttentionAnalysis,
  performAblationStudy,
};
