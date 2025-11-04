import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generateSEOMetadata, generateFAQSchema } from '@/lib/seo-helpers'
import { generateServiceSchema } from '@/lib/seo-config'
import { Heart, Camera, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react'
import FAQSection from '@/components/FAQSection'

export const metadata = generateSEOMetadata({
  title: 'Wedding Photography Pinehurst TX - Studio37 Professional Wedding Photographer',
  description: 'Studio37 offers professional wedding photography services in Pinehurst, Texas and surrounding areas. Capturing your special day with romantic, timeless images. Serving Montgomery County, The Woodlands, and Houston.',
  keywords: [
    'wedding photography Pinehurst TX',
    'wedding photographer Texas',
    'Montgomery County wedding photography',
    'The Woodlands wedding photographer',
    'Houston wedding photography',
    'bridal photography Texas',
    'engagement photography Pinehurst',
    'wedding photos Montgomery County'
  ],
  canonicalUrl: 'https://studio37.cc/services/wedding-photography',
  pageType: 'service'
})

// Static marketing page; revalidate daily
export const revalidate = 86400

const weddingFAQs = [
  {
    question: "How far in advance should I book my wedding photographer in Pinehurst, TX?",
    answer: "We recommend booking your wedding photographer 6-12 months in advance, especially for popular wedding dates in Montgomery County. Spring and fall wedding seasons book up quickly in the Pinehurst and The Woodlands area."
  },
  {
    question: "Do you travel to wedding venues outside of Pinehurst?",
    answer: "Yes! We regularly photograph weddings throughout Montgomery County, including The Woodlands, Spring, Magnolia, and Conroe. We also travel to Houston area venues. Travel fees may apply for venues more than 50 miles from Pinehurst."
  },
  {
    question: "What's included in your wedding photography packages?",
    answer: "All packages include professional editing, high-resolution digital gallery, and personal usage rights. Our Complete and Premium packages also include engagement sessions, and the Premium package includes a wedding album. We can customize packages to fit your specific needs."
  },
  {
    question: "How many photos will we receive from our wedding?",
    answer: "Photo counts vary by package and wedding length, but typically range from 50+ photos for our Essential package to 300+ for Premium coverage. We deliver all the best moments from your day, professionally edited and gallery-ready."
  },
  {
    question: "Do you offer engagement sessions in Montgomery County?",
    answer: "Absolutely! Engagement sessions are included in our Complete and Premium packages, or can be booked separately. We know all the best locations in Pinehurst, The Woodlands, and surrounding areas for beautiful engagement photos."
  },
  {
    question: "What happens if there's bad weather on our wedding day?",
    answer: "As experienced Texas wedding photographers, we're prepared for all weather conditions. We bring lighting equipment for indoor ceremonies and have backup plans for outdoor events. Rain often creates unique and romantic photo opportunities!"
  },
  {
    question: "Can we see full wedding galleries from your previous work?",
    answer: "Yes! We'd be happy to share complete wedding galleries during your consultation so you can see our full documentation style and editing approach. This helps ensure we're the right fit for your vision."
  },
  {
    question: "Do you photograph both the ceremony and reception?",
    answer: "Our Standard and Premium packages include full day coverage from getting ready through reception. We capture all the important moments including ceremony, family photos, couple portraits, and reception festivities including your first dance and cake cutting."
  }
]

export default function WeddingPhotographyPage() {
  const serviceSchema = generateServiceSchema(
    'Wedding Photography',
    'Professional wedding photography services in Pinehurst, Texas. Capturing your special day with romantic and timeless images that tell your love story.'
  )

  const faqSchema = generateFAQSchema(weddingFAQs)

  return (
    <div className="pt-16">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-rose-900 to-amber-900">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=600&fit=crop"
            alt="Wedding photography by Studio37 in Pinehurst TX"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Wedding Photography in Pinehurst, TX</h1>
            <p className="text-xl mb-6">
              Your love story deserves to be captured beautifully. Studio37 specializes in romantic, 
              timeless wedding photography throughout Montgomery County and surrounding areas.
            </p>
            <Link 
              href="/contact" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Book Your Wedding <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Studio37 for Your Wedding?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Based in Pinehurst, Texas, we understand the unique beauty of Montgomery County venues 
                and the importance of capturing every precious moment of your special day.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Full Day Coverage</h3>
                    <p className="text-gray-600">From getting ready to the last dance, we capture every moment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Engagement Session Included</h3>
                    <p className="text-gray-600">Get comfortable with us before your big day</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">High-Resolution Digital Gallery</h3>
                    <p className="text-gray-600">All your photos delivered in a beautiful online gallery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Professional Print Options</h3>
                    <p className="text-gray-600">Albums, prints, and canvas options available</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop"
                alt="Wedding ceremony photography in Montgomery County TX"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Wedding Photography Service Areas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide wedding photography services throughout Montgomery County and surrounding Texas areas
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
            <h2 className="text-3xl font-bold mb-4">Wedding Photography Packages</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect package for your special day in Pinehurst, TX
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Essential</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$1,500</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>4 hours coverage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>50+ edited photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Digital gallery</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-secondary w-full text-center block">
                Choose Essential
              </Link>
            </div>
            
            <div className="bg-primary-50 p-8 rounded-lg border-2 border-primary-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4">Complete</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$2,500</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>8 hours coverage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>150+ edited photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Engagement session</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Digital gallery</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-primary w-full text-center block">
                Choose Complete
              </Link>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">$3,500</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Full day coverage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>300+ edited photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Engagement session</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Wedding album</span>
                </li>
              </ul>
              <Link href="/contact" className="btn-secondary w-full text-center block">
                Choose Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Wedding Photography FAQ"
        serviceName="wedding photography"
        faqs={weddingFAQs}
      />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Wedding Photography?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss your special day and create beautiful memories that will last a lifetime. 
            Serving couples throughout Pinehurst, Montgomery County, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Your Quote
            </Link>
            <Link 
              href="/gallery" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              View Our Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}