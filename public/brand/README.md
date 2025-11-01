# Brand Assets

Inspired by the watermark image:
<https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077115/My%20Brand/IMG_2115_mtuowt.png>

Added and refined files:

- studio37-badge-light.svg — refined badge (light), production-ready
- studio37-badge-dark.svg — refined badge (dark), production-ready
- studio37-badge-square.svg — square badge (512×512) for social/profile uses
- studio37-logo-watermark-light.svg — previous variant that incorporates watermark texture
- studio37-logo-watermark-dark.svg — previous variant for dark contexts

Preview in the site:

- The Navigation component now falls back to the refined badge automatically.
- To force a specific logo, go to Admin → Settings → Branding and set Logo URL to one of:
  - /brand/studio37-badge-light.svg
  - /brand/studio37-badge-dark.svg

Next steps I can automate:

- Export PNG/WEBP variants (Favicon, 512/1024 social, transparent PNGs).
- Upload to Cloudinary and update `lib/settings.ts` and DB `settings.logo_url`.
- Minor tweaks (kerning, spacing, thicker/thinner ring, alternate tagline).
