// Test script to verify voice.js loading
console.log("Testing voice.js loading...");

// Test function to check if all parts are working
function testVoiceLoading() {
  console.log("Voice.js file loading status check:");
  
  // Check if the functions from voice.js exist
  const functions = [
    "initVoiceRecognition",
    "toggleVoiceRecording",
    "startRecording",
    "stopRecording",
    "processRecording",
    "transcribeAudio",
    "resetVoiceUI",
    "showVoiceError"
  ];
  
  for (const func of functions) {
    console.log(`Function ${func} exists:`, typeof window[func] === 'function');
  }
  
  // Check if the voice button exists and has click handler
  const voiceBtn = document.getElementById('voice-btn');
  if (voiceBtn) {
    console.log("Voice button found in DOM");
    
    // Add a test click handler
    voiceBtn.addEventListener('click', function() {
      console.log("Test click handler working");
    });
  } else {
    console.error("Voice button not found in DOM");
  }
}

// Run the test after a short delay to ensure all scripts are loaded
setTimeout(testVoiceLoading, 1000);
