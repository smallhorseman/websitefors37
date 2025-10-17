import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generateSEOMetadata } from '@/lib/seo-helpers'
import { generateServiceSchema } from '@/lib/seo-config'
import { Building2, Camera, Users, Briefcase, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata = generateSEOMetadata({
  title: 'Commercial Photography Pinehurst TX - Business Photography Studio37',
  description: 'Professional commercial photography in Pinehurst, Texas. Product photography, headshots, corporate branding, and business marketing photos. Serving Montgomery County, The Woodlands, and Houston.',
  keywords: [
    'commercial photography Pinehurst TX',
    'business photographer Texas',
    'product photography Montgomery County',
    'corporate headshots The Woodlands',
    'marketing photography Pinehurst',
    'business photography Texas',
    'professional commercial photography Montgomery County',
    'brand photography Houston area'
  ],
  canonicalUrl: 'https://studio37.cc/services/commercial-photography'
})

export default function CommercialPhotographyPage() {
  const serviceSchema = generateServiceSchema(
    'Commercial Photography',
    'Professional commercial photography services in Pinehurst, Texas. Specializing in product photography, corporate headshots, and business marketing imagery.'
  )

  return (
    <div className="pt-16">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-blue-900">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=600&fit=crop"
            alt="Commercial photography by Studio37 in Pinehurst TX"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Commercial Photography in Pinehurst, TX</h1>
            <p className="text-xl mb-6">
              Elevate your business with professional commercial photography. 
              From product shots to corporate headshots, we help your brand shine.
            </p>
            <Link 
              href="/contact" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Commercial Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Commercial Photography Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional photography solutions to showcase your business, products, and team
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Product Photography</h3>
              <p className="text-gray-600">
                High-quality product images for catalogs, websites, and marketing materials.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Corporate Headshots</h3>
              <p className="text-gray-600">
                Professional headshots for executives, teams, and company directories.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Architectural Photography</h3>
              <p className="text-gray-600">
                Showcase buildings, interiors, and commercial spaces professionally.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Brand Photography</h3>
              <p className="text-gray-600">
                Custom brand imagery for marketing campaigns and brand identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commercial photography expertise spans across various industries in Montgomery County
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Technology Companies',
              'Healthcare & Medical',
              'Real Estate',
              'Restaurants & Food',
              'Manufacturing',
              'Professional Services',
              'Retail & E-commerce',
              'Construction',
              'Financial Services'
            ].map((industry) => (
              <div key={industry} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="font-semibold text-gray-800">{industry}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop"
                alt="Professional business photography in Montgomery County TX"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Studio37 for Commercial Photography?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Located in Pinehurst, Texas, we understand the unique needs of Montgomery County businesses. 
                Our commercial photography helps you stand out in competitive markets.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Brand-Focused Approach</h3>
                    <p className="text-gray-600">We understand your brand and create images that align with your identity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">High-End Equipment</h3>
                    <p className="text-gray-600">Professional studio lighting and camera equipment for perfect results</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Flexible Scheduling</h3>
                    <p className="text-gray-600">On-location or studio sessions that work with your business schedule</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Commercial Usage Rights</h3>
                    <p className="text-gray-600">Full rights to use images across all your marketing channels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Commercial Photography Service Areas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide commercial photography services throughout Montgomery County and surrounding Texas areas
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
              <div key={area} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="font-semibold text-gray-800">{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Commercial Photography Packages</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional commercial photography solutions for businesses in Pinehurst, TX
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Starter Package</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$500</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>2 hour session</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>20+ edited images</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>High-resolution files</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Commercial usage rights</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-secondary w-full text-center block">
                Choose Starter
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-primary-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4">Professional Package</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$1,000</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>4 hour session</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>50+ edited images</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Multiple setups/locations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Brand consultation</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-primary w-full text-center block">
                Choose Professional
              </Link>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Enterprise Package</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$2,000</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Full day coverage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>100+ edited images</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Multiple photographers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Ongoing brand support</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-secondary w-full text-center block">
                Choose Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-gray-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Business Photography?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss your commercial photography needs and create compelling visuals that drive results. 
            Serving businesses throughout Pinehurst, Montgomery County, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Commercial Quote
            </Link>
            <Link 
              href="/gallery" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              View Commercial Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}