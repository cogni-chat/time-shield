/**
 * Cogni Time Shield - Offscreen Document for Audio Playback
 * Chrome Manifest V3 requires audio playback in offscreen documents
 * This file is only used in Chrome, not in Firefox
 */

let currentAudio = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'playSound') {
    playSound(message.soundUrl);
    sendResponse({ success: true });
  } else if (message.action === 'stopAudio') {
    stopSound();
    sendResponse({ success: true });
  }
  return true;
});

function playSound(soundUrl) {
  // Stop any currently playing audio
  stopSound();
  
  currentAudio = new Audio(soundUrl);
  currentAudio.volume = 0.7;
  currentAudio.play().catch(err => {
    console.error('Error playing sound:', err);
  });
  
  // Clear reference when audio ends
  currentAudio.addEventListener('ended', () => {
    currentAudio = null;
  });
}

function stopSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
