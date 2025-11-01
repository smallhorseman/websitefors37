import React from 'react'
import { Metadata } from 'next'
import AdminProtected from '@/components/AdminProtected'

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
    <AdminProtected>
      <div className="bg-gray-50 min-h-screen">
        {/* Offset for fixed public navigation bar */}
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </div>
    </AdminProtected>
  )
}
