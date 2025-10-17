import { useState, useEffect } from 'react'

export interface DashboardStats {
  totalLeads: number
  totalRevenue: number
  totalBookings: number
  leadsByStatus: {
    new: number
    contacted: number
    qualified: number
    converted: number
    'closed-won': number
    'closed-lost': number
  }
  recentLeads: Array<{
    id: string
    name: string
    email: string
    service_interest: string
    status: string
    created_at: string
  }>
  recentBookings: Array<{
    id: string
    client_name: string
    session_type: string
    session_date: string
    total_amount: number
    status: string
  }>
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // For now, we'll use mock data since we don't have Supabase connected
      // This simulates what the real data would look like
      const mockStats: DashboardStats = {
        totalLeads: 5,
        totalRevenue: 13800.00,
        totalBookings: 3,
        leadsByStatus: {
          new: 1,
          contacted: 1,
          qualified: 1,
          converted: 1,
          'closed-won': 1,
          'closed-lost': 0
        },
        recentLeads: [
          {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            service_interest: 'Wedding Photography',
            status: 'new',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            service_interest: 'Portrait Session',
            status: 'contacted',
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            name: 'Mike Wilson',
            email: 'mike@example.com',
            service_interest: 'Event Photography',
            status: 'qualified',
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ],
        recentBookings: [
          {
            id: '1',
            client_name: 'Emily Davis',
            session_type: 'Commercial Photography',
            session_date: '2024-11-15',
            total_amount: 4000.00,
            status: 'confirmed'
          },
          {
            id: '2',
            client_name: 'David Brown',
            session_type: 'Wedding Photography',
            session_date: '2024-12-05',
            total_amount: 9000.00,
            status: 'confirmed'
          },
          {
            id: '3',
            client_name: 'Lisa Chen',
            session_type: 'Portrait Session',
            session_date: '2024-10-25',
            total_amount: 800.00,
            status: 'completed'
          }
        ]
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setStats(mockStats)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardData
  }
}