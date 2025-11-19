"use client"

import React from "react"
import { usePathname, useSearchParams } from "next/navigation"

export interface EditableChromeProps {
  label: string
  block: string
  // current props snapshot for future use (emit or deep link)
  payload?: Record<string, any>
  // Optional anchor id or key
  anchorId?: string
}

export default function EditableChrome({ label, block, payload, anchorId }: EditableChromeProps) {
  const params = useSearchParams()
  const pathname = usePathname()
  const isEdit = params.get("edit") === "1"
  const force = params.get('force') === '1'
  const [allowed, setAllowed] = React.useState<boolean>(false)

  React.useEffect(() => {
    let cancelled = false
    async function check() {
      if (!isEdit) { setAllowed(false); return }
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' })
        if (res.ok) {
          const json: any = await res.json().catch(()=>({}))
          if (!cancelled) setAllowed(!!json?.authenticated || force)
        } else {
          if (!cancelled) setAllowed(!!force)
        }
      } catch {
        if (!cancelled) setAllowed(!!force)
      }
    }
    check()
    return () => { cancelled = true }
  }, [isEdit, force])
  if (!isEdit || !allowed) return null

  const query = new URLSearchParams({ block, ...(anchorId ? { id: anchorId } : {}), path: pathname || "/" })
  const href = `/admin/editor?${query.toString()}`

  return (
    <div className="pointer-events-none absolute z-[60] -top-3 left-2">
      <div className="inline-flex items-center gap-2 rounded-md bg-white/95 backdrop-blur border border-gray-200 shadow p-1.5">
        <span className="text-xs font-medium text-gray-700 px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
          {label}
        </span>
        <a
          href={href}
          className="pointer-events-auto text-xs px-2 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 transition"
          title="Edit block"
        >
          Edit
        </a>
      </div>
    </div>
  )
}
