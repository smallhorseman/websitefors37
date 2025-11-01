#!/bin/bash
# SVG to PNG Conversion Script for Studio37 Badge Logos
# Run this after the SVG files are committed and synced

cd "$(dirname "$0")/public/brand" || exit 1

echo "Converting Studio37 badge logos to PNG..."

# Check if SVG files exist
if [ ! -f "studio37-badge-light.svg" ]; then
    echo "Error: SVG files not found. Please ensure the files are synced from VS Code workspace."
    exit 1
fi

# Convert light badge
echo "Converting light badge..."
sips -s format png studio37-badge-light.svg --out studio37-badge-light-192.png -Z 192
sips -s format png studio37-badge-light.svg --out studio37-badge-light-512.png -Z 512
sips -s format png studio37-badge-light.svg --out studio37-badge-light-1024.png -Z 1024

# Convert dark badge
echo "Converting dark badge..."
sips -s format png studio37-badge-dark.svg --out studio37-badge-dark-192.png -Z 192
sips -s format png studio37-badge-dark.svg --out studio37-badge-dark-512.png -Z 512
sips -s format png studio37-badge-dark.svg --out studio37-badge-dark-1024.png -Z 1024

# Convert square badge
echo "Converting square badge..."
sips -s format png studio37-badge-square.svg --out studio37-badge-square-192.png -Z 192
sips -s format png studio37-badge-square.svg --out studio37-badge-square-512.png -Z 512
sips -s format png studio37-badge-square.svg --out studio37-badge-square-1024.png -Z 1024

echo ""
echo "✅ PNG conversion complete!"
echo ""
echo "Created files:"
echo "  Light badge: 192px, 512px, 1024px"
echo "  Dark badge: 192px, 512px, 1024px"
echo "  Square badge: 192px, 512px, 1024px"
echo ""
echo "Use cases:"
echo "  - 192px: Favicons, PWA icons"
echo "  - 512px: Social media, Open Graph"
echo "  - 1024px: High-res displays, print"
