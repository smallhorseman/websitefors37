# App Icons (PWA)

This folder is expected to contain PNG icons referenced by `public/manifest.webmanifest`:

- icon-192.png (192x192)
- icon-512.png (512x512)
- maskable-192.png (192x192, maskable safe area)
- maskable-512.png (512x512, maskable safe area)

Generate them from the SVG brand assets under `public/brand/` using the provided scripts:

## Option 1: Shell (macOS with ImageMagick)

./convert-logos.sh

## Option 2: Node script

node ./convert-logos.js

Then copy the generated PNGs into this `public/icons/` folder with the filenames above.
