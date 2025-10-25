/**
 * Term Analysis Service - DISABLED
 *
 * Purpose: This service generates BULLSHIT percentages with no mathematical basis
 * Status: COMPLETELY DISABLED until proper mathematical foundation is implemented
 *
 * @module termAnalysisService
 */

const OpenAI = require("openai");
const logger = require("../utils/logger");
const { generateEmbedding, cosineSimilarity } = require("./embeddingService");

// Constants
const LLM_MODEL = "gpt-4o-mini";
const SUGGESTION_TEMPERATURE = 0.5; // Balance creativity and relevance
const LOW_SCORE_THRESHOLD = 0.6; // Terms below 60% get suggestions
const MIN_IMPROVEMENT_THRESHOLD = 3; // Minimum 3% improvement to suggest

// Section weights (must sum to 1.0)
const SECTION_WEIGHTS = {
  hardSkills: 0.35,
  softSkills: 0.25,
  experience: 0.25,
  education: 0.15,
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze key terms and generate TESTED suggestions
 *
 * @param {Object} cvKeywords - CV keywords by section
 * @param {Object} jobKeywords - Job keywords by section
 * @param {Object} jobEmbeddings - Pre-computed job section embeddings
 * @returns {Promise<Array>} Term analysis with validated suggestions
 */
async function analyzeTermsAndSuggest(cvKeywords, jobKeywords, jobEmbeddings) {
  // DISABLED: This function generates bullshit percentages with no mathematical basis
  logger.warn("Term analysis service is DISABLED - returns empty array");
  return [];
}

// extractKeyTerms removed - now using keywordExtractionService

// DISABLED: All suggestion functions removed - they generate bullshit percentages

module.exports = {
  analyzeTermsAndSuggest,
};
