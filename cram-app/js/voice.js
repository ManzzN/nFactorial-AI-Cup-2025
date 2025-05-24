/**
 * Voice Recognition for Cram application using Whisper API
 * 
 * This file contains functions for handling speech recognition
 * to allow users to input topics via voice using OpenAI's Whisper API.
 */

// Voice recognition state
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

// DOM references - will be initialized when document is loaded
let voiceBtn;
let voiceStatus;
let voiceTopicInput;
let voiceErrorContainer;
let voiceErrorMessage;

/**
 * Initialize the voice recognition functionality
 */
function initVoiceRecognition() {
  // Initialize DOM references
  voiceBtn = document.getElementById('voice-btn');
  voiceStatus = document.getElementById('voice-status');
  voiceTopicInput = document.getElementById('topic-input');
  voiceErrorContainer = document.getElementById('error-container');
  voiceErrorMessage = document.getElementById('error-message');
  
  // Check if elements were found
  if (!voiceBtn || !voiceStatus || !voiceTopicInput) {
    console.error("Не удалось найти необходимые элементы для голосового ввода");
    return;
  }
  
  // Check if browser supports media recording
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn("Ваш браузер не поддерживает запись аудио");
    voiceBtn.style.display = 'none'; // Hide the button if not supported
    return;
  }

  // Add event listener to the voice button
  voiceBtn.addEventListener('click', toggleVoiceRecording);
  
  // Add keyboard shortcut (Ctrl+M) for voice recording
  document.addEventListener('keydown', function(event) {
    // Check if focus is not in an input field
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        toggleVoiceRecording();
      }
    }
  });
  
  console.log("Инициализация голосового ввода завершена");
}

/**
 * Toggle voice recording on/off
 */
function toggleVoiceRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

/**
 * Start audio recording using MediaRecorder
 */
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.onstop = processRecording;
    
    mediaRecorder.start();
    isRecording = true;
    
    // Update UI
    voiceBtn.classList.remove('bg-blue-500');
    voiceBtn.classList.add('bg-red-500');
    voiceBtn.querySelector('svg').classList.add('animate-pulse');
    voiceStatus.classList.remove('hidden');
    
    console.log("Начало записи голоса...");
  } catch (error) {
    console.error("Ошибка доступа к микрофону:", error);
    showVoiceError("Для голосового ввода необходим доступ к микрофону");
  }
}

/**
 * Stop audio recording
 */
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    
    // Update UI to show processing state
    voiceStatus.textContent = "Обработка речи...";
    
    console.log("Запись голоса остановлена, начинается обработка");
  }
}

/**
 * Process the recorded audio using Whisper API
 */
async function processRecording() {
  try {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    
    // Reset recording state
    isRecording = false;
    
    // Send to Whisper API
    await transcribeAudio(audioBlob);
    
    // Close audio tracks to release the microphone
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    
  } catch (error) {
    console.error("Ошибка при обработке записи:", error);
    resetVoiceUI();
    showVoiceError("Произошла ошибка при обработке голосового ввода");
  }
}

/**
 * Send audio to Whisper API for transcription
 * @param {Blob} audioBlob - The recorded audio blob
 */
async function transcribeAudio(audioBlob) {
  try {
    // Use the OpenAI API key from CONFIG
    const apiKey = CONFIG.apiKey;
    
    if (!apiKey) {
      throw new Error("API ключ OpenAI не настроен");
    }
    
    const formData = new FormData();
    formData.append("file", audioBlob, "speech.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "ru");  // Specify Russian language
    
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API вернул ошибку: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Set the transcribed text to the input field
    if (data.text) {
      voiceTopicInput.value = data.text.trim();
      console.log("Распознано: " + data.text.trim());
    } else {
      throw new Error("Текст не распознан");
    }
    
    resetVoiceUI();
  } catch (error) {
    console.error("Ошибка при транскрибации аудио:", error);
    showVoiceError("Ошибка при распознавании речи: " + error.message);
    resetVoiceUI();
  }
}

/**
 * Reset the voice recording UI
 */
function resetVoiceUI() {
  voiceBtn.classList.remove('bg-red-500');
  voiceBtn.classList.add('bg-blue-500');
  voiceBtn.querySelector('svg').classList.remove('animate-pulse');
  voiceStatus.classList.add('hidden');
}

/**
 * Show voice recognition error
 * @param {string} message - Error message to display
 */
function showVoiceError(message) {
  if (voiceErrorContainer && voiceErrorMessage) {
    voiceErrorMessage.textContent = message;
    voiceErrorContainer.classList.remove('hidden');
    voiceErrorContainer.style.transform = 'translateY(0)';
    voiceErrorContainer.style.opacity = '1';
    
    setTimeout(() => {
      voiceErrorContainer.style.transform = 'translateY(-10px)';
      voiceErrorContainer.style.opacity = '0';
      setTimeout(() => voiceErrorContainer.classList.add('hidden'), 300);
    }, 5000);
  } else {
    alert(message);
  }
}

// Initialize voice recognition when DOM is loaded or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log("Voice.js: DOM Content Loaded - initializing voice recognition");
    initVoiceRecognition();
  });
} else {
  console.log("Voice.js: DOM already loaded - initializing voice recognition immediately");
  initVoiceRecognition();
}