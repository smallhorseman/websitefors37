'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Theme Provider with Dark Mode Support
 * Phase 3: Theme System
 * 
 * Provides theme context throughout the application
 * Syncs with localStorage and system preferences
 */

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  density: 'compact' | 'comfortable' | 'spacious'
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('light')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [primaryColor, setPrimaryColorState] = useState('#b47e28')
  const [density, setDensityState] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable')

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    const storedColor = localStorage.getItem('primaryColor')
    const storedDensity = localStorage.getItem('density') as 'compact' | 'comfortable' | 'spacious' | null

    if (stored) setThemeState(stored)
    if (storedColor) setPrimaryColorState(storedColor)
    if (storedDensity) setDensityState(storedDensity)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Resolve theme based on system preference
  useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setResolvedTheme(isDark ? 'dark' : 'light')
    } else {
      setResolvedTheme(theme)
    }
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
    root.style.setProperty('--color-primary-custom', primaryColor)

    // Apply density spacing
    const densityScale = {
      compact: 0.75,
      comfortable: 1,
      spacious: 1.25
    }
    root.style.setProperty('--density-scale', String(densityScale[density]))
  }, [resolvedTheme, primaryColor, density])

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color)
    localStorage.setItem('primaryColor', color)
  }

  const setDensity = (newDensity: 'compact' | 'comfortable' | 'spacious') => {
    setDensityState(newDensity)
    localStorage.setItem('density', newDensity)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        primaryColor,
        setPrimaryColor,
        density,
        setDensity
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
