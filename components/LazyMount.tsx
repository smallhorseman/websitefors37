"use client"

import React from 'react'

type Props = {
  children: React.ReactNode
  /** Height placeholder to avoid layout shift before mount */
  minHeight?: number | string
  /** Intersection rootMargin to start mounting earlier */
  rootMargin?: string
  /** Threshold between 0 and 1 */
  threshold?: number
  /** Optional className on the wrapper */
  className?: string
}

export default function LazyMount({ children, minHeight = 300, rootMargin = '300px 0px', threshold = 0.01, className }: Props) {
  const [visible, setVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!ref.current || visible) return
    const el = ref.current
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin, threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin, threshold, visible])

  return (
    <div ref={ref} className={className} style={{ minHeight, contentVisibility: visible ? 'visible' : 'auto' as any }}>
      {visible ? children : null}
    </div>
  )
}
