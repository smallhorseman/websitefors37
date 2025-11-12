import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Email Preview API
 * Renders email template with test data
 * GET /api/marketing/preview?templateId=xxx or POST with custom HTML
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const templateId = searchParams.get('templateId')
  
  if (!templateId) {
    return NextResponse.json({ error: 'Template ID required' }, { status: 400 })
  }
  
  // Fetch template
  const { data: template, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('id', templateId)
    .single()
  
  if (error || !template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }
  
  // Default test data for variable substitution
  const testData: Record<string, string> = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    sessionType: 'Wedding Photography',
    sessionDate: 'December 15, 2025',
    sessionTime: '2:00 PM',
    location: 'Studio37',
    galleryLink: 'https://www.studio37.cc/gallery/sample',
    expiryDays: '30'
  }
  
  // Render HTML with variable substitution
  let renderedHtml = template.html_content
  
  // Replace {{variable}} with test data
  Object.entries(testData).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    renderedHtml = renderedHtml.replace(regex, value)
  })
  
  // Wrap in email-safe HTML structure
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${renderedHtml}
  </div>
</body>
</html>
  `
  
  return new NextResponse(fullHtml, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'SAMEORIGIN' // Allow iframe from same origin
    }
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { html, subject, testData } = body
  
  if (!html) {
    return NextResponse.json({ error: 'HTML content required' }, { status: 400 })
  }
  
  // Custom test data or use defaults
  const data = testData || {
    firstName: 'Sarah',
    lastName: 'Johnson',
    sessionType: 'Wedding Photography',
    sessionDate: 'December 15, 2025',
    sessionTime: '2:00 PM',
    location: 'Studio37',
    galleryLink: 'https://www.studio37.cc/gallery/sample',
    expiryDays: '30'
  }
  
  // Render HTML with variable substitution
  let renderedHtml = html
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    renderedHtml = renderedHtml.replace(regex, String(value))
  })
  
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || 'Email Preview'}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${renderedHtml}
  </div>
</body>
</html>
  `
  
  return new NextResponse(fullHtml, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'SAMEORIGIN'
    }
  })
}
