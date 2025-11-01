# Logo PNG Conversion Guide

The badge SVG logos have been created in `public/brand/`. To convert them to PNG format:

## Option 1: Using macOS sips (recommended for Mac users)

After committing the SVG files, run:

```bash
cd public/brand

# Light badge
sips -s format png studio37-badge-light.svg --out studio37-badge-light-192.png -Z 192
sips -s format png studio37-badge-light.svg --out studio37-badge-light-512.png -Z 512
sips -s format png studio37-badge-light.svg --out studio37-badge-light-1024.png -Z 1024

# Dark badge
sips -s format png studio37-badge-dark.svg --out studio37-badge-dark-192.png -Z 192
sips -s format png studio37-badge-dark.svg --out studio37-badge-dark-512.png -Z 512
sips -s format png studio37-badge-dark.svg --out studio37-badge-dark-1024.png -Z 1024

# Square badge
sips -s format png studio37-badge-square.svg --out studio37-badge-square-192.png -Z 192
sips -s format png studio37-badge-square.svg --out studio37-badge-square-512.png -Z 512
sips -s format png studio37-badge-square.svg --out studio37-badge-square-1024.png -Z 1024
```

Or simply run:
```bash
./convert-logos.sh
```

## Option 2: Using ImageMagick

```bash
brew install imagemagick

cd public/brand
convert -background none -resize 192x192 studio37-badge-light.svg studio37-badge-light-192.png
convert -background none -resize 512x512 studio37-badge-light.svg studio37-badge-light-512.png
convert -background none -resize 1024x1024 studio37-badge-light.svg studio37-badge-light-1024.png
```

## Option 3: Online Conversion

1. Go to <https://cloudconvert.com/svg-to-png>
2. Upload the SVG files from `public/brand/`
3. Set output sizes: 192px, 512px, 1024px
4. Download and save to `public/brand/`

## PNG Size Guide

- **192px**: Favicons, PWA icons, mobile shortcuts
- **512px**: Social media (Facebook, Twitter/X), Open Graph images
- **1024px**: High-resolution displays, Retina screens, print materials

## Files to Convert

- `studio37-badge-light.svg` → Light backgrounds (primary use)
- `studio37-badge-dark.svg` → Dark/transparent backgrounds
- `studio37-badge-square.svg` → Social profiles, app icons (512×512 format)
