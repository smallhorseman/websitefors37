'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  Image, 
  Calendar, 
  MessageSquare,
  Settings,
  Mail,
  LogOut,
  BarChart3,
  Bell,
  Target,
  Briefcase,
  Palette
} from 'lucide-react'
import NotificationCenter from './NotificationCenter'

export default function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/login')
    }
  }

  const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard', exact: true },
    { href: '/admin/pages', icon: FileText, label: 'Pages' },
    { href: '/admin/blog', icon: FileText, label: 'Blog Posts' },
    { href: '/admin/gallery', icon: Image, label: 'Gallery' },
    { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/admin/calendar', icon: Calendar, label: 'Calendar View' },
    { href: '/admin/leads', icon: MessageSquare, label: 'Leads & Messages' },
    { href: '/admin/lead-scoring', icon: Target, label: 'Lead Scoring' },
    { href: '/admin/client-portals', icon: Briefcase, label: 'Client Portals' },
    { href: '/admin/email-templates', icon: Mail, label: 'Email Templates' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/theme-customizer', icon: Palette, label: 'Theme Customizer' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="text-xl font-bold text-gray-900">
            Studio37 Admin
          </Link>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-white shadow-xl z-50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href, item.exact)
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                          active
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Divider */}
              <div className="my-4 border-t border-gray-200" />

              {/* Quick Actions */}
              <div className="space-y-2">
                <Link
                  href="/admin/chatbot-training"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  🧠 <span>AI Training</span>
                </Link>
                <Link
                  href="/admin/ai-site-builder"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  ⚙️ <span>AI Site Builder</span>
                </Link>
                <Link
                  href="/admin/ai-blog-writer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  ✍️ <span>AI Blog Writer</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-200" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-700 hover:bg-red-50 transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  )
}
