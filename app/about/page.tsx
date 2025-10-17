import React from "react"
import { generateSEOMetadata } from '@/lib/seo-helpers'

export const metadata = generateSEOMetadata({
  title: 'About Studio37 - Professional Photography Team in Pinehurst, TX',
  description: 'Meet the Studio37 photography team based in Pinehurst, Texas. Award-winning photographers serving Montgomery County with personalized sessions and artistic excellence.',
  keywords: [
    'about Studio37',
    'photographer Pinehurst TX',
    'photography team Texas',
    'professional photographer Montgomery County',
    'award winning photographer',
    'Pinehurst photography studio',
    'experienced photographer Texas'
  ],
  canonicalUrl: 'https://studio37.cc/about'
})

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-gray-50 pt-16">
      <div className="relative h-64 w-full mb-12">
        <img
          src="https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg"
          alt="Studio 37 Photography Hero"
          className="object-cover w-full h-full rounded-b-2xl shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold bg-amber-900/70 px-8 py-4 rounded-xl shadow-xl font-serif drop-shadow-lg">
            About Studio 37 Photography
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-2xl bg-white rounded-2xl shadow-lg py-12">
        <h2 className="text-amber-700 text-2xl font-bold mb-6">Our Story</h2>
        <p className="text-lg text-gray-700 mb-8">
          Studio 37 Photography is dedicated to capturing life's most precious moments with artistry, professionalism, and heart. Founded by passionate creatives, we believe every story deserves to be told beautifully—whether it's a wedding, portrait, brand, or event.
        </p>
        <h2 className="text-amber-700 text-2xl font-bold mb-6">Why Choose Us?</h2>
        <ul className="mb-8 text-lg text-gray-700 list-disc pl-6">
          <li>Award-winning photographers</li>
          <li>Personalized sessions and packages</li>
          <li>Artistic editing and fast turnaround</li>
          <li>Friendly, professional service</li>
          <li>Trusted by hundreds of happy clients</li>
        </ul>
        <h2 className="text-amber-700 text-2xl font-bold mb-6">Meet the Team</h2>
        <p className="text-lg text-gray-700 mb-8">
          Our team is a blend of experienced photographers, editors, and creative minds who love what they do. We’re here to make your experience seamless, fun, and unforgettable.
        </p>
        <div className="text-center mt-8">
          <a href="/contact" className="btn-primary px-8 py-4 rounded-lg text-lg font-semibold">Contact Us</a>
        </div>
      </div>
    </section>
  )
}
