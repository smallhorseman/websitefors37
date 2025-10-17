import React from 'react'
import { Star, ExternalLink, MessageSquare } from 'lucide-react'

interface ReviewPromptProps {
  className?: string
  compact?: boolean
}

export default function ReviewPrompt({ className = "", compact = false }: ReviewPromptProps) {
  const googleReviewUrl = "https://www.google.com/maps/place/Studio37+Photography/@30.1647,-95.4677,17z/data=!4m5!3m4!1s0x0:0x0!8m2!3d30.1647!4d-95.4677?hl=en-US"

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              Love our work? Share your experience!
            </span>
          </div>
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            Leave Review
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center ${className}`}>
      <div className="mb-6">
        <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
            ))}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Love Your Photos?
        </h3>
        <p className="text-gray-600 mb-6">
          Help other families in Pinehurst and Montgomery County discover our photography services 
          by sharing your experience on Google.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="font-semibold text-gray-800">4.9 out of 5 stars</span>
          </div>
          <p className="text-sm text-gray-600">Based on 47+ Google reviews</p>
        </div>

        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          Write a Google Review
          <ExternalLink className="h-4 w-4" />
        </a>

        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ Takes less than 2 minutes</p>
          <p>✓ Helps local families find great photography</p>
          <p>✓ Shows appreciation for our work</p>
        </div>
      </div>
    </div>
  )
}