"use client"

import React from 'react'
import { themeConfig, getAllColorVariants, getAllFontOptions } from '@/lib/themeConfig'

/**
 * Color Picker - Brand Colors Only
 * Shows visual swatches with color names
 */
interface ColorPickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
  allowTransparent?: boolean
  type?: 'background' | 'text'
}

export function ColorPicker({ label, value, onChange, allowTransparent, type = 'background' }: ColorPickerProps) {
  const colors = getAllColorVariants()
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
        {allowTransparent && (
          <button
            type="button"
            onClick={() => onChange('transparent')}
            className={`flex flex-col items-center gap-1 p-2 rounded-md border-2 transition-all ${
              value === 'transparent' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="w-12 h-12 rounded-md bg-white border border-gray-300" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 10px, white 10px, white 20px)'
            }} />
            <span className="text-xs text-gray-700 font-medium">None</span>
          </button>
        )}
        
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(type === 'text' ? color.value : color.class)}
            className={`flex flex-col items-center gap-1 p-2 rounded-md border-2 transition-all ${
              (value === color.value || value === color.class) ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            title={color.name}
          >
            <div 
              className="w-12 h-12 rounded-md border border-gray-200 shadow-sm"
              style={{ backgroundColor: color.value }}
            />
            <span className="text-xs text-gray-700 text-center font-medium leading-tight">{color.name}</span>
          </button>
        ))}
      </div>
      {value && (
        <p className="text-xs text-gray-500 mt-2">
          Current: <code className="bg-gray-100 px-2 py-1 rounded">{value}</code>
        </p>
      )}
    </div>
  )
}

/**
 * Font Picker - Brand Fonts Only
 * Shows font samples with names
 */
interface FontPickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
  type?: 'heading' | 'body' | 'all'
}

export function FontPicker({ label, value, onChange, type = 'all' }: FontPickerProps) {
  const allFonts = getAllFontOptions()
  
  // Filter fonts based on type
  const fonts = type === 'all' ? allFonts : 
    type === 'heading' ? themeConfig.fonts.heading.options :
    themeConfig.fonts.body.options
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
        {fonts.map((font) => (
          <button
            key={font.value}
            type="button"
            onClick={() => onChange(font.class)}
            className={`w-full text-left p-3 rounded-md border-2 transition-all ${
              value === font.class ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            <div className={`${font.class} text-lg mb-1`}>
              The quick brown fox jumps
            </div>
            <div className="text-xs text-gray-600 font-sans">{font.name}</div>
          </button>
        ))}
      </div>
      {value && (
        <p className="text-xs text-gray-500 mt-2">
          Current: <code className="bg-gray-100 px-2 py-1 rounded">{value}</code>
        </p>
      )}
    </div>
  )
}

/**
 * Text Size Picker
 */
interface TextSizePickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
}

export function TextSizePicker({ label, value, onChange }: TextSizePickerProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value || 'base'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {themeConfig.textSizes.map((size) => (
          <option key={size.value} value={size.value}>
            {size.name} ({size.class})
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * Text Color Picker (optimized for light/dark backgrounds)
 */
interface TextColorPickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
  background?: 'light' | 'dark'
}

export function TextColorPicker({ label, value, onChange, background = 'light' }: TextColorPickerProps) {
  const colors = background === 'light' ? themeConfig.textColors.light : themeConfig.textColors.dark
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`w-full text-left p-3 rounded-md border-2 transition-all ${
              value === color.value ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-md border border-gray-200 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{color.name}</div>
                <div className="text-xs text-gray-500">{color.value}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Button Style Picker
 */
interface ButtonStylePickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
}

export function ButtonStylePicker({ label, value, onChange }: ButtonStylePickerProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {themeConfig.buttonStyles.map((style) => (
          <button
            key={style.name}
            type="button"
            onClick={() => onChange(style.class)}
            className={`w-full p-3 rounded-md border-2 transition-all ${
              value === style.class ? 'border-primary-600' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{style.name}</span>
              <div className={`${style.class} px-4 py-2 text-sm rounded-lg`}>
                Preview
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Spacing Picker (Padding/Margin)
 */
interface SpacingPickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
  type: 'padding' | 'margin'
}

export function SpacingPicker({ label, value, onChange, type }: SpacingPickerProps) {
  const options = type === 'padding' ? themeConfig.spacing.padding : themeConfig.spacing.margin
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value || '0'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name} ({option.value}px)
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * Animation Picker
 */
interface AnimationPickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
}

export function AnimationPicker({ label, value, onChange }: AnimationPickerProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value || 'none'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {themeConfig.animations.map((anim) => (
          <option key={anim.value} value={anim.value}>
            {anim.name}
          </option>
        ))}
      </select>
    </div>
  )
}
