/**
 * Group Embedding Service
 *
 * Purpose: Create enhanced embeddings by grouping related keywords
 * instead of simple concatenation. This provides better context
 * and semantic understanding.
 *
 * @module groupEmbeddingService
 */

const { generateEmbedding } = require("./embeddingService");
const logger = require("../utils/logger");

/**
 * Generate group embeddings with contextual sentences
 *
 * @param {Object} groupedKeywords - Keywords grouped by subcategories
 * @param {string} category - Category name (e.g., "hardSkills", "softSkills")
 * @returns {Promise<Array>} Enhanced embedding
 */
async function generateGroupEmbedding(groupedKeywords, category) {
  try {
    if (!groupedKeywords || typeof groupedKeywords !== "object") {
      // Fallback to simple list if not grouped
      if (Array.isArray(groupedKeywords)) {
        const text = groupedKeywords.join(", ");
        return generateEmbedding(text);
      }
      return generateEmbedding("none");
    }

    // Create contextual sentences for each group
    const contextualSentences = [];

    // Category-specific sentence generation
    switch (category) {
      case "hardSkills":
        contextualSentences.push(
          ...generateTechnicalSentences(groupedKeywords)
        );
        break;
      case "softSkills":
        contextualSentences.push(
          ...generateSoftSkillSentences(groupedKeywords)
        );
        break;
      case "experience":
        contextualSentences.push(
          ...generateExperienceSentences(groupedKeywords)
        );
        break;
      case "education":
        contextualSentences.push(
          ...generateEducationSentences(groupedKeywords)
        );
        break;
      default:
        // Generic grouping
        for (const [subcat, keywords] of Object.entries(groupedKeywords)) {
          if (Array.isArray(keywords) && keywords.length > 0) {
            contextualSentences.push(`${subcat}: ${keywords.join(", ")}`);
          }
        }
    }

    // Join with semantic connectors
    const enhancedText = contextualSentences.join(". ");

    logger.info(
      `Generated group embedding for ${category}: ${enhancedText.substring(
        0,
        100
      )}...`
    );

    return generateEmbedding(enhancedText);
  } catch (error) {
    logger.error(`Group embedding generation failed: ${error.message}`);
    // Fallback to simple concatenation
    const fallbackText = Object.values(groupedKeywords).flat().join(", ");
    return generateEmbedding(fallbackText);
  }
}

/**
 * Generate contextual sentences for technical skills
 */
function generateTechnicalSentences(grouped) {
  const sentences = [];

  if (grouped.languages && grouped.languages.length > 0) {
    sentences.push(
      `Proficient in ${grouped.languages.join(", ")} programming languages`
    );
  }

  if (grouped.frameworks && grouped.frameworks.length > 0) {
    sentences.push(
      `Experienced with ${grouped.frameworks.join(", ")} frameworks`
    );
  }

  if (grouped.databases && grouped.databases.length > 0) {
    sentences.push(
      `Database expertise includes ${grouped.databases.join(", ")}`
    );
  }

  if (grouped.cloud && grouped.cloud.length > 0) {
    sentences.push(`Cloud technologies: ${grouped.cloud.join(", ")}`);
  }

  if (grouped.tools && grouped.tools.length > 0) {
    sentences.push(`Utilizes ${grouped.tools.join(", ")} development tools`);
  }

  return sentences;
}

/**
 * Generate contextual sentences for soft skills
 */
function generateSoftSkillSentences(grouped) {
  const sentences = [];

  if (grouped.leadership && grouped.leadership.length > 0) {
    sentences.push(`Leadership capabilities: ${grouped.leadership.join(", ")}`);
  }

  if (grouped.communication && grouped.communication.length > 0) {
    sentences.push(
      `Strong ${grouped.communication.join(", ")} communication skills`
    );
  }

  if (grouped.collaboration && grouped.collaboration.length > 0) {
    sentences.push(
      `Collaborative approach includes ${grouped.collaboration.join(", ")}`
    );
  }

  if (grouped.problemSolving && grouped.problemSolving.length > 0) {
    sentences.push(
      `Problem-solving through ${grouped.problemSolving.join(", ")}`
    );
  }

  if (grouped.traits && grouped.traits.length > 0) {
    sentences.push(`Personal traits: ${grouped.traits.join(", ")}`);
  }

  return sentences;
}

/**
 * Generate contextual sentences for experience
 */
function generateExperienceSentences(grouped) {
  const sentences = [];

  if (grouped.roles && grouped.roles.length > 0) {
    sentences.push(`Professional roles include ${grouped.roles.join(", ")}`);
  }

  if (grouped.achievements && grouped.achievements.length > 0) {
    sentences.push(`Key achievements: ${grouped.achievements.join(", ")}`);
  }

  if (grouped.projects && grouped.projects.length > 0) {
    sentences.push(`Project experience in ${grouped.projects.join(", ")}`);
  }

  if (grouped.domains && grouped.domains.length > 0) {
    sentences.push(`Industry experience: ${grouped.domains.join(", ")}`);
  }

  if (grouped.metrics && grouped.metrics.length > 0) {
    sentences.push(`Experience metrics: ${grouped.metrics.join(", ")}`);
  }

  if (grouped.years && grouped.years.length > 0) {
    sentences.push(`Experience level: ${grouped.years.join(", ")}`);
  }

  return sentences;
}

/**
 * Generate contextual sentences for education
 */
function generateEducationSentences(grouped) {
  const sentences = [];

  if (grouped.degrees && grouped.degrees.length > 0) {
    sentences.push(`Educational background: ${grouped.degrees.join(", ")}`);
  }

  if (grouped.certifications && grouped.certifications.length > 0) {
    sentences.push(
      `Professional certifications: ${grouped.certifications.join(", ")}`
    );
  }

  if (grouped.specializations && grouped.specializations.length > 0) {
    sentences.push(`Specialized in ${grouped.specializations.join(", ")}`);
  }

  if (grouped.institutions && grouped.institutions.length > 0) {
    sentences.push(`Studied at ${grouped.institutions.join(", ")}`);
  }

  if (grouped.skills && grouped.skills.length > 0) {
    sentences.push(`Academic skills: ${grouped.skills.join(", ")}`);
  }

  return sentences;
}

/**
 * Generate embeddings for all categories with grouping
 */
async function generateAllGroupEmbeddings(keywords) {
  try {
    const embeddings = {};

    // Use grouped structure if available
    if (keywords.grouped) {
      embeddings.hardSkills = await generateGroupEmbedding(
        keywords.grouped.hardSkills,
        "hardSkills"
      );
      embeddings.softSkills = await generateGroupEmbedding(
        keywords.grouped.softSkills,
        "softSkills"
      );
      embeddings.experience = await generateGroupEmbedding(
        keywords.grouped.experience,
        "experience"
      );
      embeddings.education = await generateGroupEmbedding(
        keywords.grouped.education,
        "education"
      );
    } else {
      // Fallback to simple embeddings
      embeddings.hardSkills = await generateEmbedding(
        keywords.hardSkills.length > 0 ? keywords.hardSkills.join(", ") : "none"
      );
      embeddings.softSkills = await generateEmbedding(
        keywords.softSkills.length > 0 ? keywords.softSkills.join(", ") : "none"
      );
      embeddings.experience = await generateEmbedding(
        keywords.experience.length > 0 ? keywords.experience.join(", ") : "none"
      );
      embeddings.education = await generateEmbedding(
        keywords.education.length > 0 ? keywords.education.join(", ") : "none"
      );
    }

    // Always generate full text embedding
    embeddings.full = await generateEmbedding(
      Object.values(keywords)
        .filter((v) => Array.isArray(v))
        .flat()
        .join(", ")
    );

    return embeddings;
  } catch (error) {
    logger.error(`Failed to generate group embeddings: ${error.message}`);
    throw error;
  }
}

module.exports = {
  generateGroupEmbedding,
  generateAllGroupEmbeddings,
};

