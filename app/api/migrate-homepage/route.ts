import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// This route requires cookies/session access; ensure Next.js treats it as dynamic.
export const dynamic = 'force-dynamic'

/**
 * One-time migration endpoint to convert static homepage to page_configs format
 * This makes the homepage editable in the Live Page Editor
 * 
 * Visit: /api/migrate-homepage to run this migration
 */
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Define homepage components matching the static layout in app/page.tsx
    const homepageComponents = [
      {
        id: 'hero-component',
        type: 'hero',
        data: {
          title: 'Professional Photography Services in Pinehurst, TX',
          subtitle: 'Capturing life\'s most precious moments with artistic excellence',
          backgroundImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop',
          buttonText: 'View Portfolio',
          buttonLink: '/gallery',
          secondaryButtonText: 'Book a Session',
          secondaryButtonLink: '/book-a-session',
          alignment: 'center',
          overlay: 50,
          titleColor: 'text-white',
          subtitleColor: 'text-amber-50',
          buttonStyle: 'primary',
          fullBleed: true,
        }
      },
      {
        id: 'portrait-gallery',
        type: 'galleryHighlights',
        data: {
          categories: ['Portrait'],
          collections: [],
          tags: [],
          group: '',
          featuredOnly: true,
          limit: 6,
          sortBy: 'display_order',
          sortDir: 'asc',
          animation: 'fade-in',
        }
      },
      {
        id: 'services-section',
        type: 'servicesGrid',
        data: {
          heading: 'Our Photography Services',
          subheading: 'Professional photography for every occasion',
          services: [
            {
              title: 'Wedding Photography',
              description: 'Timeless wedding photography that tells your unique love story',
              icon: '💍',
              link: '/services#weddings',
            },
            {
              title: 'Portrait Sessions',
              description: 'Professional portraits for individuals, families, and seniors',
              icon: '📸',
              link: '/services#portraits',
            },
            {
              title: 'Event Coverage',
              description: 'Comprehensive coverage of corporate events, parties, and celebrations',
              icon: '🎉',
              link: '/services#events',
            },
            {
              title: 'Commercial Photography',
              description: 'High-quality images for businesses, products, and marketing',
              icon: '💼',
              link: '/services#commercial',
            },
          ],
          columns: 4,
          animation: 'fade-in',
        }
      },
      {
        id: 'commercial-gallery',
        type: 'galleryHighlights',
        data: {
          categories: ['Commercial'],
          collections: [],
          tags: [],
          group: '',
          featuredOnly: true,
          limit: 6,
          sortBy: 'display_order',
          sortDir: 'asc',
          animation: 'fade-in',
        }
      },
      {
        id: 'cta-section',
        type: 'ctaBanner',
        data: {
          heading: 'Ready to Capture Your Story?',
          subheading: 'Let\'s discuss your photography needs and create something beautiful together.',
          primaryButtonText: 'Get Started',
          primaryButtonLink: '/book-a-session',
          secondaryButtonText: 'View Pricing',
          secondaryButtonLink: '/services',
          backgroundColor: '#0f172a',
          textColor: 'text-white',
          fullBleed: true,
          animation: 'fade-in',
        }
      },
      {
        id: 'testimonials-section',
        type: 'testimonials',
        data: {
          heading: 'What Our Clients Say',
          style: 'cards',
          autoplay: true,
          interval: 5000,
          items: [
            {
              text: 'Studio37 captured our wedding day perfectly. The photos are absolutely stunning!',
              author: 'Sarah & Michael',
              role: 'Wedding Clients',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
              rating: 5,
            },
            {
              text: 'Professional, creative, and a pleasure to work with. Our family portraits are treasures.',
              author: 'The Johnson Family',
              role: 'Portrait Session',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
              rating: 5,
            },
            {
              text: 'Exceptional quality and attention to detail. Highly recommend for any photography needs!',
              author: 'Emily Rodriguez',
              role: 'Event Coverage',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
              rating: 5,
            },
          ],
        }
      },
    ]

    // Save to page_configs
    const { error } = await supabase
      .from('page_configs')
      .upsert({
        slug: 'home',
        data: {
          components: homepageComponents,
        }
      }, { onConflict: 'slug' })

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Homepage migrated to page_configs successfully!',
      componentsCount: homepageComponents.length,
      instructions: 'You can now edit the homepage in the Live Page Editor at /admin/live-editor'
    })

  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
