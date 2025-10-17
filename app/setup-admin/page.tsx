'use client'

import React, { useState } from 'react'
import { Shield, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const createCEOAccount = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Create the auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'ceo@studio37.cc',
        password: '19!Alebest',
        options: {
          data: {
            name: 'CEO - Studio37'
          }
        }
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // The trigger will automatically create the user profile
        // But let's ensure it has the right role
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: data.user.id,
            name: 'CEO - Studio37',
            email: 'ceo@studio37.cc',
            role: 'owner',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw here as the auth user was created successfully
        }

        setSuccess(true)
      }
    } catch (error: any) {
      if (error.message?.includes('User already registered')) {
        setError('CEO account already exists. You can log in with the provided credentials.')
      } else {
        setError(error.message || 'Failed to create CEO account')
      }
    } finally {
      setLoading(false)
    }
  }

  const checkExistingAccount = async () => {
    try {
      const { data: users } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', 'ceo@studio37.cc')
        .eq('role', 'owner')

      if (users && users.length > 0) {
        setSuccess(true)
        setError('CEO account already exists and is properly configured.')
      } else {
        setError('CEO account not found. Click "Create CEO Account" to set it up.')
      }
    } catch (error: any) {
      setError('Unable to check account status.')
    }
  }

  React.useEffect(() => {
    checkExistingAccount()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full inline-block mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Studio37 Admin Setup
          </h1>
          <p className="text-gray-600">
            Initialize the CEO admin account for your photography business
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-900">ceo@studio37.cc</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Lock className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Password</p>
              <p className="text-sm text-gray-900 font-mono">19!Alebest</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Role</p>
              <p className="text-sm text-gray-900">Owner (Full Access)</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800 font-medium">CEO Account Ready!</p>
              <p className="text-sm text-green-700 mt-1">
                You can now log in to the admin dashboard with the credentials above.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={createCEOAccount}
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Creating Account...
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Account Created
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Create CEO Account
              </>
            )}
          </button>

          <button
            onClick={checkExistingAccount}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Check Account Status
          </button>

          {success && (
            <a
              href="/admin/login"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-center block"
            >
              Go to Admin Login
            </a>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            This page is for initial setup only. Remove after account creation.
          </p>
        </div>
      </div>
    </div>
  )
}