'use client'

import { useState } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { themeConfig } from '@/lib/themeConfig'

/**
 * Theme Customizer Component
 * Phase 3: Theme System
 * Admin UI for visual customization
 */

export default function ThemeCustomizer() {
  const { theme, setTheme, primaryColor, setPrimaryColor, density, setDensity, resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing'>('colors')

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Theme Customizer</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['colors', 'typography', 'spacing'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium transition capitalize ${
              activeTab === tab
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* Dark Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Mode
            </label>
            <div className="flex gap-2">
              {['light', 'dark', 'system'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode as any)}
                  className={`px-4 py-2 rounded-lg border-2 transition capitalize ${
                    theme === mode
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Currently showing: <strong>{resolvedTheme}</strong> mode
            </p>
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <div>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="#b47e28"
                />
                <p className="text-xs text-gray-500 mt-1">Used for buttons, links, accents</p>
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Presets
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(themeConfig.colors).map(([key, group]) => (
                <div key={key} className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">{group.label}</p>
                  <div className="flex gap-1">
                    {group.variants.map((variant) => (
                      <button
                        key={variant.name}
                        onClick={() => setPrimaryColor(variant.value)}
                        className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition"
                        style={{ backgroundColor: variant.value }}
                        title={variant.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Heading Fonts
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {themeConfig.fonts.heading.options.map((font) => (
                <button
                  key={font.name}
                  className={`px-4 py-3 border rounded-lg hover:border-primary-300 transition text-left ${font.class}`}
                  style={{ fontFamily: font.value }}
                >
                  <div className="font-bold text-lg">Aa</div>
                  <div className="text-xs text-gray-600">{font.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Body Fonts
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {themeConfig.fonts.body.options.map((font) => (
                <button
                  key={font.name}
                  className={`px-4 py-3 border rounded-lg hover:border-primary-300 transition text-left ${font.class}`}
                  style={{ fontFamily: font.value }}
                >
                  <div className="text-base">The quick brown fox jumps</div>
                  <div className="text-xs text-gray-600">{font.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacing Tab */}
      {activeTab === 'spacing' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout Density
            </label>
            <div className="flex gap-2">
              {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition capitalize ${
                    density === d
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{d}</div>
                  <div className="text-xs text-gray-500">
                    {d === 'compact' && '0.75x spacing'}
                    {d === 'comfortable' && '1x spacing'}
                    {d === 'spacious' && '1.25x spacing'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Examples */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Preview</h3>
            <div className="space-y-2">
              <div className="bg-gray-100 rounded p-4" style={{ padding: `calc(1rem * var(--density-scale, 1))` }}>
                <p className="font-medium">Section Padding</p>
                <p className="text-sm text-gray-600">Adjusts based on density setting</p>
              </div>
              <div className="flex gap-2" style={{ gap: `calc(0.5rem * var(--density-scale, 1))` }}>
                <div className="bg-primary-100 px-3 py-2 rounded text-sm">Button</div>
                <div className="bg-primary-100 px-3 py-2 rounded text-sm">Button</div>
                <div className="bg-primary-100 px-3 py-2 rounded text-sm">Button</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save/Reset Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
        <button
          onClick={() => {
            setTheme('light')
            setPrimaryColor('#b47e28')
            setDensity('comfortable')
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Reset to Default
        </button>
        <button
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          onClick={() => {
            alert('Theme saved! (In production, this would save to database)')
          }}
        >
          Save Theme
        </button>
      </div>
    </div>
  )
}
