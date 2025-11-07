import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('page_configs')
      .select('*')
      .order('slug', { ascending: true })

    if (error) throw error

    // Pretty print the data structure
    const formatted = (data || []).map(page => ({
      slug: page.slug,
      dataType: typeof page.data,
      dataKeys: page.data ? Object.keys(page.data) : [],
      componentsType: page.data?.components ? typeof page.data.components : 'undefined',
      componentsIsArray: Array.isArray(page.data?.components),
      componentsLength: Array.isArray(page.data?.components) ? page.data.components.length : 0,
      sampleComponent: page.data?.components?.[0] ? {
        id: page.data.components[0].id,
        type: page.data.components[0].type,
        hasData: !!page.data.components[0].data
      } : null
    }))

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      pages: formatted,
      raw: data
    }, { status: 200 })
  } catch (e: any) {
    console.error('Debug endpoint error:', e)
    return NextResponse.json({
      success: false,
      error: e.message
    }, { status: 500 })
  }
}
