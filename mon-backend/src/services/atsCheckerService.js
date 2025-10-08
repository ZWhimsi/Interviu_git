/**
 * ATS Friendliness Checker Service
 *
 * Purpose: Evaluate CV format compatibility with Applicant Tracking Systems
 * Checks: Sections, Quantifications, Formatting, Keyword Stuffing, Length
 *
 * Scoring: 5 checks × 20 points = 100 points max
 *
 * @module atsCheckerService
 */

const logger = require("../utils/logger");

// Scoring weights - each check contributes equally
const POINTS_PER_CHECK = 20;
const SECTION_THRESHOLD = 0.8; // 80% of standard sections must be present
const MIN_QUANTIFICATIONS = 5; // Minimum quantified achievements
const IDEAL_WORD_COUNT_MIN = 200;
const IDEAL_WORD_COUNT_MAX = 1500;
const KEYWORD_FREQUENCY_THRESHOLD = 0.05; // Max 5% repetition

/**
 * Main function: Check ATS friendliness
 *
 * @param {string} cvText - Extracted CV text
 * @param {string} cvPath - Path to original PDF (for structure analysis)
 * @returns {Object} { score, issues, recommendations }
 */
async function checkATSFriendliness(cvText, cvPath = null) {
  logger.info("[ATS Checker] Starting ATS-friendliness analysis...");

  const checks = {
    hasStandardSections: checkStandardSections(cvText),
    hasQuantifications: checkQuantifications(cvText),
    hasProperFormatting: checkProperFormatting(cvText),
    hasNoKeywordStuffing: checkKeywordStuffing(cvText),
    lengthAppropriate: checkLength(cvText),
  };

  // Calculate score (each check = 20 points max)
  let score = 0;
  let issues = [];
  let recommendations = [];

  // Check 1: Standard Sections (20 points)
  if (checks.hasStandardSections.score > 0.8) {
    score += 20;
    logger.info("[ATS] ✓ Standard sections found");
  } else {
    score += Math.round(checks.hasStandardSections.score * 20);
    issues.push("Missing or non-standard section headers");
    recommendations.push(
      `Use standard headers like: ${checks.hasStandardSections.missing.join(
        ", "
      )}`
    );
    logger.warn(
      `[ATS] ⚠ Missing sections: ${checks.hasStandardSections.missing.join(
        ", "
      )}`
    );
  }

  // Check 2: Quantifications (20 points)
  if (checks.hasQuantifications.count >= 5) {
    score += 20;
    logger.info(
      `[ATS] ✓ Good quantifications (${checks.hasQuantifications.count} found)`
    );
  } else {
    score += Math.round((checks.hasQuantifications.count / 5) * 20);
    issues.push(
      `Only ${checks.hasQuantifications.count} quantified achievements found`
    );
    recommendations.push(
      "Add numbers and metrics to your achievements (%, $, time saved, team size, etc.)"
    );
    logger.warn(
      `[ATS] ⚠ Low quantifications: ${checks.hasQuantifications.count}/5`
    );
  }

  // Check 3: Proper Formatting (20 points)
  if (checks.hasProperFormatting.isClean) {
    score += 20;
    logger.info("[ATS] ✓ Clean formatting");
  } else {
    score += 10;
    issues.push("Potential formatting issues detected");
    recommendations.push(
      "Avoid special characters, emojis, and complex formatting. Use simple bullet points."
    );
    logger.warn("[ATS] ⚠ Formatting issues detected");
  }

  // Check 4: No Keyword Stuffing (20 points)
  if (checks.hasNoKeywordStuffing.isClean) {
    score += 20;
    logger.info("[ATS] ✓ No keyword stuffing");
  } else {
    score += 10;
    issues.push("Possible keyword stuffing detected");
    recommendations.push(
      "Integrate keywords naturally in context, not as random lists"
    );
    logger.warn("[ATS] ⚠ Keyword stuffing suspected");
  }

  // Check 5: Length (20 points)
  if (checks.lengthAppropriate.isGood) {
    score += 20;
    logger.info(
      `[ATS] ✓ Appropriate length (${checks.lengthAppropriate.wordCount} words)`
    );
  } else {
    score += 10;
    issues.push(checks.lengthAppropriate.issue);
    recommendations.push(checks.lengthAppropriate.recommendation);
    logger.warn(`[ATS] ⚠ Length issue: ${checks.lengthAppropriate.issue}`);
  }

  logger.info(`[ATS Checker] Final ATS Score: ${score}/100`);
  logger.info(`[ATS Checker] Issues found: ${issues.length}`);

  return {
    atsScore: score,
    issues,
    recommendations,
    details: checks,
  };
}

/**
 * Check for standard section headers
 */
function checkStandardSections(cvText) {
  const standardSections = [
    {
      patterns: [/experience/i, /work\s+history/i, /employment/i],
      name: "Experience",
    },
    {
      patterns: [/education/i, /academic/i, /qualification/i],
      name: "Education",
    },
    { patterns: [/skills/i, /competenc/i, /expertise/i], name: "Skills" },
  ];

  let foundCount = 0;
  const missing = [];

  for (const section of standardSections) {
    const found = section.patterns.some((pattern) => pattern.test(cvText));
    if (found) {
      foundCount++;
    } else {
      missing.push(section.name);
    }
  }

  return {
    score: foundCount / standardSections.length,
    found: foundCount,
    total: standardSections.length,
    missing,
  };
}

/**
 * Check for quantified achievements
 */
function checkQuantifications(cvText) {
  const quantPatterns = [
    /\d+%/g, // Percentages (40%)
    /\$\d+[MKk]?/g, // Money ($2M, $50K)
    /\d+\+?\s*(years?|months?)/gi, // Time periods
    /team of \d+/gi, // Team size
    /\d+x/gi, // Multipliers (2x faster)
    /reduced.*by \d+/gi, // Reductions
    /increased.*by \d+/gi, // Increases
    /grew.*from \d+.*to \d+/gi, // Growth
  ];

  let totalCount = 0;
  const examples = [];

  for (const pattern of quantPatterns) {
    const matches = cvText.match(pattern);
    if (matches) {
      totalCount += matches.length;
      examples.push(...matches.slice(0, 2));
    }
  }

  return {
    count: totalCount,
    examples: examples.slice(0, 5),
  };
}

/**
 * Check for clean formatting
 */
function checkProperFormatting(cvText) {
  // Check for problematic characters
  const hasEmojis =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/gu.test(
      cvText
    );
  const hasSpecialChars = /[★☆●○■□▪▫◆◇]/.test(cvText);
  const hasTooManySymbols = (cvText.match(/[►▸‣⦿⦾]/g) || []).length > 10;

  const isClean = !hasEmojis && !hasSpecialChars && !hasTooManySymbols;

  return {
    isClean,
    hasEmojis,
    hasSpecialChars,
  };
}

/**
 * Detect keyword stuffing
 */
function checkKeywordStuffing(cvText) {
  const words = cvText.toLowerCase().split(/\s+/);
  const wordFreq = {};

  // Count word frequencies
  for (const word of words) {
    if (word.length > 3) {
      // Ignore short words
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }

  // Find words repeated too many times
  const totalWords = words.length;
  const suspiciousWords = [];

  for (const [word, count] of Object.entries(wordFreq)) {
    const frequency = count / totalWords;
    // If a word appears in >5% of the text, it's suspicious
    if (frequency > 0.05 && count > 10) {
      suspiciousWords.push({ word, count });
    }
  }

  return {
    isClean: suspiciousWords.length === 0,
    suspiciousWords: suspiciousWords.slice(0, 3),
  };
}

/**
 * Check CV length
 */
function checkLength(cvText) {
  const wordCount = cvText.split(/\s+/).length;

  let isGood = true;
  let issue = null;
  let recommendation = null;

  if (wordCount < 200) {
    isGood = false;
    issue = "CV is too short";
    recommendation =
      "Expand your CV with more details about your experience and achievements (aim for 400-800 words)";
  } else if (wordCount > 1500) {
    isGood = false;
    issue = "CV is too long";
    recommendation =
      "Condense your CV to 1-2 pages (aim for 400-800 words total)";
  }

  return {
    isGood,
    wordCount,
    issue,
    recommendation,
  };
}

module.exports = {
  checkATSFriendliness,
};
