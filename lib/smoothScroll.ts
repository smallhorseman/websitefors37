/**
 * Smooth Scroll Utility - Phase 7
 * 
 * Provides smooth scrolling behavior for anchor links with offset support for fixed headers.
 * Handles URL hash updates without page jumping.
 */

interface SmoothScrollOptions {
  offset?: number // Offset in pixels for fixed headers
  duration?: number // Animation duration (not used with native smooth scroll, but kept for API consistency)
  updateHash?: boolean // Whether to update URL hash
}

/**
 * Scrolls smoothly to a target element
 */
export function scrollToElement(
  target: HTMLElement, 
  options: SmoothScrollOptions = {}
): void {
  const { offset = 0, updateHash = true } = options
  
  const elementPosition = target.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })

  // Update URL hash without jumping
  if (updateHash && target.id) {
    // Use history API to avoid scroll jump
    if (history.pushState) {
      history.pushState(null, '', `#${target.id}`)
    } else {
      // Fallback for older browsers
      window.location.hash = target.id
    }
  }
}

/**
 * Scrolls smoothly to an element by ID
 */
export function scrollToId(
  elementId: string, 
  options: SmoothScrollOptions = {}
): void {
  const target = document.getElementById(elementId)
  if (target) {
    scrollToElement(target, options)
  } else {
    console.warn(`Element with id "${elementId}" not found`)
  }
}

/**
 * Initializes smooth scroll behavior for all anchor links
 * Call this once when the page loads, typically in a layout or main component
 */
export function initSmoothScroll(options: SmoothScrollOptions = {}): () => void {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const anchor = target.closest('a')
    
    if (!anchor) return
    
    const href = anchor.getAttribute('href')
    if (!href || !href.startsWith('#')) return
    
    // Prevent default jump behavior
    e.preventDefault()
    
    const elementId = href.substring(1)
    scrollToId(elementId, options)
  }

  // Attach click listener to document
  document.addEventListener('click', handleClick)

  // Return cleanup function
  return () => {
    document.removeEventListener('click', handleClick)
  }
}

/**
 * Gets the offset height of fixed headers
 * Useful for calculating scroll offset automatically
 */
export function getFixedHeaderOffset(): number {
  // Common selectors for fixed headers
  const selectors = [
    'header',
    '[data-fixed-header]',
    '.fixed-header',
    'nav[class*="fixed"]',
    'header[class*="fixed"]'
  ]

  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element && window.getComputedStyle(element).position === 'fixed') {
      return element.getBoundingClientRect().height
    }
  }

  return 0
}

/**
 * Scrolls to hash on page load (useful for direct links)
 */
export function scrollToHashOnLoad(options: SmoothScrollOptions = {}): void {
  if (typeof window === 'undefined') return

  const handleLoad = () => {
    const hash = window.location.hash
    if (hash) {
      // Small delay to ensure page is fully rendered
      setTimeout(() => {
        const elementId = hash.substring(1)
        scrollToId(elementId, { ...options, updateHash: false })
      }, 100)
    }
  }

  if (document.readyState === 'complete') {
    handleLoad()
  } else {
    window.addEventListener('load', handleLoad)
  }
}

/**
 * React hook for smooth scroll initialization
 * Usage in a client component:
 * 
 * useEffect(() => {
 *   return initSmoothScroll({ offset: 80 })
 * }, [])
 */
export function useSmoothScroll(options: SmoothScrollOptions = {}): void {
  if (typeof window === 'undefined') return

  const cleanup = initSmoothScroll(options)
  
  // If used in a framework without useEffect, call cleanup manually
  return cleanup as any
}

// Export types
export type { SmoothScrollOptions }
