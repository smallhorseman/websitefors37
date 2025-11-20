'use client'

import Image from 'next/image'

/**
 * Timeline Block - Vertical timeline with milestones
 * Perfect for "Our Story", "Company History", "Process" pages
 * Phase 2 Enhancement: Enhanced Blocks
 */

interface TimelineItem {
  date: string
  title: string
  description: string
  image?: string
  icon?: string
}

interface TimelineClientProps {
  items: TimelineItem[]
  accentColor?: string
  style?: 'default' | 'modern' | 'minimal'
}

export default function TimelineClient({
  items,
  accentColor = '#b46e14',
  style = 'default'
}: TimelineClientProps) {
  const isModern = style === 'modern'
  const isMinimal = style === 'minimal'

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical Line */}
      <div
        className={`absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 ${isMinimal ? 'bg-gray-200' : 'bg-amber-300'}`}
        style={!isMinimal ? { backgroundColor: accentColor } : undefined}
      />

      {/* Timeline Items */}
      {items.map((item, index) => {
        const isLeft = index % 2 === 0
        
        return (
          <div
            key={index}
            className={`relative mb-12 md:mb-16 ${isLeft ? 'md:pr-1/2' : 'md:pl-1/2'}`}
          >
            {/* Mobile/Tablet Layout */}
            <div className="md:hidden flex gap-6 pl-16">
              {/* Dot */}
              <div
                className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${isMinimal ? 'bg-gray-400' : 'bg-amber-600'}`}
                style={!isMinimal ? { backgroundColor: accentColor } : undefined}
              />
              
              {/* Content */}
              <div className={`flex-1 ${isModern ? 'bg-white rounded-lg shadow-lg p-6' : isMinimal ? '' : 'bg-amber-50 rounded-lg p-6 border border-amber-200'}`}>
                <div className={`text-sm font-semibold mb-2 ${isMinimal ? 'text-gray-500' : 'text-amber-700'}`}>
                  {item.date}
                </div>
                {item.icon && (
                  <div className="text-3xl mb-3">{item.icon}</div>
                )}
                {item.image && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center">
              {/* Dot */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white z-10 ${isMinimal ? 'bg-gray-400' : 'bg-amber-600'}`}
                style={!isMinimal ? { backgroundColor: accentColor } : undefined}
              />

              {/* Content */}
              <div className={`w-5/12 ${isLeft ? 'text-right pr-12' : 'ml-auto pl-12'}`}>
                <div className={`inline-block ${isModern ? 'bg-white rounded-lg shadow-lg p-6' : isMinimal ? '' : 'bg-amber-50 rounded-lg p-6 border border-amber-200'}`}>
                  <div className={`text-sm font-semibold mb-2 ${isMinimal ? 'text-gray-500' : 'text-amber-700'}`}>
                    {item.date}
                  </div>
                  {item.icon && (
                    <div className="text-3xl mb-3">{item.icon}</div>
                  )}
                  {item.image && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
