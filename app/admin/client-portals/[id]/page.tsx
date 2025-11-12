export const dynamic = 'force-dynamic'

import Link from 'next/link'

type ClientPortalResponse = {
  success?: boolean
  user?: {
    id: string
    email?: string
    name?: string
    active?: boolean
    last_login_at?: string | null
    created_at?: string
    projects?: Array<{ id: string; name?: string; status?: string }>
    messages?: Array<{ id: string; body?: string; created_at?: string }>
  }
  error?: string
}

async function getClientPortal(id: string): Promise<ClientPortalResponse | null> {
  try {
    const res = await fetch(`/api/admin/client-portals/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function ClientPortalDetail({ params }: { params: { id: string } }) {
  const data = await getClientPortal(params.id)
  const user = data?.user

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client Portal</h1>
        <Link href="/admin/client-portals" className="text-sm text-blue-600 hover:underline">
          Back to Client Portals
        </Link>
      </div>

      {!user && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <p className="font-medium">Not found</p>
          <p className="text-sm">We couldn't load this client portal. It may not exist yet or the API endpoint is unavailable.</p>
        </div>
      )}

      {user && (
        <div className="space-y-6">
          <section className="rounded-md border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-medium">Profile</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm text-gray-500">ID</div>
                <div className="font-mono text-sm">{user.id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div>{user.name || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div>{user.email || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Active</div>
                <div>{user.active ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </section>

          <section className="rounded-md border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-medium">Projects</h2>
            {user.projects && user.projects.length > 0 ? (
              <ul className="list-inside list-disc space-y-1">
                {user.projects.map((p) => (
                  <li key={p.id}>
                    <span className="font-medium">{p.name || p.id}</span>
                    {p.status ? <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{p.status}</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No projects yet.</p>
            )}
          </section>

          <section className="rounded-md border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-medium">Recent Messages</h2>
            {user.messages && user.messages.length > 0 ? (
              <ul className="space-y-2">
                {user.messages.map((m) => (
                  <li key={m.id} className="rounded border p-2">
                    <div className="text-sm">{m.body || '—'}</div>
                    {m.created_at ? (
                      <div className="mt-1 text-xs text-gray-500">{new Date(m.created_at).toLocaleString()}</div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No messages yet.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
