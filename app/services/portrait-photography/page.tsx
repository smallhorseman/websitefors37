import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generateSEOMetadata } from '@/lib/seo-helpers'
import { generateServiceSchema } from '@/lib/seo-config'
import PortraitHighlightGallery from '@/components/PortraitHighlightGallery'
import { Users, Camera, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react'
import PricingCalculator from '@/components/PricingCalculator'

export const metadata = generateSEOMetadata({
  title: 'Portrait Photography Pinehurst TX - Professional Portrait Sessions Studio37',
  description: 'Professional portrait photography in Pinehurst, Texas. Family portraits, senior photos, headshots, and maternity sessions. Serving Montgomery County, The Woodlands, and Houston area.',
  keywords: [
    'portrait photography Pinehurst TX',
    'family photographer Texas',
    'senior portraits Montgomery County',
    'headshots The Woodlands',
    'maternity photography Pinehurst',
    'family photos Texas',
    'professional portraits Montgomery County',
    'portrait photographer Houston area'
  ],
  canonicalUrl: 'https://studio37.cc/services/portrait-photography',
  pageType: 'service'
})

// Static marketing page; revalidate daily
export const revalidate = 86400

export default function PortraitPhotographyPage() {
  const serviceSchema = generateServiceSchema(
    'Portrait Photography',
    'Professional portrait photography services in Pinehurst, Texas. Specializing in family portraits, senior photos, headshots, and maternity sessions.'
  )

  return (
    <div className="pt-16">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&h=600&fit=crop"
            alt="Portrait photography by Studio37 in Pinehurst TX"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Portrait Photography in Pinehurst, TX</h1>
            <p className="text-xl mb-6">
              Capture life's precious moments with professional portrait photography. 
              From family sessions to senior portraits, we create timeless images you'll treasure forever.
            </p>
            <Link 
              href="/contact" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Book Your Session <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Portrait Types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Portrait Photography Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional portrait sessions tailored to capture your unique personality and special moments
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/family-photography" className="group text-center rounded-lg p-4 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-700">Family Portraits</h3>
              <p className="text-gray-600">
                Beautiful family photos that capture your bonds and create lasting memories for generations.
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 group-hover:underline">View Family Photography <ArrowRight className="h-4 w-4" /></span>
            </Link>
            
            <Link href="/senior-portraits" className="group text-center rounded-lg p-4 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-700">Senior Portraits</h3>
              <p className="text-gray-600">
                Celebrate this milestone with stunning senior portraits that showcase personality and style.
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 group-hover:underline">View Senior Portraits <ArrowRight className="h-4 w-4" /></span>
            </Link>
            
            <Link href="/professional-headshots" className="group text-center rounded-lg p-4 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Camera className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-700">Professional Headshots</h3>
              <p className="text-gray-600">
                Make a great first impression with professional headshots for business and personal use.
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 group-hover:underline">View Headshot Info <ArrowRight className="h-4 w-4" /></span>
            </Link>
            
            <Link href="/maternity-sessions" className="group text-center rounded-lg p-4 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-700">Maternity Sessions</h3>
              <p className="text-gray-600">
                Capture the beauty and excitement of expecting with elegant maternity photography.
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 group-hover:underline">View Maternity Sessions <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop"
                alt="Family portrait session in Montgomery County TX"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Studio37 for Portraits?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Located in Pinehurst, Texas, we understand what makes Montgomery County families special. 
                Our portrait sessions are relaxed, fun, and focused on capturing authentic moments.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Relaxed, Natural Sessions</h3>
                    <p className="text-gray-600">We create a comfortable environment for authentic expressions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Multiple Location Options</h3>
                    <p className="text-gray-600">Studio, outdoor, or in-home sessions available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Quick Turnaround</h3>
                    <p className="text-gray-600">Receive your gallery within 2 weeks of your session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Professional Editing</h3>
                    <p className="text-gray-600">Every image is professionally edited for the best results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portrait Highlight Gallery */}
      <PortraitHighlightGallery />

      {/* Service Areas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Portrait Photography Service Areas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide portrait photography services throughout Montgomery County and surrounding Texas areas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Pinehurst, TX',
              'The Woodlands, TX', 
              'Montgomery, TX',
              'Spring, TX',
              'Tomball, TX',
              'Magnolia, TX',
              'Conroe, TX',
              'Houston, TX'
            ].map((area) => (
              <div key={area} className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
                <h3 className="font-semibold text-gray-800">{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Portrait Photography Packages</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect portrait session package in Pinehurst, TX
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Mini Session</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$200</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>30 minute session</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>15+ edited photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Digital gallery</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-secondary w-full text-center block">
                Book Mini Session
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-primary-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4">Standard Session</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$350</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>60 minute session</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>30+ edited photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Multiple outfits/looks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Digital gallery</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-primary w-full text-center block">
                Book Standard Session
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Extended Session</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$500</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>90 minute session</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>50+ edited photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Multiple locations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Print release included</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-secondary w-full text-center block">
                Book Extended Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Not sure which option is best?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Use our instant calculator to compare custom hourly pricing against our portrait packages. For example, the Standard Session at $350 is a $25 savings vs. $375/hr.
            </p>
          </div>
          <PricingCalculator className="max-w-5xl mx-auto" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Portrait Session?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's create beautiful portraits that capture your unique personality and special moments. 
            Serving families throughout Pinehurst, Montgomery County, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule Your Session
            </Link>
            <Link 
              href="/gallery" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              View Portrait Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}