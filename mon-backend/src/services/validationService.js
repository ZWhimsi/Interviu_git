/**
 * Validation Service - Clinical Architecture
 *
 * Purpose: Ensure all data flows correctly through the system
 * No hardcodes, no fallbacks - everything must be precise
 *
 * @module validationService
 */

const logger = require("../utils/logger");

/**
 * Validate CV sections completeness
 */
function validateCVSections(cvSections) {
  const requiredSections = [
    "hardSkills",
    "softSkills",
    "experience",
    "education",
  ];

  for (const section of requiredSections) {
    if (!cvSections[section] || cvSections[section].trim().length === 0) {
      throw new Error(
        `CV section '${section}' is empty - system requires complete data`
      );
    }
  }

  logger.info("CV sections validation passed");
  return true;
}

/**
 * Validate Job sections completeness (flexible for education)
 */
function validateJobSections(jobSections) {
  const requiredSections = ["hardSkills", "softSkills", "experience"];

  const optionalSections = ["education"];

  // Check required sections
  for (const section of requiredSections) {
    if (!jobSections[section] || jobSections[section].trim().length === 0) {
      throw new Error(
        `Job section '${section}' is empty - system requires complete data`
      );
    }
  }

  // Check optional sections (warn but don't fail)
  for (const section of optionalSections) {
    if (!jobSections[section] || jobSections[section].trim().length === 0) {
      logger.warn(
        `Job section '${section}' is empty - this is optional for some job types`
      );
    }
  }

  logger.info("Job sections validation passed");
  return true;
}

/**
 * Validate keywords extraction completeness (flexible for education)
 */
function validateKeywords(cvKeywords, jobKeywords) {
  const requiredCategories = ["hardSkills", "softSkills", "experience"];
  const optionalCategories = ["education"];

  // Check required categories
  for (const category of requiredCategories) {
    if (!cvKeywords[category] || cvKeywords[category].length === 0) {
      throw new Error(
        `CV keywords for '${category}' are empty - extraction failed`
      );
    }

    if (!jobKeywords[category] || jobKeywords[category].length === 0) {
      throw new Error(
        `Job keywords for '${category}' are empty - extraction failed`
      );
    }
  }

  // Check optional categories (warn but don't fail)
  for (const category of optionalCategories) {
    if (!cvKeywords[category] || cvKeywords[category].length === 0) {
      logger.warn(`CV keywords for '${category}' are empty - this is optional`);
    }

    if (!jobKeywords[category] || jobKeywords[category].length === 0) {
      logger.warn(
        `Job keywords for '${category}' are empty - this is optional for some job types`
      );
    }
  }

  logger.info("Keywords validation passed");
  return true;
}

/**
 * Validate embeddings completeness (flexible for education)
 */
function validateEmbeddings(embeddings) {
  const requiredEmbeddings = ["hardSkills", "softSkills", "experience", "full"];

  const optionalEmbeddings = ["education"];

  // Check required embeddings
  for (const embeddingType of requiredEmbeddings) {
    if (
      !embeddings[embeddingType] ||
      !Array.isArray(embeddings[embeddingType]) ||
      embeddings[embeddingType].length === 0
    ) {
      throw new Error(
        `Embedding '${embeddingType}' is missing or empty - generation failed`
      );
    }
  }

  // Check optional embeddings (warn but don't fail)
  for (const embeddingType of optionalEmbeddings) {
    if (
      !embeddings[embeddingType] ||
      !Array.isArray(embeddings[embeddingType]) ||
      embeddings[embeddingType].length === 0
    ) {
      logger.warn(
        `Embedding '${embeddingType}' is missing or empty - this is optional`
      );
    }
  }

  logger.info("Embeddings validation passed");
  return true;
}

/**
 * Validate attention matrix completeness (flexible for education)
 */
function validateAttentionMatrix(attentionMatrix) {
  const requiredSections = ["hardSkills", "softSkills", "experience"];
  const optionalSections = ["education"];

  // Check required sections
  for (const cvSection of requiredSections) {
    if (!attentionMatrix[cvSection]) {
      throw new Error(`Attention matrix missing CV section '${cvSection}'`);
    }

    for (const jobSection of requiredSections) {
      if (attentionMatrix[cvSection][jobSection] === undefined) {
        throw new Error(
          `Attention matrix missing alignment for CV '${cvSection}' -> Job '${jobSection}'`
        );
      }
    }
  }

  // Check optional sections (warn but don't fail)
  for (const cvSection of optionalSections) {
    if (!attentionMatrix[cvSection]) {
      logger.warn(
        `Attention matrix missing CV section '${cvSection}' - this is optional`
      );
    } else {
      for (const jobSection of optionalSections) {
        if (attentionMatrix[cvSection][jobSection] === undefined) {
          logger.warn(
            `Attention matrix missing alignment for CV '${cvSection}' -> Job '${jobSection}' - this is optional`
          );
        }
      }
    }
  }

  logger.info("Attention matrix validation passed");
  return true;
}

/**
 * Validate scores completeness (flexible for education)
 */
function validateScores(scores) {
  const requiredScores = ["hardSkills", "softSkills", "experience", "overall"];

  const optionalScores = ["education"];

  // Check required scores
  for (const scoreType of requiredScores) {
    if (scores[scoreType] === undefined || scores[scoreType] === null) {
      throw new Error(`Score '${scoreType}' is missing - calculation failed`);
    }

    if (
      typeof scores[scoreType] !== "number" ||
      scores[scoreType] < 0 ||
      scores[scoreType] > 100
    ) {
      throw new Error(
        `Score '${scoreType}' is invalid: ${scores[scoreType]} - must be 0-100`
      );
    }
  }

  // Check optional scores (warn but don't fail)
  for (const scoreType of optionalScores) {
    if (scores[scoreType] === undefined || scores[scoreType] === null) {
      logger.warn(`Score '${scoreType}' is missing - this is optional`);
    } else if (
      typeof scores[scoreType] !== "number" ||
      scores[scoreType] < 0 ||
      scores[scoreType] > 100
    ) {
      logger.warn(
        `Score '${scoreType}' is invalid: ${scores[scoreType]} - this is optional`
      );
    }
  }

  logger.info("Scores validation passed");
  return true;
}

/**
 * Complete system validation
 */
function validateCompleteAnalysis(analysisData) {
  try {
    validateCVSections(analysisData.cvSections);
    validateJobSections(analysisData.jobSections);
    validateKeywords(analysisData.cvKeywords, analysisData.jobKeywords);
    validateEmbeddings(analysisData.cvEmbeddings);
    validateEmbeddings(analysisData.jobEmbeddings);
    validateAttentionMatrix(analysisData.attentionMatrix);
    validateScores(analysisData.scores);

    logger.info(
      "Complete analysis validation passed - system is clinically precise"
    );
    return true;
  } catch (error) {
    logger.error(`Analysis validation failed: ${error.message}`);
    throw error;
  }
}

module.exports = {
  validateCVSections,
  validateJobSections,
  validateKeywords,
  validateEmbeddings,
  validateAttentionMatrix,
  validateScores,
  validateCompleteAnalysis,
};
