#!/bin/bash

echo "🧹 Cleaning up loose files in components folder..."

# Change to components directory
cd src/components

# Remove all .jsx files in the root (not in subdirectories)
find . -maxdepth 1 -name "*.jsx" -type f -delete

# Remove all .js files in the root (not in subdirectories)
find . -maxdepth 1 -name "*.js" -type f -delete

echo "✅ Cleanup complete!"
echo ""
echo "📁 Remaining items in components folder:"
ls -la

echo ""
echo "🎯 Only organized folders should remain:"
echo "   📂 bear/"
echo "   📂 common/"
echo "   📂 icons/"
echo "   📂 layout/"
echo "   📂 notes/"
echo "   📂 projects/"
echo "   📂 ui/"
