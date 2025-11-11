import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/admin/pages/publish')

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    
    if (!sessionCookie) {
      log.warn('Unauthorized publish attempt - no session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify session
    const { data: session } = await supabaseAdmin
      .from('admin_sessions')
      .select('user_id')
      .eq('token_hash', sessionCookie.value)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (!session) {
      log.warn('Invalid or expired session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug, title, content, meta_description, published } = await request.json()

    // Validate required fields
    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, content' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabaseAdmin
      .from('content_pages')
      .select('id')
      .eq('slug', slug)
      .single()

    let result

    if (existing) {
      // Update existing page
      const { data, error } = await supabaseAdmin
        .from('content_pages')
        .update({
          title,
          content,
          meta_description,
          published: !!published,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug)
        .select()
        .single()

      if (error) {
        log.error('Failed to update page', { slug }, error)
        return NextResponse.json(
          { error: 'Failed to update page' },
          { status: 500 }
        )
      }

      result = data
      log.info('Page updated', { slug, published: !!published, userId: session.user_id })
    } else {
      // Create new page
      const { data, error } = await supabaseAdmin
        .from('content_pages')
        .insert({
          slug,
          title,
          content,
          meta_description,
          published: !!published,
          author_id: session.user_id,
        })
        .select()
        .single()

      if (error) {
        log.error('Failed to create page', { slug }, error)
        return NextResponse.json(
          { error: 'Failed to create page' },
          { status: 500 }
        )
      }

      result = data
      log.info('Page created', { slug, published: !!published, userId: session.user_id })
    }

    // Revalidate the page and sitemap
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: [`/${slug}`, '/sitemap.xml'] }),
      })
    } catch (revalError) {
      log.warn('Revalidation failed', { slug }, revalError)
      // Don't fail the request if revalidation fails
    }

    return NextResponse.json({
      success: true,
      page: result,
      message: published ? 'Page published successfully' : 'Page saved as draft',
    })
  } catch (error) {
    log.error('Publish error', undefined, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
