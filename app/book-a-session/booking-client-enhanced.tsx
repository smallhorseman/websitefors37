'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Calendar, Clock, CheckCircle2, Plus, Minus, Mail, MapPin, Phone, Download, ChevronRight, ChevronLeft } from 'lucide-react'
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
    description: '15 mins, 15 photos, 1-minute BTS video, free Polaroid print.'
  },
  full_episode: {
    name: 'Full Episode',
    duration: 30,
    priceCents: 15000,
    description: '30 mins, 30 photos, 1-minute BTS video, free Polaroid print.'
  },
  movie_premier: {
    name: 'Movie Premier',
    duration: 60,
    priceCents: 30000,
    description: '60 mins, 60 photos, 1-minute BTS video, free Polaroid print.'
  }
}

const ADD_ONS: AddOn[] = [
  { id: 'rush-editing', name: 'Rush Editing (48hr)', priceCents: 5000, description: 'Get your photos in 2 days' },
  { id: 'extra-outfit', name: 'Extra Outfit/Look', priceCents: 2500, description: 'Add another wardrobe change' },
  { id: 'print-package', name: 'Premium Prints', priceCents: 10000, description: '10x 8x10 professional prints' },
  { id: 'digital-priority', name: 'Digital Priority', priceCents: 3000, description: 'Instant high-res download' }
]

const CONSULTATION_DURATION = 30

function isWeekend(date: Date) {
  const d = date.getDay()
  return d === 0 || d === 6
}

function toTZ(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

function addMinutes(date: Date, mins: number) {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + mins)
  return d
}

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

export default function BookSessionPageEnhanced() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedType, setSelectedType] = useState<PackageKey>('consultation')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [existingForDay, setExistingForDay] = useState<{ start_time: string; end_time: string; status: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const duration = useMemo(() => {
    if (selectedType === 'consultation') return CONSULTATION_DURATION
    const key = selectedType as Exclude<PackageKey, 'consultation'>
    return PACKAGES[key].duration
  }, [selectedType])

  const totalPrice = useMemo(() => {
    if (selectedType === 'consultation') return 0
    const packagePrice = PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].priceCents
    const addOnsPrice = selectedAddOns.reduce((sum, id) => {
      const addOn = ADD_ONS.find(a => a.id === id)
      return sum + (addOn?.priceCents || 0)
    }, 0)
    return packagePrice + addOnsPrice
  }, [selectedType, selectedAddOns])

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
    const step = 15
    for (const w of windows) {
      for (let t = new Date(w.start); addMinutes(t, duration) <= w.end; t = addMinutes(t, step)) {
        const slotStart = new Date(t)
        const slotEnd = addMinutes(slotStart, duration)
        const hasConflict = existingForDay.some((a: { start_time: string; end_time: string }) =>
          overlaps(slotStart, slotEnd, new Date(a.start_time), new Date(a.end_time))
        )
        if (!hasConflict) {
          out.push(toTZ(slotStart).slice(11, 16))
        }
      }
    }
    return out
  }, [selectedDate, existingForDay, duration])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (honeypot) {
      console.warn('Spam detected')
      return
    }

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
        const { data: newLead, error: leadErr } = await supabase
          .from('leads')
          .insert([{ 
            name, email, phone, 
            message: notes,
            service_interest: selectedType === 'consultation' ? 'consultation' : PACKAGES[selectedType].name,
            status: 'converted'
          }])
          .select('id')
          .single()
        if (leadErr) throw leadErr
        leadId = newLead.id
      }

      const payload: Record<string, any> = {
        lead_id: leadId,
        name,
        email,
        phone,
        type: selectedType === 'consultation' ? 'consultation' : 'package',
        package_key: selectedType === 'consultation' ? null : selectedType,
        package_name: selectedType === 'consultation' ? null : PACKAGES[(selectedType as Exclude<PackageKey,'consultation'>)].name,
        price_cents: selectedType === 'consultation' ? null : totalPrice,
        duration_minutes: duration,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        notes: notes + (selectedAddOns.length > 0 ? `\n\nAdd-ons: ${selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ')}` : ''),
        status: 'scheduled'
      }

      const { error: apptErr } = await supabase.from('appointments').insert([payload])
      if (apptErr) throw apptErr

      setSuccess(true)
      setCurrentStep(5)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to book. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const generateCalendarInvite = () => {
    if (!selectedDate || !selectedTime || !name) return
    
    const start = new Date(`${selectedDate}T${selectedTime}:00`)
    const end = addMinutes(start, duration)
    
    const formatICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
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
      `SUMMARY:Studio37 - ${selectedType === 'consultation' ? 'Photography Consultation' : PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].name}`,
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

  const steps = [
    { number: 1, name: 'Package', completed: currentStep > 1 },
    { number: 2, name: 'Details', completed: currentStep > 2 },
    { number: 3, name: 'Date & Time', completed: currentStep > 3 },
    { number: 4, name: 'Review', completed: currentStep > 4 }
  ]

  return (
    <div className="relative min-h-screen flex flex-col">
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
      
      <div className="container mx-auto px-4 py-12 max-w-6xl w-full flex-1 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 text-white drop-shadow-lg">Book Your Session</h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto drop-shadow">
            Start with a free consultation or choose from our photography packages. We'll find the perfect time that works for you.
          </p>
        </div>

        {/* Progress Steps */}
        {!success && (
          <div className="mb-8 bg-white/90 backdrop-blur rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, idx) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.completed ? 'bg-green-500 text-white' : 
                      currentStep === step.number ? 'bg-primary-600 text-white' : 
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {step.completed ? <CheckCircle2 className="h-5 w-5" /> : step.number}
                    </div>
                    <span className="text-xs mt-2 text-gray-700 font-medium">{step.name}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

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
                {selectedType === 'consultation' ? 'Free Consultation' : PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].name}
                <br />
                {new Date(selectedDate + 'T' + selectedTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                {totalPrice > 0 && <><br />Total: ${(totalPrice / 100).toFixed(2)}</>}
              </p>
            </div>
            
            <button
              onClick={generateCalendarInvite}
              className="btn-primary px-6 py-3 mb-4 inline-flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Add to Calendar
            </button>
            
            <p className="text-sm text-gray-500 mb-6">
              Need to make changes? Contact us at <a href="tel:+18325551234" className="text-blue-600 hover:underline">(832) 555-1234</a>
            </p>
            <button 
              onClick={() => {
                setSuccess(false)
                setCurrentStep(1)
                setName('')
                setEmail('')
                setPhone('')
                setNotes('')
                setSelectedDate('')
                setSelectedTime('')
                setSelectedType('consultation')
                setSelectedAddOns([])
              }}
              className="btn-secondary px-6 py-3"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            {/* Honeypot */}
            <input 
              type="text" 
              name="company" 
              value={honeypot} 
              onChange={e => setHoneypot(e.target.value)}
              className="absolute -left-9999px" 
              tabIndex={-1} 
              autoComplete="off"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content - 3 columns */}
              <div className="lg:col-span-3 space-y-6">
                {/* Package Selection */}
                <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Choose Your Package
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedType==='consultation'?'border-primary-500 bg-primary-50 shadow-md':'border-gray-200 hover:border-gray-300 hover:shadow'}`}>
                      <input name="package-type" type="radio" className="mr-2" checked={selectedType==='consultation'} onChange={()=>setSelectedType('consultation')} />
                      <div className="font-semibold text-lg">Free Consultation</div>
                      <div className="text-sm text-gray-600 mt-1">30 minutes</div>
                      <div className="text-xs text-gray-500 mt-2">Perfect for discussing your photography needs</div>
                    </label>
                    {Object.entries(PACKAGES).map(([key, p]) => (
                      <label key={key} className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedType===key?'border-primary-500 bg-primary-50 shadow-md':'border-gray-200 hover:border-gray-300 hover:shadow'}`}>
                        <input name="package-type" type="radio" className="mr-2" checked={selectedType===key} onChange={()=>setSelectedType(key as PackageKey)} />
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{p.name}</div>
                            <div className="text-sm text-gray-600">{p.duration} minutes</div>
                          </div>
                          <div className="text-2xl font-bold text-primary-600">${(p.priceCents/100).toFixed(0)}</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{p.description}</p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Add-ons (only for paid packages) */}
                {selectedType !== 'consultation' && (
                  <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Add Optional Extras</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {ADD_ONS.map(addOn => (
                        <label key={addOn.id} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selectedAddOns.includes(addOn.id) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input
                            type="checkbox"
                            checked={selectedAddOns.includes(addOn.id)}
                            onChange={() => toggleAddOn(addOn.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{addOn.name}</div>
                            <div className="text-xs text-gray-500">{addOn.description}</div>
                          </div>
                          <div className="font-semibold text-primary-600">+${(addOn.priceCents/100).toFixed(0)}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Your Information */}
                <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Your Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <input 
                        name="name" 
                        className={`w-full border rounded-lg px-4 py-2 ${validationErrors.name ? 'border-red-500' : ''}`} 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={e=>setName(e.target.value)} 
                      />
                      {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input 
                        name="email" 
                        className={`w-full border rounded-lg px-4 py-2 ${validationErrors.email ? 'border-red-500' : ''}`} 
                        placeholder="john@example.com" 
                        type="email" 
                        value={email} 
                        onChange={e=>setEmail(e.target.value)} 
                      />
                      {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input 
                        name="phone" 
                        className="w-full border rounded-lg px-4 py-2" 
                        placeholder="(832) 555-1234" 
                        value={phone} 
                        onChange={e=>setPhone(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Special Requests</label>
                      <textarea 
                        name="notes" 
                        className="w-full border rounded-lg px-4 py-2" 
                        placeholder="Any special requirements..." 
                        rows={1}
                        value={notes} 
                        onChange={e=>setNotes(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Pick Date & Time
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium mb-2">Date *</label>
                      <input 
                        id="date" 
                        name="date" 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full border rounded-lg px-4 py-2 ${validationErrors.date ? 'border-red-500' : ''}`} 
                        value={selectedDate} 
                        onChange={(e)=>{setSelectedDate(e.target.value); setSelectedTime('')}} 
                      />
                      {validationErrors.date && <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>}
                      <p className="text-xs text-gray-500 mt-2">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Weekdays: 6-8am, 5:30-9pm • Weekends: 9am-9pm
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Available Times *</label>
                      {loadingSlots ? (
                        <div className="flex items-center text-gray-500 py-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading available slots...
                        </div>
                      ) : !selectedDate ? (
                        <div className="text-gray-500 text-sm py-2">← Select a date to see available times</div>
                      ) : (
                        <div className="flex flex-wrap gap-2 max-h-64 overflow-auto p-2 border rounded-lg bg-gray-50">
                          {slots.length === 0 ? (
                            <div className="text-gray-500 text-sm p-2">
                              No slots available for this date. Try another day or <a href="/contact" className="text-blue-600 underline">contact us</a>.
                            </div>
                          ) : slots.map((t) => (
                            <button 
                              type="button" 
                              key={t} 
                              onClick={()=>setSelectedTime(t)} 
                              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                selectedTime===t
                                  ?'bg-primary-600 text-white border-primary-600 shadow-md'
                                  :'bg-white border-gray-300 hover:border-primary-400 hover:shadow'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                      {validationErrors.time && <p className="text-red-500 text-xs mt-1">{validationErrors.time}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!name || !email || !selectedDate || !selectedTime || submitting}
                    className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Floating Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl p-6 sticky top-4">
                  <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-semibold">
                        {selectedType === 'consultation' ? 'Consultation' : PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{duration} min</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold">{selectedTime}</span>
                      </div>
                    )}
                  </div>

                  {selectedType !== 'consultation' && (
                    <>
                      <div className="border-t pt-3 mb-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Package Price:</span>
                          <span className="font-semibold">${(PACKAGES[selectedType as Exclude<PackageKey, 'consultation'>].priceCents / 100).toFixed(2)}</span>
                        </div>
                        {selectedAddOns.map(id => {
                          const addOn = ADD_ONS.find(a => a.id === id)
                          return addOn ? (
                            <div key={id} className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600 text-xs">{addOn.name}:</span>
                              <span className="text-sm">${(addOn.priceCents / 100).toFixed(2)}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-primary-600">${(totalPrice / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedType === 'consultation' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                      <p className="text-sm text-green-800 font-medium">✓ Free Consultation</p>
                      <p className="text-xs text-green-700 mt-1">No payment required</p>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t text-xs text-gray-500 space-y-2">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>Confirmation sent to your email</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>Studio37, Pinehurst, TX</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>(832) 555-1234</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-200 mt-6 drop-shadow">
              Need a date not shown? <a href="/contact" className="text-white underline font-medium">Contact us</a> to schedule a custom time.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
