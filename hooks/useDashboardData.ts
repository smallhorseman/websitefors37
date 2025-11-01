import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

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
  const fetchDashboardData = async (): Promise<DashboardStats> => {
    try {

      // Fetch all data in parallel for better performance
      const [
        { data: allLeads, error: leadsError },
        { data: allAppointments, error: appointmentsError },
        { data: recentLeadsData, error: recentLeadsError },
        { data: recentAppointmentsData, error: recentAppointmentsError }
      ] = await Promise.all([
        // Total leads count
        supabase
          .from('leads')
          .select('id, status'),
        
        // Total appointments and revenue
        supabase
          .from('appointments')
          .select('id, price_cents, status'),
        
        // Recent leads (last 5)
        supabase
          .from('leads')
          .select('id, name, email, service_interest, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent appointments (last 5)
        supabase
          .from('appointments')
          .select('id, name, type, package_name, start_time, price_cents, status')
          .order('start_time', { ascending: false })
          .limit(5)
      ])

      // Handle errors
      if (leadsError) throw new Error(`Leads fetch failed: ${leadsError.message}`)
      if (appointmentsError) throw new Error(`Appointments fetch failed: ${appointmentsError.message}`)
      if (recentLeadsError) throw new Error(`Recent leads fetch failed: ${recentLeadsError.message}`)
      if (recentAppointmentsError) throw new Error(`Recent appointments fetch failed: ${recentAppointmentsError.message}`)

      // Calculate stats from real data
      const totalLeads = allLeads?.length || 0
      const totalBookings = allAppointments?.length || 0
      
      // Calculate total revenue from completed/scheduled appointments (convert cents to dollars)
      const totalRevenue = allAppointments?.reduce((sum, appointment) => {
        if (appointment.status === 'completed' || appointment.status === 'scheduled') {
          return sum + ((appointment.price_cents || 0) / 100)
        }
        return sum
      }, 0) || 0

      // Count leads by status
      const leadsByStatus = {
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        'closed-won': 0,
        'closed-lost': 0
      }
      
      allLeads?.forEach(lead => {
        if (lead.status && lead.status in leadsByStatus) {
          leadsByStatus[lead.status as keyof typeof leadsByStatus]++
        }
      })

      const dashboardStats: DashboardStats = {
        totalLeads,
        totalRevenue,
        totalBookings,
        leadsByStatus,
        recentLeads: recentLeadsData || [],
        recentBookings: recentAppointmentsData?.map(apt => ({
          id: apt.id,
          client_name: apt.name,
          session_type: apt.package_name || apt.type,
          session_date: apt.start_time,
          total_amount: (apt.price_cents || 0) / 100,
          status: apt.status
        })) || []
      }

      return dashboardStats
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
      throw err
    }
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  })

  return {
    stats: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  }
}