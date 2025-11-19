"use client"

import React from "react"
import { useSearchParams } from "next/navigation"

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
  const isEdit = params.get("edit") === "1"
  if (!isEdit) return null

  const query = new URLSearchParams({ block, ...(anchorId ? { id: anchorId } : {}) })
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
