'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-5NTFJK2GH8'

function dntEnabled(): boolean {
  if (typeof navigator === 'undefined') return false
  // Standard DNT checks: navigator.doNotTrack (Chrome/Firefox), window.doNotTrack, navigator.msDoNotTrack
  const dnt = (navigator as any).doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack
  return dnt === '1' || dnt === 'yes'
}

function sendPageview(url: string, title?: string) {
  if (dntEnabled()) return // Respect Do Not Track
  // @ts-ignore - gtag injected via next/script in layout
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    // GA4 recommended SPA page view
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

  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    if (!GA_ID || !isMounted || dntEnabled()) return
    sendPageview(window.location.pathname + window.location.search)
  }, [isMounted])

  useEffect(() => {
    if (!GA_ID || !isMounted || dntEnabled()) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    sendPageview(url)
  }, [pathname, searchParams, isMounted])

  return null
}
