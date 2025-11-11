'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SEOScoreIndicatorProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function SEOScoreIndicator({ 
  score, 
  size = 'md',
  showLabel = true 
}: SEOScoreIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-300'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-300'
    if (score >= 40) return 'text-orange-600 bg-orange-100 border-orange-300'
    return 'text-red-600 bg-red-100 border-red-300'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Work'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 60) return <TrendingUp className="h-3 w-3" />
    if (score >= 40) return <Minus className="h-3 w-3" />
    return <TrendingDown className="h-3 w-3" />
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className={`inline-flex items-center gap-1 rounded border font-semibold ${getScoreColor(score)} ${sizeClasses[size]}`}>
      {getScoreIcon(score)}
      <span>{score}/100</span>
      {showLabel && <span className="font-normal">{getScoreLabel(score)}</span>}
    </div>
  )
}
