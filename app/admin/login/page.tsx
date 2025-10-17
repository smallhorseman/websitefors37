'use client'

import React, { useState } from 'react'
import { Lock, Mail, Eye, EyeOff, Shield, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        // Check user role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, name')
          .eq('id', data.user.id)
          .single()

        if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
          await supabase.auth.signOut()
          setError('Access denied. Admin privileges required.')
          return
        }

        // Successful login - use window.location for clean redirect
        window.location.href = '/admin/dashboard'
      }
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Check for URL errors on component mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errorParam = params.get('error')
    
    if (errorParam) {
      switch (errorParam) {
        case 'unauthorized':
          setError('You are not authorized to access the admin panel.')
          break
        case 'middleware':
          setError('Authentication error. Please try logging in again.')
          break
        case 'profile':
          setError('User profile error. Please contact support.')
          break
        default:
          setError('Authentication error occurred.')
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full inline-block mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Camera className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Studio37</h1>
          </div>
          <p className="text-gray-600">Admin Dashboard Login</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Signing In...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Sign In to Admin
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Secure access to Studio37 Photography business management
          </p>
        </div>
      </div>
    </div>
  )
}