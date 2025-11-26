/**
 * Cogni Time Shield - Popup UI Controller
 * Manages the extension popup interface and user interactions
 */

// DOM Elements
const timeDisplay = document.getElementById('timeDisplay');
const phaseDisplay = document.getElementById('phaseDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const focusTimeInput = document.getElementById('focusTime');
const shortBreakInput = document.getElementById('shortBreak');
const longBreakInput = document.getElementById('longBreak');
const sessionsBeforeLongInput = document.getElementById('sessionsBeforeLong');
const sessionsCompletedDisplay = document.getElementById('sessionsCompleted');

// Timer state
let timerState = {
  isRunning: false,
  timeLeft: 25 * 60, // seconds
  phase: 'focus', // 'focus', 'shortBreak', 'longBreak'
  sessionsCompleted: 0,
  settings: {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsBeforeLong: 4
  }
};

// Initialize
async function init() {
  // Load saved state
  const result = await browserAPI.storage.local.get(['timerState']);
  if (result.timerState) {
    timerState = result.timerState;
  }
  
  // Update UI
  updateDisplay();
  updateSettings();
  updateButtons();
}

// Update time display
function updateDisplay() {
  const minutes = Math.floor(timerState.timeLeft / 60);
  const seconds = timerState.timeLeft % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Update phase display
  if (timerState.phase === 'focus') {
    phaseDisplay.textContent = 'Focus Time';
    phaseDisplay.className = 'phase phase-focus';
  } else if (timerState.phase === 'shortBreak') {
    phaseDisplay.textContent = 'Short Break';
    phaseDisplay.className = 'phase phase-break';
  } else {
    phaseDisplay.textContent = 'Long Break';
    phaseDisplay.className = 'phase phase-break';
  }
  
  sessionsCompletedDisplay.textContent = timerState.sessionsCompleted;
}

// Update settings inputs
function updateSettings() {
  focusTimeInput.value = timerState.settings.focusTime;
  shortBreakInput.value = timerState.settings.shortBreak;
  longBreakInput.value = timerState.settings.longBreak;
  sessionsBeforeLongInput.value = timerState.settings.sessionsBeforeLong;
}

// Update button states
function updateButtons() {
  if (timerState.isRunning) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
  } else {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }
}

// Start timer
startBtn.addEventListener('click', async () => {
  timerState.isRunning = true;
  await saveState();
  updateButtons();
  
  // Send message to background script
  browserAPI.runtime.sendMessage({ action: 'start' }).catch(() => {
    // Ignore if background script is not ready
  });
});

// Pause timer
pauseBtn.addEventListener('click', async () => {
  timerState.isRunning = false;
  await saveState();
  updateButtons();
  
  browserAPI.runtime.sendMessage({ action: 'pause' }).catch(() => {
    // Ignore if background script is not ready
  });
});

// Reset timer
resetBtn.addEventListener('click', async () => {
  timerState.isRunning = false;
  timerState.phase = 'focus';
  timerState.timeLeft = timerState.settings.focusTime * 60;
  
  await saveState();
  updateDisplay();
  updateButtons();
  
  browserAPI.runtime.sendMessage({ action: 'reset' }).catch(() => {
    // Ignore if background script is not ready
  });
});

// Settings change handlers
focusTimeInput.addEventListener('change', async () => {
  timerState.settings.focusTime = parseInt(focusTimeInput.value);
  if (timerState.phase === 'focus' && !timerState.isRunning) {
    timerState.timeLeft = timerState.settings.focusTime * 60;
    updateDisplay();
  }
  await saveState();
});

shortBreakInput.addEventListener('change', async () => {
  timerState.settings.shortBreak = parseInt(shortBreakInput.value);
  if (timerState.phase === 'shortBreak' && !timerState.isRunning) {
    timerState.timeLeft = timerState.settings.shortBreak * 60;
    updateDisplay();
  }
  await saveState();
});

longBreakInput.addEventListener('change', async () => {
  timerState.settings.longBreak = parseInt(longBreakInput.value);
  if (timerState.phase === 'longBreak' && !timerState.isRunning) {
    timerState.timeLeft = timerState.settings.longBreak * 60;
    updateDisplay();
  }
  await saveState();
});

sessionsBeforeLongInput.addEventListener('change', async () => {
  timerState.settings.sessionsBeforeLong = parseInt(sessionsBeforeLongInput.value);
  await saveState();
});

// Save state to storage
async function saveState() {
  await browserAPI.storage.local.set({ timerState });
}

// Listen for updates from background script
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'tick') {
    timerState = message.state;
    updateDisplay();
    updateButtons();
  }
});

// Initialize on load
init();
