'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Calendar, Clock, CheckCircle2, Plus, Minus, Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'

type PackageKey = 'consultation' | 'mini_reel' | 'full_episode' | 'movie_premier'

interface AddOn {
  id: string
  name: string
  priceCents: number
  description: string
}

const PACKAGES: Record<Exclude<PackageKey, 'consultation'>, { name: string; duration: number; priceCents: number; description: string }> = {
  mini_reel: {
    name: 'Mini Reel',
    duration: 15,
    priceCents: 7500,
    description: '15 mins, 15 photos, 1-minute free behind-the-scenes video, free on-site Polaroid print.'
  },
  full_episode: {
    name: 'Full Episode',
    duration: 30,
    priceCents: 15000,
    description: '30 mins, 30 photos, 1-minute free behind-the-scenes video, free on-site Polaroid print.'
  },
  movie_premier: {
    name: 'Movie Premier',
    duration: 60,
    priceCents: 30000,
    description: '60 mins, 60 photos, 1-minute free behind-the-scenes video, free on-site Polaroid print.'
  }
}

const ADD_ONS: AddOn[] = [
  { id: 'rush-editing', name: 'Rush Editing (48hr)', priceCents: 5000, description: 'Get your photos in 2 days instead of 2 weeks' },
  { id: 'extra-outfit', name: 'Extra Outfit/Look', priceCents: 2500, description: 'Add another wardrobe change' },
  { id: 'print-package', name: 'Premium Print Package', priceCents: 10000, description: '10x 8x10 professional prints' },
  { id: 'digital-priority', name: 'Digital Priority Delivery', priceCents: 3000, description: 'High-res files available for instant download' }
]

// Assumption: consultation is 30 minutes if not specified
const CONSULTATION_DURATION = 30

function isWeekend(date: Date) {
  const d = date.getDay()
  return d === 0 || d === 6
}

function toTZ(date: Date) {
  // Ensure minutes are zero padded
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

function addMinutes(date: Date, mins: number) {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + mins)
  return d
}

// Returns availability windows for a given date (local time)
function availabilityWindows(date: Date): Array<{ start: Date; end: Date }> {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const mk = (h: number, m = 0) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m)
  if (isWeekend(day)) {
    return [{ start: mk(9, 0), end: mk(21, 0) }]
  }
  return [
    { start: mk(6, 0), end: mk(8, 0) },
    { start: mk(17, 30), end: mk(21, 0) },
  ]
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart
}

type BookingOptionType = 'consultation' | 'packages' | 'custom'

export default function BookSessionPage() {
  const [currentStep, setCurrentStep] = useState(1) // 1=Package, 2=Details, 3=DateTime, 4=Review
  const [bookingOption, setBookingOption] = useState<BookingOptionType>('consultation') // Main option type
  const [selectedType, setSelectedType] = useState<PackageKey>('consultation')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('') // Anti-spam
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [existingForDay, setExistingForDay] = useState<{ start_time: string; end_time: string; status: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  // Custom package calculator state
  const [customDuration, setCustomDuration] = useState(30)
  const [customPeople, setCustomPeople] = useState(1)
  const [customType, setCustomType] = useState<'solo' | 'couple' | 'family'>('solo')

  // Prefill from pricing calculator (query params)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      const durStr = params.get('duration')
      const pplStr = params.get('people')
      const typeParam = params.get('type') // solo|couple|family|consultation
      const priceStr = params.get('price_cents')

      const dur = durStr ? parseInt(durStr, 10) : NaN
      const ppl = pplStr ? parseInt(pplStr, 10) : NaN
      const price = priceStr ? parseInt(priceStr, 10) : NaN

      // Map duration to nearest package if available
      if (!Number.isNaN(dur)) {
        if (dur <= 15) setSelectedType('mini_reel')
        else if (dur <= 30) setSelectedType('full_episode')
        else if (dur <= 60) setSelectedType('movie_premier')
        // For >60, keep current selection (user can choose manually)
      }

      // Add helpful note so the user sees their calculator context
      const parts: string[] = []
      if (typeParam) parts.push(`Type: ${typeParam}`)
      if (!Number.isNaN(ppl)) parts.push(`People: ${ppl}`)
      if (!Number.isNaN(dur)) parts.push(`Duration: ${dur} min`)
      if (!Number.isNaN(price)) parts.push(`Estimated: $${(price/100).toFixed(2)}`)
      if (parts.length) {
        setNotes(prev => prev ? prev : `From pricing calculator → ${parts.join(' · ')}`)
      }
    } catch {}
  }, [])

  const duration = useMemo(() => {
    if (bookingOption === 'custom') return customDuration
    if (selectedType === 'consultation') return CONSULTATION_DURATION
    const key = selectedType as Exclude<PackageKey, 'consultation'>
    return PACKAGES[key].duration
  }, [bookingOption, selectedType, customDuration])

  const totalPrice = useMemo(() => {
    if (bookingOption === 'consultation') return 0
    if (bookingOption === 'custom') {
      // Custom pricing formula - match PricingCalculator.tsx logic
      const hourlyRate = 400_00 // $400/hr for all types
      const proratedBase = Math.round((hourlyRate * customDuration) / 60)
      
      // Family group surcharge: $50 per person over 5
      const extraPersonFee = customType === 'family' && customPeople > 5 
        ? (customPeople - 5) * 50_00 
        : 0
      
      const total = proratedBase + extraPersonFee
      return Math.max(total, 100_00) // minimum $100
    }
    // Package pricing
    if (selectedType === 'consultation') return 0
    const packagePrice = PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].priceCents
    const addOnsPrice = selectedAddOns.reduce((sum, id) => {
      const addOn = ADD_ONS.find(a => a.id === id)
      return sum + (addOn?.priceCents || 0)
    }, 0)
    return packagePrice + addOnsPrice
  }, [bookingOption, selectedType, selectedAddOns, customDuration, customPeople, customType])

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  // Load existing appointments for the selected date
  useEffect(() => {
    const load = async () => {
      if (!selectedDate) return
      setLoadingSlots(true)
      try {
        const day = new Date(selectedDate + 'T00:00:00')
        const start = new Date(day)
        const end = new Date(day)
        end.setHours(23, 59, 59, 999)

        const { data, error } = await supabase
          .from('appointments')
          .select('start_time,end_time,status')
          .gte('start_time', start.toISOString())
          .lte('start_time', end.toISOString())
          .eq('status', 'scheduled')

        if (error) throw error
        setExistingForDay(data || [])
      } catch (e) {
        console.error(e)
        setExistingForDay([])
      } finally {
        setLoadingSlots(false)
      }
    }
    load()
  }, [selectedDate])

  const slots = useMemo(() => {
    if (!selectedDate) return [] as string[]
    const d = new Date(selectedDate + 'T00:00:00')
    const windows = availabilityWindows(d)
  const out: string[] = []
    const step = 15 // minutes granularity
    for (const w of windows) {
      for (let t = new Date(w.start); addMinutes(t, duration) <= w.end; t = addMinutes(t, step)) {
        const slotStart = new Date(t)
        const slotEnd = addMinutes(slotStart, duration)
        // Check overlap against existing appointments
        const hasConflict = existingForDay.some((a: { start_time: string; end_time: string }) =>
          overlaps(slotStart, slotEnd, new Date(a.start_time), new Date(a.end_time))
        )
        if (!hasConflict) {
          out.push(toTZ(slotStart).slice(11, 16)) // HH:MM
        }
      }
    }
    return out
  }, [selectedDate, existingForDay, duration])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check
    if (honeypot) {
      console.warn('Spam detected')
      return
    }

    // Validation
    const errors: Record<string, string> = {}
    if (!name || name.length < 2) errors.name = 'Name is required'
    if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required'
    if (!selectedDate) errors.date = 'Please select a date'
    if (!selectedTime) errors.time = 'Please select a time'
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setValidationErrors({})
    if (!selectedDate || !selectedTime) return
    setSubmitting(true)
    try {
      const start = new Date(`${selectedDate}T${selectedTime}:00`)
      const end = addMinutes(start, duration)

      // Basic server-side conflict check just before booking
      const { data: conflicts, error: confErr } = await supabase
        .from('appointments')
        .select('id')
        .lt('start_time', end.toISOString())
        .gt('end_time', start.toISOString())
        .eq('status', 'scheduled')

      if (confErr) throw confErr
      if (conflicts && conflicts.length > 0) {
        alert('Sorry, that slot was just taken. Please pick another time.')
        setSelectedTime('')
        return
      }

      // Ensure lead exists
  let leadId: string | null = null
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', email)
        .limit(1)
        .maybeSingle()

      if (existingLead?.id) {
        leadId = existingLead.id
      } else {
        // Determine service interest based on booking option
        let serviceInterest = 'consultation'
        if (bookingOption === 'packages' && selectedType !== 'consultation') {
          serviceInterest = PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].name
        } else if (bookingOption === 'custom') {
          serviceInterest = `Custom Package (${customDuration}min, ${customType}, ${customPeople} people)`
        }
        
        const { data: newLead, error: leadErr } = await supabase
          .from('leads')
          .insert([{ 
            name, email, phone, 
            message: notes,
            service_interest: serviceInterest,
            status: 'converted'
          }])
          .select('id')
          .single()
        if (leadErr) throw leadErr
        leadId = newLead.id
      }

      // Build appointment payload based on booking option
      let packageName = null
      let packageKey = null
      let appointmentType = 'consultation'
      
      if (bookingOption === 'packages' && selectedType !== 'consultation') {
        appointmentType = 'package'
        packageKey = selectedType
        packageName = PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].name
      } else if (bookingOption === 'custom') {
        appointmentType = 'custom'
        packageKey = 'custom'
        packageName = `Custom Package (${customDuration}min)`
      }

      const payload: Record<string, any> = {
        lead_id: leadId,
        name,
        email,
        phone,
        type: appointmentType,
        package_key: packageKey,
        package_name: packageName,
        price_cents: totalPrice > 0 ? totalPrice : null,
        duration_minutes: duration,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        notes: notes + (selectedAddOns.length > 0 ? `\n\nAdd-ons: ${selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ')}` : '') + (bookingOption === 'custom' ? `\n\nCustom Package: ${customType}, ${customPeople} people` : ''),
        status: 'scheduled'
      }

      const { error: apptErr } = await supabase.from('appointments').insert([payload])
      if (apptErr) throw apptErr

      setSuccess(true)
      setCurrentStep(5) // Success step
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to book. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Generate .ics calendar file
  const generateCalendarInvite = () => {
    if (!selectedDate || !selectedTime || !name) return
    
    const start = new Date(`${selectedDate}T${selectedTime}:00`)
    const end = addMinutes(start, duration)
    
    const formatICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    let sessionTitle = 'Photography Consultation'
    if (bookingOption === 'packages' && selectedType !== 'consultation') {
      sessionTitle = PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].name
    } else if (bookingOption === 'custom') {
      sessionTitle = `Custom Package (${customDuration}min)`
    }
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Studio37//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@studio37.cc`,
      `DTSTAMP:${formatICS(new Date())}`,
      `DTSTART:${formatICS(start)}`,
      `DTEND:${formatICS(end)}`,
      `SUMMARY:Studio37 - ${sessionTitle}`,
      `DESCRIPTION:Your photography session with Studio37. Contact: ${email}`,
      'LOCATION:Studio37, Pinehurst, TX',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'studio37-session.ics'
    link.click()
  }

  // Fetch booking background image URL from settings
  const [bgUrl, setBgUrl] = useState<string>('https://images.unsplash.com/photo-1423666639041-f56000c27a9a')
  useEffect(() => {
    const fetchBg = async () => {
      try {
        const { data } = await supabase.from('settings').select('book_session_bg_url').maybeSingle()
        if (data?.book_session_bg_url) {
          setBgUrl(data.book_session_bg_url)
        }
      } catch {}
    }
    fetchBg()
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* True Full-Page Background Image, fixed and always behind content */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none">
        <Image
          src={bgUrl}
          alt="Book a session background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            aria-hidden="true"
            role="presentation"
          />
      </div>
      <div className="container mx-auto px-4 py-12 max-w-5xl w-full flex-1 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 text-white drop-shadow-lg">Book Your Session</h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto drop-shadow">
            Choose from a free consultation, our curated packages, or build your own custom session. We'll find the perfect time that works for you.
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center max-w-2xl mx-auto">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-900">You're All Set! 🎉</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your session has been confirmed. We've sent a confirmation email with all the details to <strong>{email}</strong>.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
              <p className="text-sm text-blue-900 font-medium mb-1">📅 Session Details:</p>
              <p className="text-sm text-blue-800">
                {bookingOption === 'consultation' 
                  ? 'Free Consultation (30 min)' 
                  : bookingOption === 'packages' && selectedType !== 'consultation'
                    ? `${PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].name} - $${(totalPrice/100).toFixed(2)}`
                    : `Custom Package (${customDuration}min) - $${(totalPrice/100).toFixed(2)}`
                }
                <br />
                {new Date(selectedDate + 'T' + selectedTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Need to make changes? Contact us at <a href="tel:+18325551234" className="text-blue-600 hover:underline">(832) 555-1234</a>
            </p>
            <button 
              onClick={() => {
                setSuccess(false)
                setBookingOption('consultation')
                setName('')
                setEmail('')
                setPhone('')
                setNotes('')
                setSelectedDate('')
                setSelectedTime('')
                setSelectedType('consultation')
                setCustomDuration(30)
                setCustomPeople(1)
                setCustomType('solo')
              }}
              className="btn-secondary px-6 py-3"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Package selector - New 3-option structure */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">Choose Booking Type</h3>
                <div className="space-y-3">
                  {/* Option 1: Consultation */}
                  <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${bookingOption==='consultation'?'border-primary-500 bg-primary-50 shadow-md':'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <div className="flex items-start">
                      <input 
                        name="booking-option" 
                        type="radio" 
                        className="mt-1 mr-3" 
                        checked={bookingOption==='consultation'} 
                        onChange={()=>{
                          setBookingOption('consultation')
                          setSelectedType('consultation')
                        }} 
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-lg">Free Consultation</div>
                        <div className="text-sm text-gray-600 mt-1">30-minute session to discuss your photography needs</div>
                        <div className="text-primary-600 font-medium mt-2">Free</div>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Packages with dropdown */}
                  <div className={`border-2 rounded-lg p-4 transition-all ${bookingOption==='packages'?'border-primary-500 bg-primary-50 shadow-md':'border-gray-200'}`}>
                    <label className="cursor-pointer">
                      <div className="flex items-start">
                        <input 
                          name="booking-option" 
                          type="radio" 
                          className="mt-1 mr-3" 
                          checked={bookingOption==='packages'} 
                          onChange={()=>{
                            setBookingOption('packages')
                            setSelectedType('mini_reel')
                          }} 
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-lg">Standard Packages</div>
                          <div className="text-sm text-gray-600 mt-1">Choose from our pre-designed photography packages</div>
                        </div>
                      </div>
                    </label>
                    
                    {bookingOption === 'packages' && (
                      <div className="mt-4 pl-8">
                        <select 
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                          value={selectedType === 'consultation' ? 'mini_reel' : selectedType}
                          onChange={(e) => setSelectedType(e.target.value as PackageKey)}
                        >
                          {Object.entries(PACKAGES).map(([key, p]) => (
                            <option key={key} value={key}>
                              {p.name} - ${(p.priceCents/100).toFixed(0)} ({p.duration} min)
                            </option>
                          ))}
                        </select>
                        {selectedType !== 'consultation' && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                            {PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].description}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Option 3: Custom with calculator */}
                  <div className={`border-2 rounded-lg p-4 transition-all ${bookingOption==='custom'?'border-primary-500 bg-primary-50 shadow-md':'border-gray-200'}`}>
                    <label className="cursor-pointer">
                      <div className="flex items-start">
                        <input 
                          name="booking-option" 
                          type="radio" 
                          className="mt-1 mr-3" 
                          checked={bookingOption==='custom'} 
                          onChange={()=>setBookingOption('custom')} 
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-lg">Custom Package</div>
                          <div className="text-sm text-gray-600 mt-1">Build your own package with our calculator</div>
                        </div>
                      </div>
                    </label>
                    
                    {bookingOption === 'custom' && (
                      <div className="mt-4 pl-8 space-y-4">
                        {/* Type selector */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Portrait Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['solo', 'couple', 'family'] as const).map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setCustomType(type)}
                                className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                                  customType === type 
                                    ? 'bg-primary-600 text-white border-primary-600' 
                                    : 'bg-white border-gray-300 hover:border-primary-400'
                                }`}
                              >
                                {type === 'solo' ? 'Solo' : type === 'couple' ? 'Couples' : 'Family'}
                              </button>
                            ))}
                          </div>
                          {customType !== 'family' && customPeople > 2 && (
                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mt-2">
                              Tip: For 3+ people, switch to Family to get the correct family rate.
                            </p>
                          )}
                        </div>

                        {/* People count */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of People
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="decrease people"
                              onClick={() => setCustomPeople(Math.max(1, customPeople - 1))}
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={50}
                              value={customPeople}
                              onChange={(e) => setCustomPeople(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                              className="w-24 text-center border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <button
                              type="button"
                              aria-label="increase people"
                              onClick={() => setCustomPeople(Math.min(50, customPeople + 1))}
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Duration selector */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (minutes)
                          </label>
                          <select 
                            value={customDuration}
                            onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                          >
                            {[15, 30, 45, 60, 75, 90, 120, 150, 180].map(mins => (
                              <option key={mins} value={mins}>{mins} minutes</option>
                            ))}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">Billed pro-rata by minutes.</p>
                        </div>

                        {/* Price display with breakdown */}
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600">Calculated session total</div>
                            <div className="text-2xl font-extrabold text-gray-900">
                              ${(totalPrice / 100).toFixed(2)}
                            </div>
                          </div>
                          {customType === 'family' && customPeople > 5 && (
                            <p className="text-xs text-gray-500">
                              Includes ${((customPeople - 5) * 50).toFixed(2)} group surcharge for {customPeople - 5} extra {customPeople - 5 === 1 ? 'person' : 'people'}.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">Your info</h3>
                <div className="space-y-3">
                  <input name="name" className="w-full border rounded px-3 py-2" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
                  <input name="email" className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
                  <input name="phone" className="w-full border rounded px-3 py-2" placeholder="Phone (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
                  <textarea name="notes" className="w-full border rounded px-3 py-2" placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Date/time picker */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5" /> Pick date & time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm text-gray-600 mb-1">Date</label>
                    <input id="date" name="date" aria-label="Choose date" type="date" className="w-full border rounded px-3 py-2" value={selectedDate} onChange={(e)=>{setSelectedDate(e.target.value); setSelectedTime('')}} />
                    <p className="text-xs text-gray-500 mt-2">Weekdays: 6-8am, 5:30-9pm. Weekends: 9am-9pm.</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Time</label>
                    {loadingSlots ? (
                      <div className="flex items-center text-gray-500"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading slots…</div>
                    ) : !selectedDate ? (
                      <div className="text-gray-500 text-sm">Choose a date to see available times</div>
                    ) : (
                      <div className="flex flex-wrap gap-2 max-h-56 overflow-auto p-1 border rounded">
                        {slots.length === 0 ? (
                          <div className="text-gray-500 text-sm p-2">No slots available for this date.</div>
                        ) : slots.map((t) => (
                          <button type="button" key={t} onClick={()=>setSelectedTime(t)} className={`px-3 py-1 rounded border text-sm ${selectedTime===t?'bg-primary-600 text-white border-primary-600':'hover:bg-gray-50'}`}>
                            <Clock className="inline h-3 w-3 mr-1" /> {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={!name || !email || !selectedDate || !selectedTime || submitting}
                    className="btn-primary px-6 py-3 disabled:opacity-50"
                  >
                    {submitting ? 'Booking…' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
