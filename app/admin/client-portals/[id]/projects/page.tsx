import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Project {
  id: string
  name: string
  type: string
  description: string | null
  status: string
  session_date: string | null
  due_date: string | null
  completed_at: string | null
  package_name: string | null
  total_amount_cents: number | null
  paid_amount_cents: number
  payment_status: string
  cover_image_url: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

interface ClientUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

async function getClientUser(userId: string): Promise<ClientUser | null> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('client_portal_users')
    .select('id, email, first_name, last_name')
    .eq('id', userId)
    .single()
  
  if (error || !data) return null
  return data
}

async function getClientProjects(userId: string): Promise<Project[]> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('client_projects')
    .select('*')
    .eq('client_user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error || !data) return []
  return data
}

function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    review: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    delivered: 'bg-teal-100 text-teal-800',
    archived: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getPaymentStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function formatCurrency(cents: number | null): string {
  if (cents === null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default async function ClientProjectsPage({
  params
}: {
  params: { id: string }
}) {
  const client = await getClientUser(params.id)
  
  if (!client) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Client Not Found</h1>
          <p className="text-gray-600 mb-4">
            The client you're looking for doesn't exist.
          </p>
          <Link 
            href="/admin/client-portals"
            className="text-blue-600 hover:underline"
          >
            ← Back to Client Portals
          </Link>
        </div>
      </div>
    )
  }

  const projects = await getClientProjects(params.id)
  const clientName = [client.first_name, client.last_name].filter(Boolean).join(' ') || client.email

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/admin/client-portals"
            className="text-sm text-blue-600 hover:underline mb-2 inline-block"
          >
            ← Back to Client Portals
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Projects for {clientName}
              </h1>
              <p className="text-gray-600 mt-1">{client.email}</p>
            </div>
            <Link
              href={`/admin/client-portals/${params.id}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              View Client Details
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h2>
            <p className="text-gray-600 mb-4">
              This client doesn't have any projects yet.
            </p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Create First Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {project.cover_image_url && (
                        <img 
                          src={project.cover_image_url}
                          alt={project.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {project.type.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    {project.description && (
                      <p className="text-gray-600 mb-3">{project.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Status:</span>{' '}
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Payment:</span>{' '}
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeColor(project.payment_status)}`}>
                          {project.payment_status}
                        </span>
                      </div>
                      
                      {project.session_date && (
                        <div>
                          <span className="text-gray-500">Session:</span>{' '}
                          <span className="text-gray-900 font-medium">
                            {formatDate(project.session_date)}
                          </span>
                        </div>
                      )}
                      
                      {project.due_date && (
                        <div>
                          <span className="text-gray-500">Due:</span>{' '}
                          <span className="text-gray-900 font-medium">
                            {formatDate(project.due_date)}
                          </span>
                        </div>
                      )}
                    </div>

                    {project.package_name && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Package:</span>{' '}
                        <span className="text-gray-900 font-medium">
                          {project.package_name}
                        </span>
                      </div>
                    )}

                    {project.total_amount_cents && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Amount:</span>{' '}
                        <span className="text-gray-900 font-medium">
                          {formatCurrency(project.paid_amount_cents)} / {formatCurrency(project.total_amount_cents)}
                        </span>
                      </div>
                    )}

                    {project.tags && project.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      View
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
