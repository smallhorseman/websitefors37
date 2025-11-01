'use client'

import React from 'react'

type Testimonial = {
  quote: string
  author?: string
  subtext?: string
  avatar?: string
}

export default function TestimonialsClient({ testimonials = [] as Testimonial[] }) {
  const [idx, setIdx] = React.useState(0)
  const count = testimonials.length

  React.useEffect(() => {
    if (count < 2) return
    const id = setInterval(() => setIdx((i) => (i + 1) % count), 5000)
    return () => clearInterval(id)
  }, [count])

  if (!count) return null

  const t = testimonials[idx]
  return (
    <div className="max-w-3xl mx-auto text-center">
      {t.avatar && (
        <img src={t.avatar} alt={t.author || 'Client'} className="mx-auto h-16 w-16 rounded-full object-cover mb-4" />
      )}
      <blockquote className="text-xl italic text-gray-800">“{t.quote}”</blockquote>
      {(t.author || t.subtext) && (
        <div className="mt-3 text-gray-600">
          {t.author && <div className="font-medium">{t.author}</div>}
          {t.subtext && <div className="text-sm opacity-80">{t.subtext}</div>}
        </div>
      )}
      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-primary-600' : 'bg-gray-300'}`} aria-label={`Show testimonial ${i+1}`} />
          ))}
        </div>
      )}
    </div>
  )
}
