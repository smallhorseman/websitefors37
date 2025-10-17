import React from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '@/components/Navigation'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin Panel | Studio37 Photography',
  description: 'Secure admin dashboard for Studio37 Photography business management',
}

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  
  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  // Check user role and permissions
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, name')
    .eq('id', session.user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    redirect('/admin/login?error=unauthorized')
  }
  
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
