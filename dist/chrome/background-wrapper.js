/**
 * Cogni Pomo Timer - Background Service Worker Wrapper (Chrome)
 * Chrome Manifest V3 service workers require importScripts
 * Loads browser polyfill and main background script
 */

importScripts('browser-polyfill.js', 'background.js');
