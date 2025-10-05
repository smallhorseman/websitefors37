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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className={`rounded-full p-1 ${scrolled ? 'bg-amber-100' : 'bg-white/20'}`}>
              <Camera className={`h-8 w-8 ${scrolled ? 'text-amber-700' : 'text-amber-200'}`} />
            </div>
            <span className={`text-xl font-serif font-bold ${scrolled ? 'text-amber-900' : 'text-white'}`}>
              Studio 37
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`hover:text-amber-600 transition-colors font-medium ${scrolled ? 'text-amber-900' : 'text-white'}`}>Home</Link>
            <Link href="/gallery" className={`hover:text-amber-600 transition-colors font-medium ${scrolled ? 'text-amber-900' : 'text-white'}`}>Gallery</Link>
            <Link href="/services" className={`hover:text-amber-600 transition-colors font-medium ${scrolled ? 'text-amber-900' : 'text-white'}`}>Services</Link>
            <Link href="/blog" className={`hover:text-amber-600 transition-colors font-medium ${scrolled ? 'text-amber-900' : 'text-white'}`}>Blog</Link>
            <Link href="/about" className={`hover:text-amber-600 transition-colors font-medium ${scrolled ? 'text-amber-900' : 'text-white'}`}>About</Link>
            <Link href="/contact" className={`hover:text-amber-600 transition-colors font-medium ${scrolled ? 'text-amber-900' : 'text-white'}`}>Contact</Link>
            <Link 
              href="/admin" 
              className={scrolled ? "btn-primary" : "bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-amber-200/30"}
            >
              Admin
            </Link>
          </div>

          <button
            className={`md:hidden ${scrolled ? 'text-amber-900' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-amber-200/20">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-amber-600 transition-colors font-medium text-amber-900">Home</Link>
              <Link href="/gallery" className="hover:text-amber-600 transition-colors font-medium text-amber-900">Gallery</Link>
              <Link href="/services" className="hover:text-amber-600 transition-colors font-medium text-amber-900">Services</Link>
              <Link href="/blog" className="hover:text-amber-600 transition-colors font-medium text-amber-900">Blog</Link>
              <Link href="/about" className="hover:text-amber-600 transition-colors font-medium text-amber-900">About</Link>
              <Link href="/contact" className="hover:text-amber-600 transition-colors font-medium text-amber-900">Contact</Link>
              <Link href="/admin" className="btn-primary w-fit">Admin</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
