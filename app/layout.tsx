import React from 'react'
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import QueryProvider from '@/components/QueryProvider'
import { businessInfo, generateLocalBusinessSchema } from '@/lib/seo-config'
import Script from 'next/script'
import Analytics from '@/components/Analytics'

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
  const ChatBot = dynamic(() => import('@/components/ChatBot'), { ssr: false, loading: () => null })
  const WebVitals = dynamic(() => import('@/components/WebVitals'), { ssr: false, loading: () => null })
  const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), { ssr: false, loading: () => null })
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
          {/* Removed aggressive preloads (they were contributing to LCP). Keep dns-prefetch instead. */}
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {/* Explicit favicon for modern browsers; Next will also use app/icon.svg */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {/* Google Analytics 4 */}
        <Script
          id="ga4-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-5NTFJK2GH8'}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-5NTFJK2GH8'}', { anonymize_ip: true });
          `}
        </Script>
        <QueryProvider>
          <Analytics />
          <WebVitals />
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <ChatBot />
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  )
}
