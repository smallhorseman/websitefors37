'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animated Counter Stats Block
 * Numbers count up when scrolled into view
 * Phase 2 Enhancement: Enhanced Blocks
 */

interface StatItem {
  icon?: string
  number: number
  suffix?: string
  prefix?: string
  label: string
  duration?: number
}

interface AnimatedCounterStatsClientProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
  style?: 'default' | 'cards' | 'minimal'
  accentColor?: string
}

export default function AnimatedCounterStatsClient({
  stats,
  columns = 3,
  style = 'default',
  accentColor = '#b46e14'
}: AnimatedCounterStatsClientProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [counts, setCounts] = useState(stats.map(() => 0))
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateCounters()
        }
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = stat.duration || 2000
      const steps = 60
      const stepValue = stat.number / steps
      const stepDuration = duration / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const newCount = Math.min(currentStep * stepValue, stat.number)
        
        setCounts((prev) => {
          const updated = [...prev]
          updated[index] = newCount
          return updated
        })

        if (currentStep >= steps) {
          clearInterval(interval)
        }
      }, stepDuration)
    })
  }

  const formatNumber = (num: number, decimals = 0) => {
    return Math.floor(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  const gridCols: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  const styleClasses: Record<string, string> = {
    default: '',
    cards: 'bg-white rounded-lg shadow-md p-6',
    minimal: 'border-b border-gray-200 pb-4'
  }

  return (
    <div
      ref={containerRef}
      className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}
    >
      {stats.map((stat, index) => (
        <div key={index} className={`text-center ${styleClasses[style]}`}>
          {stat.icon && (
            <div className="text-4xl mb-3">{stat.icon}</div>
          )}
          <div
            className="text-4xl font-bold mb-2"
            style={{ color: accentColor }}
          >
            {stat.prefix}
            {formatNumber(counts[index])}
            {stat.suffix}
          </div>
          <div className="text-gray-700 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
