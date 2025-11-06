const withPWABuilder = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
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
    optimizePackageImports: ['lucide-react', 'react-hot-toast'], // Tree-shake large packages
  },
  async redirects() {
    return [
      {
        source: "/portfolio",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/portfolio/:path*",
        destination: "/gallery/:path*",
        permanent: true,
      },
    ];
  },
  // Bundle analyzer for production builds
  ...(process.env.ANALYZE === "true" && {
    webpack: (config) => {
      if (process.env.NODE_ENV === "production") {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),
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
