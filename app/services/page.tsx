import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Services from '@/components/Services'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Professional Photography Services | Studio 37 Photography',
  description: 'Explore our full range of professional photography services including weddings, portraits, commercial photography and special events.',
}

export default function ServicesPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 opacity-30">
          <Image 
            src="https://images.unsplash.com/photo-1552334405-4929f2ed861e" 
            alt="Photography equipment"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Photography Services</h1>
            <p className="text-xl text-gray-200 mb-8">
              Capturing life's most precious moments with artistic excellence and professional craftsmanship.
            </p>
            <Link 
              href="#services" 
              className="btn-primary inline-flex items-center text-lg px-6 py-3"
            >
              Explore Our Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Services Component */}
      <div id="services">
        <Services />
      </div>

      {/* Additional Services Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Process</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary-600">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Initial Consultation</h3>
                    <p className="text-gray-600">
                      We start by understanding your vision, preferences, and requirements. This helps us tailor our services to your specific needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary-600">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Planning & Preparation</h3>
                    <p className="text-gray-600">
                      We plan every detail, from location scouting to lighting setups, ensuring everything is perfect for your shoot.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary-600">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Photography Session</h3>
                    <p className="text-gray-600">
                      Our professional photographers work their magic, capturing stunning images that tell your unique story.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary-600">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Post-Production & Delivery</h3>
                    <p className="text-gray-600">
                      Your images are carefully edited and delivered in your preferred format, ready to be cherished for years to come.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Studio 37</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium">Professional Expertise</h3>
                    <p className="text-gray-600">Our photographers bring years of experience and technical knowledge to every project.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium">Customized Approach</h3>
                    <p className="text-gray-600">We tailor our services to match your unique vision and requirements.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium">State-of-the-Art Equipment</h3>
                    <p className="text-gray-600">We use the latest photography technology to deliver exceptional image quality.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium">Attention to Detail</h3>
                    <p className="text-gray-600">We focus on capturing those small, special moments that others might miss.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium">Quick Turnaround</h3>
                    <p className="text-gray-600">We understand the excitement of seeing your photos, so we work efficiently without sacrificing quality.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium">Customer Satisfaction</h3>
                    <p className="text-gray-600">Your happiness is our priority, and we work with you until you're completely satisfied.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Session?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Contact us today to discuss your photography needs and schedule a consultation with our professional team.
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium inline-flex items-center text-lg"
          >
            Contact Us
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
