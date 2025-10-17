import React from 'react'
import { Star, MapPin, Phone, Clock, ExternalLink } from 'lucide-react'

interface GoogleBusinessProps {
  className?: string
}

export default function GoogleBusinessWidget({ className = "" }: GoogleBusinessProps) {
  const businessInfo = {
    name: "Studio37 Photography",
    rating: 4.9,
    reviewCount: 47,
    address: "1701 Goodson Loop Unit 80, Pinehurst, TX 77362",
    phone: "(832) 713-9944",
    hours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed",
    services: ["Wedding Photography", "Portrait Photography", "Event Photography", "Commercial Photography"]
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{businessInfo.name}</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(businessInfo.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {businessInfo.rating} ({businessInfo.reviewCount} reviews)
            </span>
          </div>
        </div>
        <a
          href="https://www.google.com/maps/place/Studio37+Photography"
          target="_blank"
          rel="noopener noreferrer"
          title="View on Google Maps"
          className="text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>

      {/* Contact Information */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700">{businessInfo.address}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <a
            href={`tel:${businessInfo.phone}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {businessInfo.phone}
          </a>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">{businessInfo.hours}</p>
        </div>
      </div>

      {/* Services */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Services</h4>
        <div className="flex flex-wrap gap-2">
          {businessInfo.services.map((service, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <a
          href="/contact"
          className="w-full bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium block"
        >
          Book a Session
        </a>
        <a
          href="https://www.google.com/maps/place/Studio37+Photography/@30.1647,-95.4677,17z/data=!4m5!3m4!1s0x0:0x0!8m2!3d30.1647!4d-95.4677"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium block"
        >
          Leave a Review
        </a>
      </div>
    </div>
  )
}