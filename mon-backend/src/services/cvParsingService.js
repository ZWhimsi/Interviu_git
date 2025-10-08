/**
 * CV Parsing Service - Regex-Based Fallback
 *
 * Purpose: Fallback parsing when LLM fails or for testing
 * Method: Regex patterns + heuristics
 * Note: Less robust than LLM but fast and free
 *
 * @module cvParsingService
 */

const logger = require("../utils/logger");

/**
 * Extract sections from CV using regex patterns
 * Used as fallback when LLM parsing fails
 *
 * @param {string} cvText - CV text
 * @returns {Object} Extracted sections
 */
function extractCVSections(cvText) {
  const sections = {
    hardSkills: "",
    softSkills: "",
    education: "",
    experience: "",
    summary: "",
  };

  const lines = cvText.split("\n");
  let currentSection = null;
  let sectionContent = [];

  // Pattern matching for section headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect section headers
    if (
      /^(technical\s+)?skills?$/i.test(line) ||
      /^competenc(es|ies)$/i.test(line)
    ) {
      if (currentSection) sections[currentSection] = sectionContent.join("\n");
      currentSection = "hardSkills";
      sectionContent = [];
    } else if (
      /^(work\s+)?experience$/i.test(line) ||
      /^employment/i.test(line)
    ) {
      if (currentSection) sections[currentSection] = sectionContent.join("\n");
      currentSection = "experience";
      sectionContent = [];
    } else if (/^education$/i.test(line) || /^academic/i.test(line)) {
      if (currentSection) sections[currentSection] = sectionContent.join("\n");
      currentSection = "education";
      sectionContent = [];
    } else if (
      /^(professional\s+)?summary$/i.test(line) ||
      /^objective$/i.test(line)
    ) {
      if (currentSection) sections[currentSection] = sectionContent.join("\n");
      currentSection = "summary";
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections[currentSection] = sectionContent.join("\n");
  }

  // Extract soft skills from experience
  sections.softSkills = extractSoftSkillsFromText(cvText);

  // Fallback heuristics if sections not found
  if (!sections.hardSkills && !sections.experience) {
    sections.hardSkills = extractHardSkillsHeuristic(cvText);
    sections.experience = extractExperienceHeuristic(cvText);
    sections.education = extractEducationHeuristic(cvText);
  }

  logger.info(
    `Extracted CV sections: ${Object.keys(sections)
      .filter((k) => sections[k])
      .join(", ")}`
  );

  return sections;
}

/**
 * Extract sections from job description
 */
function extractJobSections(jobText) {
  const sections = {
    hardSkills: "",
    softSkills: "",
    experience: "",
    responsibilities: "",
  };

  // Simple keyword-based extraction
  const hardSkillPatterns = [
    /\b(python|javascript|java|react|node|aws|docker|kubernetes|sql|typescript|git)\b/gi,
  ];

  const softSkillPatterns = [
    /\b(leadership|communication|teamwork|collaboration|problem[\s-]solving|analytical)\b/gi,
  ];

  sections.hardSkills = extractMatchingText(jobText, hardSkillPatterns);
  sections.softSkills = extractMatchingText(jobText, softSkillPatterns);

  // Experience requirements
  const expMatch = jobText.match(/(\d+)\+?\s*years?\s+(?:of\s+)?experience/i);
  if (expMatch) {
    sections.experience = `${expMatch[1]}+ years required`;
  }

  logger.info("Extracted job sections");
  return sections;
}

/**
 * Helper functions
 */
function extractSoftSkillsFromText(text) {
  const indicators = [
    "led",
    "managed",
    "coordinated",
    "mentored",
    "presented",
    "collaborated",
  ];
  const lines = text.split("\n");
  const skillLines = lines.filter((line) => {
    const lineLower = line.toLowerCase();
    return indicators.some((ind) => lineLower.includes(ind));
  });
  return skillLines.join("\n").substring(0, 2000);
}

function extractHardSkillsHeuristic(text) {
  const techTerms = [
    "python",
    "javascript",
    "react",
    "node",
    "aws",
    "docker",
    "sql",
  ];
  const lines = text.split("\n");
  const skillLines = lines.filter((line) => {
    const lineLower = line.toLowerCase();
    return techTerms.some((term) => lineLower.includes(term));
  });
  return skillLines.join("\n").substring(0, 1000);
}

function extractExperienceHeuristic(text) {
  const lines = text.split("\n");
  const expLines = lines.filter((line) =>
    /\d{4}\s*-\s*(?:\d{4}|present|current)/i.test(line)
  );
  return expLines.join("\n").substring(0, 2000);
}

function extractEducationHeuristic(text) {
  const lines = text.split("\n");
  const eduLines = lines.filter((line) =>
    /bachelor|master|phd|university|degree/i.test(line)
  );
  return eduLines.join("\n").substring(0, 1000);
}

function extractMatchingText(text, patterns) {
  let extracted = "";
  patterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) extracted += matches.join(" ") + " ";
  });
  return extracted.trim().substring(0, 1000);
}

module.exports = {
  extractCVSections,
  extractJobSections,
};

