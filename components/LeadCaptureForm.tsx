'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import ThankYouWithSMS from './ThankYouWithSMS'

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  service_interest: z.string().min(1, 'Please select a service'),
  budget_range: z.string().optional(),
  event_date: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type LeadFormData = z.infer<typeof leadSchema>

export default function LeadCaptureForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'web-form' })
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Submission failed')
      }

      toast.success('Thank you! We\'ll be in touch soon.')
      setShowThankYou(true)
      reset()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show thank you page with SMS signup after successful submission
  if (showThankYou) {
    return <ThankYouWithSMS />
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <form
        name="contact"
        method="POST"
          // ...no Netlify attributes...
        onSubmit={handleSubmit(async (data, event) => {
          await onSubmit(data)
          // Let browser submit to Netlify after Supabase
          if (event?.target) {
            setTimeout(() => {
              (event.target as HTMLFormElement).submit()
            }, 100)
          }
        })}
        className="space-y-6"
      >
        {/* Netlify hidden fields */}
          {/* ...no Netlify hidden fields... */}
        <input type="hidden" name="bot-field" />
  <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              {...register('name')}
              id="name-input"
              aria-invalid={!!errors.name || undefined}
              aria-required="true"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1" id="name-error" role="alert">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              {...register('email')}
              id="email-input"
              type="email"
              aria-invalid={!!errors.email || undefined}
              aria-required="true"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1" id="email-error" role="alert">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone-input" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              {...register('phone')}
              id="phone-input"
              type="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 mb-2">
              Service Interest *
            </label>
            <select
              {...register('service_interest')}
              id="service-select"
              aria-invalid={!!errors.service_interest || undefined}
              aria-required="true"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a service</option>
              <option value="wedding">Wedding Photography</option>
              <option value="portrait">Portrait Session</option>
              <option value="event">Event Photography</option>
              <option value="commercial">Commercial Photography</option>
              <option value="other">Other</option>
            </select>
            {errors.service_interest && (
              <p className="text-red-500 text-sm mt-1" id="service-error" role="alert">{errors.service_interest.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget-select" className="block text-sm font-medium text-gray-700 mb-2">
              Package Interest <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <select
              {...register('budget_range')}
              id="budget-select"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a package</option>
              <option value="mini-reel">Mini Reel - Starting at $75</option>
              <option value="full-episode">Full Episode - Starting at $150</option>
              <option value="movie-premier">Movie Premier - Starting at $300</option>
              <option value="hourly">Hourly Rate</option>
              <option value="custom">Custom Package</option>
            </select>
          </div>

          <div>
            <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
            </label>
            <input
              {...register('event_date')}
              id="date-input"
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message-textarea" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            {...register('message')}
            id="message-textarea"
            rows={4}
            aria-invalid={!!errors.message || undefined}
            aria-required="true"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Tell us about your photography needs..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1" id="message-error" role="alert">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Get Your Quote'}
        </button>
      </form>
    </div>
  )
}
