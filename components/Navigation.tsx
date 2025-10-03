'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Camera } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold">Studio 37</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <Link href="/gallery" className="hover:text-primary-600 transition-colors">Gallery</Link>
            <Link href="/services" className="hover:text-primary-600 transition-colors">Services</Link>
            <Link href="/about" className="hover:text-primary-600 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
            <Link href="/admin" className="btn-primary">Admin</Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <Link href="/gallery" className="hover:text-primary-600 transition-colors">Gallery</Link>
              <Link href="/services" className="hover:text-primary-600 transition-colors">Services</Link>
              <Link href="/about" className="hover:text-primary-600 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
              <Link href="/admin" className="btn-primary w-fit">Admin</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
