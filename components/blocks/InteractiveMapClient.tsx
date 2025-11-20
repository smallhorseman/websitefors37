'use client'

import { useEffect, useRef } from 'react'

/**
 * Interactive Map Block
 * Google Maps embed with custom markers
 * Phase 2 Enhancement: Enhanced Blocks
 */

interface MapMarker {
  lat: number
  lng: number
  title?: string
  description?: string
}

interface InteractiveMapClientProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: MapMarker[]
  height?: string
  apiKey?: string
  style?: 'default' | 'silver' | 'dark' | 'retro'
}

export default function InteractiveMapClient({
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 13,
  markers = [],
  height = '400px',
  apiKey,
  style = 'default'
}: InteractiveMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (!apiKey || !mapRef.current) {
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.onload = initMap
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [apiKey])

  const initMap = () => {
    if (!mapRef.current || !window.google) return

    const mapStyles: Record<string, google.maps.MapTypeStyle[]> = {
      silver: [
        { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] }
      ],
      dark: [
        { elementType: 'geometry', stylers: [{ color: '#212121' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] }
      ],
      retro: [
        { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] }
      ]
    }

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: mapStyles[style] || [],
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    })

    mapInstanceRef.current = map

    // Add markers
    markers.forEach((marker) => {
      const mapMarker = new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map,
        title: marker.title
      })

      if (marker.description) {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div class="p-2"><strong>${marker.title}</strong><br>${marker.description}</div>`
        })

        mapMarker.addListener('click', () => {
          infoWindow.open(map, mapMarker)
        })
      }
    })
  }

  // Fallback to static iframe if no API key
  if (!apiKey) {
    const staticMapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${center.lat},${center.lng}&zoom=${zoom}`
    
    return (
      <div className="w-full rounded-lg overflow-hidden shadow-md" style={{ height }}>
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
          <div className="text-center p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">Google Maps API key required</p>
            <p className="text-xs mt-2 text-gray-400">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden shadow-md"
      style={{ height }}
    />
  )
}
