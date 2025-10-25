const OpenAI = require("openai");
const logger = require("../utils/logger");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Check semantic match between keyword and CV text
 * More flexible than exact string matching
 */
function checkSemanticMatch(keyword, cvText) {
  // Remove common words and check for meaningful matches
  const commonWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
  ];
  const keywordWords = keyword
    .split(" ")
    .filter((word) => !commonWords.includes(word.toLowerCase()));

  if (keywordWords.length === 0) return false;

  // Check if most meaningful words from keyword exist in CV
  const meaningfulMatches = keywordWords.filter(
    (word) =>
      cvText.includes(word.toLowerCase()) ||
      cvText.includes(word.toLowerCase() + "s") || // plural forms
      cvText.includes(word.toLowerCase() + "ing") // gerund forms
  );

  // Require at least 50% of meaningful words to match
  return meaningfulMatches.length >= Math.ceil(keywordWords.length * 0.5);
}

/**
 * Helper function to flatten grouped keywords
 */
function flattenGroupedKeywords(groupedKeywords) {
  if (Array.isArray(groupedKeywords)) {
    return groupedKeywords;
  }

  if (typeof groupedKeywords === "object" && groupedKeywords !== null) {
    return Object.values(groupedKeywords).flat();
  }

  return [];
}

/**
 * Validate extracted keywords against original CV text
 * Removes any keywords that are not actually mentioned in the CV
 */
function validateExtractedKeywords(cvText, extractedKeywords) {
  const cvTextLower = cvText.toLowerCase();
  const validatedKeywords = {};

  for (const category in extractedKeywords) {
    if (Array.isArray(extractedKeywords[category])) {
      validatedKeywords[category] = extractedKeywords[category].filter(
        (keyword) => {
          const keywordLower = keyword.toLowerCase();
          // More flexible matching - check for partial matches and variations
          return (
            cvTextLower.includes(keywordLower) ||
            keywordLower
              .split(" ")
              .some((word) => cvTextLower.includes(word)) ||
            checkSemanticMatch(keywordLower, cvTextLower)
          );
        }
      );
    } else if (
      typeof extractedKeywords[category] === "object" &&
      extractedKeywords[category] !== null
    ) {
      // Handle grouped keywords
      validatedKeywords[category] = {};
      for (const subcategory in extractedKeywords[category]) {
        if (Array.isArray(extractedKeywords[category][subcategory])) {
          validatedKeywords[category][subcategory] = extractedKeywords[
            category
          ][subcategory].filter((keyword) => {
            const keywordLower = keyword.toLowerCase();
            // More flexible matching for grouped keywords
            return (
              cvTextLower.includes(keywordLower) ||
              keywordLower
                .split(" ")
                .some((word) => cvTextLower.includes(word)) ||
              checkSemanticMatch(keywordLower, cvTextLower)
            );
          });
        }
      }
    }
  }

  // Log validation details for debugging
  logger.info("=== VALIDATION DETAILS ===");
  for (const category in validatedKeywords) {
    if (Array.isArray(validatedKeywords[category])) {
      logger.info(
        `${category}: ${validatedKeywords[category].length} keywords validated`
      );
      if (validatedKeywords[category].length === 0) {
        logger.warn(`WARNING: No ${category} keywords passed validation!`);
      }
    } else if (
      typeof validatedKeywords[category] === "object" &&
      validatedKeywords[category] !== null
    ) {
      let totalValidated = 0;
      for (const subcategory in validatedKeywords[category]) {
        if (Array.isArray(validatedKeywords[category][subcategory])) {
          totalValidated += validatedKeywords[category][subcategory].length;
        }
      }
      logger.info(
        `${category}: ${totalValidated} keywords validated across subcategories`
      );
      if (totalValidated === 0) {
        logger.warn(`WARNING: No ${category} keywords passed validation!`);
      }
    }
  }

  return validatedKeywords;
}

/**
 * Extract COMPREHENSIVE keywords from CV
 * Groups by subcategories for better embeddings
 *
 * @param {Object} cvSections - Parsed CV sections
 * @returns {Promise<Object>} Key terms by category (flattened + grouped)
 */
async function extractCVKeywords(cvSections, cvText = "") {
  try {
    const prompt = `Extract ONLY the keywords that are ACTUALLY MENTIONED in this CV. Do not invent or assume anything.

CV Content:
Hard Skills: ${String(cvSections.hardSkills || "").substring(0, 1200)}
Soft Skills: ${String(cvSections.softSkills || "").substring(0, 800)}
Experience: ${String(cvSections.experience || "").substring(0, 1200)}
Education: ${String(cvSections.education || "").substring(0, 600)}

CRITICAL REQUIREMENTS:
- Extract ALL keywords that are explicitly mentioned in the CV
- Extract as many relevant keywords as possible - no artificial limits
- Be comprehensive - extract everything that could be relevant
- Focus on exact matches and clear mentions
- Do not add technologies that are not explicitly mentioned
- Do not assume skills based on job titles or roles

Focus on:
- Technical: ONLY programming languages, frameworks, tools explicitly mentioned
- Soft skills: ONLY leadership, communication skills explicitly mentioned
- Experience: ONLY roles, achievements, metrics explicitly mentioned
- Education: ONLY degrees, certifications, institutions explicitly mentioned

Return grouped JSON:
{
  "hardSkills": {
    "languages": ["Python", "JavaScript", "TypeScript", "Java", "C++"],
    "frameworks": ["React", "Node.js", "Express", "Django", "Spring"],
    "databases": ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
    "cloud": ["AWS", "Lambda", "S3", "EC2", "Docker", "Kubernetes"],
    "tools": ["Git", "Jenkins", "JIRA", "Webpack"]
  },
  "softSkills": {
    "leadership": ["team leadership", "mentoring", "coaching"],
    "communication": ["client communication", "presentations", "documentation"],
    "collaboration": ["cross-functional", "agile", "pair programming"],
    "problemSolving": ["analytical", "debugging", "troubleshooting"]
  },
  "experience": {
    "roles": ["Senior Engineer", "Full Stack Developer"],
    "achievements": ["40% improvement", "$2M savings", "led 8 people"],
    "projects": ["e-commerce", "microservices", "API development"],
    "metrics": ["5 years", "10+ projects", "3 promotions"]
  },
  "education": {
    "degrees": ["Master CS", "Bachelor Engineering"],
    "certifications": ["AWS Architect", "Google Cloud"],
    "specializations": ["Machine Learning", "Distributed Systems"],
    "institutions": ["MIT", "Stanford"]
  }
}

Return ONLY the JSON object.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a precise keyword extractor. Extract ONLY keywords that are explicitly mentioned in the CV. Do not invent or assume anything. Be conservative. Return valid JSON with ALL required sections.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.0, // DETERMINISTIC - No randomness
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    // VALIDATION POST-PARSING - Ensure all sections exist
    const requiredSections = [
      "hardSkills",
      "softSkills",
      "experience",
      "education",
    ];
    for (const section of requiredSections) {
      if (!result[section]) {
        logger.warn(`Missing section ${section}, creating empty structure`);
        result[section] = {};
      }
    }

    logger.info("CV keywords extracted successfully");

    // Log extracted keywords for debugging
    logger.info("=== CV KEYWORDS EXTRACTED ===");
    logger.info(`Hard Skills: ${JSON.stringify(result.hardSkills)}`);
    logger.info(`Soft Skills: ${JSON.stringify(result.softSkills)}`);
    logger.info(`Experience: ${JSON.stringify(result.experience)}`);
    logger.info(`Education: ${JSON.stringify(result.education)}`);

    // Validate keywords against original CV text if available
    let validatedResult = result;
    if (cvText) {
      const beforeValidation = {
        hardSkills: Array.isArray(result.hardSkills)
          ? result.hardSkills.length
          : typeof result.hardSkills === "object" && result.hardSkills !== null
          ? Object.values(result.hardSkills).flat().length
          : 0,
        softSkills: Array.isArray(result.softSkills)
          ? result.softSkills.length
          : typeof result.softSkills === "object" && result.softSkills !== null
          ? Object.values(result.softSkills).flat().length
          : 0,
        experience: Array.isArray(result.experience)
          ? result.experience.length
          : typeof result.experience === "object" && result.experience !== null
          ? Object.values(result.experience).flat().length
          : 0,
        education: Array.isArray(result.education)
          ? result.education.length
          : typeof result.education === "object" && result.education !== null
          ? Object.values(result.education).flat().length
          : 0,
      };

      validatedResult = validateExtractedKeywords(cvText, result);

      const afterValidation = {
        hardSkills: Array.isArray(validatedResult.hardSkills)
          ? validatedResult.hardSkills.length
          : typeof validatedResult.hardSkills === "object" &&
            validatedResult.hardSkills !== null
          ? Object.values(validatedResult.hardSkills).flat().length
          : 0,
        softSkills: Array.isArray(validatedResult.softSkills)
          ? validatedResult.softSkills.length
          : typeof validatedResult.softSkills === "object" &&
            validatedResult.softSkills !== null
          ? Object.values(validatedResult.softSkills).flat().length
          : 0,
        experience: Array.isArray(validatedResult.experience)
          ? validatedResult.experience.length
          : typeof validatedResult.experience === "object" &&
            validatedResult.experience !== null
          ? Object.values(validatedResult.experience).flat().length
          : 0,
        education: Array.isArray(validatedResult.education)
          ? validatedResult.education.length
          : typeof validatedResult.education === "object" &&
            validatedResult.education !== null
          ? Object.values(validatedResult.education).flat().length
          : 0,
      };

      logger.info("=== VALIDATION RESULTS ===");
      logger.info(`Before validation: ${JSON.stringify(beforeValidation)}`);
      logger.info(`After validation: ${JSON.stringify(afterValidation)}`);
      logger.info(`Validated keywords: ${JSON.stringify(validatedResult)}`);
    }

    // Flatten grouped keywords while preserving structure for embeddings
    return {
      hardSkills: flattenGroupedKeywords(validatedResult.hardSkills),
      softSkills: flattenGroupedKeywords(validatedResult.softSkills),
      experience: flattenGroupedKeywords(validatedResult.experience),
      education: flattenGroupedKeywords(validatedResult.education),
      grouped: validatedResult, // Keep grouped structure for enhanced embeddings
    };
  } catch (error) {
    logger.error(`CV keyword extraction failed: ${error.message}`);
    return {
      hardSkills: [],
      softSkills: [],
      experience: [],
      education: [],
      grouped: null,
    };
  }
}

/**
 * Extract ONLY the most important requirements from job description
 *
 * @param {Object} jobSections - Parsed job sections
 * @returns {Promise<Object>} Key requirements by category
 */
async function extractJobKeywords(jobSections) {
  try {
    const prompt = `Extract AT LEAST 10 requirements per category from this job description. Be comprehensive. MANDATORY: Return ALL sections even if empty.

Job Description:
Hard Skills: ${String(jobSections.hardSkills || "").substring(0, 1200)}
Soft Skills: ${String(jobSections.softSkills || "").substring(0, 800)}
Experience: ${String(jobSections.experience || "").substring(0, 1000)}
Education: ${String(jobSections.education || "").substring(0, 600)}

CRITICAL REQUIREMENTS:
- Extract ALL requirements mentioned in the job description
- If a section is empty, return empty arrays: {"degrees": [], "certifications": [], "specializations": [], "institutions": []}
- NEVER omit sections - always include all 4 categories
- Group related requirements by subcategories
- Include required, preferred, and nice-to-have skills
- No artificial limits - be comprehensive

Focus on:
- Technical: ALL mentioned languages, frameworks, tools, platforms, methodologies
- Soft skills: ALL interpersonal skills, work styles, team dynamics
- Experience: ALL experience levels, domains, project types, responsibilities
- Education: ALL degrees, certifications, training mentioned

Return grouped JSON:
{
  "hardSkills": {
    "languages": ["Python 3+", "JavaScript", "TypeScript"],
    "frameworks": ["React", "Node.js", "Django"],
    "databases": ["PostgreSQL", "MongoDB", "Redis"],
    "cloud": ["AWS", "Lambda", "S3", "Docker"],
    "tools": ["Git", "CI/CD", "Kubernetes"]
  },
  "softSkills": {
    "leadership": ["team leadership", "mentoring", "project management"],
    "communication": ["client interaction", "documentation", "presentations"],
    "collaboration": ["agile teams", "cross-functional", "remote work"],
    "traits": ["problem-solving", "adaptability", "attention to detail"]
  },
  "experience": {
    "years": ["5+ years", "3+ years Python", "2+ years cloud"],
    "domains": ["fintech", "e-commerce", "SaaS", "B2B"],
    "responsibilities": ["system design", "code reviews", "deployment"],
    "projects": ["microservices", "REST APIs", "scalable systems"]
  },
  "education": {
    "degrees": ["Bachelor CS", "Master preferred", "STEM degree"],
    "certifications": ["AWS certified", "Google Cloud", "Scrum Master"],
    "skills": ["algorithms", "data structures", "system design"],
    "other": ["bootcamp acceptable", "continuous learning"]
  }
}

Return ONLY the JSON object.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a comprehensive requirement extractor. Extract ALL job requirements, grouped by subcategories. Be thorough. Minimum 10 per main category. Return valid JSON with ALL required sections.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.0, // DETERMINISTIC - No randomness
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    // VALIDATION POST-PARSING - Ensure all sections exist
    const requiredSections = [
      "hardSkills",
      "softSkills",
      "experience",
      "education",
    ];
    for (const section of requiredSections) {
      if (!result[section]) {
        logger.warn(`Missing job section ${section}, creating empty structure`);
        result[section] = {};
      }
    }

    logger.info("Job keywords extracted successfully");

    // Log extracted job keywords for debugging
    logger.info("=== JOB KEYWORDS EXTRACTED ===");
    logger.info(`Hard Skills: ${JSON.stringify(result.hardSkills)}`);
    logger.info(`Soft Skills: ${JSON.stringify(result.softSkills)}`);
    logger.info(`Experience: ${JSON.stringify(result.experience)}`);
    logger.info(`Education: ${JSON.stringify(result.education)}`);

    // Flatten grouped keywords while preserving structure for embeddings
    return {
      hardSkills: flattenGroupedKeywords(result.hardSkills),
      softSkills: flattenGroupedKeywords(result.softSkills),
      experience: flattenGroupedKeywords(result.experience),
      education: flattenGroupedKeywords(result.education),
      grouped: result, // Keep grouped structure for enhanced embeddings
    };
  } catch (error) {
    logger.error(`Job keyword extraction failed: ${error.message}`);
    return {
      hardSkills: [],
      softSkills: [],
      experience: [],
      education: [],
      grouped: null,
    };
  }
}

module.exports = {
  extractCVKeywords,
  extractJobKeywords,
};
