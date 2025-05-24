/**
 * Main application file for Cram
 * 
 * This file initializes the application, sets up DOM references,
 * and coordinates the various components.
 */

// DOM Element references
// Sections
const projectInfo = document.getElementById('project-info');
const intro = document.getElementById('intro');
const app = document.getElementById('app');
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');

// Inputs and controls
const startBtn = document.getElementById('start-btn');
const topicInput = document.getElementById('topic-input');
const generateBtn = document.getElementById('generate-btn');
const topicDisplay = document.getElementById('topic-display');
const fontRange = document.getElementById('font-range');
const fontSizeLabel = document.getElementById('font-size-label');
const sizeGroup = document.getElementById('size-group');
const sizeRange = document.getElementById('size-range');
const sizeLabel = document.getElementById('size-label');
const exportBtn = document.getElementById('export-btn');
const regenerateBtn = document.getElementById('regenerate-btn');
const backBtn = document.getElementById('back-btn');
const themeToggle = document.getElementById('theme-toggle');

// Preview elements
const preview = document.getElementById('preview');
const wrapperPreview = document.getElementById('wrapperPreview');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');

// Application state
let apiKey = CONFIG.apiKey; // Using the hardcoded API key from config
let currentTopic = ""; // Current topic being displayed

/**
 * Initialize the application
 */
function initApp() {
  setInitialTheme();
  initUI();
  initExport();
  applyLayout();
  
  // Initialize voice recognition if the function exists
  if (typeof initVoiceRecognition === 'function') {
    initVoiceRecognition();
  }
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
