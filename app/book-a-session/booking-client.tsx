'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

type PackageKey = 'consultation' | 'mini_reel' | 'full_episode' | 'movie_premier'

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

export default function BookSessionPage() {
  const [selectedType, setSelectedType] = useState<PackageKey>('consultation')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [existingForDay, setExistingForDay] = useState<{ start_time: string; end_time: string; status: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const duration = useMemo(() => {
    if (selectedType === 'consultation') return CONSULTATION_DURATION
    const key = selectedType as Exclude<PackageKey, 'consultation'>
    return PACKAGES[key].duration
  }, [selectedType])

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
  price_cents: selectedType === 'consultation' ? null : PACKAGES[(selectedType as Exclude<PackageKey,'consultation'>)].priceCents,
        duration_minutes: duration,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        notes,
        status: 'scheduled'
      }

      const { error: apptErr } = await supabase.from('appointments').insert([payload])
      if (apptErr) throw apptErr

      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to book. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Fetch booking background image URL from settings
  const [bgUrl, setBgUrl] = useState<string>('https://images.unsplash.com/photo-1423666639041-f56000c27a9a')
  useEffect(() => {
    const fetchBg = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('book_session_bg_url').single()
        if (!error && data?.book_session_bg_url) {
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
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            aria-hidden="true"
            role="presentation"
          />
      </div>
      <div className="container mx-auto px-4 py-12 max-w-5xl w-full flex-1 relative z-10">
        <h1 className="text-4xl font-bold mb-2">Book a Session</h1>
        <p className="text-gray-600 mb-8">Choose a consultation or one of our packages and pick a time that works for you.</p>

        {success ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">You're booked!</h2>
            <p className="text-gray-600">We just saved your appointment. You’ll receive a confirmation email shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Package selector */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">Select type</h3>
                <div className="space-y-2">
                  <label className={`block border rounded p-3 cursor-pointer ${selectedType==='consultation'?'border-primary-500 bg-primary-50':'hover:bg-gray-50'}`}>
                    <input name="package-type" type="radio" className="mr-2" checked={selectedType==='consultation'} onChange={()=>setSelectedType('consultation')} />
                    Consultation (30 min)
                  </label>
                  {Object.entries(PACKAGES).map(([key, p]) => (
                    <label key={key} className={`block border rounded p-3 cursor-pointer ${selectedType===key?'border-primary-500 bg-primary-50':'hover:bg-gray-50'}`}>
                      <input name="package-type" type="radio" className="mr-2" checked={selectedType===key} onChange={()=>setSelectedType(key as PackageKey)} />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-sm text-gray-500">{p.duration} min</div>
                        </div>
                        <div className="font-semibold">${(p.priceCents/100).toFixed(0)}</div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                    </label>
                  ))}
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
