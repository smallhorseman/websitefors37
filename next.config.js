const withPWABuilder = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // Cache Cloudinary images safely
    {
      urlPattern: /^https?:\/\/res\.cloudinary\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cloudinary-images',
        expiration: { maxEntries: 80, maxAgeSeconds: 7 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Same-origin images under /images and typical image extensions
    {
      urlPattern: ({ url }) => url.origin === self.location.origin && (/\/(images|_next\/image)\//.test(url.pathname) || /\.(?:png|jpg|jpeg|gif|webp|avif|svg)$/.test(url.pathname)),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'local-images',
        expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    // Fonts
    {
      urlPattern: /\.(?:woff2?|ttf|otf)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'font-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: eslint.ignoreDuringBuilds will be re-injected in the final export
  // to avoid being dropped by the PWA wrapper's merge.
  images: {
    // Disable image optimization on serverless (Netlify can't write to cache)
    unoptimized: process.env.NETLIFY === "true",
    formats: ["image/avif", "image/webp"], // Prioritize AVIF
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Reduced larger sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Optimized sizes
    minimumCacheTTL: 31536000, // 1 year cache
    contentSecurityPolicy:
      "default-src 'self'; img-src 'self' blob: data: https://*.cloudinary.com https://*.unsplash.com;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  skipTrailingSlashRedirect: false,
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // optimizeCss: true, // Disabled - requires 'critters' package
    optimizePackageImports: ['lucide-react', 'react-hot-toast', '@supabase/auth-helpers-nextjs'], // Tree-shake large packages (framer-motion removed - now only in dynamic imports)
  },
  async redirects() {
    return [];
  },
  // Headers for performance and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          // Security: HSTS (HTTPS only) - safe on Netlify with automatic HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Security: Permissions Policy - disable powerful features by default
          {
            key: "Permissions-Policy",
            value: [
              "geolocation=()",
              "camera=()",
              "microphone=()",
              "payment=()",
              "accelerometer=()",
              "autoplay=()",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()"
            ].join(", "),
          },
          // Security: Cross-Origin policies
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          // Security: Content Security Policy (moderate defaults compatible with Next.js)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              // Next.js requires unsafe-inline for React hydration; unsafe-eval only in dev
              "script-src 'self' 'unsafe-inline' " + (process.env.NODE_ENV === 'development' ? "'unsafe-eval' " : "") + "https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.supabase.co",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://res.cloudinary.com",
              "frame-ancestors 'self'",
              "frame-src 'self' https://app.simpletexting.com https://app2.simpletexting.com",
              "child-src 'self' https://app.simpletexting.com https://app2.simpletexting.com",
              "object-src 'none'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-placeholder',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-placeholder',
  },
};

// Export a function so we can re-inject eslint.ignoreDuringBuilds after PWA wraps the config
module.exports = (phase, { defaultConfig } = {}) => {
  const cfg = withPWABuilder(nextConfig);
  // Re-inject ESLint override explicitly (the PWA wrapper omits it otherwise)
  cfg.eslint = { ignoreDuringBuilds: true };
  cfg.typescript = { ignoreBuildErrors: true };
  return cfg;
};
