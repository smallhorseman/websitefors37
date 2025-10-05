'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Image, 
  Settings, 
  Calendar,
  MessageSquare,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    content: false,
    gallery: false
  })
  
  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true
    },
    { 
      name: 'Leads', 
      path: '/admin/leads', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Content', 
      path: '/admin/content', 
      icon: <FileText className="w-5 h-5" />,
      submenu: [
        { name: 'Pages', path: '/admin/content' },
        { name: 'Blog Posts', path: '/admin/content/blog' }
      ]
    },
    { 
      name: 'Gallery', 
      path: '/admin/gallery', 
      icon: <Image className="w-5 h-5" />,
      submenu: [
        { name: 'All Images', path: '/admin/gallery' },
        { name: 'Categories', path: '/admin/gallery/categories' },
      ]
    },
    { 
      name: 'Messages', 
      path: '/admin/messages', 
      icon: <MessageSquare className="w-5 h-5" /> 
    },
    { 
      name: 'Bookings', 
      path: '/admin/bookings', 
      icon: <Calendar className="w-5 h-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings className="w-5 h-5" /> 
    }
  ]
  
  const MenuItem = ({ item }: { item: any }) => {
    const active = isActive(item.path)
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const expanded = expandedMenus[item.name.toLowerCase()]
    
    return (
      <>
        <Link
          href={hasSubmenu ? '#' : item.path}
          onClick={hasSubmenu ? () => toggleMenu(item.name.toLowerCase()) : undefined}
          className={`
            flex items-center px-4 py-3 text-sm
            ${active && !hasSubmenu ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-100'}
            ${hasSubmenu ? 'justify-between' : ''}
          `}
        >
          <div className="flex items-center">
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </div>
          
          {hasSubmenu && (
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${expanded ? 'transform rotate-180' : ''}`}
            />
          )}
        </Link>
        
        {/* Submenu */}
        {hasSubmenu && expanded && (
          <div className="pl-4 bg-gray-50">
            {item.submenu.map((subitem: any, idx: number) => (
              <Link
                key={idx}
                href={subitem.path}
                className={`
                  flex items-center px-6 py-2 text-sm
                  ${pathname === subitem.path ? 'text-primary-700 font-medium' : 'text-gray-600 hover:text-primary-600'}
                `}
              >
                {subitem.name}
              </Link>
            ))}
          </div>
        )}
      </>
    )
  }
  
  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 px-4 py-3 flex justify-between items-center bg-white z-30 border-b">
        <Link href="/admin" className="font-semibold text-primary-600">Admin Panel</Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-gray-500"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Sidebar */}
      <aside className={`
        lg:block fixed z-20 h-full bg-white border-r w-64 transition-all duration-300 transform
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
      `}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b">
            <Link href="/admin" className="flex items-center">
              <Image className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-semibold ml-2">Studio 37 Admin</span>
            </Link>
          </div>
          
          <div className="overflow-y-auto flex-1 py-4">
            <nav className="space-y-1">
              {menuItems.map((item, idx) => (
                <div key={idx}>
                  <MenuItem item={item} />
                </div>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <Link 
              href="/"
              target="_blank"
              className="flex items-center text-sm text-gray-600 hover:text-primary-600"
            >
              <span>Visit Website</span>
            </Link>
          </div>
        </div>
      </aside>
      
      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
