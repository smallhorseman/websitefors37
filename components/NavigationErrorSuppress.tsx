'use client'

import { useEffect } from 'react'

export default function NavigationErrorSuppress() {
  useEffect(() => {
    // Suppress navigation-related errors in development/production
    if (typeof window !== 'undefined') {
      const originalError = console.error
      
      // Override console.error to suppress specific navigation errors
      console.error = (...args) => {
        const message = args.join(' ')
        
        // Suppress specific navigation and DOM errors
        if (
          message.includes('The operation is insecure') ||
          message.includes('Too many calls to Location or History APIs') ||
          message.includes('NextJS') ||
          message.includes('overrideMethod') ||
          message.includes('DOMException')
        ) {
          return // Suppress these errors
        }
        
        // Let other errors through
        originalError.apply(console, args)
      }
      
      // Override window.onerror to handle global navigation errors
      const originalOnError = window.onerror
      window.onerror = (message, source, lineno, colno, error) => {
        if (
          typeof message === 'string' && (
            message.includes('The operation is insecure') ||
            message.includes('Too many calls to Location') ||
            message.includes('NextJS')
          )
        ) {
          return true // Suppress these errors
        }
        
        // Let other errors through
        if (originalOnError) {
          return originalOnError(message, source, lineno, colno, error)
        }
        return false
      }
      
      // Override unhandledrejection for promise-based navigation errors
      const originalUnhandledRejection = window.onunhandledrejection
      window.onunhandledrejection = (event) => {
        if (
          event.reason?.message?.includes('The operation is insecure') ||
          event.reason?.message?.includes('NextJS')
        ) {
          event.preventDefault()
          return
        }
        
        if (originalUnhandledRejection) {
          originalUnhandledRejection.call(window, event)
        }
      }
      
      // Cleanup
      return () => {
        console.error = originalError
        window.onerror = originalOnError
        window.onunhandledrejection = originalUnhandledRejection
      }
    }
  }, [])

  return null
}