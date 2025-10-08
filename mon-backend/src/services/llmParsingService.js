/**
 * LLM-Based Parsing Service
 *
 * Purpose: Use GPT-4o-mini to intelligently extract structured data from unstructured text
 * Why: More robust than regex - understands context, handles variations, no maintenance
 *
 * @module llmParsingService
 */

const OpenAI = require("openai");
const logger = require("../utils/logger");

// Constants
const LLM_MODEL = "gpt-4o-mini"; // Cost-effective, good quality
const PARSING_TEMPERATURE = 0.1; // Low = more consistent
const MAX_CV_LENGTH = 6000; // Characters for CV parsing
const MAX_JOB_LENGTH = 4000; // Characters for job parsing

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse CV using LLM (more robust than regex)
 * Extracts: hardSkills, softSkills, education, experience, summary
 *
 * @param {string} cvText - Raw CV text from PDF
 * @returns {Promise<Object>} Structured sections
 */
async function parseCVWithLLM(cvText) {
  try {
    const prompt = `You are a CV parsing expert. Extract and categorize information from this CV.

CV TEXT:
${cvText.substring(0, MAX_CV_LENGTH)}

Extract the following sections and return ONLY valid JSON:

{
  "hardSkills": "List ALL technical skills, tools, technologies, programming languages, frameworks, certifications",
  "softSkills": "List ALL soft skills like leadership, communication, teamwork (look for action verbs: led, managed, coordinated, mentored, etc.)",
  "education": "List degrees, universities, graduation dates, relevant coursework",
  "experience": "List job titles, companies, dates, key responsibilities and achievements",
  "summary": "Professional summary or career objective if present"
}

IMPORTANT:
- Be comprehensive - include ALL relevant information
- For softSkills, look for action verbs and leadership indicators
- For hardSkills, include every technical term mentioned
- Keep original phrasing when possible
- If a section is missing, use empty string ""

Return ONLY the JSON object, no other text.`;

    const response = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a precise CV parsing assistant. Always return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: PARSING_TEMPERATURE,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    logger.info("CV parsed successfully with LLM");

    // Return with guaranteed structure
    return {
      hardSkills: parsed.hardSkills || "",
      softSkills: parsed.softSkills || "",
      education: parsed.education || "",
      experience: parsed.experience || "",
      summary: parsed.summary || "",
    };
  } catch (error) {
    logger.error(`LLM CV parsing failed: ${error.message}`);
    // Fallback to heuristic parsing
    return fallbackCVParsing(cvText);
  }
}

/**
 * Parse Job Description using LLM
 * Extracts: requirements, qualifications, responsibilities
 *
 * @param {string} jobText - Job description text
 * @returns {Promise<Object>} Structured requirements
 */
async function parseJobWithLLM(jobText) {
  try {
    const prompt = `You are a job description analyzer. Extract requirements from this job posting.

JOB DESCRIPTION:
${jobText.substring(0, MAX_JOB_LENGTH)}

Extract the following and return ONLY valid JSON:

{
  "hardSkills": "ALL technical requirements: tools, technologies, languages, frameworks",
  "softSkills": "ALL soft skills required: leadership, communication, teamwork, problem-solving",
  "experience": "Required years of experience and type of experience needed",
  "education": "Educational requirements: degree level, field of study",
  "responsibilities": "Key responsibilities of the role"
}

IMPORTANT:
- Extract EVERY technical requirement mentioned
- Include specific years of experience if stated
- Be comprehensive
- If section missing, use empty string ""

Return ONLY the JSON object.`;

    const response = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a precise job requirement extractor. Always return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: PARSING_TEMPERATURE,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    logger.info("Job description parsed successfully with LLM");

    return {
      hardSkills: parsed.hardSkills || "",
      softSkills: parsed.softSkills || "",
      experience: parsed.experience || "",
      education: parsed.education || "",
      responsibilities: parsed.responsibilities || "",
    };
  } catch (error) {
    logger.error(`LLM job parsing failed: ${error.message}`);
    // Fallback to heuristic parsing
    return fallbackJobParsing(jobText);
  }
}

/**
 * Fallback: Use regex-based parsing if LLM fails
 * Imports original cvParsingService for backward compatibility
 */
function fallbackCVParsing(cvText) {
  const { extractCVSections } = require("./cvParsingService");
  logger.warn("Using fallback CV parsing (regex-based)");
  return extractCVSections(cvText);
}

function fallbackJobParsing(jobText) {
  const { extractJobSections } = require("./cvParsingService");
  logger.warn("Using fallback job parsing (regex-based)");
  return extractJobSections(jobText);
}

module.exports = {
  parseCVWithLLM,
  parseJobWithLLM,
};

