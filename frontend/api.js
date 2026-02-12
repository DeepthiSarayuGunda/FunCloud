/**
 * API client for FunCloud AI Backend
 * Configure API_BASE_URL via environment or use default
 */

import CONFIG from './config.js';

// Get API base URL from config
const API_BASE_URL = CONFIG.API_BASE_URL;

/**
 * Analyze a website URL for SEO recommendations
 * @param {string} url - Website URL to analyze
 * @returns {Promise<Object>} SEO analysis with recommendations
 */
export async function analyzeSEO(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL: must be a non-empty string");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/seo/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("SEO analysis error:", err);
    throw new Error(`SEO analysis failed: ${err.message}`);
  }
}

/**
 * Send a chat message and get AI response
 * @param {string} message - User message
 * @param {Array} history - Conversation history [{role, content}]
 * @returns {Promise<Object>} Chat response with reply
 */
export async function sendChatMessage(message, history = []) {
  if (!message || typeof message !== "string") {
    throw new Error("Invalid message: must be a non-empty string");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Chat error:", err);
    throw new Error(`Chat failed: ${err.message}`);
  }
}
