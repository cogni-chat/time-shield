# Changelog

All notable changes to Cogni Pomo Timer will be documented in this file.

## [1.2.0] - 2025-11-03

### Added
- **Firefox Support**: Extension now works on both Chrome and Firefox
- `browser-polyfill.js` - Cross-browser compatibility layer for unified API
- `manifest.firefox.json` - Firefox Manifest V2 configuration
- `background-wrapper.js` - Chrome service worker wrapper for importScripts
- `build.sh` - Build script to create distribution packages for both browsers
- Audio playback in completion page for Firefox (Chrome uses offscreen document)
- Professional JSDoc comments throughout codebase
- Comprehensive browser compatibility documentation in README

### Changed
- All `chrome.*` API calls replaced with `browserAPI.*` for cross-browser compatibility
- Audio playback strategy: Chrome uses Offscreen API, Firefox plays directly in completion page
- README updated with installation instructions for both browsers
- Project structure documentation updated to reflect all files
- Technical details section expanded with browser-specific information

### Removed
- `REBRANDING.md` - Cleanup for professional codebase

### Technical Details
- Chrome: Manifest V3 with service worker and Offscreen API
- Firefox: Manifest V2 with background scripts and direct audio playback
- Shared codebase with browser detection for platform-specific features
- Browser polyfill provides unified API across both platforms

## [1.1.0] - 2025-10-15

### Fixed
- **Timer completion sound not playing**: Implemented offscreen document architecture required for audio playback in Chrome Manifest V3 service workers
- **No notification interaction**: Added notification click handler to provide visual feedback when timer completes
- **Sound continues after restart**: Sound now stops immediately when start button is clicked again
- **Sound keeps playing on completion page**: Sound now auto-stops after 3 seconds and stops when any button is clicked
- **Start next phase button not working**: Fixed message routing and state management for starting next timer phase
- **Message routing conflicts**: Separated internal audio control messages (`stopAudio`) from external stop requests (`stopSound`)
- **Badge counter not clearing**: Badge now clears when pause or reset button is clicked

### Added
- **Completion page**: Beautiful full-page notification that opens automatically when timer completes
- `complete.html` - Animated completion page with phase information and quick actions
- `complete.js` - Completion page logic with start next phase functionality
- `offscreen.html` - Offscreen document for audio playback
- `offscreen.js` - Audio playback handler with play/stop functionality
- `setupOffscreenDocument()` function in background.js to manage offscreen document lifecycle
- `stopGongSound()` function to stop any playing audio
- Notification click listener to focus on completion page tab

### Changed
- Updated `playGongSound()` to use offscreen document instead of direct Audio API
- Modified `startTimer()` to stop any playing sound before starting timer
- Modified `handleTimerComplete()` to open completion page in new tab
- Added `offscreen` and `tabs` permissions to manifest.json
- Added `offscreen.html` to web_accessible_resources in manifest.json
- Updated notification click handler to focus on completion page instead of attempting to open popup

### Technical Details
- Chrome Manifest V3 service workers cannot use the Audio API directly
- Offscreen documents provide the necessary DOM context for audio playback
- Audio element is tracked globally in offscreen.js to enable stop functionality

## [1.0.0] - Initial Release

### Features
- Pomodoro timer with focus and break sessions
- Customizable focus time, short break, and long break durations
- Session counter to track completed focus sessions
- Browser notifications when timer completes
- Badge display showing remaining minutes
- Persistent state across browser sessions
- Simple, clean UI
