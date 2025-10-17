import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generateSEOMetadata } from '@/lib/seo-helpers'
import { generateEnhancedLocalBusinessSchema, generateBreadcrumbSchema } from '@/lib/enhanced-seo-schemas'
import { MapPin, Star, Users, Camera, Award, CheckCircle } from 'lucide-react'
import FAQSection from '@/components/FAQSection'
import GoogleBusinessWidget from '@/components/GoogleBusinessWidget'

export const metadata = generateSEOMetadata({
  title: 'Professional Photographer Pinehurst TX - Studio37 Photography Montgomery County',
  description: 'Top-rated photographer in Pinehurst, Texas serving Montgomery County. Wedding, portrait, event & commercial photography. 5-star reviews, local expertise since 2020.',
  keywords: [
    'photographer Pinehurst TX',
    'photography Pinehurst Texas',
    'wedding photographer Montgomery County',
    'family photographer The Woodlands',
    'professional photographer near me',
    'Pinehurst photography studio',
    'Montgomery County photographer',
    'Texas photography services',
    'local photographer Pinehurst',
    'portrait photographer Texas'
  ],
  canonicalUrl: 'https://studio37.cc/local-photographer-pinehurst-tx',
  pageType: 'service'
})

export default function LocalPhotographerPage() {
  const localBusinessSchema = generateEnhancedLocalBusinessSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://studio37.cc' },
    { name: 'Local Photographer Pinehurst TX', url: 'https://studio37.cc/local-photographer-pinehurst-tx' }
  ])

  return (
    <div className="pt-16">
      {/* Enhanced Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1554048612-b6a482b224b0?w=1200&h=600&fit=crop"
            alt="Professional photographer in Pinehurst TX"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-300" />
              <span className="text-blue-200">Proudly serving Pinehurst, TX & Montgomery County</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              #1 Photographer in Pinehurst, Texas
            </h1>
            <p className="text-xl mb-6 text-gray-200">
              Award-winning photography studio serving Montgomery County since 2020. 
              Specializing in weddings, portraits, events, and commercial photography 
              with over 500 happy clients and 4.9-star reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
              >
                Book Your Session Today
              </Link>
              <Link 
                href="/gallery" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
              >
                View Our Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Local Credibility Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pinehurst's Most Trusted Photography Studio</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Located in the heart of Pinehurst, Texas, Studio37 has become Montgomery County's 
              go-to photography studio for life's most important moments.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">4.9★</h3>
              <p className="text-gray-600">Average Rating</p>
              <p className="text-sm text-gray-500">From 47+ Reviews</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">500+</h3>
              <p className="text-gray-600">Happy Clients</p>
              <p className="text-sm text-gray-500">Since 2020</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">1000+</h3>
              <p className="text-gray-600">Sessions Completed</p>
              <p className="text-sm text-gray-500">All Types</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-amber-600 mb-2">2024</h3>
              <p className="text-gray-600">Best Photographer</p>
              <p className="text-sm text-gray-500">Montgomery County</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6">Why Pinehurst Families Choose Studio37</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Local Expertise & Knowledge</h4>
                    <p className="text-gray-600">
                      As Pinehurst residents, we know the best locations, lighting, and timing for stunning photos 
                      throughout Montgomery County. From The Woodlands to Spring, we've captured memories at every venue.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Community-Focused Service</h4>
                    <p className="text-gray-600">
                      We're not just your photographers - we're your neighbors. Our commitment to the Pinehurst 
                      community shows in our personalized service and long-lasting client relationships.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Flexible & Convenient</h4>
                    <p className="text-gray-600">
                      Located centrally in Pinehurst, we're easily accessible to clients throughout Montgomery County. 
                      We offer flexible scheduling and can travel to your preferred locations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Professional Equipment & Expertise</h4>
                    <p className="text-gray-600">
                      State-of-the-art camera equipment, professional lighting, and years of experience ensure 
                      your photos are crisp, beautiful, and professionally edited.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <GoogleBusinessWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Areas We Serve Throughout Montgomery County</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional photography services delivered to your location across Texas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { city: 'Pinehurst, TX', description: 'Our home base - same-day availability' },
              { city: 'The Woodlands, TX', description: 'Premium venue photography specialist' },
              { city: 'Montgomery, TX', description: 'Historic venue & outdoor photography' },
              { city: 'Spring, TX', description: 'Family & portrait photography hub' },
              { city: 'Tomball, TX', description: 'Wedding & event photography' },
              { city: 'Magnolia, TX', description: 'Rustic & outdoor session specialist' },
              { city: 'Conroe, TX', description: 'Corporate & commercial photography' },
              { city: 'Houston, TX', description: 'Extended service area coverage' }
            ].map((area) => (
              <div key={area.city} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="font-semibold text-gray-800 mb-2">{area.city}</h3>
                <p className="text-sm text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Don't see your city? We travel throughout Texas for special events and sessions.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              Contact us about your location →
            </Link>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Photography Specialties in Pinehurst, TX</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive photography services for every important moment in your life
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link 
              href="/services/wedding-photography" 
              className="group text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
                <span className="text-3xl">💍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wedding Photography</h3>
              <p className="text-gray-600 mb-4">
                Romantic wedding photography at Montgomery County's most beautiful venues.
              </p>
              <span className="text-rose-600 group-hover:text-rose-700 font-medium">
                Learn More →
              </span>
            </Link>

            <Link 
              href="/services/portrait-photography" 
              className="group text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Family Portraits</h3>
              <p className="text-gray-600 mb-4">
                Beautiful family portraits that capture your unique bonds and personalities.
              </p>
              <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                Learn More →
              </span>
            </Link>

            <Link 
              href="/services/event-photography" 
              className="group text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Photography</h3>
              <p className="text-gray-600 mb-4">
                Professional coverage of corporate events, parties, and celebrations.
              </p>
              <span className="text-green-600 group-hover:text-green-700 font-medium">
                Learn More →
              </span>
            </Link>

            <Link 
              href="/services/commercial-photography" 
              className="group text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <span className="text-3xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Business Photography</h3>
              <p className="text-gray-600 mb-4">
                Professional headshots, product photography, and commercial branding.
              </p>
              <span className="text-purple-600 group-hover:text-purple-700 font-medium">
                Learn More →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section for Local SEO */}
      <FAQSection
        title="Frequently Asked Questions - Pinehurst Photographer"
        faqs={[
          {
            question: "What makes Studio37 the best photographer in Pinehurst, TX?",
            answer: "Studio37 combines local expertise, professional equipment, and personalized service. As Pinehurst residents, we know the area intimately and have built strong relationships with venues throughout Montgomery County. Our 4.9-star rating and 500+ happy clients speak to our commitment to excellence."
          },
          {
            question: "Do you travel outside of Pinehurst for photography sessions?",
            answer: "Absolutely! We regularly serve clients throughout Montgomery County including The Woodlands, Spring, Tomball, Magnolia, and Conroe. We also travel to Houston and surrounding areas for weddings and special events. Travel fees may apply for locations over 50 miles from Pinehurst."
          },
          {
            question: "How far in advance should I book my photography session?",
            answer: "For wedding photography, we recommend booking 6-12 months in advance. Portrait sessions can typically be scheduled 2-4 weeks out. Corporate and commercial photography can often be accommodated within 1-2 weeks. Peak seasons (spring and fall) fill up faster."
          },
          {
            question: "What are your photography session rates in Pinehurst?",
            answer: "Our pricing varies by session type and duration. Portrait sessions start at $200, event photography at $400, wedding packages from $1,500, and commercial photography from $500. We offer detailed pricing information during consultations and can customize packages to fit your needs and budget."
          },
          {
            question: "Do you offer same-day photo editing and delivery?",
            answer: "While we don't offer same-day delivery as standard, we can accommodate rush orders for an additional fee. Typical delivery times are 1 week for portraits, 2 weeks for events, and 2-3 weeks for weddings. All photos include professional editing and color correction."
          },
          {
            question: "Can you recommend the best photography locations in Montgomery County?",
            answer: "Absolutely! As local experts, we know the best spots for every type of session. Popular locations include The Woodlands Waterway, Spring Creek Park, downtown Montgomery historic district, and numerous private venues. We'll help choose the perfect location based on your style preferences and session type."
          }
        ]}
      />

      {/* Local CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work with Pinehurst's Top Photographer?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients throughout Montgomery County who trust Studio37 
            for their most important photography needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule Your Consultation
            </Link>
            <Link 
              href="/gallery" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              View Our Portfolio
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-200">
            <MapPin className="h-5 w-5" />
            <span>1701 Goodson Loop Unit 80, Pinehurst, TX 77362 | (832) 713-9944</span>
          </div>
        </div>
      </section>
    </div>
  )
}