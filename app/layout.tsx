import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import ChatBot from '@/components/ChatBot'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Studio 37 - Professional Photography Services',
  description: 'Capturing your precious moments with artistic excellence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
    </html>
  )
}
