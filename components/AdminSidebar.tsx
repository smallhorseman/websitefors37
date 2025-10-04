'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, FileText, Images, Settings, Home } from 'lucide-react'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: Home },
  { path: '/admin/leads', label: 'Leads', icon: Users },
  { path: '/admin/content', label: 'Content', icon: FileText },
  { path: '/admin/gallery', label: 'Gallery', icon: Images },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">Admin</h2>
      </div>
      <nav className="mt-5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = 
            item.path === '/admin' 
              ? pathname === '/admin'
              : pathname.startsWith(item.path)
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 text-sm rounded-lg mb-1 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
