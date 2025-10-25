const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI service for Gemini 2.5 GLG integration

/**
 * Generate product description using Gemini
 * @param {string} productTitle - The title of the product
 * @returns {Promise<string>} - Generated product description
 */
const generateProductDescription = async (productTitle) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Write a professional and SEO-optimized product description with 5 bullet points for: ${productTitle}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('AI description generation error:', error);
    throw new Error('Failed to generate product description');
  }
};

/**
 * Generate product tags using Gemini
 * @param {string} productTitle - The title of the product
 * @param {string} productDescription - The description of the product
 * @returns {Promise<string[]>} - Generated product tags
 */
const generateProductTags = async (productTitle, productDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate 5 comma-separated product tags for a product with title: "${productTitle}" and description: "${productDescription}".`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.split(',').map(tag => tag.trim());
  } catch (error) {
    console.error('AI tag generation error:', error);
    throw new Error('Failed to generate product tags');
  }
};

/**
 * Moderate product content using Gemini
 * @param {string} productTitle - The title of the product
 * @param {string} productDescription - The description of the product
 * @returns {Promise<boolean>} - Whether the content is appropriate
 */
const moderateProductContent = async (productTitle, productDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Review the following product title and description for appropriateness. Respond with "true" if appropriate, "false" if inappropriate. Title: "${productTitle}", Description: "${productDescription}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.toLowerCase().includes('true');
  } catch (error) {
    console.error('AI content moderation error:', error);
    throw new Error('Failed to moderate product content');
  }
};

/**
 * Get smart search suggestions using Gemini
 * @param {string} query - The user's search query
 * @returns {Promise<string[]>} - Suggested search terms
 */
const getSearchSuggestions = async (query) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Given the search query "${query}", provide 5 relevant and diverse search suggestions as a comma-separated list.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.split(',').map(suggestion => suggestion.trim());
  } catch (error) {
    console.error('AI search suggestion error:', error);
    throw new Error('Failed to generate search suggestions');
  }
};

/**
 * Chat with AI assistant using Gemini
 * @param {string} message - The user's message
 * @returns {Promise<string>} - AI assistant response
 */
const chatWithAssistant = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are an AI assistant for an e-commerce marketplace. Respond to the user's message: "${message}".`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('AI chat error:', error);
    throw new Error('Failed to get AI assistant response');
  }
};

module.exports = {
  generateProductDescription,
  generateProductTags,
  moderateProductContent,
  getSearchSuggestions,
  chatWithAssistant
};