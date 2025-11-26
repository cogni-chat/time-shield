#!/bin/bash

#####################################################################
# Cogni Time Shield - Build Script
# Creates distribution packages for Chrome and Firefox extensions
#####################################################################

set -e

echo "🔨 Building Cogni Time Shield extensions..."

# Clean previous builds
rm -rf dist
mkdir -p dist/chrome dist/firefox

# Common files for both browsers
COMMON_FILES=(
  "background.js"
  "browser-polyfill.js"
  "complete.html"
  "complete.js"
  "create-icons.html"
  "generate-icons.js"
  "popup.html"
  "popup.js"
  "styles.css"
  "icons"
  "sounds"
  "README.md"
  "CHANGELOG.md"
  "LICENSE"
)

# Chrome-specific files
CHROME_SPECIFIC=(
  "background-wrapper.js"
  "offscreen.html"
  "offscreen.js"
)

echo "📦 Packaging Chrome extension..."
# Copy common files to Chrome dist
for file in "${COMMON_FILES[@]}"; do
  if [ -e "$file" ]; then
    cp -r "$file" dist/chrome/
  fi
done

# Copy Chrome-specific files
for file in "${CHROME_SPECIFIC[@]}"; do
  if [ -e "$file" ]; then
    cp "$file" dist/chrome/
  fi
done

# Copy Chrome manifest
cp manifest.json dist/chrome/

echo "📦 Packaging Firefox extension..."
# Copy common files to Firefox dist
for file in "${COMMON_FILES[@]}"; do
  if [ -e "$file" ]; then
    cp -r "$file" dist/firefox/
  fi
done

# Copy Firefox manifest
cp manifest.firefox.json dist/firefox/manifest.json

echo "🎉 Build complete!"
echo ""
echo "Chrome extension: dist/chrome/"
echo "Firefox extension: dist/firefox/"
echo ""
echo "To create zip files for distribution:"
echo "  cd dist/chrome && zip -r ../cogni-time-shield-chrome.zip * && cd ../.."
echo "  cd dist/firefox && zip -r ../cogni-time-shield-firefox.zip * && cd ../.."
