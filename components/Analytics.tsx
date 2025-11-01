'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-5NTFJK2GH8'

function sendPageview(url: string, title?: string) {
  // @ts-ignore - gtag injected via next/script in layout
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    // GA4 recommended SPA page view
    // See: https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag
    // and Next.js guidance
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.gtag('config', GA_ID, {
      page_path: url,
      page_title: title || document.title,
      anonymize_ip: true,
    })
  }
}

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track the first page load
  useEffect(() => {
    if (!GA_ID) return
    sendPageview(window.location.pathname + window.location.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track pageviews on route changes
  useEffect(() => {
    if (!GA_ID) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    sendPageview(url)
  }, [pathname, searchParams])

  return null
}
