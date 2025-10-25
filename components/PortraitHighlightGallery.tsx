'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import OptimizedImage from './OptimizedImage'
import Link from 'next/link'
import { ArrowRight, Users, Camera, Star } from 'lucide-react'

 'use client'

 import React from 'react'
 import { motion } from 'framer-motion'
 import OptimizedImage from './OptimizedImage'
 import Link from 'next/link'

 const images = [
   {
     id: 'p1',
     title: 'Professional Portrait',
     description: 'Clean, modern business portrait with studio lighting',
     src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1761358417/PANA3494_afj4t9_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.20_o_80_fl_layer_apply_g_north_x_0.03_y_0.04_iatwyt.jpg',
     category: 'headshots'
   },
   {
     id: 'p2',
     title: 'Family Portrait',
     description: 'Warm, natural family portraits in outdoor settings',
     src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1760503070/F836BA20-9A10-4D23-81E3-9CB8999E1368_1_105_c_ji0ngc_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.36_o_80_fl_layer_apply_g_west_x_0.03_y_0.04_gxtw8e.jpg',
     category: 'family'
   },
   {
     id: 'p3',
     title: 'Studio Portrait',
     description: 'Professional studio portrait session',
     src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756082735/54740994305_b99379cf95_h_ky7is7.jpg',
     category: 'studio'
   },
   {
     id: 'p4',
     title: 'Corporate Portrait',
     description: 'Business and corporate portrait',
     src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756081262/Untitled_convert.io_jnf0gn_aclplu.jpg',
     category: 'business'
   },
   {
     id: 'p5',
     title: 'Creative Portrait',
     description: 'Artistic creative portrait',
     src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756078209/54681762715_a8ed7d4dbc_o_budwjo.jpg',
     category: 'creative'
   },
   {
     id: 'p6',
     title: 'Personal Branding',
     description: 'Portraits for personal branding',
     src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077326/54694193043_f9ae5338ca_k_p7pjaz.jpg',
     category: 'branding'
   }
 ]

 export default function PortraitHighlightGallery() {
   return (
     <section className="py-20 bg-white">
       <div className="container mx-auto px-4">
         <div className="text-center mb-12">
           <motion.h2
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="text-3xl md:text-4xl font-bold mb-3"
           >
             Portrait Highlights
           </motion.h2>
           <p className="text-gray-600 max-w-2xl mx-auto">
             A curated selection of our portrait work — headshots, family sessions, studio
             portraits, and creative branding images.
           </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {images.map((img, i) => (
             <motion.div
               key={img.id}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.45, delay: i * 0.06 }}
               className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/5] shadow-lg"
             >
               <OptimizedImage
                 src={img.src}
                 alt={img.title}
                 fill
                 imgClassName="object-cover"
                 priority={i < 3}
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />

               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                 <div className="p-4 text-white w-full">
                   <h3 className="font-semibold text-lg">{img.title}</h3>
                   <p className="text-sm text-gray-200 mt-1 line-clamp-2">{img.description}</p>
                   <div className="mt-3">
                     <Link href={`/gallery?category=portrait`} className="inline-block text-xs bg-amber-600 px-3 py-1 rounded-full">View more</Link>
                   </div>
                 </div>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   )
 }
