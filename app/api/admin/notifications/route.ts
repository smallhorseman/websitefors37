import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch recent leads and appointments for notifications
    const [leadsRes, appointmentsRes] = await Promise.all([
      supabase
        .from('leads')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('appointments')
        .select('id, name, start_time')
        .order('start_time', { ascending: false })
        .limit(5)
    ])

    const notifications = []
    let unreadCount = 0

    // Add lead notifications
    if (leadsRes.data) {
      for (const lead of leadsRes.data) {
        const timestamp = new Date(lead.created_at)
        const now = new Date()
        const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
        
        // Only show leads from last 24 hours as unread
        const isUnread = diffHours < 24
        if (isUnread) unreadCount++
        
        notifications.push({
          id: `lead-${lead.id}`,
          type: 'lead',
          title: 'New Lead',
          message: `${lead.name || lead.email || 'Someone'} submitted a contact form`,
          timestamp: lead.created_at,
          read: !isUnread,
          link: `/admin/leads`
        })
      }
    }

    // Add appointment notifications
    if (appointmentsRes.data) {
      for (const appt of appointmentsRes.data) {
        const timestamp = new Date(appt.start_time)
        const now = new Date()
        const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
        
        const isUnread = diffHours < 24
        if (isUnread) unreadCount++
        
        notifications.push({
          id: `appointment-${appt.id}`,
          type: 'appointment',
          title: 'New Appointment',
          message: `${appt.name || 'Someone'} booked a session`,
          timestamp: appt.start_time,
          read: !isUnread,
          link: `/admin/bookings`
        })
      }
    }

    // Sort by timestamp desc
    notifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return NextResponse.json({
      success: true,
      notifications: notifications.slice(0, 10),
      unreadCount
    })
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
