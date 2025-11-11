'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Camera, ChevronDown } from '@/icons'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface NavigationItem {
  id: string
  label: string
  href: string
  order: number
  visible: boolean
  highlighted?: boolean
  children?: NavigationItem[]
}

export default function Navigation() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [dbLogoUrl, setDbLogoUrl] = useState<string | null>(null)
  const [navItems, setNavItems] = useState<NavigationItem[]>([])
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({})
  const [mobileDropdownStates, setMobileDropdownStates] = useState<Record<string, boolean>>({})
  // Small hover-intent close delays so menus don't vanish while moving cursor
  const dropdownCloseTimers = React.useRef<Record<string, ReturnType<typeof setTimeout> | null>>({})
  // Badge concept (light/dark) as default fallbacks
  const DEFAULT_LOGO_LIGHT = '/brand/studio37-badge-light.svg'
  const DEFAULT_LOGO_DARK = '/brand/studio37-badge-dark.svg'
  // User-requested default brand logo (Cloudinary) - optimized
  const DEFAULT_BRAND_LOGO = 'https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,w_200,c_limit/v1756077115/My%20Brand/IMG_2115_mtuowt.png'
  
  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    // Set initial scroll state
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMounted])

  // Fetch logo URL from settings once (client-side via Supabase)
  useEffect(() => {
    if (!isMounted) return
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase.from('settings').select('logo_url, navigation_items').single()
        if (!mounted) return
        setDbLogoUrl((data && data.logo_url) ? String(data.logo_url) : null)
        
        // Load navigation items
        const items = (data?.navigation_items || []) as NavigationItem[]
        const visibleItems = items
          .filter(item => item.visible)
          .sort((a, b) => a.order - b.order)
        setNavItems(visibleItems)
      } catch {
        if (mounted) {
          setDbLogoUrl(null)
          // Fallback to default navigation if DB fails
          setNavItems([
            { id: 'home', label: 'Home', href: '/', order: 1, visible: true },
            { id: 'gallery', label: 'Gallery', href: '/gallery', order: 2, visible: true },
            { id: 'services', label: 'Services', href: '/services', order: 3, visible: true },
            { id: 'blog', label: 'Blog', href: '/blog', order: 4, visible: true },
            { id: 'about', label: 'About', href: '/about', order: 5, visible: true },
            { id: 'contact', label: 'Contact', href: '/contact', order: 6, visible: true },
            { id: 'book', label: 'Book a Session', href: '/book-a-session', order: 7, visible: true, highlighted: true },
          ])
        }
      }
    })()
    return () => { mounted = false }
  }, [isMounted])

  // Derive which logo to show based on DB value and scroll state
  useEffect(() => {
    // Prefer DB-provided logo; else use brand default; else fallback badges
    if (dbLogoUrl) {
      setLogoUrl(dbLogoUrl)
    } else if (DEFAULT_BRAND_LOGO) {
      setLogoUrl(DEFAULT_BRAND_LOGO)
    } else {
      // Fallback to badge variants depending on scroll state for contrast
      setLogoUrl(scrolled ? DEFAULT_LOGO_LIGHT : DEFAULT_LOGO_DARK)
    }
  }, [dbLogoUrl, scrolled])

  return (
    <nav 
      id="site-navigation"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center space-x-2"
            aria-label="Studio 37 Photography - Home"
          >
            {logoUrl ? (
              <div className="flex items-center gap-2" suppressHydrationWarning>
                {/* Watermarked logo with responsive sizing */}
                <div className={`relative transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'} w-auto`} style={{ minWidth: scrolled ? 120 : 140 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={logoUrl} 
                    alt="Studio 37 Photography - Professional photography in Pinehurst, TX" 
                    width="140"
                    height="40"
                    className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'}`}
                    loading="eager"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className={`rounded-full p-1 ${scrolled ? 'bg-amber-100' : 'bg-white/20'}`}>
                  <Camera 
                    className={`h-8 w-8 ${scrolled ? 'text-amber-700' : 'text-amber-200'}`} 
                    aria-hidden="true"
                  />
                </div>
                <span className={`text-xl font-serif font-bold ${scrolled ? 'text-amber-900' : 'text-white'}`}>
                  Studio 37
                </span>
              </>
            )}
          </Link>

          <div className="hidden md:flex items-center space-x-8" suppressHydrationWarning>
            {navItems.map((item) => {
              // Dropdown menu item
              if (item.children && item.children.length > 0) {
                const isDropdownOpen = dropdownStates[item.id] || false

                const handleEnter = () => {
                  // Cancel any pending close timer and open
                  const t = dropdownCloseTimers.current[item.id]
                  if (t) clearTimeout(t)
                  dropdownCloseTimers.current[item.id] = null
                  setDropdownStates(prev => ({ ...prev, [item.id]: true }))
                }

                const handleLeave = () => {
                  // Delay close slightly to allow cursor to traverse the gap
                  const t = setTimeout(() => {
                    setDropdownStates(prev => ({ ...prev, [item.id]: false }))
                    dropdownCloseTimers.current[item.id] = null
                  }, 180)
                  dropdownCloseTimers.current[item.id] = t
                }

                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                  >
                    <button
                      className={`transition-colors font-medium px-2 py-1 rounded flex items-center gap-1 ${
                        scrolled ? 'text-amber-900 hover:text-amber-600' : 'text-white hover:text-amber-200'
                      } focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2`}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    
                    {isDropdownOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                        role="menu"
                        aria-label={`${item.label} submenu`}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="block px-4 py-2 text-amber-900 hover:bg-amber-50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              
              // Regular link item
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`transition-colors font-medium px-2 py-1 rounded ${
                    item.highlighted
                      ? scrolled
                        ? 'btn-primary'
                        : 'bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-amber-200/30'
                      : `hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 ${
                          scrolled ? 'text-amber-900' : 'text-white'
                        }`
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/admin"
              className={`focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors ${
                scrolled
                  ? 'btn-primary'
                  : 'bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-amber-200/30'
              }`}
            >
              Admin
            </Link>
          </div>

          <button
            type="button"
            className={`md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 ${scrolled ? 'text-amber-900' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {isOpen && (
          <div 
            className="md:hidden py-4 border-t border-amber-200/20" 
            id="mobile-menu"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                // Mobile dropdown menu item
                if (item.children && item.children.length > 0) {
                  const isMobileDropdownOpen = mobileDropdownStates[item.id] || false
                  
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setMobileDropdownStates(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="w-full flex items-center justify-between text-left transition-colors font-medium text-amber-900 px-2 py-1 rounded hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
                        aria-expanded={isMobileDropdownOpen}
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                      
                      {isMobileDropdownOpen && (
                        <div className="pl-4 mt-2 space-y-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              className="block transition-colors text-amber-900 px-2 py-1 rounded hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                
                // Regular mobile link
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`transition-colors font-medium text-amber-900 px-2 py-1 rounded ${
                      item.highlighted
                        ? 'btn-primary w-fit'
                        : 'hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/admin"
                className="btn-primary w-fit focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
