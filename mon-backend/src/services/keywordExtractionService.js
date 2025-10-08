const OpenAI = require("openai");
const logger = require("../utils/logger");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract ONLY the most important keywords from CV
 * Removes noise, keeps signal
 *
 * @param {Object} cvSections - Parsed CV sections
 * @returns {Promise<Object>} Key terms by category
 */
async function extractCVKeywords(cvSections) {
  try {
    const prompt = `Extract ONLY the 10-15 MOST IMPORTANT keywords from this CV.

CV Content:
Hard Skills: ${String(cvSections.hardSkills || "").substring(0, 800)}
Soft Skills: ${String(cvSections.softSkills || "").substring(0, 500)}
Experience: ${String(cvSections.experience || "").substring(0, 800)}
Education: ${String(cvSections.education || "").substring(0, 400)}

Focus on:
- Concrete technical skills (Python, React, AWS, NOT "programming")
- Specific soft skills (team leadership, NOT "good communicator")
- Quantified achievements (40% improvement, NOT "improved things")
- Education credentials (Master's in CS, NOT "went to school")

Ignore:
- Generic words (responsible, worked, helped)
- Articles, prepositions
- Job titles alone
- Vague descriptions

Return JSON:
{
  "hardSkills": ["Python", "React.js", "AWS Lambda", "Docker"],
  "softSkills": ["team leadership", "cross-functional collaboration", "mentoring"],
  "experience": ["3 years backend development", "scaled to 1M users", "reduced latency by 45%"],
  "education": ["Master's Computer Science", "Stanford University"]
}

Return ONLY the JSON object.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You extract only the most impactful keywords. Be selective. Return valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    logger.info("CV keywords extracted successfully");

    return {
      hardSkills: result.hardSkills || [],
      softSkills: result.softSkills || [],
      experience: result.experience || [],
      education: result.education || [],
    };
  } catch (error) {
    logger.error(`CV keyword extraction failed: ${error.message}`);
    return { hardSkills: [], softSkills: [], experience: [], education: [] };
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
    const prompt = `Extract ONLY the KEY REQUIREMENTS from this job description.

Job Description:
Hard Skills: ${String(jobSections.hardSkills || "").substring(0, 800)}
Soft Skills: ${String(jobSections.softSkills || "").substring(0, 500)}
Experience: ${String(jobSections.experience || "").substring(0, 600)}
Education: ${String(jobSections.education || "").substring(0, 400)}

Focus on:
- Specific required technologies
- Must-have soft skills
- Experience type and years
- Education requirements

Return JSON:
{
  "hardSkills": ["Python 3+", "React", "AWS services", "RESTful APIs"],
  "softSkills": ["leadership", "communication", "problem-solving"],
  "experience": ["5+ years software development", "backend systems", "high-traffic applications"],
  "education": ["Bachelor's degree", "Computer Science or related"]
}

Return ONLY the JSON object.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You extract key job requirements. Be concise. Return valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    logger.info("Job keywords extracted successfully");

    return {
      hardSkills: result.hardSkills || [],
      softSkills: result.softSkills || [],
      experience: result.experience || [],
      education: result.education || [],
    };
  } catch (error) {
    logger.error(`Job keyword extraction failed: ${error.message}`);
    return { hardSkills: [], softSkills: [], experience: [], education: [] };
  }
}

module.exports = {
  extractCVKeywords,
  extractJobKeywords,
};

