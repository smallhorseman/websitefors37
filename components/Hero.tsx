 "use client";

import React from "react";
import { Camera, ArrowRight } from "@/icons";
import Link from "next/link";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/lib/cloudinaryOptimizer";

export default function Hero() {
  // Static hero configuration for maximum performance
  const heroTitle = "Studio ";
  const heroSubtitle = "Capturing your precious moments with artistic excellence and professional craftsmanship";
  
  // Static hero image - optimized for LCP
  const rawHeroImage = "https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg";
  
  // Generate multi-density sources for responsive loading (reduces LCP bytes)
  const heroImageLarge = optimizeCloudinaryUrl(rawHeroImage, 1600, 'auto:good');
  const heroImageMedium = optimizeCloudinaryUrl(rawHeroImage, 1200, 'auto:good');
  const heroImageSmall = optimizeCloudinaryUrl(rawHeroImage, 800, 'auto:good');
  // Use the medium as default src (balanced quality vs size).
  const heroImage = heroImageMedium;
  const heroMinHeight = "70vh";
  const overlayPct = 60;

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ 
        minHeight: heroMinHeight,
        contain: 'layout style paint', // Performance: contain layout to prevent reflow
      }}
      aria-label="Hero section - Studio 37 Photography"
    >
      {/* Background Image - static for performance */}
      <div className="absolute inset-0 z-0" style={{ contain: 'strict' }}>
        <picture>
          {/* Modern formats delivered automatically by Cloudinary (f_auto) */}
          <source srcSet={`${heroImageSmall} 800w, ${heroImageMedium} 1200w, ${heroImageLarge} 1600w`} sizes="100vw" />
          <Image
            src={heroImage}
            alt="Studio 37 Photography - Professional wedding and portrait photography"
            fill
            priority
            fetchPriority="high"
            quality={75}
            sizes="100vw"
            decoding="async"
            className="object-cover will-change-auto"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </picture>
      </div>

      {/* Overlay with vintage gradient */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(to top, rgba(120, 53, 15, ${
            overlayPct / 100
          }), rgba(146, 64, 14, ${
            Math.max(overlayPct - 20, 0) / 100
          }), rgba(0,0,0,0))`,
          willChange: 'auto', // Remove will-change to reduce layer promotion
        }}
      ></div>

      {/* Film grain removed for performance - dark overlay provides depth */}

      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block p-2 border-4 border-amber-200/30 rounded-full mb-8" style={{ contentVisibility: 'auto' }}>
            <Camera className="h-16 w-16 text-amber-200" />
          </div>

          <h1
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg"
            suppressHydrationWarning
          >
            {heroTitle}
            <span className="text-amber-200">37</span>
          </h1>

          <p
            className="text-lg md:text-xl lg:text-2xl mb-8 text-amber-50 max-w-2xl mx-auto font-light"
            suppressHydrationWarning
          >
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/book-a-session"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Book your photography session"
            >
              Book Your Session
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>

            <Link
              href="/gallery"
              className="btn-secondary text-lg px-8 py-4 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="View our photography portfolio"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Vintage frame border */}
      <div className="absolute inset-8 border border-amber-200/20 pointer-events-none z-10 hidden md:block"></div>

      {/* Animated scroll indicator - pure CSS */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce-slow" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-amber-200/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-amber-200/70 rounded-full mt-2"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, 10px);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
