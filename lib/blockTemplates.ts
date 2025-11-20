/**
 * Block Templates Library - Phase 6
 * 
 * Pre-configured block combinations for common page types and sections.
 * Provides ready-to-use page layouts that follow best practices for photography websites.
 */

export interface BlockTemplate {
  block: string
  props: Record<string, any>
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  category: 'page' | 'section'
  preview: string // Preview image URL or emoji
  blocks: BlockTemplate[]
  tags: string[]
}

// Helper to encode JSON as base64 for complex props
function encodeBase64(obj: any): string {
  return Buffer.from(JSON.stringify(obj), 'utf-8').toString('base64')
}

// =============================================================================
// PAGE TEMPLATES
// =============================================================================

export const PAGE_TEMPLATES: Record<string, PageTemplate> = {
  about: {
    id: 'about',
    name: 'About Page',
    description: 'Complete about page with hero, story, timeline, stats, and CTA',
    category: 'page',
    preview: '👤',
    tags: ['about', 'company', 'story', 'team'],
    blocks: [
      {
        block: 'HeroBlock',
        props: {
          title: 'About <span class="gradient-text">Studio 37</span>',
          subtitle: 'Capturing Life\'s Most Precious Moments Through the Lens of Artistry',
          backgroundImage: '/images/about-hero.jpg',
          variant: 'split',
          alignment: 'left',
          overlay: '50',
          buttonText: 'Our Story',
          buttonLink: '#story',
          animation: 'fade-in'
        }
      },
      {
        block: 'TextBlock',
        props: {
          contentB64: encodeBase64(`
            <h2>Our Story</h2>
            <p>Founded in 2015, Studio 37 was born from a passion for capturing authentic moments and telling stories through imagery. What started as a small home studio has grown into a full-service photography business serving clients across the region.</p>
            <p>We believe that every photograph tells a story—your story. Our approach combines technical excellence with artistic vision to create images that resonate emotionally and stand the test of time.</p>
          `),
          alignment: 'left',
          size: 'lg',
          animation: 'slide-up'
        }
      },
      {
        block: 'TimelineBlock',
        props: {
          heading: 'Our Journey',
          subheading: 'A decade of growth and creative excellence',
          style: 'modern',
          accentColor: '#b46e14',
          itemsB64: encodeBase64([
            {
              date: '2015',
              title: 'Studio Founded',
              description: 'Started in a small home studio with a passion for portrait photography',
              icon: '🎬'
            },
            {
              date: '2017',
              title: 'First Studio Space',
              description: 'Expanded to a professional studio in downtown',
              icon: '🏢'
            },
            {
              date: '2019',
              title: 'Wedding Specialization',
              description: 'Began focusing on wedding and event photography',
              icon: '💍'
            },
            {
              date: '2022',
              title: 'Team Expansion',
              description: 'Grew to a team of 5 professional photographers',
              icon: '👥'
            },
            {
              date: '2025',
              title: 'Award Recognition',
              description: 'Received regional photography awards and industry recognition',
              icon: '🏆'
            }
          ])
        }
      },
      {
        block: 'StatsBlock',
        props: {
          heading: 'By The Numbers',
          columns: '4',
          style: 'cards',
          statsB64: encodeBase64([
            { icon: '📸', number: '10', suffix: '+', label: 'Years Experience' },
            { icon: '💑', number: '500', suffix: '+', label: 'Weddings Captured' },
            { icon: '⭐', number: '1000', suffix: '+', label: '5-Star Reviews' },
            { icon: '🎨', number: '50000', suffix: '+', label: 'Photos Delivered' }
          ])
        }
      },
      {
        block: 'CTABannerBlock',
        props: {
          heading: 'Ready to Tell Your Story?',
          subheading: 'Let\'s create something beautiful together',
          primaryButtonText: 'Book a Consultation',
          primaryButtonLink: '/contact',
          secondaryButtonText: 'View Portfolio',
          secondaryButtonLink: '/portfolio',
          backgroundImage: '/images/cta-background.jpg',
          overlay: '70'
        }
      }
    ]
  },

  services: {
    id: 'services',
    name: 'Services Page',
    description: 'Services showcase with hero, grid, before/after, and pricing',
    category: 'page',
    preview: '💼',
    tags: ['services', 'pricing', 'packages'],
    blocks: [
      {
        block: 'HeroBlock',
        props: {
          title: 'Photography <span class="gradient-text">Services</span>',
          subtitle: 'Professional packages tailored to your needs',
          backgroundImage: '/images/services-hero.jpg',
          variant: 'fullscreen',
          alignment: 'center',
          overlay: '60',
          buttonText: 'Explore Services',
          buttonLink: '#services',
          scrollAnimation: 'parallax'
        }
      },
      {
        block: 'ServicesGridBlock',
        props: {
          heading: 'Our Photography Services',
          subheading: 'Comprehensive packages for every occasion',
          columns: '3',
          servicesB64: encodeBase64([
            {
              image: '/images/services/weddings.jpg',
              title: 'Wedding Photography',
              description: 'Complete wedding day coverage with artistic storytelling',
              features: [
                '8 hours coverage',
                '2 photographers',
                '500+ edited photos',
                'Online gallery',
                'Print rights included'
              ],
              link: '/services/weddings'
            },
            {
              image: '/images/services/portraits.jpg',
              title: 'Portrait Sessions',
              description: 'Professional portraits for individuals and families',
              features: [
                '1-2 hour session',
                'Multiple locations',
                '30+ edited photos',
                'Wardrobe changes',
                'Print ordering available'
              ],
              link: '/services/portraits'
            },
            {
              image: '/images/services/events.jpg',
              title: 'Event Photography',
              description: 'Corporate and private event documentation',
              features: [
                'Flexible coverage',
                'Candid moments',
                'Same-day previews',
                'High-res downloads',
                'Social media ready'
              ],
              link: '/services/events'
            }
          ])
        }
      },
      {
        block: 'BeforeAfterSliderBlock',
        props: {
          heading: 'Our Editing Excellence',
          subheading: 'Professional post-processing that brings your photos to life',
          beforeImage: '/images/before-edit.jpg',
          afterImage: '/images/after-edit.jpg',
          beforeLabel: 'RAW',
          afterLabel: 'Edited',
          orientation: 'horizontal'
        }
      },
      {
        block: 'CTABannerBlock',
        props: {
          heading: 'Ready to Book Your Session?',
          subheading: 'Contact us for custom package pricing',
          primaryButtonText: 'Get a Quote',
          primaryButtonLink: '/contact',
          backgroundImage: '/images/booking-cta.jpg',
          overlay: '65'
        }
      }
    ]
  },

  portfolio: {
    id: 'portfolio',
    name: 'Portfolio Page',
    description: 'Gallery showcase with hero, masonry layout, and testimonials',
    category: 'page',
    preview: '🖼️',
    tags: ['portfolio', 'gallery', 'work'],
    blocks: [
      {
        block: 'VideoHeroBlock',
        props: {
          title: 'Our <span class="gradient-text">Portfolio</span>',
          subtitle: 'A Collection of Our Finest Work',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoType: 'youtube',
          overlay: '50',
          buttonText: 'View Gallery',
          buttonLink: '#gallery',
          autoplay: 'true',
          muted: 'true',
          loop: 'true'
        }
      },
      {
        block: 'MasonryGalleryBlock',
        props: {
          heading: 'Featured Work',
          subheading: 'Explore our diverse portfolio of wedding, portrait, and event photography',
          columns: '4',
          gap: '16',
          imagesB64: encodeBase64([
            { url: '/gallery/wedding-1.jpg', alt: 'Wedding ceremony', title: 'Sarah & John', category: 'Weddings', aspectRatio: 1.5 },
            { url: '/gallery/portrait-1.jpg', alt: 'Family portrait', title: 'Johnson Family', category: 'Portraits', aspectRatio: 0.75 },
            { url: '/gallery/event-1.jpg', alt: 'Corporate event', title: 'Tech Summit 2024', category: 'Events', aspectRatio: 1.33 },
            { url: '/gallery/wedding-2.jpg', alt: 'Reception dance', title: 'Emily & Michael', category: 'Weddings', aspectRatio: 1.2 },
            { url: '/gallery/portrait-2.jpg', alt: 'Senior portrait', title: 'Graduation 2024', category: 'Portraits', aspectRatio: 1.0 },
            { url: '/gallery/wedding-3.jpg', alt: 'Bride getting ready', title: 'Getting Ready', category: 'Weddings', aspectRatio: 0.8 }
          ])
        }
      },
      {
        block: 'TestimonialsBlock',
        props: {
          heading: 'What Our Clients Say',
          subheading: 'Don\'t just take our word for it',
          style: 'carousel',
          testimonialsB64: encodeBase64([
            {
              quote: 'Studio 37 captured our wedding day perfectly. Every emotion, every detail—absolutely stunning!',
              author: 'Sarah & John Martinez',
              role: 'Wedding Clients',
              image: '/testimonials/sarah-john.jpg',
              rating: 5
            },
            {
              quote: 'Professional, creative, and such a joy to work with. Our family portraits are treasures.',
              author: 'The Johnson Family',
              role: 'Portrait Clients',
              image: '/testimonials/johnson.jpg',
              rating: 5
            }
          ])
        }
      },
      {
        block: 'CTABannerBlock',
        props: {
          heading: 'Let\'s Create Your Story',
          subheading: 'Book your photography session today',
          primaryButtonText: 'Get Started',
          primaryButtonLink: '/contact',
          backgroundImage: '/images/portfolio-cta.jpg',
          overlay: '60'
        }
      }
    ]
  },

  contact: {
    id: 'contact',
    name: 'Contact Page',
    description: 'Contact form with map, info, and FAQ',
    category: 'page',
    preview: '📧',
    tags: ['contact', 'location', 'inquiry'],
    blocks: [
      {
        block: 'HeroBlock',
        props: {
          title: 'Get In <span class="gradient-text">Touch</span>',
          subtitle: 'Let\'s discuss your photography needs',
          backgroundImage: '/images/contact-hero.jpg',
          variant: 'minimal',
          alignment: 'center',
          overlay: '50'
        }
      },
      {
        block: 'ContactFormBlock',
        props: {
          heading: 'Send Us a Message',
          subheading: 'Fill out the form below and we\'ll get back to you within 24 hours',
          includePhone: 'true',
          includeMessage: 'true',
          submitButtonText: 'Send Message'
        }
      },
      {
        block: 'InteractiveMapBlock',
        props: {
          heading: 'Visit Our Studio',
          subheading: '123 Photography Lane, Creative District',
          centerLat: '37.7749',
          centerLng: '-122.4194',
          zoom: '15',
          height: '400px',
          mapStyle: 'default',
          markersB64: encodeBase64([
            {
              lat: 37.7749,
              lng: -122.4194,
              title: 'Studio 37',
              description: 'Our main photography studio'
            }
          ])
        }
      },
      {
        block: 'FAQBlock',
        props: {
          heading: 'Frequently Asked Questions',
          faqsB64: encodeBase64([
            {
              question: 'How far in advance should I book?',
              answer: 'For weddings, we recommend booking 6-12 months in advance. Portrait sessions can typically be scheduled within 2-4 weeks.'
            },
            {
              question: 'What is your pricing?',
              answer: 'Our pricing varies by service type and package. Wedding packages start at $2,500, portraits at $350, and events at $500. Contact us for a detailed quote.'
            },
            {
              question: 'Do you travel for shoots?',
              answer: 'Yes! We travel throughout the region. Travel fees may apply for locations over 50 miles from our studio.'
            },
            {
              question: 'When will I receive my photos?',
              answer: 'Wedding galleries are delivered within 4-6 weeks. Portrait and event galleries are typically ready in 2-3 weeks.'
            }
          ])
        }
      }
    ]
  }
}

// =============================================================================
// SECTION TEMPLATES
// =============================================================================

export const SECTION_TEMPLATES: Record<string, PageTemplate> = {
  heroWithStats: {
    id: 'hero-with-stats',
    name: 'Hero + Stats',
    description: 'Impactful hero section followed by statistics',
    category: 'section',
    preview: '📊',
    tags: ['hero', 'stats', 'conversion'],
    blocks: [
      {
        block: 'HeroBlock',
        props: {
          title: 'Professional Photography <span class="gradient-text">Solutions</span>',
          subtitle: 'Elevate your brand with stunning imagery',
          backgroundImage: '/images/hero.jpg',
          variant: 'fullscreen',
          alignment: 'center',
          overlay: '60',
          buttonText: 'Learn More',
          buttonLink: '#services',
          scrollAnimation: 'kenburns'
        }
      },
      {
        block: 'AnimatedCounterStatsBlock',
        props: {
          heading: 'Trusted by Hundreds',
          columns: '4',
          style: 'default',
          accentColor: '#b46e14',
          statsB64: encodeBase64([
            { icon: '📸', number: 10, suffix: '+', label: 'Years Experience' },
            { icon: '💑', number: 500, suffix: '+', label: 'Happy Clients' },
            { icon: '⭐', number: 4.9, suffix: '/5', label: 'Average Rating' },
            { icon: '🏆', number: 15, suffix: '+', label: 'Awards Won' }
          ])
        }
      }
    ]
  },

  testimonialsGrid: {
    id: 'testimonials-grid',
    name: 'Testimonials Grid',
    description: 'Social proof section with client testimonials',
    category: 'section',
    preview: '💬',
    tags: ['testimonials', 'social-proof', 'trust'],
    blocks: [
      {
        block: 'TestimonialsBlock',
        props: {
          heading: 'Client Love',
          subheading: 'Hear what our clients have to say',
          style: 'grid',
          testimonialsB64: encodeBase64([
            {
              quote: 'Absolutely incredible experience from start to finish!',
              author: 'Jennifer Smith',
              role: 'Bride',
              rating: 5
            },
            {
              quote: 'The photos exceeded all our expectations. True artists!',
              author: 'Michael Chen',
              role: 'Groom',
              rating: 5
            },
            {
              quote: 'Professional, creative, and so much fun to work with.',
              author: 'Amanda Rodriguez',
              role: 'Corporate Client',
              rating: 5
            }
          ])
        }
      }
    ]
  },

  galleryShowcase: {
    id: 'gallery-showcase',
    name: 'Gallery Showcase',
    description: 'Beautiful masonry gallery with heading',
    category: 'section',
    preview: '🎨',
    tags: ['gallery', 'portfolio', 'visual'],
    blocks: [
      {
        block: 'TextBlock',
        props: {
          contentB64: encodeBase64('<h2>Recent Work</h2><p>Explore our latest photography projects</p>'),
          alignment: 'center',
          size: 'xl'
        }
      },
      {
        block: 'MasonryGalleryBlock',
        props: {
          columns: '3',
          gap: '20',
          imagesB64: encodeBase64([
            { url: '/gallery/1.jpg', alt: 'Project 1', title: 'Wedding Day', category: 'Weddings' },
            { url: '/gallery/2.jpg', alt: 'Project 2', title: 'Family Portrait', category: 'Portraits' },
            { url: '/gallery/3.jpg', alt: 'Project 3', title: 'Corporate Event', category: 'Events' },
            { url: '/gallery/4.jpg', alt: 'Project 4', title: 'Engagement Shoot', category: 'Weddings' },
            { url: '/gallery/5.jpg', alt: 'Project 5', title: 'Senior Photos', category: 'Portraits' },
            { url: '/gallery/6.jpg', alt: 'Project 6', title: 'Product Launch', category: 'Events' }
          ])
        }
      }
    ]
  },

  ctaSection: {
    id: 'cta-section',
    name: 'Call-to-Action Banner',
    description: 'Conversion-focused CTA with dual buttons',
    category: 'section',
    preview: '🎯',
    tags: ['cta', 'conversion', 'action'],
    blocks: [
      {
        block: 'CTABannerBlock',
        props: {
          heading: 'Ready to Get Started?',
          subheading: 'Let\'s bring your vision to life',
          primaryButtonText: 'Book Now',
          primaryButtonLink: '/contact',
          secondaryButtonText: 'View Pricing',
          secondaryButtonLink: '/services',
          backgroundImage: '/images/cta-bg.jpg',
          overlay: '70',
          fullBleed: 'true'
        }
      }
    ]
  },

  timelineStory: {
    id: 'timeline-story',
    name: 'Company Timeline',
    description: 'Visual timeline for company history or process',
    category: 'section',
    preview: '⏱️',
    tags: ['timeline', 'history', 'process'],
    blocks: [
      {
        block: 'TimelineBlock',
        props: {
          heading: 'Our Process',
          subheading: 'From booking to delivery',
          style: 'minimal',
          accentColor: '#b46e14',
          itemsB64: encodeBase64([
            {
              date: 'Step 1',
              title: 'Initial Consultation',
              description: 'We discuss your vision, timeline, and specific needs',
              icon: '📞'
            },
            {
              date: 'Step 2',
              title: 'Planning & Preparation',
              description: 'Create shot list, scout locations, plan logistics',
              icon: '📋'
            },
            {
              date: 'Step 3',
              title: 'Photo Session',
              description: 'Capture your special moments with professional equipment',
              icon: '📸'
            },
            {
              date: 'Step 4',
              title: 'Editing & Selection',
              description: 'Professional editing and curation of best shots',
              icon: '✨'
            },
            {
              date: 'Step 5',
              title: 'Delivery',
              description: 'Receive your high-resolution images in online gallery',
              icon: '🎁'
            }
          ])
        }
      }
    ]
  }
}

// =============================================================================
// TEMPLATE HELPERS
// =============================================================================

export function getAllTemplates(): PageTemplate[] {
  return [...Object.values(PAGE_TEMPLATES), ...Object.values(SECTION_TEMPLATES)]
}

export function getTemplateById(id: string): PageTemplate | undefined {
  return getAllTemplates().find(t => t.id === id)
}

export function getTemplatesByCategory(category: 'page' | 'section'): PageTemplate[] {
  return getAllTemplates().filter(t => t.category === category)
}

export function getTemplatesByTag(tag: string): PageTemplate[] {
  return getAllTemplates().filter(t => t.tags.includes(tag))
}

export function generateMDXFromTemplate(template: PageTemplate): string {
  return template.blocks
    .map(block => {
      const propsStr = Object.entries(block.props)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `  ${key}="${value}"`
          } else if (typeof value === 'boolean') {
            return `  ${key}={${value}}`
          } else {
            return `  ${key}={${JSON.stringify(value)}}`
          }
        })
        .join('\n')
      
      return `<${block.block}\n${propsStr}\n/>`
    })
    .join('\n\n')
}
