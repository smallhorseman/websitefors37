"use client"

import Script from "next/script"

/**
 * Google Analytics 4 loader wrapped in a Client Component to avoid
 * passing function props from a Server Component (App Router constraint).
 *
 * - Loads GA with lazyOnload to reduce impact on LCP/INP.
 * - Defers initialization by ~2s and sends a manual page_view.
 */
export default function GoogleAnalyticsScript() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-5NTFJK2GH8"

  return (
    <Script
      id="ga4-src"
      strategy="lazyOnload"
      onLoad={() => {
        // Defer initialization by 2 seconds to reduce impact on load metrics
        setTimeout(() => {
          // @ts-ignore
          window.dataLayer = window.dataLayer || []
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          function gtag(...args: any[]) {
            // @ts-ignore
            window.dataLayer.push(args)
          }
          gtag("js", new Date())
          gtag("config", GA_ID, {
            anonymize_ip: true,
            send_page_view: false, // Prevent automatic page view
          })
          // Send initial page view after delay
          gtag("event", "page_view", {
            page_path: window.location.pathname + window.location.search,
          })
        }, 2000)
      }}
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
    />
  )
}
