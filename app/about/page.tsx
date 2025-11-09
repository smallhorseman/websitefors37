import React from "react"
import Image from "next/image"
import Link from "next/link"
import { generateSEOMetadata } from '@/lib/seo-helpers'
import BTSFeed from '@/components/BTSFeed'
import { optimizeCloudinaryUrl } from '@/lib/cloudinaryOptimizer'

export const metadata = generateSEOMetadata({
  title: 'About Studio37 - Christian & Caitie Photography Team in Pinehurst, TX',
  description: 'Meet Christian and Caitie, the award-winning photography team behind Studio37 in Pinehurst, Texas. Serving Montgomery County with personalized sessions and artistic excellence.',
  keywords: [
    'about Studio37',
    'Christian photographer Pinehurst TX',
    'Caitie photographer Texas',
    'photography team Montgomery County',
    'professional photographer Pinehurst',
    'award winning photographer Texas'
  ],
  canonicalUrl: 'https://studio37.cc/about'
})

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-blue-900 text-white py-20">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg", 1920, 'auto:low')}
            alt="Studio37 Photography workspace"
            fill
            className="object-cover"
            priority
            quality={70}
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Studio37 Photography</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Meet the passionate photographers behind Pinehurst's premier photography studio, 
            capturing life's most precious moments throughout Montgomery County.
          </p>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Your Photography Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Christian and Caitie bring together years of experience, artistic vision, and genuine passion 
              for storytelling through photography.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Christian */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-80 h-80 mx-auto rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src={optimizeCloudinaryUrl("https://res.cloudinary.com/dmjxho2rl/image/upload/v1758315615/_MG_9234_aerdni_e_gen_restore_e_improve_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.36_o_80_fl_layer_apply_g_west_x_0.03_y_0.04_bmly4s.jpg", 640, 'auto:low')}
                    alt="Christian - CEO, Marketing Lead, Producer and Photographer at Studio37"
                    width={320}
                    height={320}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    quality={75}
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold">
                  Lead Photographer
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Christian</h3>
              <p className="text-blue-600 font-semibold mb-4">
                CEO, Marketing Lead, Producer & Photographer
              </p>
              <div className="bg-gray-50 p-6 rounded-lg text-left">
                <p className="text-gray-700 mb-4">
                  Christian brings a unique blend of business acumen and artistic vision to Studio37. 
                  As CEO and lead photographer, he's passionate about creating not just beautiful images, 
                  but meaningful experiences for every client.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Specializes in wedding and commercial photography</li>
                  <li>• 5+ years professional experience</li>
                  <li>• Expert in client relations and project management</li>
                </ul>
              </div>
            </div>

            {/* Caitie */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-80 h-80 mx-auto rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src={optimizeCloudinaryUrl("https://res.cloudinary.com/dmjxho2rl/image/upload/v1758315656/IMG_6580_axayxe_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.36_o_80_fl_layer_apply_g_west_x_0.03_y_0.04_nkjfev.jpg", 640, 'auto:low')}
                    alt="Caitie - Co-Owner, Photographer and Editor at Studio37"
                    width={320}
                    height={320}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    quality={75}
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-full font-semibold">
                  Creative Director
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Caitie</h3>
              <p className="text-purple-600 font-semibold mb-4">
                Co-Owner, Photographer & Editor
              </p>
              <div className="bg-gray-50 p-6 rounded-lg text-left">
                <p className="text-gray-700 mb-4">
                  Caitie's artistic eye and attention to detail ensure every image tells a perfect story. 
                  As co-owner and lead editor, she brings creativity and technical excellence to every project.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Specializes in portraits and family photography</li>
                  <li>• Expert photo editor and post-production artist</li>
                  <li>• Creative vision and artistic direction</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-gray-600">
                How Studio37 became Pinehurst's most trusted photography studio
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-blue-600">Founded on Passion</h3>
                <p className="text-gray-700 mb-6">
                  Studio37 Photography was born from Christian and Caitie's shared passion for capturing 
                  life's most meaningful moments. What started as a creative outlet quickly grew into 
                  Pinehurst's premier photography studio.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-blue-600">Local Roots, Personal Touch</h3>
                <p className="text-gray-700 mb-6">
                  As Pinehurst residents, we understand the unique beauty of Montgomery County. 
                  We're not just your photographers – we're your neighbors, invested in capturing 
                  your story with the care and attention it deserves.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>500+ happy clients served</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>4.9-star average rating</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Award-winning photography team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Serving Montgomery County since 2020</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Dynamic BTS Feed Component */}
                <BTSFeed />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work with Studio37?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss your photography needs and create beautiful memories together. 
            Christian and Caitie are excited to capture your story!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get In Touch
            </Link>
            <Link 
              href="/gallery" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}