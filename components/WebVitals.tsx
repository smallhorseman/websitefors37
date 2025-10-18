'use client'

import { useEffect } from 'react'

interface Metric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

export default function WebVitals() {
  useEffect(() => {
    function sendToAnalytics(metric: Metric) {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric)
      }

      // Send to analytics service (Google Analytics, Vercel Analytics, etc.)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: metric.value,
          custom_map: {
            metric_id: 'dimension1',
            metric_value: 'metric1',
            metric_rating: 'dimension2',
          },
        })
      }

      // Send to Vercel Analytics if available
      if (typeof window !== 'undefined' && window.va) {
        window.va('track', 'Web Vital', {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
        })
      }
    }

    // Import and measure Core Web Vitals dynamically
    async function measureWebVitals() {
      try {
        const webVitals = await import('web-vitals')
        
        if (webVitals.onCLS) webVitals.onCLS(sendToAnalytics)
        if (webVitals.onINP) webVitals.onINP(sendToAnalytics) // INP replaced FID
        if (webVitals.onFCP) webVitals.onFCP(sendToAnalytics)
        if (webVitals.onLCP) webVitals.onLCP(sendToAnalytics)
        if (webVitals.onTTFB) webVitals.onTTFB(sendToAnalytics)
      } catch (error) {
        console.warn('Web Vitals not available:', error)
      }
    }

    measureWebVitals()
  }, [])

  return null // This component doesn't render anything
}

// Extend window types for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    va?: (...args: any[]) => void
  }
}