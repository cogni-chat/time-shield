#!/bin/bash

# 🛡️ COGNI TIME SHIELD - DISTRIBUTION SCRIPT
# "Simplicity is the ultimate sophistication."

APP_NAME="cogni-time-shield"
DIST_DIR="dist"

# 1. CLEANUP (Destroy previous builds)
echo "🧹 Cleaning up old artifacts..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/chrome"
mkdir -p "$DIST_DIR/firefox"

# 2. EXTRACT VERSION (Read from manifest.json)
# Uses grep/sed to avoid dependency on 'jq'
VERSION=$(grep '"version":' manifest.json | cut -d\" -f4)
echo "🚀 Building Version: $VERSION"

# 3. DEFINE CORE ASSETS
# Add any new files here. We exclude git files, DS_Store, and dev scripts automatically.
FILES=(
  "background.js"
  "popup.html"
  "popup.js"
  "offscreen.html"
  "offscreen.js"
  "style.css"
  "icons"
  "sounds"
)

# 4. BUILD FOR CHROME (Manifest V3)
echo "🛠️  Assembling Chrome Package..."
for file in "${FILES[@]}"; do
  cp -r "$file" "$DIST_DIR/chrome/"
done
cp manifest.json "$DIST_DIR/chrome/" # Use the default MV3 manifest

# 5. BUILD FOR FIREFOX (Manifest V2)
echo "🦊 Assembling Firefox Package..."
for file in "${FILES[@]}"; do
  cp -r "$file" "$DIST_DIR/firefox/"
done
# CRITICAL: Rename the firefox-specific manifest to standard 'manifest.json'
cp manifest.firefox.json "$DIST_DIR/firefox/manifest.json" 

# 6. ZIP IT UP (Distribution Ready)
echo "📦 Zipping archives..."

# Chrome
cd "$DIST_DIR/chrome"
zip -r -q "../${APP_NAME}-v${VERSION}-chrome.zip" .
cd ../..

# Firefox
cd "$DIST_DIR/firefox"
zip -r -q "../${APP_NAME}-v${VERSION}-firefox.zip" .
cd ../..

echo "✅ Build Complete."
echo "📂 Output: $DIST_DIR/"
