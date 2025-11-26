# Cogni Pomo Timer

Cognitive Pomodoro Timer - Focus with intention. A clean, minimal browser extension for mindful time management.

Available for **Chrome** and **Firefox**.

*A Cogni.chat initiative*

## Features

- ⏱️ **Focus Timer**: 25-minute focus sessions by default
- ☕ **Short Breaks**: 5-minute breaks between sessions
- 🌴 **Long Breaks**: 15-minute breaks after 4 sessions
- 🔔 **Notifications**: Desktop notifications when timers complete
- 🔊 **Custom Gong Sound**: Play your own MP3 gong sound when timer ends
- 📊 **Session Counter**: Track completed focus sessions
- ⚙️ **Customizable**: Adjust timer durations to your preference
- 🎨 **Clean UI**: Simple, distraction-free interface
- 🔢 **Badge Counter**: See remaining minutes in toolbar badge

Any additional feature is Procrastination. Just do your work! 

"You should be working" - Hollow man ()

 > a scene in the 2000 movie Hollow Man features the character Sebastian Caine wrote "You should be working" on the ceiling above his desk. The scene shows him procrastinating and then looking up at the message to motivate himself to return to his work on the invisibility serum

## Installation

### Prerequisites

1. **Generate Icons** (required before loading):
   - Open `create-icons.html` in your browser
   - Click each download button to get icon16.png, icon48.png, and icon128.png
   - Move the downloaded PNG files to the `icons/` directory

2. **Add Your Gong Sound** (optional):
   - Place your MP3 file in the `sounds/` directory
   - **Important**: Rename it to `gong.mp3` (exact name required)
   - The sound will play automatically when timers complete
   - Recommended: Keep file size under 1MB for quick loading

### Chrome Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `cogni-pomo-timer` directory
5. Click the extension icon in your toolbar to start

### Firefox Installation

1. **Build Firefox Package** (one-time setup):
   ```bash
   ./build.sh
   ```
   This creates a Firefox-compatible build in `dist/firefox/`

2. **Temporary Installation** (for testing):
   - Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Navigate to `dist/firefox/` and select `manifest.json`

3. **Permanent Installation** (requires signing):
   - Create a zip file: `cd dist/firefox && zip -r ../cogni-pomo-timer-firefox.zip *`
   - Submit to [Firefox Add-ons](https://addons.mozilla.org/developers/) for signing
   - Install the signed package

### Getting Started

1. Click the extension icon in your toolbar
2. Configure your preferred timer durations
3. Click "Start" to begin your first Pomodoro session

## Usage

### Basic Operation

1. **Start a Session**: Click the "Start" button to begin a focus session
2. **Pause**: Click "Pause" to temporarily stop the timer
3. **Reset**: Click "Reset" to restart the current phase

### Timer Phases

- **Focus Time**: Work on your task with full concentration
- **Short Break**: Take a quick 5-minute break
- **Long Break**: After 4 focus sessions, enjoy a longer 15-minute break

### Customization

Adjust the following settings in the popup:

- **Focus Duration**: Length of focus sessions (default: 25 minutes)
- **Short Break**: Length of short breaks (default: 5 minutes)
- **Long Break**: Length of long breaks (default: 15 minutes)
- **Sessions Before Long Break**: Number of focus sessions before a long break (default: 4)

### Notifications & Sound

The extension will show desktop notifications when:
- A focus session completes
- A break ends and it's time to focus again

Make sure to allow notifications when Chrome prompts you.

**Custom Gong Sound:**
- Place your `gong.mp3` file in the `sounds/` directory
- The gong will play automatically at 70% volume when any timer completes
- If no gong file is present, only the notification will show (no error)

## Project Structure

```
cogni-pomo-timer/
├── manifest.json              # Chrome extension configuration (Manifest V3)
├── manifest.firefox.json      # Firefox extension configuration (Manifest V2)
├── browser-polyfill.js        # Cross-browser compatibility layer
├── background.js              # Main background service worker
├── background-wrapper.js      # Chrome service worker wrapper
├── popup.html                 # Extension popup interface
├── popup.js                   # Popup logic and UI controller
├── complete.html              # Timer completion page
├── complete.js                # Completion page controller
├── offscreen.html             # Chrome offscreen document (audio)
├── offscreen.js               # Chrome audio playback handler
├── styles.css                 # Popup styling
├── icons/                     # Extension icons (16px, 48px, 128px)
├── sounds/                    # Audio files
│   └── gong.mp3              # Custom gong sound (add your own)
├── create-icons.html          # Icon generator tool
├── generate-icons.js          # Icon generation script
├── build.sh                   # Build script for distribution
└── README.md                  # This file
```

## Technical Details

### Chrome
- **Manifest Version**: 3 (Chrome's latest extension standard)
- **Background**: Service worker with importScripts
- **Audio Playback**: Offscreen API for audio in service workers
- **Browser API**: Uses `chrome` namespace

### Firefox
- **Manifest Version**: 2 (Firefox standard)
- **Background**: Event page with persistent: false
- **Audio Playback**: Direct audio playback in completion page
- **Browser API**: Uses `browser` namespace with promises

### Common Features
- **Permissions**: 
  - `storage`: Save timer state and settings
  - `notifications`: Show completion notifications
  - `alarms`: Reserved for future use
  - `tabs`: Open completion page
- **Storage**: Browser local storage for persistence
- **Cross-browser**: Unified API via browser-polyfill.js

## Building for Distribution

To create distribution packages for both browsers:

```bash
# Make build script executable (one-time)
chmod +x build.sh

# Build packages
./build.sh
```

This creates:
- `dist/chrome/` - Chrome extension (ready to load unpacked or zip for Chrome Web Store)
- `dist/firefox/` - Firefox extension (ready to load temporarily or zip for AMO)

To create zip files for store submission:
```bash
cd dist/chrome && zip -r ../cogni-pomo-timer-chrome.zip * && cd ../..
cd dist/firefox && zip -r ../cogni-pomo-timer-firefox.zip * && cd ../..
```

## Philosophy

Cogni Pomo Timer embraces cognitive focus and intentional work. This is a minimal timer inspired by [Marinara](https://github.com/schmich/marinara) with only essential features:

**Included:**
- Basic Pomodoro timer (focus/short break/long break)
- Customizable timer durations
- Desktop notifications
- Custom gong sound (MP3)
- Session counter
- Badge with countdown

**Not Included:**
- Multiple sound options (only one custom gong)
- Pomodoro history tracking
- Statistics and charts
- Scheduled automatic timers
- Multiple timer configurations
- Ticking sounds
- Advanced settings

## License

MIT License - feel free to use and modify as needed.

## Credits

A [CogniChat](https://cogni.chat) initiative - Cognitive Chat. With the human factor.

Inspired by [Marinara Pomodoro Timer](https://github.com/schmich/marinara) by Chris Schmich.

Pomodoro® and The Pomodoro Technique® are trademarks of Francesco Cirillo. This extension is not affiliated with or endorsed by Francesco Cirillo.
