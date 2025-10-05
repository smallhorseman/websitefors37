'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Save, Globe, Search, Palette, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

interface SiteSettings {
  site_name: string
  contact_email: string
  contact_phone: string
  business_address: string
  social_facebook: string
  social_instagram: string
  social_twitter: string
  seo_title_template: string
  seo_default_description: string
  theme_primary_color: string
  theme_secondary_color: string
  google_analytics_id: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Studio 37 Photography',
    contact_email: 'contact@studio37.cc',
    contact_phone: '',
    business_address: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    seo_title_template: '%s | Studio 37 Photography',
    seo_default_description: 'Professional photography services for weddings, events, portraits, and commercial projects.',
    theme_primary_color: '#b46e14', // amber-700
    theme_secondary_color: '#a17a07', // amber-800
    google_analytics_id: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Fetch settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const { supabase } = await import('@/lib/supabase')
        
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single()
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error
        }
        
        if (data) {
          setSettings(data)
        }
        
      } catch (err: any) {
        console.error('Error fetching settings:', err)
        setError('Failed to load settings. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [])
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings({
      ...settings,
      [name]: value
    })
  }
  
  // Save settings to database
  const saveSettings = async () => {
    try {
      setSaving(true)
      setError(null)
      setSaveSuccess(false)
      
      const { supabase } = await import('@/lib/supabase')
      
      // First check if settings exist
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .single()
      
      let result
      
      if (existing) {
        // Update existing settings
        result = await supabase
          .from('settings')
          .update(settings)
          .eq('id', existing.id)
      } else {
        // Insert new settings
        result = await supabase
          .from('settings')
          .insert([settings])
      }
      
      if (result.error) throw result.error
      
      setSaveSuccess(true)
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
      
    } catch (err: any) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }
  
  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Settings</h1>
        <button
          onClick={saveSettings}
          disabled={saving || loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
          Settings saved successfully!
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2">Loading settings...</span>
        </div>
      ) : (
        <>
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium border-b pb-2">Business Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="site_name"
                    value={settings.site_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>Contact Email</span>
                      </div>
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      value={settings.contact_email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>Contact Phone</span>
                      </div>
                    </label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={settings.contact_phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Business Address</span>
                    </div>
                  </label>
                  <textarea
                    name="business_address"
                    value={settings.business_address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <h2 className="text-lg font-medium border-b pb-2 pt-4">Social Media</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-1">
                        <Facebook className="h-4 w-4" />
                        <span>Facebook URL</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      name="social_facebook"
                      value={settings.social_facebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourbusiness"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-1">
                        <Instagram className="h-4 w-4" />
                        <span>Instagram URL</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      name="social_instagram"
                      value={settings.social_instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/yourbusiness"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-1">
                        <Twitter className="h-4 w-4" />
                        <span>Twitter URL</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      name="social_twitter"
                      value={settings.social_twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/yourbusiness"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <h2 className="text-lg font-medium border-b pb-2 pt-4">Analytics</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    name="google_analytics_id"
                    value={settings.google_analytics_id}
                    onChange={handleChange}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your Google Analytics measurement ID to track website traffic.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium border-b pb-2">Search Engine Optimization</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title Template
                  </label>
                  <input
                    type="text"
                    name="seo_title_template"
                    value={settings.seo_title_template}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use %s as a placeholder for the page title. Example: "%s | Studio 37"
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Meta Description
                  </label>
                  <textarea
                    name="seo_default_description"
                    value={settings.seo_default_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Default description used when a page doesn't have a specific one. Keep it under 160 characters.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">SEO Tips</h3>
                  <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                    <li>Use unique, descriptive titles for each page</li>
                    <li>Include relevant keywords in your content naturally</li>
                    <li>Add alt text to all images</li>
                    <li>Ensure your site loads quickly</li>
                    <li>Create quality content that answers visitors' questions</li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium border-b pb-2">Theme Colors</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex">
                      <input
                        type="color"
                        name="theme_primary_color"
                        value={settings.theme_primary_color}
                        onChange={handleChange}
                        className="h-10 w-10 rounded-l border-l border-y p-0"
                      />
                      <input
                        type="text"
                        name="theme_primary_color"
                        value={settings.theme_primary_color}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border-r border-y rounded-r focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Used for buttons, links, and accents.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex">
                      <input
                        type="color"
                        name="theme_secondary_color"
                        value={settings.theme_secondary_color}
                        onChange={handleChange}
                        className="h-10 w-10 rounded-l border-l border-y p-0"
                      />
                      <input
                        type="text"
                        name="theme_secondary_color"
                        value={settings.theme_secondary_color}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border-r border-y rounded-r focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Used for highlights and secondary elements.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-3">Color Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div 
                        className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: settings.theme_primary_color }}
                      >
                        Primary Button
                      </div>
                      <div 
                        className="border rounded-lg h-12 flex items-center justify-center font-medium"
                        style={{ color: settings.theme_primary_color, borderColor: settings.theme_primary_color }}
                      >
                        Outlined Button
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow border">
                        <p>Text with <a href="#" style={{ color: settings.theme_primary_color }}>colored links</a> to show how they look.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div 
                        className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: settings.theme_secondary_color }}
                      >
                        Secondary Button
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div
                          className="h-8 rounded-full mb-2"
                          style={{ backgroundColor: settings.theme_secondary_color, opacity: 0.2 }}
                        ></div>
                        <div
                          className="h-3 w-24 rounded-full"
                          style={{ backgroundColor: settings.theme_secondary_color, opacity: 0.6 }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> Theme color changes will require deploying an updated version of your site to take effect.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
