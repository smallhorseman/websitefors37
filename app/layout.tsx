import React, { Suspense } from "react";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import QueryProvider from "@/components/QueryProvider";
import { businessInfo, generateLocalBusinessSchema } from "@/lib/seo-config";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import ToasterClient from "@/components/ToasterClient";
import ChatBotMount from "@/components/ChatBotMount";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ['georgia', 'serif'],
});

export const metadata = {
  title: {
    template: `%s | ${businessInfo.name} - Professional Photography Pinehurst, TX`,
    default: `Studio37 - Houston-based Photography | Blending Vintage Film Warmth with Modern Digital Precision`,
  },
  description:
    "Studio37 Photography blends vintage film warmth with modern digital precision. We specialize in weddings, portraits, and commercial photography in Houston, TX and surrounding areas.",
  keywords:
    "photography, photographer, Houston TX, Pinehurst TX, wedding photography, portrait photography, vintage style photography, film photography, digital photography, commercial photography",
  authors: [{ name: businessInfo.name }],
  creator: businessInfo.name,
  publisher: businessInfo.name,
  metadataBase: new URL(businessInfo.contact.website),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      'twilio-domain-verification': 'a41a3d624e3ac9cb94868de50be953d2',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  referrer: 'strict-origin-when-cross-origin',
  other: {
    "geo.region": "US-TX",
    "geo.placename": "Pinehurst, Texas",
    "geo.position": `${businessInfo.geo.latitude};${businessInfo.geo.longitude}`,
    ICBM: `${businessInfo.geo.latitude}, ${businessInfo.geo.longitude}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const WebVitals = dynamic(() => import("@/components/WebVitals"), {
    ssr: false,
    loading: () => null,
  });
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#b46e14" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema, null, 0),
          }}
        />
        <meta
          name="google-site-verification"
          content={process.env.GOOGLE_SITE_VERIFICATION || ""}
        />
        {/* Fonts are self-hosted via next/font; remove external Google Fonts preconnect to shrink network dependency tree */}
        {/* Preconnect to Cloudinary for faster image loading (LCP optimization) */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        {/* Preload LCP hero image for faster rendering */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg"
          imageSrcSet="https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,c_limit,w_640/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg 640w, https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,c_limit,w_800/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg 800w, https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,c_limit,w_1200/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg 1200w"
          imageSizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1200px"
        />
  {/* Removed global Cloudinary Media Library (only needed in admin). */}
        {/* Explicit favicon for modern browsers */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {/* Accessibility: Skip to content link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-amber-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        {/* Google Analytics 4 - Deferred to afterInteractive for better performance */}
        <Script
          id="ga4-src"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-5NTFJK2GH8"
          }`}
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', '${
              process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-5NTFJK2GH8"
            }', { anonymize_ip: true });
          `}
        </Script>
        <QueryProvider>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <WebVitals />
          {/* Wrap dynamic/client sections in an error boundary to avoid hard crashes from runtime errors */}
          {/** Using a dynamic import here would not help with errors during render; instead, use a client error boundary. */}
          <ClientErrorBoundary label="navigation">
            <Navigation />
          </ClientErrorBoundary>
          <ClientErrorBoundary label="page">
            <main id="main" className="min-h-screen">{children}</main>
          </ClientErrorBoundary>
          {/* Interaction-based ChatBot mount for performance */}
          <ClientErrorBoundary label="chatbot">
            <ChatBotMount />
          </ClientErrorBoundary>
          <ToasterClient />
        </QueryProvider>
      </body>
    </html>
  );
}
