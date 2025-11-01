"use client"

import React from 'react'

export interface WidgetEmbedProps {
  html?: string
  scriptSrcs?: string[]
  provider?: string
  className?: string
  styleReset?: boolean
}

export default function WidgetEmbedClient({ html, scriptSrcs = [], provider, className = '', styleReset = true }: WidgetEmbedProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Extract script tags from provided HTML (if pasted as-is) and collect their src
    const temp = document.createElement('div')
    if (html) {
      temp.innerHTML = html
      // Move non-script HTML into container
      const scripts = Array.from(temp.querySelectorAll('script'))
      scripts.forEach((s) => s.remove())
      el.innerHTML = temp.innerHTML

      // Append any discovered script src to list (de-duplicate)
      const discovered = Array.from((html.match(/<script[^>]*src=\"([^\"]+)\"/g) || []).map(m => (m.match(/src=\"([^\"]+)\"/) || [])[1] || '')).filter(Boolean)
      scriptSrcs = Array.from(new Set([...(scriptSrcs||[]), ...discovered]))
    } else {
      el.innerHTML = ''
    }

    // Load external scripts sequentially to preserve order when needed
    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      if (!src) return resolve()
      const s = document.createElement('script')
      s.src = src
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      el.appendChild(s)
    })

    let cancelled = false
    ;(async () => {
      try {
        for (const src of scriptSrcs) {
          if (cancelled) return
          await loadScript(src)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Widget script load error', e)
      }
    })()

    return () => {
      cancelled = true
      // cleanup: remove dynamically added scripts to avoid duplicates on rerender
      if (!el) return
      Array.from(el.querySelectorAll('script')).forEach((s) => s.remove())
    }
    // We only want to run when inputs change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, JSON.stringify(scriptSrcs)])

  const wrapperClass = `${styleReset ? 'third-party-embed' : ''} ${className}`.trim()

  return <div ref={containerRef} className={wrapperClass} data-provider={provider || ''} />
}
