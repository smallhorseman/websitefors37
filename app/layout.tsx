import React from 'react'
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import Navigation from '@/components/Navigation'
import ChatBot from '@/components/ChatBot'
import WebVitals from '@/components/WebVitals'
import { Toaster } from 'react-hot-toast'
import { businessInfo, generateLocalBusinessSchema } from '@/lib/seo-config'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

// Add module preload hints for critical resources
export const viewport = {
  themeColor: '#ffffff',
}

// Add HTTP headers for performance
export const headers = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' blob: data: https://*.cloudinary.com https://*.unsplash.com;",
}

export const metadata = {
  title: {
    template: `%s | ${businessInfo.name} - Professional Photography Pinehurst, TX`,
    default: `Studio37 - Houston-based Photography | Blending Vintage Film Warmth with Modern Digital Precision`
  },
  description: "Studio37 Photography blends vintage film warmth with modern digital precision. We specialize in weddings, portraits, and commercial photography in Houston, TX and surrounding areas.",
  keywords: 'photography, photographer, Houston TX, Pinehurst TX, wedding photography, portrait photography, vintage style photography, film photography, digital photography, commercial photography',
  authors: [{ name: businessInfo.name }],
  creator: businessInfo.name,
  publisher: businessInfo.name,
  metadataBase: new URL(businessInfo.contact.website),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Pinehurst, Texas',
    'geo.position': `${businessInfo.geo.latitude};${businessInfo.geo.longitude}`,
    'ICBM': `${businessInfo.geo.latitude}, ${businessInfo.geo.longitude}`,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const localBusinessSchema = generateLocalBusinessSchema()
  
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema, null, 0)
          }}
        />
        <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION || ''} />
        {/* Preload critical resources */}
        <link rel="preload" href="https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg" as="image" />
        <link rel="preload" href="https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639916/Pngtree_film_grain_overlay_8671079_amgbm1.png" as="image" />
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <WebVitals />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <ChatBot />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
