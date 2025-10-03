import React from 'react'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import Services from '@/components/Services'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import Testimonials from '@/components/Testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Gallery />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Capture Your Story?</h2>
            <p className="text-lg text-gray-600">
              Let's discuss your photography needs and create something beautiful together.
            </p>
          </div>
          <LeadCaptureForm />
        </div>
      </section>
      <Testimonials />
    </>
  )
}
