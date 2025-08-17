#!/bin/bash

echo "🧹 Starting cleanup of loose files in components folder..."
echo ""

cd src/components

# Remove all loose .jsx files
echo "Removing .jsx files..."
rm -f AboutMe.jsx AnimatedCursor.jsx BearContext.jsx BearDebug.jsx BearEars.jsx
rm -f BearIcon.jsx BearIconProjects.jsx BearIconReading.jsx BearIconResume.jsx
rm -f ContentCard.jsx ContentCarousel.jsx ContentGrid.jsx ContentSection.jsx
rm -f CursorSVG.jsx Experience.jsx HeroBackground.jsx HeyThere.jsx
rm -f Home.jsx Navbar.jsx Projects.jsx Resume.jsx RevealStarter.jsx
rm -f Stories.jsx ThingsBuilt.jsx UnifiedBearIcon.jsx

# Remove loose .js files
echo "Removing .js files..."
rm -f useBearState.js useReveal.js

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "📁 Remaining items in components folder:"
ls -la
