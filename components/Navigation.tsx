'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Camera } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center space-x-2"
            aria-label="Studio 37 Photography - Home"
          >
            <div className={`rounded-full p-1 ${scrolled ? 'bg-amber-100' : 'bg-white/20'}`}>
              <Camera 
                className={`h-8 w-8 ${scrolled ? 'text-amber-700' : 'text-amber-200'}`} 
                aria-hidden="true"
              />
            </div>
            <span className={`text-xl font-serif font-bold ${scrolled ? 'text-amber-900' : 'text-white'}`}>
              Studio 37
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium px-2 py-1 rounded ${scrolled ? 'text-amber-900' : 'text-white'}`}
            >
              Home
            </Link>
            <Link 
              href="/gallery" 
              className={`hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium px-2 py-1 rounded ${scrolled ? 'text-amber-900' : 'text-white'}`}
            >
              Gallery
            </Link>
            <Link 
              href="/services" 
              className={`hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium px-2 py-1 rounded ${scrolled ? 'text-amber-900' : 'text-white'}`}
            >
              Services
            </Link>
            <Link 
              href="/blog" 
              className={`hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium px-2 py-1 rounded ${scrolled ? 'text-amber-900' : 'text-white'}`}
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium px-2 py-1 rounded ${scrolled ? 'text-amber-900' : 'text-white'}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium px-2 py-1 rounded ${scrolled ? 'text-amber-900' : 'text-white'}`}
            >
              Contact
            </Link>
            <Link 
              href="/book-a-session" 
              className={`hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium px-2 py-1 rounded ${scrolled ? 'text-amber-900' : 'text-white'}`}
            >
              Book a Session
            </Link>
            <Link 
              href="/admin" 
              className={`focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors ${scrolled ? "btn-primary" : "bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-amber-200/30"}`}
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
              <Link 
                href="/" 
                className="hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium text-amber-900 px-2 py-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/gallery" 
                className="hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium text-amber-900 px-2 py-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                href="/services" 
                className="hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium text-amber-900 px-2 py-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/blog" 
                className="hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium text-amber-900 px-2 py-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className="hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium text-amber-900 px-2 py-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium text-amber-900 px-2 py-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/book-a-session" 
                className="hover:text-amber-600 focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium text-amber-900 px-2 py-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                Book a Session
              </Link>
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
