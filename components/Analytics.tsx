'use client'

import { useEffect, useState } from 'react'
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
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Ensure client-only rendering to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Track the first page load
  useEffect(() => {
    if (!GA_ID || !isMounted) return
    sendPageview(window.location.pathname + window.location.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  // Track pageviews on route changes
  useEffect(() => {
    if (!GA_ID || !isMounted) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    sendPageview(url)
  }, [pathname, searchParams, isMounted])

  return null
}
