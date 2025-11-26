/**
 * Cogni Pomo Timer - Completion Page Controller
 * Displays timer completion notification and handles audio playback
 * Firefox: Plays audio directly in this page
 * Chrome: Audio is handled by offscreen document
 */

let currentAudio = null;

// Initialize completion page
async function init() {
  const result = await browserAPI.storage.local.get(['timerState']);
  const state = result.timerState;
  
  if (!state) {
    window.close();
    return;
  }
  
  // Update UI based on current phase
  const icon = document.getElementById('icon');
  const title = document.getElementById('title');
  const message = document.getElementById('message');
  const nextPhase = document.getElementById('nextPhase');
  const sessions = document.getElementById('sessions');
  
  if (state.phase === 'focus') {
    // Just completed a break, now starting focus
    icon.textContent = '💪';
    title.textContent = 'Break Complete!';
    message.textContent = 'Time to get back to work!';
    nextPhase.textContent = `Next: Focus Time (${state.settings.focusTime} min)`;
  } else if (state.phase === 'shortBreak') {
    // Just completed focus, now starting short break
    icon.textContent = '☕';
    title.textContent = 'Focus Complete!';
    message.textContent = 'Great work! Time for a short break.';
    nextPhase.textContent = `Next: Short Break (${state.settings.shortBreak} min)`;
  } else if (state.phase === 'longBreak') {
    // Just completed focus, now starting long break
    icon.textContent = '🌟';
    title.textContent = 'Focus Complete!';
    message.textContent = 'Excellent! You earned a long break.';
    nextPhase.textContent = `Next: Long Break (${state.settings.longBreak} min)`;
  }
  
  sessions.textContent = `Sessions completed: ${state.sessionsCompleted}`;
  
  // Play sound on Firefox (Chrome uses offscreen document)
  if (typeof isFirefoxBrowser !== 'undefined' && isFirefoxBrowser()) {
    playGongSound();
  }
  
  // Auto-stop sound after 3 seconds
  setTimeout(async () => {
    stopSound();
    await browserAPI.runtime.sendMessage({ action: 'stopSound' }).catch(() => {});
  }, 3000);
}

// Play gong sound (Firefox only, Chrome uses offscreen)
function playGongSound() {
  try {
    const soundUrl = browserAPI.runtime.getURL('sounds/gong.mp3');
    currentAudio = new Audio(soundUrl);
    currentAudio.volume = 0.7;
    currentAudio.play().catch(err => {
      console.error('Error playing sound:', err);
    });
    
    currentAudio.addEventListener('ended', () => {
      currentAudio = null;
    });
  } catch (error) {
    console.log('Audio playback error:', error);
  }
}

// Stop sound
function stopSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

// Listen for stop audio messages
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'stopAudio') {
    stopSound();
    sendResponse({ success: true });
  }
  return true;
});

// Start next phase button
document.getElementById('startNextBtn').addEventListener('click', async () => {
  const result = await browserAPI.storage.local.get(['timerState']);
  const state = result.timerState;
  
  // Stop any playing sound first
  stopSound();
  await browserAPI.runtime.sendMessage({ action: 'stopSound' }).catch(() => {});
  
  state.isRunning = true;
  await browserAPI.storage.local.set({ timerState: state });
  
  // Send message to background to start timer
  await browserAPI.runtime.sendMessage({ action: 'start' });
  
  window.close();
});

// Close button
document.getElementById('closeBtn').addEventListener('click', async () => {
  // Stop any playing sound when closing
  stopSound();
  await browserAPI.runtime.sendMessage({ action: 'stopSound' }).catch(() => {});
  window.close();
});

// Initialize on load
init();
