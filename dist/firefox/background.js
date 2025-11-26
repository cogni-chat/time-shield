/**
 * Cogni Pomo Timer - Background Service Worker
 * Handles timer logic, notifications, and audio playback
 * Supports both Chrome (Manifest V3) and Firefox (Manifest V2)
 */

let timerInterval = null;

// Initialize on install
browserAPI.runtime.onInstalled.addListener(() => {
  // Set default state
  const defaultState = {
    isRunning: false,
    timeLeft: 25 * 60,
    phase: 'focus',
    sessionsCompleted: 0,
    settings: {
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      sessionsBeforeLong: 4
    }
  };
  
  browserAPI.storage.local.set({ timerState: defaultState });
});

// Listen for messages from popup and completion page
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    startTimer();
    sendResponse({ success: true });
  } else if (message.action === 'pause') {
    pauseTimer();
    browserAPI.action.setBadgeText({ text: '' }); // Clear badge on pause
    sendResponse({ success: true });
  } else if (message.action === 'reset') {
    pauseTimer();
    browserAPI.action.setBadgeText({ text: '' }); // Clear badge on reset
    sendResponse({ success: true });
  } else if (message.action === 'stopSound') {
    stopGongSound().then(() => sendResponse({ success: true }));
    return true; // Keep channel open for async response
  }
  return true; // Keep the message channel open for async response
});

// Start timer
async function startTimer() {
  // Stop any playing sound
  await stopGongSound();
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(async () => {
    const result = await browserAPI.storage.local.get(['timerState']);
    let state = result.timerState;
    
    if (!state.isRunning) {
      clearInterval(timerInterval);
      return;
    }
    
    state.timeLeft--;
    
    // Check if timer finished
    if (state.timeLeft <= 0) {
      await handleTimerComplete(state);
    }
    
    // Save state and notify popup
    await browserAPI.storage.local.set({ timerState: state });
    
    // Send message to popup if it's open
    browserAPI.runtime.sendMessage({ action: 'tick', state: state }).catch(() => {
      // Popup is closed, ignore error
    });
    
    // Update badge
    updateBadge(state);
  }, 1000);
}

// Pause timer
function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Handle timer completion
async function handleTimerComplete(state) {
  // Show notification
  const notificationOptions = {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Pomodoro Timer',
    message: '',
    priority: 2
  };
  
  if (state.phase === 'focus') {
    state.sessionsCompleted++;
    
    // Determine next phase
    if (state.sessionsCompleted % state.settings.sessionsBeforeLong === 0) {
      state.phase = 'longBreak';
      state.timeLeft = state.settings.longBreak * 60;
      notificationOptions.message = 'Focus session complete! Time for a long break.';
    } else {
      state.phase = 'shortBreak';
      state.timeLeft = state.settings.shortBreak * 60;
      notificationOptions.message = 'Focus session complete! Time for a short break.';
    }
  } else {
    // Break finished, back to focus
    state.phase = 'focus';
    state.timeLeft = state.settings.focusTime * 60;
    notificationOptions.message = 'Break is over! Time to focus.';
  }
  
  // Show notification
  browserAPI.notifications.create('pomodoroComplete', notificationOptions);
  
  // Open completion page (will handle sound playback)
  browserAPI.tabs.create({
    url: browserAPI.runtime.getURL('complete.html'),
    active: true
  });
  
  // Stop timer
  state.isRunning = false;
  pauseTimer();
}

// Play gong sound using offscreen document (Chrome) or background audio (Firefox)
async function playGongSound() {
  try {
    // Chrome: Use offscreen document if available
    if (typeof hasOffscreenAPI !== 'undefined' && hasOffscreenAPI()) {
      await setupOffscreenDocument();
      await browserAPI.runtime.sendMessage({
        action: 'playSound',
        soundUrl: browserAPI.runtime.getURL('sounds/gong.mp3')
      });
    }
    // Firefox: Audio will be played from complete.html page
    // No action needed here as the page handles it
  } catch (error) {
    console.log('Audio playback error:', error);
  }
}

// Setup offscreen document for audio playback (Chrome only)
async function setupOffscreenDocument() {
  if (typeof hasOffscreenAPI === 'undefined' || !hasOffscreenAPI()) {
    return; // Not supported in this browser
  }
  
  const existingContexts = await browserAPI.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });
  
  if (existingContexts.length > 0) {
    return; // Offscreen document already exists
  }
  
  await browserAPI.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Play notification sound when timer completes'
  });
}

// Stop gong sound
async function stopGongSound() {
  try {
    if (typeof hasOffscreenAPI !== 'undefined' && hasOffscreenAPI()) {
      const existingContexts = await browserAPI.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT']
      });
      
      if (existingContexts.length > 0) {
        await browserAPI.runtime.sendMessage({ action: 'stopAudio' });
      }
    }
    // Firefox: Send message to complete.html to stop audio
    browserAPI.runtime.sendMessage({ action: 'stopAudio' }).catch(() => {});
  } catch (error) {
    // Ignore errors if offscreen document doesn't exist
  }
}

// Update badge with time remaining
function updateBadge(state) {
  if (state.isRunning) {
    const minutes = Math.floor(state.timeLeft / 60);
    browserAPI.action.setBadgeText({ text: minutes.toString() });
    
    if (state.phase === 'focus') {
      browserAPI.action.setBadgeBackgroundColor({ color: '#d32f2f' });
    } else {
      browserAPI.action.setBadgeBackgroundColor({ color: '#388e3c' });
    }
  } else {
    browserAPI.action.setBadgeText({ text: '' });
  }
}

// Clear badge on startup
browserAPI.action.setBadgeText({ text: '' });

// Handle notification clicks to focus on completion page
browserAPI.notifications.onClicked.addListener(async (notificationId) => {
  if (notificationId === 'pomodoroComplete') {
    // Find the completion page tab
    const tabs = await browserAPI.tabs.query({ url: browserAPI.runtime.getURL('complete.html') });
    
    if (tabs.length > 0) {
      // Focus on existing completion tab
      await browserAPI.tabs.update(tabs[0].id, { active: true });
      await browserAPI.windows.update(tabs[0].windowId, { focused: true });
    } else {
      // Open new completion page if it was closed
      await browserAPI.tabs.create({
        url: browserAPI.runtime.getURL('complete.html'),
        active: true
      });
    }
    
    // Clear the notification
    browserAPI.notifications.clear(notificationId);
  }
});
