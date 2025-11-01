'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Camera, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Star, 
  Mail,
  Phone,
  MessageSquare,
  Award,
  Eye,
  Activity,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ProgressBar from '@/components/ProgressBar'
import Link from 'next/link'

interface DashboardStats {
  totalLeads: number
  newLeads: number
  convertedLeads: number
  totalRevenue: number
  avgDealSize: number
  conversionRate: number
  activeBookings: number
  completedSessions: number
  galleryImages: number
  websiteViews: number
  // Trend data (comparing to last period)
  leadsTrend?: number
  revenueTrend?: number
  conversionTrend?: number
}

interface RecentActivity {
  id: string
  type: 'lead' | 'booking' | 'communication' | 'session'
  title: string
  description: string
  timestamp: string
  priority?: 'low' | 'medium' | 'high'
}

// Trend indicator component
const TrendIndicator = ({ value, suffix = '%' }: { value?: number; suffix?: string }) => {
  if (value === undefined || value === 0) return null
  
  const isPositive = value > 0
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600'
  
  return (
    <span className={`text-xs flex items-center gap-1 ${colorClass}`}>
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    convertedLeads: 0,
    totalRevenue: 0,
    avgDealSize: 0,
    conversionRate: 0,
    activeBookings: 0,
    completedSessions: 0,
    galleryImages: 0,
    websiteViews: 0,
    leadsTrend: 0,
    revenueTrend: 0,
    conversionTrend: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchDashboardData()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setUser({ ...session.user, ...profile })
    }
  }

  const fetchDashboardData = async () => {
    try {
      // Fetch leads statistics
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('status, expected_value, created_at')

      if (leadsError) throw leadsError

      // Calculate lead stats
      const totalLeads = leadsData?.length || 0
      const newLeads = leadsData?.filter(lead => lead.status === 'new').length || 0
      const convertedLeads = leadsData?.filter(lead => lead.status === 'closed-won').length || 0
      const totalRevenue = leadsData
        ?.filter(lead => lead.status === 'closed-won')
        .reduce((sum, lead) => sum + (lead.expected_value || 0), 0) || 0
      const avgDealSize = convertedLeads > 0 ? totalRevenue / convertedLeads : 0
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

      // Fetch gallery stats
      const { data: galleryData } = await supabase
        .from('gallery_images')
        .select('id')

      // Fetch recent activity
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('id, name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      const activity: RecentActivity[] = recentLeads?.map(lead => ({
        id: lead.id,
        type: 'lead',
        title: `New lead: ${lead.name}`,
        description: `Status: ${lead.status}`,
        timestamp: lead.created_at,
        priority: lead.status === 'new' ? 'high' : 'medium'
      })) || []

      setStats({
        totalLeads,
        newLeads,
        convertedLeads,
        totalRevenue,
        avgDealSize,
        conversionRate,
        activeBookings: 0, // You can implement bookings later
        completedSessions: 0,
        galleryImages: galleryData?.length || 0,
        websiteViews: 1247 // Mock data - implement analytics later
      })

      setRecentActivity(activity)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Admin'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with Studio37 Photography today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Leads */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLeads}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-gray-500">
                    {stats.newLeads} new this month
                  </p>
                  <TrendIndicator value={stats.leadsTrend} />
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-gray-500">
                    {stats.conversionRate.toFixed(1)}% conversion
                  </p>
                  <TrendIndicator value={stats.revenueTrend} />
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Average Deal Size */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${stats.avgDealSize.toFixed(0)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-gray-500">
                    From {stats.convertedLeads} deals
                  </p>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Gallery Images</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.galleryImages}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Showcasing your work
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Camera className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${
                          item.type === 'lead' ? 'bg-blue-100' :
                          item.type === 'booking' ? 'bg-green-100' :
                          'bg-gray-100'
                        }`}>
                          {item.type === 'lead' && <Users className="h-4 w-4 text-blue-600" />}
                          {item.type === 'booking' && <Calendar className="h-4 w-4 text-green-600" />}
                          {item.type === 'communication' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {item.priority === 'high' && (
                          <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            High Priority
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <Link href="/admin/leads" className="block w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">View All Leads</p>
                      <p className="text-sm text-gray-600">Manage your prospects</p>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/bookings" className="block w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 group-hover:bg-green-200 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Manage Bookings</p>
                      <p className="text-sm text-gray-600">Schedule & organize</p>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/gallery" className="block w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 group-hover:bg-purple-200 p-2 rounded-lg">
                      <Camera className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Update Gallery</p>
                      <p className="text-sm text-gray-600">Showcase your work</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Performance
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats.conversionRate.toFixed(1)}%
                  </span>
                </div>
                <ProgressBar percentage={stats.conversionRate} color="green" />
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">Website Traffic</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {stats.websiteViews.toLocaleString()} views
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Leads</span>
                  <span className="text-sm font-semibold text-orange-600">
                    {stats.newLeads}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}