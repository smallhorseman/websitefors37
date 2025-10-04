import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '@/components/Navigation'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Optional: Add authentication check
  const supabase = createServerComponentClient({ cookies })
  
  // You can add authentication check here if needed
  
  return (
    <>
      <Navigation />
      <div className="flex min-h-screen pt-16">
        <AdminSidebar />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </>
  )
}
