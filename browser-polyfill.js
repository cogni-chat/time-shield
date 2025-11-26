/**
 * Cogni Time Shield - Browser API Polyfill
 * Provides a unified API for cross-browser compatibility
 * Supports Chrome (Manifest V3) and Firefox (Manifest V2)
 * Works in both service worker and window contexts
 */

const isFirefox = typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined';
const isChrome = typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined';

// Use globalThis for compatibility with both window and service worker contexts
const globalContext = typeof globalThis !== 'undefined' ? globalThis : 
                      typeof self !== 'undefined' ? self : 
                      typeof window !== 'undefined' ? window : {};

/**
 * Unified browser API that works across Chrome and Firefox
 * Firefox uses the 'browser' namespace with native promises
 * Chrome uses the 'chrome' namespace with callback-based APIs
 */
globalContext.browserAPI = (function() {
  if (isFirefox) {
    return browser;
  } else if (isChrome) {
    return chrome;
  }
  throw new Error('Unsupported browser');
})();

/**
 * Check if Chrome's Offscreen API is available
 * @returns {boolean} True if running in Chrome with Offscreen API support
 */
globalContext.hasOffscreenAPI = function() {
  return isChrome && typeof chrome.offscreen !== 'undefined';
};

/**
 * Check if running in Firefox browser
 * @returns {boolean} True if running in Firefox
 */
globalContext.isFirefoxBrowser = function() {
  return isFirefox;
};
