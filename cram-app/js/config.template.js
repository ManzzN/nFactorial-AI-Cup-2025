/**
 * Configuration settings for Cram application (TEMPLATE)
 * 
 * INSTRUCTIONS: 
 * 1. Make a copy of this file and rename it to 'config.js'
 * 2. Replace 'YOUR_API_KEY_HERE' with your actual OpenAI API key
 * 3. The config.js file is ignored by Git to protect your API key
 */

const CONFIG = {
  // OpenAI API settings
  apiKey: "YOUR_API_KEY_HERE", // Replace with your API key
  apiEndpoint: "https://api.openai.com/v1/chat/completions",
  model: "gpt-4.1", // Using GPT-4.1 for better responses
  
  // Page format settings
  maxBottleHeightCm: 10.5, // Upper half of landscape page
  bottleColumns: 4,        // Number of sections in the upper half
  
  // Default values
  defaultFontSize: 14,
  defaultWidth: 20         // Default cheat width in cm
};
