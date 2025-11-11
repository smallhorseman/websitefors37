'use client'

import { useEffect } from 'react'

interface PageWrapperProps {
  showNav: boolean
  children: React.ReactNode
  className?: string
}

export default function PageWrapper({ showNav, children, className = '' }: PageWrapperProps) {
  useEffect(() => {
    const styleId = 'hide-nav-style'
    const removeStyle = () => {
      const existing = document.getElementById(styleId)
      if (existing) existing.remove()
    }

    if (showNav) {
      // Ensure any previous hide style is removed when nav should be visible
      removeStyle()
      return
    }

    // Hide navigation when showNav is false
    let style = document.getElementById(styleId) as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        #site-navigation { display: none !important; }
        body { padding-top: 0 !important; }
      `
      document.head.appendChild(style)
    }

    return () => {
      // Cleanup when this wrapper unmounts or deps change
      removeStyle()
    }
  }, [showNav])

  return <div className={className}>{children}</div>
}
