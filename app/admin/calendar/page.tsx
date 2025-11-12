'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Appointment {
  id: string
  client_name: string
  client_email?: string
  client_phone?: string
  appointment_date: string
  appointment_time?: string
  session_type: string
  location?: string
  status: string
  notes?: string
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const fetchAppointments = async (date: Date) => {
    setLoading(true)
    try {
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const res = await fetch(`/api/admin/appointments-calendar?month=${month}`)
      const data = await res.json()
      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (e) {
      console.error('Failed to load appointments:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments(currentDate)
  }, [currentDate])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Array<{ date: number; isCurrentMonth: boolean; fullDate: Date }> = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i)
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      })
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      })
    }

    return days
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date).toISOString().split('T')[0]
      return aptDate === dateStr
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleAddAppointment = (date: Date) => {
    setSelectedDate(date)
    setShowAddModal(true)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-700 border-green-300',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      completed: 'bg-blue-100 text-blue-700 border-blue-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
      rescheduled: 'bg-purple-100 text-purple-700 border-purple-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-blue-600 hover:underline text-sm">← Back to Admin</Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Calendar</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
            >
              Today
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Previous month"
              >
                ←
              </button>
              <span className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
                {monthName}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Next month"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading calendar...</p>
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b bg-gray-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-sm font-semibold text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const dateStr = day.fullDate.toISOString().split('T')[0]
                const isToday = dateStr === todayStr
                const dayAppointments = getAppointmentsForDate(day.fullDate)

                return (
                  <div
                    key={idx}
                    className={`min-h-[120px] border-r border-b p-2 ${
                      !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                    } ${isToday ? 'bg-blue-50' : ''} hover:bg-gray-50 transition`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-sm font-medium ${
                          !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'
                        } ${isToday ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}
                      >
                        {day.date}
                      </span>
                      {day.isCurrentMonth && (
                        <button
                          onClick={() => handleAddAppointment(day.fullDate)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          title="Add appointment"
                        >
                          +
                        </button>
                      )}
                    </div>

                    {/* Appointments for this day */}
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map(apt => (
                        <div
                          key={apt.id}
                          className={`text-xs p-1.5 rounded border ${getStatusColor(apt.status)} cursor-pointer hover:shadow-sm transition`}
                          title={`${apt.client_name} - ${apt.session_type}\n${apt.appointment_time || 'No time set'}`}
                        >
                          <div className="font-medium truncate">{apt.appointment_time || 'TBD'}</div>
                          <div className="truncate">{apt.client_name}</div>
                          <div className="truncate text-[10px] opacity-75">{apt.session_type}</div>
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-500 font-medium pl-1">
                          +{dayAppointments.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Add Modal */}
        {showAddModal && selectedDate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Add Appointment - {selectedDate.toLocaleDateString()}
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  try {
                    const res = await fetch('/api/admin/appointments-calendar', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        client_name: formData.get('client_name'),
                        client_email: formData.get('client_email'),
                        client_phone: formData.get('client_phone'),
                        appointment_date: selectedDate.toISOString().split('T')[0],
                        appointment_time: formData.get('appointment_time'),
                        session_type: formData.get('session_type'),
                        location: formData.get('location'),
                        notes: formData.get('notes'),
                        status: 'confirmed'
                      })
                    })
                    const data = await res.json()
                    if (data.success) {
                      setShowAddModal(false)
                      fetchAppointments(currentDate)
                    } else {
                      alert('Failed to create appointment: ' + data.error)
                    }
                  } catch (error) {
                    alert('Error creating appointment')
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    name="client_name"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="client_email"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="client_phone"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    name="appointment_time"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Type *</label>
                  <select
                    name="session_type"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Event">Event</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Headshots">Headshots</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="Studio37 or custom location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    Create Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
