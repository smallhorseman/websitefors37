import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel | Studio37 Photography',
  description: 'Secure admin dashboard for Studio37 Photography business management',
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
