# 🛡️ Cogni Time Shield
**Protect your most valuable asset: Consciousness.**

> *"Time is the currency of consciousness. Spend it where it matters."*

<div align="left">
  <img src="https://img.shields.io/badge/Chrome-Supported-FF8C00?style=flat-square&logo=google-chrome&logoColor=white" />
  <img src="https://img.shields.io/badge/Firefox-Supported-FF2E63?style=flat-square&logo=firefox&logoColor=white" />
  <img src="https://img.shields.io/badge/Architecture-Edge_Only-6A0DAD?style=flat-square" />
</div>

---

### // THE MISSION
In an attention economy designed to fragment your mind, **Time Shield** is a digital boundary for your *Sadhana* (Deep Work).
It is not just a timer; it is a **Fiduciary Agent for your Attention**.

* **No Cloud Sync:** Your data never leaves your machine.
* **No Gamification:** Focus is a duty, not a game.
* **Sattvic Design:** Minimalist UI. Orange for Action (Rajas), Purple for Insight (Sattva).

---

## // THE PROTOCOL (Features)

* **⏱️ Deep Work Sessions:** 25-minute default focus blocks.
* **☕ Integration Breaks:** 5-minute pauses to let the "diffuse mode" network operate.
* **🌴 Recovery Phase:** 15-minute break after 4 cycles.
* **🔔 Edge Notifications:** Respectful desktop alerts.
* **🔊 Gong Bath:** Plays a custom `gong.mp3` to signal state changes.
* **🛡️ Privacy First:** Zero tracking. Zero analytics.

### The "Hollow Man" Principle
> *"You should be working."* — Sebastian Caine, *Hollow Man* (2000)

Any additional feature is Procrastination. We intentionally omit charts, social sharing, and complex settings.

---

## // INSTALLATION

### 0. Prerequisites
1.  **Generate Icons:** Open `create-icons.html` in your browser, download the 3 PNGs, and move them to `icons/`.
2.  **Sound (Optional):** Drop your favorite `gong.mp3` into `sounds/`. (Keep it <1MB).

### 🖥️ Chrome (Edge/Brave)
1.  Navigate to `chrome://extensions/`.
2.  Toggle **Developer mode** (top right).
3.  Click **Load unpacked**.
4.  Select this folder (`cogni-time-shield`).

### 🦊 Firefox
1.  **Temporary (Dev Mode):**
    * Go to `about:debugging`.
    * Click **This Firefox** > **Load Temporary Add-on...**.
    * Select `dist/firefox/manifest.json`.
2.  **Permanent:**
    * Run `./build.sh` to generate the package.
    * Submit to AMO for signing.

---

## // USAGE & CUSTOMIZATION

**The Flow:**
1.  **Start:** Engages the "Time Shield." Focus.
2.  **Pause:** Emergency interruptions only.
3.  **Reset:** Abort mission.

**Configuration:**
Click the extension icon to adjust your rhythms:
* *Focus Duration* (Default: 25m)
* *Short Break* (Default: 5m)
* *Long Break* (Default: 15m)

---

## // TECHNICAL ARCHITECTURE

**Manifest V3 (Chrome) & V2 (Firefox) Hybrid**
This repo uses a unified codebase that builds for both architectures.

```text
time-shield/
├── manifest.json              # Chrome V3 Configuration
├── manifest.firefox.json      # Firefox V2 Configuration
├── background.js              # Service Worker (The Brain)
├── offscreen.html             # Audio Handler (The Voice)
├── popup.js                   # UI Logic (The Face)
└── build.sh                   # Distribution Script
```
### Permissions Explained
* `storage`: Saves settings locally (No cloud sync).
* `notifications`: Alerts when the session ends.
* `tabs`: Opens the "Session Complete" landing page.

---

## // CREDITS

**A [Cogni.chat](https://cogni.chat) Initiative.**
*Bridging silicon logic with spiritual insight.*

Built by **[@airawatraj](https://github.com/airawatraj)**.
* *Concept:* The Truth Lab
* *Inspiration:* [Marinara](https://github.com/schmich/marinara)
* *License:* MIT (Free as in Freedom)

> *AI simulates logic; it is never the Witness.*
