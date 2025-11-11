'use client'

import { useEffect } from 'react'

interface PageWrapperProps {
  showNav: boolean
  children: React.ReactNode
  className?: string
}

export default function PageWrapper({ showNav, children, className = '' }: PageWrapperProps) {
  useEffect(() => {
    if (!showNav) {
      // Hide navigation when showNav is false
      const style = document.createElement('style')
      style.id = 'hide-nav-style'
      style.textContent = `
        header nav { display: none !important; }
        body { padding-top: 0 !important; }
      `
      document.head.appendChild(style)

      return () => {
        // Cleanup: remove style when component unmounts
        const existingStyle = document.getElementById('hide-nav-style')
        if (existingStyle) {
          existingStyle.remove()
        }
      }
    }
  }, [showNav])

  return <div className={className}>{children}</div>
}
