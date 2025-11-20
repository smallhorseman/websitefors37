import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import VisualEditorClient from './VisualEditorClient'

export const metadata: Metadata = {
  title: 'Visual Page Builder | Studio37 Admin',
  description: 'Drag-and-drop page builder for creating custom pages',
}

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function VisualEditorPage({ params }: PageProps) {
  // Check authentication
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('admin_session')

  if (!sessionCookie) {
    redirect('/admin/login')
  }

  const { slug } = params

  // In production, fetch existing page data from database
  // For now, we'll start with an empty canvas
  const initialBlocks = []

  return (
    <VisualEditorClient
      pageSlug={slug}
      initialBlocks={initialBlocks}
    />
  )
}
