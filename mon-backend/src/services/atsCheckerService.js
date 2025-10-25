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

  // Check 2: Quantifications (20 points) - Pure calculation
  const quantificationScore = Math.min(
    20,
    Math.round((checks.hasQuantifications.count / 5) * 20)
  );
  score += quantificationScore;

  if (checks.hasQuantifications.count >= 5) {
    logger.info(
      `[ATS] ✓ Good quantifications (${checks.hasQuantifications.count} found)`
    );
  } else {
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

  // Generate detailed explanations
  const explanations = generateDetailedExplanations(checks, score);

  return {
    atsScore: score,
    issues,
    recommendations,
    details: checks,
    explanations,
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

/**
 * Generate detailed explanations for ATS score
 */
function generateDetailedExplanations(checks, score) {
  const explanations = {
    overall: generateOverallExplanation(score),
    sections: generateSectionExplanation(checks.hasStandardSections),
    quantifications: generateQuantificationExplanation(
      checks.hasQuantifications
    ),
    formatting: generateFormattingExplanation(checks.hasProperFormatting),
    keywords: generateKeywordExplanation(checks.hasNoKeywordStuffing),
    length: generateLengthExplanation(checks.lengthAppropriate),
  };

  return explanations;
}

function generateOverallExplanation(score) {
  if (score >= 90) {
    return "Excellent ATS compatibility! Your CV is highly optimized for automated systems and should pass through most ATS filters without issues.";
  } else if (score >= 70) {
    return "Good ATS compatibility. Your CV should work well with most systems, though some improvements could increase your success rate.";
  } else if (score >= 50) {
    return "Moderate ATS compatibility. Your CV may face challenges with some systems. Consider implementing the recommended improvements.";
  } else {
    return "Poor ATS compatibility. Your CV needs significant improvements to pass through automated systems effectively.";
  }
}

function generateSectionExplanation(sectionCheck) {
  const { found, total, missing, score } = sectionCheck;

  if (score > 0.8) {
    return `Excellent section structure! Found ${found}/${total} standard sections. ATS systems can easily parse your CV structure.`;
  } else if (missing.length > 0) {
    return `Missing important sections: ${missing.join(
      ", "
    )}. ATS systems expect these standard headers to properly categorize your information. Without them, your qualifications may be overlooked.`;
  }
  return "Section headers need improvement for better ATS parsing.";
}

function generateQuantificationExplanation(quantCheck) {
  const { count, examples } = quantCheck;

  if (count >= 5) {
    return `Strong use of metrics! Found ${count} quantified achievements (e.g., ${examples
      .slice(0, 2)
      .join(
        ", "
      )}). This helps ATS systems recognize your concrete accomplishments.`;
  } else if (count > 0) {
    return `Limited quantification. Only ${count} metrics found. ATS systems favor CVs with specific numbers, percentages, and measurable results. Add more concrete achievements.`;
  }
  return "No quantified achievements found. ATS systems cannot identify the impact of your work without specific metrics.";
}

function generateFormattingExplanation(formatCheck) {
  const { isClean, hasEmojis, hasSpecialChars } = formatCheck;

  if (isClean) {
    return "Clean formatting detected. Your CV uses standard characters that ATS systems can parse without issues.";
  }

  let issues = [];
  if (hasEmojis) issues.push("emojis");
  if (hasSpecialChars) issues.push("special characters");

  return `Formatting issues found: ${issues.join(
    " and "
  )}. These can cause ATS parsing errors, potentially making sections of your CV unreadable to the system.`;
}

function generateKeywordExplanation(keywordCheck) {
  const { isClean, suspiciousWords } = keywordCheck;

  if (isClean) {
    return "Natural keyword usage detected. Your CV avoids keyword stuffing while maintaining relevant terms.";
  }

  const topWords = suspiciousWords
    .slice(0, 2)
    .map((w) => `"${w.word}" (${w.count}x)`)
    .join(", ");
  return `Potential keyword stuffing detected. Words like ${topWords} appear too frequently. This can trigger ATS spam filters and hurt your ranking.`;
}

function generateLengthExplanation(lengthCheck) {
  const { isGood, wordCount, issue } = lengthCheck;

  if (isGood) {
    return `Optimal CV length (${wordCount} words). This length allows comprehensive information while maintaining ATS readability.`;
  }

  if (wordCount < 200) {
    return `CV too short (${wordCount} words). ATS systems may not have enough content to properly evaluate your qualifications. Aim for 400-800 words.`;
  } else {
    return `CV too long (${wordCount} words). Many ATS systems have character limits or may truncate long CVs. Focus on the most relevant 2-3 years of experience.`;
  }
}

module.exports = {
  checkATSFriendliness,
};
