import React from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '@/components/Navigation'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin Panel | Studio 37',
}

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Optional: Add authentication check
  const supabase = createServerComponentClient({ cookies })
  
  // You can add authentication check here if needed
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <AdminSidebar />
      <div className="lg:ml-64 pt-0 lg:pt-0">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
