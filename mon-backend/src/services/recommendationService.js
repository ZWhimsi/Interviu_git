/**
 * Intelligent Recommendation Service
 *
 * Purpose: Generate specific, actionable, tailored recommendations
 * Method: GPT-4o-mini compares CV vs Job keywords to identify GAPS
 * Key: Only suggests MISSING elements (not duplicates)
 *
 * @module recommendationService
 */

const OpenAI = require("openai");
const logger = require("../utils/logger");

// Constants
const LLM_MODEL = "gpt-4o-mini";
const RECOMMENDATION_TEMPERATURE = 0.7; // Balance creativity and consistency

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate intelligent, tailored recommendations
 * Based on actual CV keywords vs Job keywords (not full sections - reduces noise)
 *
 * @param {Object} cvSections - CV keywords by section
 * @param {Object} jobSections - Job keywords by section
 * @param {Object} scores - Calculated scores
 * @param {Array} strengths - Identified strengths
 * @param {Array} weaknesses - Identified weaknesses
 * @returns {Promise<Array>} Specific, actionable recommendations (5-8 items)
 */
async function generateIntelligentRecommendations(
  cvSections,
  jobSections,
  scores,
  strengths,
  weaknesses
) {
  try {
    const prompt = `You are a CV optimization expert. Compare what the job REQUIRES vs what the CV HAS.

JOB REQUIRES:
Hard Skills: ${jobSections.hardSkills?.join(", ") || "Not specified"}
Soft Skills: ${jobSections.softSkills?.join(", ") || "Not specified"}
Experience: ${jobSections.experience?.join(", ") || "Not specified"}
Education: ${jobSections.education?.join(", ") || "Not specified"}

CV CURRENTLY HAS:
Hard Skills: ${cvSections.hardSkills?.join(", ") || "None listed"}
Soft Skills: ${cvSections.softSkills?.join(", ") || "None listed"}
Experience: ${cvSections.experience?.join(", ") || "None listed"}
Education: ${cvSections.education?.join(", ") || "None listed"}

CRITICAL: Only suggest adding things that are MISSING from the CV!
- If CV has "C++" and job wants "C++", DON'T suggest adding it again
- If CV has "problem-solving" don't suggest "add problem-solving"
- Look for GAPS: what job requires that CV doesn't mention

SCORES:
- Hard Skills: ${scores.hardSkills}% ${
      scores.hardSkills < 70 ? "(NEEDS IMPROVEMENT)" : ""
    }
- Soft Skills: ${scores.softSkills}% ${
      scores.softSkills < 70 ? "(NEEDS IMPROVEMENT)" : ""
    }
- Experience: ${scores.experience}% ${
      scores.experience < 70 ? "(NEEDS IMPROVEMENT)" : ""
    }
- Education: ${scores.education}% ${
      scores.education < 70 ? "(NEEDS IMPROVEMENT)" : ""
    }
- Overall: ${scores.overall}%

Generate 5-7 recommendations for MISSING elements or IMPROVEMENTS:

ONLY suggest:
1. Skills job requires that CV doesn't have
2. Ways to REPHRASE existing content to match job language
3. QUANTIFICATION of existing achievements
4. Specific gaps in requirements vs CV

GOOD examples:
- "Add 'Docker containerization' since job requires it and you don't mention it"
- "Rephrase 'team member' as 'collaborated with cross-functional teams' to match job's teamwork requirement"
- "Quantify: Change 'improved system' to 'reduced latency by X%' to show impact"

BAD examples (DON'T do):
- "Add C++" (if already in CV!) ❌
- "Show problem-solving" (if already mentioned!) ❌
- "Add more skills" (too vague) ❌

Return JSON:
{
  "recommendations": [
    "specific actionable recommendation 1",
    "specific actionable recommendation 2",
    ...
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional CV consultant. Give specific, tailored advice. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    logger.info(
      `Generated ${
        result.recommendations?.length || 0
      } intelligent recommendations`
    );

    return result.recommendations || [];
  } catch (error) {
    logger.error(`Intelligent recommendations failed: ${error.message}`);
    // Fallback to basic recommendations
    return generateFallbackRecommendations(scores, weaknesses);
  }
}

/**
 * Fallback recommendations if LLM fails
 */
function generateFallbackRecommendations(scores, weaknesses) {
  const recommendations = [];

  if (scores.hardSkills < 70) {
    recommendations.push(
      "Add more specific technical skills mentioned in the job description"
    );
  }

  if (scores.softSkills < 70) {
    recommendations.push(
      "Highlight leadership experiences and team collaboration"
    );
  }

  if (scores.experience < 70) {
    recommendations.push(
      "Emphasize relevant work experience and quantify achievements"
    );
  }

  if (scores.education < 70) {
    recommendations.push(
      "Ensure your education section is prominent and detailed"
    );
  }

  return recommendations;
}

module.exports = {
  generateIntelligentRecommendations,
};
