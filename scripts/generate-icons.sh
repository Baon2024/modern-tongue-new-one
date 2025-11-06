#!/bin/bash

# Generate PNG icons from SVG using ImageMagick
# Install: brew install imagemagick (Mac) or apt-get install imagemagick (Linux)

cd "$(dirname "$0")/.."

if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found!"
    echo ""
    echo "Please install ImageMagick:"
    echo "  Mac: brew install imagemagick"
    echo "  Linux: sudo apt-get install imagemagick"
    echo "  Or use online tool: https://svgtopng.com/"
    echo ""
    echo "Then run this script again, or follow docs/ICONS_GUIDE.md"
    exit 1
fi

echo "🎨 Generating extension icons..."

# Use 'magick' for ImageMagick 7, 'convert' for older versions
CMD="magick"
if ! command -v magick &> /dev/null; then
    CMD="convert"
fi

# Generate PNG icons from SVG
$CMD icons/icon.svg -resize 16x16 icons/icon16.png
$CMD icons/icon.svg -resize 32x32 icons/icon32.png
$CMD icons/icon.svg -resize 48x48 icons/icon48.png
$CMD icons/icon.svg -resize 96x96 icons/icon96.png
$CMD icons/icon.svg -resize 128x128 icons/icon128.png

echo "✅ Icons generated successfully!"
echo ""
echo "Generated files:"
ls -lh icons/*.png

echo ""
echo "Next steps:"
echo "1. Check icons folder"
echo "2. Update manifest.json with icon references (already done if you committed)"
echo "3. Reload extension in chrome://extensions"
