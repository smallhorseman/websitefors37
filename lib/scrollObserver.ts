/**
 * Scroll Observer Utility
 * Adds scroll-triggered animations to elements with .scroll-animate class
 * Phase 1 Enhancement: Component Variants
 */

export function initScrollAnimations() {
  if (typeof window === 'undefined') return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          // Optionally unobserve after animation triggers (one-time animation)
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  document.querySelectorAll('.scroll-animate').forEach((el) => {
    observer.observe(el)
  })

  return observer
}

/**
 * Parallax scroll effect for hero backgrounds
 */
export function initParallaxScroll() {
  if (typeof window === 'undefined') return

  const handleScroll = () => {
    const scrolled = window.scrollY
    const parallaxElements = document.querySelectorAll('.parallax-bg')
    
    parallaxElements.forEach((el) => {
      const speed = 0.5 // Adjust for parallax intensity
      const yPos = -(scrolled * speed)
      ;(el as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`
    })
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  
  return () => window.removeEventListener('scroll', handleScroll)
}
