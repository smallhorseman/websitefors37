"use client";

import React, { useEffect, useState, useRef } from "react";
import { Camera, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPageConfig } from "@/lib/pageConfig";
import { useGalleryImages } from "@/hooks/useGalleryImages";

export default function Hero() {
  const [cfg, setCfg] = useState<Record<string, any> | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [siteSettings, setSiteSettings] = useState<any | null>(null);

  // Categories to show in homepage hero
  const homepageCategories = [
    "professional portraits",
    "creative portraits",
    "product photography",
    "brand photography",
  ];

  // React Query: featured images for homepage categories
  const { data: featuredImages } = useGalleryImages({
    categories: homepageCategories,
    featured: true,
    orderBy: "display_order",
    ascending: true,
  });

  useEffect(() => {
    getPageConfig("home").then((c) => setCfg(c?.data || null));
  }, []);

  // Fetch site-wide settings to allow hero customization from Admin > Settings
  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase.from("settings").select("*").single();
        if (data) setSiteSettings(data);
      } catch (e) {
        // non-fatal if settings table missing
        console.warn("Hero: settings not available", e);
      }
    })();
  }, []);

  // Keep local state in sync for slideshow logic
  useEffect(() => {
    if (featuredImages) setGalleryImages(featuredImages);
  }, [featuredImages]);

  // Slideshow rotation
  useEffect(() => {
    if (galleryImages.length < 2) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((idx) => (idx + 1) % galleryImages.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [galleryImages]);

  const heroTitle: string = siteSettings?.hero_title || cfg?.hero_title || "Studio ";
  const heroSubtitle: string =
    siteSettings?.hero_subtitle ||
    cfg?.hero_subtitle ||
    "Capturing your precious moments with artistic excellence and professional craftsmanship";
  // Use slideshow image if available, else fallback to config/default
  const heroImage: string =
    galleryImages.length > 0
      ? galleryImages[currentIndex]?.image_url
      : cfg?.hero_image ||
        "https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg";

  // Admin-configurable appearance fallbacks
  const heroMinHeight: string = siteSettings?.hero_min_height || "70vh"; // reduced from full screen
  const titleColorCSS: string | undefined = siteSettings?.hero_title_color;
  const subtitleColorCSS: string | undefined = siteSettings?.hero_subtitle_color;
  const overlayPct: number = Math.min(
    Math.max(Number(siteSettings?.hero_overlay_opacity ?? 60), 0),
    100
  );

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: heroMinHeight }}
    >
      {/* Background Image (slideshow) - fetchPriority high for LCP optimization */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt={
            galleryImages.length > 0
              ? galleryImages[currentIndex]?.title || "Homepage slideshow"
              : "Studio 37 Photography background"
          }
          fill
          priority
          fetchPriority="high"
          quality={90}
          sizes="100vw"
          className="object-cover transition-opacity duration-1000"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
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
        }}
      ></div>

      {/* Film grain texture overlay - optimized */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay z-10 film-grain-bg"
        aria-hidden="true"
      />

      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-block p-2 border-4 border-amber-200/30 rounded-full mb-8">
            <Camera className="h-16 w-16 text-amber-200" />
          </div>

          <h1
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg"
            style={titleColorCSS ? { color: titleColorCSS } : undefined}
            suppressHydrationWarning
          >
            {heroTitle || "Studio "}
            <span className="text-amber-200">37</span>
          </h1>

          <p
            className="text-lg md:text-xl lg:text-2xl mb-8 text-amber-50 max-w-2xl mx-auto font-light"
            style={subtitleColorCSS ? { color: subtitleColorCSS } : undefined}
            suppressHydrationWarning
          >
            {heroSubtitle}
          </p>

          {/* Show current image category and title if slideshow is active */}
          {galleryImages.length > 0 && (
            <div className="mb-6 text-amber-100 text-lg font-medium">
              <span className="capitalize">
                {galleryImages[currentIndex]?.category}
              </span>
              {galleryImages[currentIndex]?.title && (
                <span className="ml-2 text-white/80">
                  — {galleryImages[currentIndex].title}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/book-a-session"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Book Your Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/gallery"
              className="btn-secondary text-lg px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-amber-200/30 hover:border-amber-200/50 transition-colors"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Vintage frame border */}
      <div className="absolute inset-8 border border-amber-200/20 pointer-events-none z-10 hidden md:block"></div>

      {/* Animated scroll indicator - pure CSS */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce-slow">
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
