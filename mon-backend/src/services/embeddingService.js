/**
 * Embedding Service - OpenAI Integration
 *
 * Purpose: Abstract OpenAI embedding API for easy provider switching
 * Model: text-embedding-3-small (1536 dimensions, cost-effective)
 *
 * @module embeddingService
 */

const OpenAI = require("openai");
const logger = require("../utils/logger");

// Constants
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const MAX_INPUT_LENGTH = 8000; // Characters (roughly 2000 tokens)

// Initialize OpenAI client (singleton pattern)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embedding for text using OpenAI
 * Model: text-embedding-3-small (cost-effective, high quality)
 *
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
async function generateEmbedding(text) {
  try {
    // Ensure text is a string
    const textString = String(text || "");

    // Handle edge case: empty input
    if (textString.trim().length === 0) {
      logger.warn("Empty text provided for embedding, returning zero vector");
      return Array(EMBEDDING_DIMENSIONS).fill(0);
    }

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: textString.substring(0, MAX_INPUT_LENGTH),
    });

    return response.data[0].embedding;
  } catch (error) {
    logger.error(`Error generating embedding: ${error.message}`);
    throw new Error("Failed to generate embedding");
  }
}

/**
 * Calculate cosine similarity between two embeddings
 *
 * Formula: cos(θ) = (A·B) / (||A|| × ||B||)
 * - Measures angle between vectors (0 = orthogonal, 1 = identical)
 * - Independent of magnitude (better than euclidean distance for embeddings)
 *
 * @param {number[]} embedding1 - First embedding vector
 * @param {number[]} embedding2 - Second embedding vector
 * @returns {number} - Similarity score between 0 and 1
 * @throws {Error} - If embeddings have different dimensions
 */
function cosineSimilarity(embedding1, embedding2) {
  // Validate inputs
  if (!Array.isArray(embedding1) || !Array.isArray(embedding2)) {
    throw new Error("Embeddings must be arrays");
  }

  if (embedding1.length !== embedding2.length) {
    throw new Error(
      `Dimension mismatch: ${embedding1.length} vs ${embedding2.length}`
    );
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  return similarity;
}

/**
 * Generate embeddings for multiple texts in batch
 * More efficient than individual calls
 *
 * @param {string[]} texts
 * @returns {Promise<number[][]>} - Array of embeddings
 */
async function generateBatchEmbeddings(texts) {
  try {
    // Validate input
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error("Texts must be non-empty array");
    }

    // Truncate each text to max length
    const limitedTexts = texts.map((t) =>
      String(t || "").substring(0, MAX_INPUT_LENGTH)
    );

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: limitedTexts,
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    logger.error(`Error generating batch embeddings: ${error.message}`);
    throw new Error("Failed to generate batch embeddings");
  }
}

module.exports = {
  generateEmbedding,
  cosineSimilarity,
  generateBatchEmbeddings,
};
