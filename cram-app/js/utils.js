/**
 * Utility functions for Cram application
 * 
 * This file contains helper functions that are used across the application.
 */

/**
 * Converts centimeters to pixels
 * @param {number} cm - Value in centimeters
 * @return {number} Value in pixels
 */
function cmToPx(cm) {
  const probe = document.createElement('div');
  probe.style.width = '1cm';
  document.body.appendChild(probe);
  const pxPerCm = probe.offsetWidth;
  probe.remove();
  return cm * pxPerCm;
}

/**
 * Shows an error message with animation
 * @param {string} message - Error message to display
 */
function showError(message) {
  errorMessage.textContent = message;
  errorContainer.classList.remove('hidden');
  
  // Trigger entrance animation
  setTimeout(() => {
    errorContainer.style.transform = 'translateY(0)';
    errorContainer.style.opacity = '1';
  }, 10);
  
  loading.classList.add('hidden');
}

/**
 * Hides the error message with animation
 */
function hideError() {
  if (errorContainer.classList.contains('hidden')) return;
  
  // Trigger exit animation
  errorContainer.style.transform = 'translateY(-10px)';
  errorContainer.style.opacity = '0';
  
  // Actually hide after animation completes
  setTimeout(() => {
    errorContainer.classList.add('hidden');
  }, 300);
}

/**
 * Gets the currently selected sheet type
 * @return {string} 'bottle' or 'cheat'
 */
function currentType() {
  return document.querySelector('input[name="ctype"]:checked').value;
}

/**
 * Sets font size across all preview elements
 * @param {number} px - Font size in pixels
 */
function setFontSize(px) {
  preview.style.fontSize = px + 'px';
  preview.style.setProperty('--sheet-font', px + 'px');
  wrapperPreview.style.fontSize = px + 'px';
  wrapperPreview.style.setProperty('--sheet-font', px + 'px');
  fontRange.value = Math.round(px);
  fontSizeLabel.textContent = Math.round(px);
}
