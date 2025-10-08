/**
 * Term Analysis Service - AI-Powered Suggestions with Validation
 *
 * Purpose: Analyze each CV term and suggest PROVEN improvements
 * Method:
 *   1. Compare term embedding to job embedding
 *   2. If score < 60%, generate alternatives via GPT
 *   3. TEST each alternative with embeddings
 *   4. Only return if proven improvement ≥3%
 *   5. Calculate OVERALL impact (section weight × improvement)
 *
 * Key Innovation: Every suggestion is TESTED, not just generated
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
  try {
    logger.info("Starting keyword-based term analysis...");

    const termAnalysis = [];

    // Flatten CV keywords into analyzable terms
    const cvTerms = [
      ...cvKeywords.hardSkills.map((t) => ({ term: t, section: "hardSkills" })),
      ...cvKeywords.softSkills.map((t) => ({ term: t, section: "softSkills" })),
      ...cvKeywords.experience.map((t) => ({ term: t, section: "experience" })),
      ...cvKeywords.education.map((t) => ({ term: t, section: "education" })),
    ];

    // Analyze each CV keyword against job keywords
    for (const termData of cvTerms) {
      const { term, section } = termData;

      // Generate embedding for this specific term
      const termEmbedding = await generateEmbedding(term);

      // Compare term to relevant job section
      const relevantJobEmbedding = jobEmbeddings[section] || jobEmbeddings.full;
      const similarity = cosineSimilarity(termEmbedding, relevantJobEmbedding);

      // Categorize impact
      let impact = "neutral";
      if (similarity > 0.7) impact = "positive";
      else if (similarity < 0.4) impact = "negative";

      // Generate TESTED suggestions with OVERALL impact
      let suggestions = [];
      if (similarity < LOW_SCORE_THRESHOLD) {
        const jobKeywordsForSection = jobKeywords[section] || [];
        const sectionWeight = SECTION_WEIGHTS[section] || 0.25;

        suggestions = await generateAndTestSuggestions(
          term,
          jobKeywordsForSection,
          relevantJobEmbedding,
          sectionWeight
        );
      }

      termAnalysis.push({
        term,
        section,
        impact,
        score: Math.round(similarity * 100),
        suggestions,
      });
    }

    // Sort by impact: negative first (most urgent), then neutral, then positive
    termAnalysis.sort((a, b) => {
      const impactOrder = { negative: 0, neutral: 1, positive: 2 };
      return impactOrder[a.impact] - impactOrder[b.impact];
    });

    logger.info(
      `Term analysis complete. Analyzed ${termAnalysis.length} terms`
    );

    // Return top 15 most impactful (to avoid overwhelming user)
    return termAnalysis.slice(0, 15);
  } catch (error) {
    logger.error(`Term analysis failed: ${error.message}`);
    return [];
  }
}

// extractKeyTerms removed - now using keywordExtractionService

/**
 * Generate AND TEST suggestions - Only return proven improvements
 *
 * @param {string} term - Current CV term
 * @param {string[]} jobKeywords - Job keywords for this section
 * @param {number[]} jobEmbedding - Job section embedding
 * @returns {Promise<Array>} TESTED suggestions with proven improvement
 */
async function generateAndTestSuggestions(
  term,
  jobKeywords,
  jobEmbedding,
  sectionWeight
) {
  try {
    // Get current term's baseline score
    const currentEmbedding = await generateEmbedding(term);
    const currentSimilarity = cosineSimilarity(currentEmbedding, jobEmbedding);

    const prompt = `You are a CV optimizer. Candidate has: "${term}"
It scores only ${Math.round(currentSimilarity * 100)}% match.

Job requires: ${jobKeywords.slice(0, 10).join(", ")}

Suggest 4 alternative phrasings of "${term}" that better match job keywords.

Return JSON:
{
  "suggestions": [
    {"alternative": "improved term or phrase"}
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "CV optimizer. Return valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    const suggestions = result.suggestions || [];

    // TEST each suggestion - only keep if PROVEN to improve
    const validated = [];

    for (const sug of suggestions.slice(0, 4)) {
      const sugEmbedding = await generateEmbedding(sug.alternative);
      const newSimilarity = cosineSimilarity(sugEmbedding, jobEmbedding);
      const sectionImprovement = (newSimilarity - currentSimilarity) * 100;

      // Calculate impact on OVERALL score (section improvement × section weight)
      const overallImpact = sectionImprovement * sectionWeight;

      if (sectionImprovement >= 3) {
        validated.push({
          term: sug.alternative,
          reasoning: `Section: ${Math.round(
            currentSimilarity * 100
          )}% → ${Math.round(newSimilarity * 100)}% (+${Math.round(
            sectionImprovement
          )}%)`,
          expectedImprovement: Math.round(overallImpact), // OVERALL impact shown to user
        });
        logger.info(
          `✓ "${term}" → "${sug.alternative}" (Section +${Math.round(
            sectionImprovement
          )}%, Overall +${Math.round(overallImpact)}%)`
        );
      }
    }

    return validated.slice(0, 3);
  } catch (error) {
    logger.error(`Suggestion generation failed: ${error.message}`);
    return [];
  }
}

module.exports = {
  analyzeTermsAndSuggest,
};
