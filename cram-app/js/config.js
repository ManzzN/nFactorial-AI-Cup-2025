/**
 * Configuration settings for Cram application
 * 
 * This file contains API keys, endpoints, and other configuration parameters.
 * In production, sensitive values should be stored in environment variables
 * or a secure configuration service.
 */

const CONFIG = {
  // not proud of that
  apiKey: "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", // Replace with your API key
  apiEndpoint: "https://api.openai.com/v1/chat/completions",
  model: "gpt-4.1-mini", // Using GPT-4.1 for better responses
  
  // Page format settings
  maxBottleHeightCm: 10.5, // Upper half of landscape page
  bottleColumns: 4,        // Number of sections in the upper half
  
  // Default values
  defaultFontSize: 14,
  defaultWidth: 20         // Default cheat width in cm
};
