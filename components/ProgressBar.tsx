'use client'

import React from 'react'

interface ProgressBarProps {
  percentage: number
  color?: 'green' | 'blue' | 'purple' | 'red'
}

export default function ProgressBar({ percentage, color = 'green' }: ProgressBarProps) {
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100)
  
  // Use discrete width classes based on percentage ranges
  const getWidthClass = (percent: number) => {
    if (percent === 0) return 'w-0'
    if (percent <= 10) return 'w-[10%]'
    if (percent <= 20) return 'w-[20%]'
    if (percent <= 30) return 'w-[30%]'
    if (percent <= 40) return 'w-[40%]'
    if (percent <= 50) return 'w-[50%]'
    if (percent <= 60) return 'w-[60%]'
    if (percent <= 70) return 'w-[70%]'
    if (percent <= 80) return 'w-[80%]'
    if (percent <= 90) return 'w-[90%]'
    return 'w-full'
  }

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500', 
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color]} ${getWidthClass(normalizedPercentage)}`}
      />
    </div>
  )
}