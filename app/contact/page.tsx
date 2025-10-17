import React from 'react'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import LeadCaptureForm from '@/components/LeadCaptureForm'

// Use server component to fetch settings
async function getSettings() {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.from('settings').select('*').single()
  
  return data || {
    contact_email: 'contact@studio37.cc',
    contact_phone: '',
    business_address: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: ''
  }
}

export const metadata = {
  title: 'Contact Us | Studio 37 Photography',
  description: 'Get in touch with Studio 37 Photography for inquiries, bookings, and consultations. We look forward to capturing your special moments.',
}

export default async function ContactPage() {
  const settings = await getSettings()
  
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* True Full-Page Background Image, fixed and always behind content */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a"
          alt="Contact background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      <div className="container mx-auto px-4 py-24 max-w-3xl w-full flex-1 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Contact Us</h1>
        <p className="text-xl text-gray-200 mb-8">
          Get in touch with our team to discuss your photography needs, book a session, or ask any questions.
        </p>
        {/* Contact Form and Information */}
        <section className="py-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-white">Send Us a Message</h2>
              <LeadCaptureForm />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8 text-white">Contact Information</h2>
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <a href={`mailto:${settings.contact_email}`} className="text-primary-600 hover:underline">
                      {settings.contact_email}
                    </a>
                    <p className="text-gray-200 mt-1">
                      We respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                </div>
                {/* Phone */}
                {settings.contact_phone ? (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Phone</h3>
                      <a href={`tel:${settings.contact_phone}`} className="text-primary-600 hover:underline">
                        {settings.contact_phone}
                      </a>
                      <p className="text-gray-200 mt-1">
                        Available Monday-Friday, 9AM-6PM
                      </p>
                    </div>
                  </div>
                ) : null}
                {/* Address */}
                {settings.business_address ? (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Studio Location</h3>
                      <p className="text-gray-200">
                        {settings.business_address}
                      </p>
                      <p className="text-gray-200 mt-1">
                        Studio visits by appointment only
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How far in advance should I book my photography session?</h3>
              <p className="text-gray-600">
                For wedding photography, we recommend booking 6-12 months in advance. For portrait sessions and other events, 2-4 weeks notice is typically sufficient, but availability may vary during peak seasons.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">What is your payment policy?</h3>
              <p className="text-gray-600">
                We require a 50% deposit to secure your booking date, with the remaining balance due one week before the session or event. For wedding photography, we offer payment plans.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How many photos will I receive?</h3>
              <p className="text-gray-600">
                The number of photos varies by package and session length. Typically, portrait sessions yield 20-40 edited images, while weddings can range from 300-800 photos. We focus on quality over quantity to deliver the best representation of your event.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How long until I receive my photos?</h3>
              <p className="text-gray-600">
                Portrait sessions are typically delivered within 1-2 weeks. Wedding and event photography can take 4-6 weeks due to the higher volume of images and detailed editing process. We'll provide select preview images within days of your session.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Do you travel for photography sessions?</h3>
              <p className="text-gray-600">
                Yes, we travel locally and internationally for photography assignments. Local travel within 30 miles is included in our standard rates. For destinations beyond that, additional travel fees apply.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
