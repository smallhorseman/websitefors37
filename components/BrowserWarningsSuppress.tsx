'use client'

import { useEffect } from 'react'

export default function BrowserWarningsSuppress() {
  useEffect(() => {
    // Suppress common CSS warnings in development
    if (typeof window !== 'undefined') {
      const originalConsoleWarn = console.warn
      console.warn = (...args) => {
        const message = args.join(' ')
        
        // Suppress specific CSS warnings
        if (
          message.includes('-webkit-text-size-adjust') ||
          message.includes('-moz-text-size-adjust') ||
          message.includes('text-size-adjust') ||
          message.includes('-moz-columns') ||
          message.includes('-moz-column-break-inside') ||
          message.includes('preloaded with link preload was not used')
        ) {
          return // Suppress these warnings
        }
        
        // Let other warnings through
        originalConsoleWarn.apply(console, args)
      }
      
      // Cleanup
      return () => {
        console.warn = originalConsoleWarn
      }
    }
  }, [])

  return null
}