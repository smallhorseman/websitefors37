"use client"

import React from 'react'
import { CheckCircle } from 'lucide-react'

export default function ThankYouWithSMS() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
        <p className="text-lg text-gray-700 mb-2">
          We've received your inquiry and will get back to you within 24 hours.
        </p>
        <p className="text-gray-600">
          Check your email for a confirmation message.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-8 mt-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <svg className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                Get Studio37 SMS Updates
              </h3>
              <p className="text-amber-800 text-sm mb-4">
                Be the first to know about mini sessions, seasonal promotions, and exclusive photography tips. 
                Join our SMS list for VIP access. Unsubscribe anytime.
              </p>
            </div>
          </div>
          
          <iframe
            title="Studio37 SMS Updates Form"
            className="w-full rounded-md border border-amber-300 shadow-sm bg-white"
            style={{ minHeight: 420 }}
            loading="eager"
            src="https://app2.simpletexting.com/join/joinWebForm?webFormId=691e36a1ebc0c10f6c32bfe6&c=USA"
          />
          
          <p className="mt-3 text-xs text-amber-700">
            📱 Your phone number stays private. Standard messaging rates apply. Text STOP to opt-out anytime.
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <a 
          href="/" 
          className="text-primary-600 hover:text-primary-700 font-medium underline"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}
