/**
 * On-demand revalidation helpers for ISR pages
 * Call these from admin actions to immediately update cached pages
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'change-me-in-production'

export async function revalidateContent(path: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${REVALIDATE_SECRET}`
      },
      body: JSON.stringify({ path, type: 'path' })
    })
    
    if (!res.ok) {
      console.error('Revalidation failed:', await res.text())
      return false
    }
    
    return true
  } catch (err) {
    console.error('Revalidation error:', err)
    return false
  }
}

export async function revalidateTag(tag: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${REVALIDATE_SECRET}`
      },
      body: JSON.stringify({ tag, type: 'tag' })
    })
    
    if (!res.ok) {
      console.error('Tag revalidation failed:', await res.text())
      return false
    }
    
    return true
  } catch (err) {
    console.error('Tag revalidation error:', err)
    return false
  }
}

// Convenience methods for common revalidations
export const revalidateBlog = () => revalidateContent('/blog')
export const revalidateGallery = () => revalidateContent('/gallery')
export const revalidateServices = () => revalidateContent('/services')
export const revalidateHomepage = () => revalidateContent('/')
