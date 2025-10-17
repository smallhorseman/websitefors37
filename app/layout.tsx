import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import ChatBot from '@/components/ChatBot'
import { Toaster } from 'react-hot-toast'
import { businessInfo, generateLocalBusinessSchema } from '@/lib/seo-config'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    template: `%s | ${businessInfo.name} - Professional Photography Pinehurst, TX`,
    default: `${businessInfo.name} - Professional Photography Services in Pinehurst, Texas`
  },
  description: businessInfo.description,
  keywords: 'photography, photographer, Pinehurst TX, wedding photography, portrait photography, event photography, commercial photography, Texas photographer',
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
      </head>
      <body className={inter.className}>
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
