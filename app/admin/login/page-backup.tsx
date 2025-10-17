'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, Shield, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    let isMounted = true
    let redirectTimeout: NodeJS.Timeout
    
    // Check for error messages first
    const errorParam = searchParams?.get('error')
    if (errorParam && isMounted) {
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
    
    // Only check auth if no error and not already redirecting
    if (!errorParam && isMounted) {
      // Delayed auth check to prevent API flooding
      redirectTimeout = setTimeout(async () => {
        if (!isMounted) return
        
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (session && !error && isMounted) {
            // Check user role before redirecting
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('role')
              .eq('id', session.user.id)
              .single()
            
            if (profile && (profile.role === 'admin' || profile.role === 'owner')) {
              // Use window.location for a clean redirect without history API issues
              window.location.href = '/admin/dashboard'
            }
          }
        } catch (error) {
          console.error('Auth check error:', error)
        }
      }, 2000) // 2 second delay to prevent rapid API calls
    }

    return () => {
      isMounted = false
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [searchParams]) // Removed router dependency to prevent extra calls

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

        // Successful login - redirect to dashboard
        window.location.href = '/admin/dashboard'
      }
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Studio37 Admin</h1>
            <p className="text-gray-300">Secure access to your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@studio37.cc"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-xs text-gray-400 text-center">
              Protected by enterprise-grade security. All access attempts are logged.
            </p>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}