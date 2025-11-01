'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { 
  GripVertical, Plus, Trash2, Eye, Code, Monitor, Tablet, Smartphone,
  Type, Image as ImageIcon, Square, Columns, Layout, Save
} from 'lucide-react'
import Image from 'next/image'
import ImageUploader from './ImageUploader'

// Component types
type ComponentType = 'hero' | 'text' | 'image' | 'button' | 'columns' | 'spacer' | 'seoFooter' | 'slideshowHero' | 'testimonials' | 'galleryHighlights' | 'widgetEmbed' | 'badges' | 'servicesGrid' | 'stats' | 'ctaBanner' | 'iconFeatures' | 'logo' | 'contactForm' | 'newsletterSignup' | 'faq' | 'pricingTable'

interface BaseComponent {
  id: string
  type: ComponentType
}

interface HeroComponent extends BaseComponent {
  type: 'hero'
  data: {
    title: string
    subtitle: string
    backgroundImage: string
    buttonText: string
    buttonLink: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
    alignment: 'left' | 'center' | 'right'
    overlay: number
    titleColor: string
    subtitleColor: string
    buttonStyle: 'primary' | 'secondary' | 'outline'
    animation: 'none' | 'fade-in' | 'slide-up' | 'zoom'
    buttonAnimation?: 'none' | 'hover-zoom'
    fullBleed?: boolean
  }
}

interface TextComponent extends BaseComponent {
  type: 'text'
  data: {
    content: string
    alignment: 'left' | 'center' | 'right'
    size: 'sm' | 'md' | 'lg' | 'xl'
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface ImageComponent extends BaseComponent {
  type: 'image'
  data: {
    url: string
    alt: string
    caption?: string
    width: 'full' | 'large' | 'medium' | 'small'
    link?: string
    animation: 'none' | 'fade-in' | 'slide-up' | 'zoom' | 'hover-zoom'
  }
}

interface ButtonComponent extends BaseComponent {
  type: 'button'
  data: {
    text: string
    link: string
    style: 'primary' | 'secondary' | 'outline'
    alignment: 'left' | 'center' | 'right'
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom' | 'hover-zoom'
  }
}

interface ColumnsComponent extends BaseComponent {
  type: 'columns'
  data: {
    columns: Array<{
      content: string
      image?: string
    }>
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface SpacerComponent extends BaseComponent {
  type: 'spacer'
  data: {
    height: 'sm' | 'md' | 'lg' | 'xl'
  }
}

interface SEOFooterComponent extends BaseComponent {
  type: 'seoFooter'
  data: {
    content: string
    includeSchema?: boolean
  }
}

interface SlideshowHeroComponent extends BaseComponent {
  type: 'slideshowHero'
  data: {
    slides: Array<{ image: string; category?: string; title?: string }>
    intervalMs: number
    overlay: number
    title?: string
    subtitle?: string
    buttonText?: string
    buttonLink?: string
    alignment?: 'left' | 'center' | 'right'
    titleColor?: string
    subtitleColor?: string
    buttonStyle?: 'primary' | 'secondary' | 'outline'
    buttonAnimation?: 'none' | 'hover-zoom'
    fullBleed?: boolean
  }
}

interface TestimonialsComponent extends BaseComponent {
  type: 'testimonials'
  data: {
    testimonials: Array<{ quote: string; author?: string; subtext?: string; avatar?: string }>
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

// GalleryHighlightsComponent is defined once below with full organizing fields (collections, tags, group, sort, limits)

interface WidgetEmbedComponent extends BaseComponent {
  type: 'widgetEmbed'
  data: {
    provider?: 'thumbtack' | 'google' | 'yelp' | 'custom'
    html: string
    scriptSrcs: string[]
    styleReset?: boolean
  }
}

interface GalleryHighlightsComponent extends BaseComponent {
  type: 'galleryHighlights'
  data: {
    categories: string[]
    featuredOnly?: boolean
    limit?: number
    // New organizing fields
    collections?: string[]
    tags?: string[]
    group?: string
    sortBy?: 'display_order' | 'created_at'
    sortDir?: 'asc' | 'desc'
    limitPerCategory?: number
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface BadgesComponent extends BaseComponent {
  type: 'badges'
  data: {
    badges: Array<{
      icon: 'star' | 'thumbtack' | 'shield' | 'camera' | 'check' | 'yelp' | 'google'
      label: string
      sublabel?: string
      href?: string
      color?: string
    }>
    alignment: 'left' | 'center' | 'right'
    size: 'sm' | 'md' | 'lg'
    style: 'solid' | 'outline' | 'pill'
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface ServicesGridComponent extends BaseComponent {
  type: 'servicesGrid'
  data: {
    heading?: string
    subheading?: string
    services: Array<{
      image: string
      title: string
      description: string
      features: string[]
      link?: string
    }>
    columns: 2 | 3 | 4
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface StatsComponent extends BaseComponent {
  type: 'stats'
  data: {
    heading?: string
    stats: Array<{
      icon?: string
      number: string
      label: string
      suffix?: string
    }>
    columns: 2 | 3 | 4
    style: 'default' | 'cards' | 'minimal'
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface CTABannerComponent extends BaseComponent {
  type: 'ctaBanner'
  data: {
    heading: string
    subheading?: string
    primaryButtonText?: string
    primaryButtonLink?: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
    backgroundImage?: string
    backgroundColor?: string
    overlay?: number
    textColor?: string
    fullBleed?: boolean
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface IconFeaturesComponent extends BaseComponent {
  type: 'iconFeatures'
  data: {
    heading?: string
    subheading?: string
    features: Array<{
      icon: string
      title: string
      description: string
    }>
    columns: 2 | 3 | 4
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface LogoComponent extends BaseComponent {
  type: 'logo'
  data: {
    mode: 'svg' | 'image'
    text: string
    subtext?: string
    showCamera?: boolean
    color?: string
    accentColor?: string
    imageUrl?: string
    size?: 'sm' | 'md' | 'lg'
    alignment?: 'left' | 'center' | 'right'
    link?: string
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface ContactFormComponent extends BaseComponent {
  type: 'contactForm'
  data: {
    heading?: string
    subheading?: string
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface NewsletterComponent extends BaseComponent {
  type: 'newsletterSignup'
  data: {
    heading?: string
    subheading?: string
    disclaimer?: string
    style?: 'card' | 'banner'
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface FAQComponent extends BaseComponent {
  type: 'faq'
  data: {
    heading?: string
    items: Array<{ question: string; answer: string }>
    columns?: 1 | 2
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
  }
}

interface PricingTableComponent extends BaseComponent {
  type: 'pricingTable'
  data: {
    heading?: string
    subheading?: string
    plans: Array<{
      title: string
      price: string
      period?: string
      features: string[]
      ctaText?: string
      ctaLink?: string
      highlight?: boolean
    }>
    columns: 2 | 3 | 4
    animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom'
    // New optional styling controls
    style?: 'light' | 'dark'
    variant?: 'card' | 'flat'
    showFeatureChecks?: boolean
  }
}

type PageComponent = HeroComponent | TextComponent | ImageComponent | ButtonComponent | ColumnsComponent | SpacerComponent | SEOFooterComponent | SlideshowHeroComponent | TestimonialsComponent | GalleryHighlightsComponent | WidgetEmbedComponent | BadgesComponent | ServicesGridComponent | StatsComponent | CTABannerComponent | IconFeaturesComponent | LogoComponent | ContactFormComponent | NewsletterComponent | FAQComponent | PricingTableComponent

interface VisualEditorProps {
  initialComponents?: PageComponent[]
  onSave: (components: PageComponent[]) => void
  onChange?: (components: PageComponent[]) => void
  slug?: string
  onImportFromPublished?: () => void | Promise<void>
}

export default function VisualEditor({ initialComponents = [], onSave, onChange, slug, onImportFromPublished }: VisualEditorProps) {
  const [components, setComponents] = useState<PageComponent[]>(initialComponents)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [previewMode, setPreviewMode] = useState(false)

  const applyHomepageTemplate = () => {
    const tpl = buildHomepageTemplate()
    notify(tpl)
    if (tpl.length) setSelectedComponent(tpl[0].id)
  }

  const notify = (next: PageComponent[]) => {
    setComponents(next)
    if (onChange) onChange(next)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(components)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    notify(items)
  }

  const addComponent = (type: ComponentType) => {
    const newComponent: PageComponent = {
      id: `component-${Date.now()}`,
      type,
      data: getDefaultData(type)
    } as PageComponent

    notify([...components, newComponent])
    setSelectedComponent(newComponent.id)
  }

  const getDefaultData = (type: ComponentType): any => {
    switch (type) {
      case 'hero':
        return {
          title: 'Studio 37',
          subtitle: 'Capturing your precious moments with artistic excellence and professional craftsmanship',
          backgroundImage: '',
          buttonText: 'Book Your Session',
          buttonLink: '/book-a-session',
          secondaryButtonText: 'View Portfolio',
          secondaryButtonLink: '/gallery',
          alignment: 'center',
          overlay: 50,
          titleColor: 'text-white',
          subtitleColor: 'text-white',
          buttonStyle: 'primary',
          animation: 'fade-in',
          buttonAnimation: 'hover-zoom',
          fullBleed: true
        }
      case 'text':
        return {
          content: 'Enter your text here...',
          alignment: 'left',
          size: 'md',
          animation: 'none'
        }
      case 'image':
        return {
          url: '',
          alt: 'Image',
          caption: '',
          width: 'full',
          link: '',
          animation: 'none'
        }
      case 'button':
        return {
          text: 'Click Here',
          link: '#',
          style: 'primary',
          alignment: 'center',
          animation: 'none'
        }
      case 'columns':
        return {
          columns: [
            { content: 'Column 1 content' },
            { content: 'Column 2 content' }
          ],
          animation: 'none'
        }
      case 'spacer':
        return { height: 'md' }
      case 'seoFooter':
        return {
          content: '<h3 class="text-lg font-bold mb-2">About Studio37</h3><p class="text-sm">Professional photography serving Pinehurst, Tomball, Magnolia, The Woodlands, Conroe, Spring, and surrounding areas within 50 miles. Specializing in portraits, weddings, events, and commercial photography.</p><h3 class="text-lg font-bold mt-4 mb-2">Contact</h3><p class="text-sm">Studio37 • 832-713-9944 • sales@studio37.cc • 1701 Goodson Loop, TRLR 80, Pinehurst, TX 77362</p>',
          includeSchema: true
        }
      case 'slideshowHero':
        return {
          slides: [
            { image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop', category: 'creative portraits' },
            { image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1600&auto=format&fit=crop', category: 'brand photography' }
          ],
          intervalMs: 5000,
          overlay: 60,
          title: 'Studio 37',
          subtitle: 'Artistic excellence, professional craft',
          buttonText: 'Book Your Session',
          buttonLink: '/book-a-session',
          alignment: 'center',
          titleColor: 'text-white',
          subtitleColor: 'text-amber-50',
          buttonStyle: 'primary',
          buttonAnimation: 'hover-zoom',
          fullBleed: true
        }
      case 'testimonials':
        return {
          testimonials: [
            { quote: 'Absolutely stunning photos and a wonderful experience.', author: 'A Happy Client' },
            { quote: 'Professional, friendly, and incredible results!', author: 'Another Client' }
          ],
          animation: 'fade-in'
        }
      case 'galleryHighlights':
        return {
          categories: [],
          featuredOnly: true,
          limit: 6,
          collections: [],
          tags: [],
          group: '',
          sortBy: 'display_order',
          sortDir: 'asc',
          limitPerCategory: 0,
          animation: 'fade-in'
        }
      case 'widgetEmbed':
        return {
          provider: 'thumbtack',
          html: '<div id="tt-dynamic"></div>',
          scriptSrcs: ['https://www.thumbtack.com/profile/widgets/scripts/?service_pk=YOUR_SERVICE_PK&widget_id=review&type=one'],
          styleReset: true
        }
      case 'badges':
        return {
          badges: [
            { icon: 'yelp', label: '5.0 • Yelp Reviews', sublabel: '★★★★★', color: '#d32323', href: 'https://www.yelp.com' },
            { icon: 'thumbtack', label: 'Thumbtack Top Pro', sublabel: 'Highly Rated', color: '#15a6ff', href: 'https://www.thumbtack.com' },
            { icon: 'shield', label: 'Certified Professional Photographer', sublabel: 'Studio 37', color: '#0ea5e9' }
          ],
          alignment: 'center',
          size: 'md',
          style: 'pill',
          animation: 'fade-in'
        }
      case 'servicesGrid':
        return {
          heading: 'Our Photography Services',
          subheading: 'From intimate portraits to grand celebrations, we offer comprehensive photography services tailored to your unique needs.',
          services: [
            {
              image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
              title: 'Wedding Photography',
              description: 'Capture your special day with romantic and timeless images that tell your love story.',
              features: ['Full day coverage', 'Engagement session', 'Digital gallery', 'Print options']
            },
            {
              image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
              title: 'Portrait Sessions',
              description: 'Professional headshots, family portraits, and individual sessions in studio or on location.',
              features: ['Studio or outdoor', 'Multiple outfits', 'Retouched images', 'Same day preview']
            },
            {
              image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop',
              title: 'Event Photography',
              description: 'Document your corporate events, parties, and celebrations with candid and posed shots.',
              features: ['Event coverage', 'Candid moments', 'Group photos', 'Quick turnaround']
            },
            {
              image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
              title: 'Commercial Photography',
              description: 'Product photography, business headshots, and marketing materials for your brand.',
              features: ['Product shots', 'Brand imagery', 'Marketing content', 'Commercial rights']
            }
          ],
          columns: 2,
          animation: 'fade-in'
        }
      case 'stats':
        return {
          heading: '',
          stats: [
            { icon: '👥', number: '150', label: 'Business Clients', suffix: '+' },
            { icon: '📸', number: '800', label: 'Projects Completed', suffix: '+' },
            { icon: '⭐', number: '95', label: 'Client Retention', suffix: '%' }
          ],
          columns: 3,
          style: 'cards',
          animation: 'fade-in'
        }
      case 'ctaBanner':
        return {
          heading: 'Ready to Capture Your Moments?',
          subheading: 'Book your session today and let\'s create something amazing together',
          primaryButtonText: 'Book Now',
          primaryButtonLink: '/book-a-session',
          secondaryButtonText: 'View Gallery',
          secondaryButtonLink: '/gallery',
          backgroundImage: '',
          backgroundColor: '#0f172a',
          overlay: 60,
          textColor: 'text-white',
          fullBleed: true,
          animation: 'fade-in'
        }
      case 'iconFeatures':
        return {
          heading: 'Why Choose Studio 37',
          subheading: 'Professional photography services you can trust',
          features: [
            { icon: '📸', title: 'Professional Equipment', description: 'State-of-the-art cameras and lighting for stunning results' },
            { icon: '⚡', title: 'Quick Turnaround', description: 'Get your edited photos within 48 hours' },
            { icon: '💎', title: 'Premium Quality', description: 'High-resolution images with expert editing' },
            { icon: '🎨', title: 'Creative Direction', description: 'Unique concepts tailored to your vision' }
          ],
          columns: 4,
          animation: 'fade-in'
        }
      case 'logo':
        return {
          mode: 'svg',
          text: 'Studio 37',
          subtext: 'Photography',
          showCamera: true,
          color: '#111827',
          accentColor: '#b46e14',
          imageUrl: '',
          size: 'md',
          alignment: 'left',
          link: '/',
          animation: 'none'
        }
      case 'contactForm':
        return {
          heading: 'Get in Touch',
          subheading: 'Tell us about your photography needs and we’ll reply within 24 hours.',
          animation: 'fade-in'
        }
      case 'newsletterSignup':
        return {
          heading: 'Get 10% Off Your First Session',
          subheading: 'Subscribe for tips, behind-the-scenes, and special offers.',
          disclaimer: 'By subscribing, you agree to receive marketing emails. Unsubscribe anytime.',
          style: 'card',
          animation: 'fade-in'
        }
      case 'faq':
        return {
          heading: 'Frequently Asked Questions',
          items: [
            { question: 'How do I book a session?', answer: 'Use the Book a Session page or contact us with your date and details.' },
            { question: 'How quickly will I receive photos?', answer: 'Typical turnaround is 48 hours for most sessions.' }
          ],
          columns: 1,
          animation: 'fade-in'
        }
      case 'pricingTable':
        return {
          heading: 'Packages & Pricing',
          subheading: 'Simple packages for every need',
          plans: [
            { title: 'Basic', price: '$199', period: 'per session', features: ['30 min session', '10 edited photos', 'Online gallery'], ctaText: 'Book Basic', ctaLink: '/book-a-session', highlight: false },
            { title: 'Standard', price: '$349', period: 'per session', features: ['60 min session', '25 edited photos', 'Online gallery', 'Print rights'], ctaText: 'Book Standard', ctaLink: '/book-a-session', highlight: true },
            { title: 'Premium', price: '$599', period: 'per session', features: ['120 min session', '50 edited photos', 'Online gallery', 'Print rights', 'Priority turnaround'], ctaText: 'Book Premium', ctaLink: '/book-a-session', highlight: false }
          ],
          columns: 3,
          animation: 'fade-in',
          style: 'light',
          variant: 'card',
          showFeatureChecks: true
        }
      default:
        return {}
    }
  }

  const updateComponent = (id: string, data: any) => {
    const updated = components.map(c => 
      c.id === id ? { ...c, data: { ...c.data, ...data } } : c
    )
    notify(updated)
  }

  const deleteComponent = (id: string) => {
    notify(components.filter(c => c.id !== id))
    if (selectedComponent === id) setSelectedComponent(null)
  }

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm'
      case 'tablet': return 'max-w-2xl'
      default: return 'max-w-7xl'
    }
  }

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar - Component Library */}
      {!previewMode && (
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Components</h2>
            {!!onImportFromPublished && !!slug && (
              <button
                onClick={() => onImportFromPublished?.()}
                className="mt-3 w-full px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                title={`Import published /${slug} into builder`}
              >
                Import from published
              </button>
            )}
            {/* Template selector dropdown */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Quick Start Templates</label>
              <select
                onChange={(e) => {
                  const template = e.target.value
                  if (!template) return
                  
                  let newComponents: PageComponent[] = []
                  switch (template) {
                    case 'home':
                      newComponents = buildHomepageTemplate()
                      break
                    case 'about':
                      newComponents = buildAboutTemplate()
                      break
                    case 'services':
                      newComponents = buildServicesTemplate()
                      break
                    case 'contact':
                      newComponents = buildContactTemplate()
                      break
                    case 'leadgen':
                      newComponents = buildLeadGenTemplate()
                      break
                    case 'servicesPricing':
                      newComponents = buildServicesPricingTemplate()
                      break
                    case 'faq':
                      newComponents = buildFAQPageTemplate()
                      break
                  }
                  
                  if (newComponents.length > 0) {
                    setComponents(newComponents)
                    setSelectedComponent(null)
                    onChange?.(newComponents)
                    // Reset dropdown
                    e.target.value = ''
                  }
                }}
                className="w-full px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50"
                defaultValue=""
              >
                <option value="">Choose a template...</option>
                <option value="home">📱 Homepage Template</option>
                <option value="about">👥 About Page Template</option>
                <option value="services">📸 Services Page Template</option>
                <option value="contact">📧 Contact Page Template</option>
                <option value="leadgen">🚀 Lead Gen Landing</option>
                <option value="servicesPricing">💼 Services + Pricing</option>
                <option value="faq">❓ FAQ Page Template</option>
              </select>
            </div>
          </div>
          
          <div className="p-4 space-y-2">
            <button
              onClick={() => addComponent('logo')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Logo</span>
            </button>
            <button
              onClick={() => addComponent('faq')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>FAQ</span>
            </button>
            <button
              onClick={() => addComponent('pricingTable')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Pricing Table</span>
            </button>
            <button
              onClick={() => addComponent('contactForm')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Contact Form</span>
            </button>
            <button
              onClick={() => addComponent('newsletterSignup')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Newsletter Signup</span>
            </button>
            <button
              onClick={() => addComponent('hero')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Hero Section</span>
            </button>
            
            <button
              onClick={() => addComponent('text')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Type className="h-5 w-5" />
              <span>Text Block</span>
            </button>
            
            <button
              onClick={() => addComponent('image')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <ImageIcon className="h-5 w-5" />
              <span>Image</span>
            </button>
            
            <button
              onClick={() => addComponent('button')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Square className="h-5 w-5" />
              <span>Button</span>
            </button>
            
            <button
              onClick={() => addComponent('columns')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Columns className="h-5 w-5" />
              <span>Columns</span>
            </button>

            <button
              onClick={() => addComponent('slideshowHero')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Slideshow Hero</span>
            </button>

            <button
              onClick={() => addComponent('testimonials')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => addComponent('galleryHighlights')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Gallery Highlights</span>
            </button>
            
            <button
              onClick={() => addComponent('widgetEmbed')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Embed Widget</span>
            </button>
            
            <button
              onClick={() => addComponent('badges')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Badges</span>
            </button>

            <button
              onClick={() => addComponent('servicesGrid')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Services Grid</span>
            </button>

            <button
              onClick={() => addComponent('stats')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Stats/Numbers</span>
            </button>

            <button
              onClick={() => addComponent('ctaBanner')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>CTA Banner</span>
            </button>

            <button
              onClick={() => addComponent('iconFeatures')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Layout className="h-5 w-5" />
              <span>Icon Features</span>
            </button>

            <button
              onClick={() => addComponent('spacer')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="h-5 w-5 flex items-center justify-center">⬍</span>
              <span>Spacer</span>
            </button>
            <button
              onClick={() => addComponent('seoFooter')}
              className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Square className="h-5 w-5" />
              <span>SEO Footer</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
              title="Desktop view"
            >
              <Monitor className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
              title="Tablet view"
            >
              <Tablet className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
              title="Mobile view"
            >
              <Smartphone className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${previewMode ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {previewMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            
            <button
              onClick={() => onSave(components)}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Page
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className={`mx-auto bg-white shadow-lg transition-all ${getViewportWidth()}`}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="page-builder">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[600px]"
                  >
                    {components.length === 0 && (
                      <div className="flex items-center justify-center h-96 text-gray-400">
                        <div className="text-center">
                          <Plus className="h-12 w-12 mx-auto mb-2" />
                          <p>Drag components here to start building</p>
                        </div>
                      </div>
                    )}
                    
                    {components.map((component, index) => (
                      <Draggable
                        key={component.id}
                        draggableId={component.id}
                        index={index}
                        isDragDisabled={previewMode}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`relative group ${
                              selectedComponent === component.id ? 'ring-2 ring-primary-500' : ''
                            } ${snapshot.isDragging ? 'opacity-50' : ''}`}
                            onClick={() => !previewMode && setSelectedComponent(component.id)}
                          >
                            {!previewMode && (
                              <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-1 bg-white rounded shadow cursor-move hover:bg-gray-50"
                                  title="Drag to reorder"
                                  aria-label="Drag to reorder"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteComponent(component.id)
                                  }}
                                  className="p-1 bg-white rounded shadow hover:bg-red-50 text-red-600"
                                  title="Delete component"
                                  aria-label="Delete component"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            
                            <ComponentRenderer component={component} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {!previewMode && selectedComponent && (
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Properties</h2>
          </div>
          
          <div className="p-4">
            <ComponentProperties
              component={components.find(c => c.id === selectedComponent)!}
              onUpdate={(data) => updateComponent(selectedComponent, data)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Component Renderer
function ComponentRenderer({ component }: { component: PageComponent }) {
  switch (component.type) {
    case 'faq':
      return <FAQRenderer data={(component as any).data} />
    case 'pricingTable':
      return <PricingTableRenderer data={(component as any).data} />
    case 'contactForm':
      return <ContactFormRenderer data={(component as any).data} />
    case 'newsletterSignup':
      return <NewsletterRenderer data={(component as any).data} />
    case 'logo':
      return <LogoRenderer data={(component as any).data} />
    case 'hero':
      return <HeroRenderer data={component.data} />
    case 'text':
      return <TextRenderer data={component.data} />
    case 'image':
      return <ImageRenderer data={component.data} />
    case 'button':
      return <ButtonRenderer data={component.data} />
     case 'columns':
      return <ColumnsRenderer data={component.data} />
    case 'slideshowHero':
      return <SlideshowHeroRenderer data={(component as any).data} />
    case 'testimonials':
      return <TestimonialsRenderer data={(component as any).data} />
    case 'galleryHighlights':
      return <GalleryHighlightsRenderer data={(component as any).data} />
    case 'widgetEmbed':
      return <WidgetEmbedRenderer data={(component as any).data} />
    case 'badges':
      return <BadgesRenderer data={(component as any).data} />
    case 'servicesGrid':
      return <ServicesGridRenderer data={(component as any).data} />
    case 'stats':
      return <StatsRenderer data={(component as any).data} />
    case 'ctaBanner':
      return <CTABannerRenderer data={(component as any).data} />
    case 'iconFeatures':
      return <IconFeaturesRenderer data={(component as any).data} />
    case 'spacer':
      return <SpacerRenderer data={component.data} />
    case 'seoFooter':
      return <SEOFooterRenderer data={component.data} />
    default:
      return null
  }
}

// Helper: Build a starter homepage template approximating the current static homepage
function buildHomepageTemplate(): PageComponent[] {
  const id = () => `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const components: PageComponent[] = []

  // Hero with dual CTAs - matching live site design
  components.push({
    id: id(),
    type: 'hero',
    data: {
      title: 'Studio 37',
      subtitle: 'Capturing your precious moments with artistic excellence and professional craftsmanship',
      backgroundImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop',
      buttonText: 'Book Your Session',
      buttonLink: '/book-a-session',
      secondaryButtonText: 'View Portfolio',
      secondaryButtonLink: '/gallery',
      alignment: 'center',
      overlay: 50,
      titleColor: 'text-white',
      subtitleColor: 'text-white',
      buttonStyle: 'primary',
      animation: 'fade-in',
      buttonAnimation: 'hover-zoom',
      fullBleed: true
    }
  } as HeroComponent)

  // Spacer
  components.push({ id: id(), type: 'spacer', data: { height: 'lg' } } as SpacerComponent)

  // Services overview (as Columns)
  components.push({
    id: id(),
    type: 'columns',
    data: {
      animation: 'fade-in',
      columns: [
        { content: '<h3 class="text-xl font-bold mb-2">Professional Portraits</h3><p>Refined images for personal and business branding.</p>' },
        { content: '<h3 class="text-xl font-bold mb-2">Creative Portraits</h3><p>Artistic sessions tailored to your unique story.</p>' },
        { content: '<h3 class="text-xl font-bold mb-2">Commercial & Product</h3><p>Clean, striking visuals that elevate your brand.</p>' }
      ]
    }
  } as ColumnsComponent)

  // Spacer
  components.push({ id: id(), type: 'spacer', data: { height: 'md' } } as SpacerComponent)

  // Lead capture prompt + button
  components.push({
    id: id(),
    type: 'text',
    data: {
      content: '<h2 class="text-3xl font-bold mb-2">Ready to Capture Your Story?</h2><p class="text-lg text-gray-600">Let\'s discuss your photography needs and create something beautiful together.</p>',
      alignment: 'center',
      size: 'md',
      animation: 'fade-in'
    }
  } as TextComponent)
  components.push({
    id: id(),
    type: 'button',
    data: {
      text: 'Book a Session',
      link: '/book-a-session',
      style: 'primary',
      alignment: 'center',
      animation: 'hover-zoom'
    }
  } as ButtonComponent)

  // Spacer
  components.push({ id: id(), type: 'spacer', data: { height: 'lg' } } as SpacerComponent)

  // Simple testimonials teaser
  components.push({
    id: id(),
    type: 'text',
    data: {
      content: '<h3 class="text-2xl font-bold mb-4 text-center">What Clients Say</h3><p class="text-center italic max-w-3xl mx-auto">“Absolutely stunning photos and a wonderful experience from start to finish.” — A Happy Client</p>',
      alignment: 'center',
      size: 'md',
      animation: 'fade-in'
    }
  } as TextComponent)

  // Newsletter signup
  components.push({
    id: id(),
    type: 'newsletterSignup',
    data: {
      heading: 'Get 10% Off Your First Session',
      subheading: 'Subscribe for tips, behind-the-scenes, and special offers.',
      disclaimer: 'By subscribing, you agree to receive marketing emails. Unsubscribe anytime.',
      style: 'card',
      animation: 'fade-in'
    }
  } as NewsletterComponent)

  // Optional SEO footer starter
  components.push({
    id: id(),
    type: 'seoFooter',
    data: {
      content: '<h3 class="text-lg font-bold mb-2">About Studio37</h3><p class="text-sm">Professional photography serving Pinehurst, Tomball, Magnolia, The Woodlands, Conroe, Spring, and surrounding areas within 50 miles.</p><h3 class="text-lg font-bold mt-4 mb-2">Contact</h3><p class="text-sm">Studio37 • 832-713-9944 • sales@studio37.cc</p>',
      includeSchema: true
    }
  } as SEOFooterComponent)

  return components
}

// Helper: Build an About page template
function buildAboutTemplate(): PageComponent[] {
  const id = () => `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const components: PageComponent[] = []

  // Hero
  components.push({
    id: id(),
    type: 'hero',
    data: {
      title: 'About Studio37 Photography',
      subtitle: 'Meet the passionate photographers behind your most precious moments',
      backgroundImage: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2000&auto=format&fit=crop',
      buttonText: 'View Our Work',
      buttonLink: '/gallery',
      alignment: 'center',
      overlay: 60,
      titleColor: 'text-white',
      subtitleColor: 'text-amber-50',
      buttonStyle: 'primary',
      animation: 'fade-in',
      buttonAnimation: 'hover-zoom',
      fullBleed: true
    }
  } as HeroComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'lg' } } as SpacerComponent)

  // Introduction
  components.push({
    id: id(),
    type: 'text',
    data: {
      content: '<h2 class="text-4xl font-bold mb-4">Meet Your Photography Team</h2><p class="text-lg text-gray-600">Christian and Caitie bring together years of experience, artistic vision, and genuine passion for storytelling through photography.</p>',
      alignment: 'center',
      size: 'lg',
      animation: 'fade-in'
    }
  } as TextComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'md' } } as SpacerComponent)

  // Team members
  components.push({
    id: id(),
    type: 'columns',
    data: {
      animation: 'fade-in',
      columns: [
        { content: '<div class="text-center"><h3 class="text-2xl font-bold mb-2">Christian</h3><p class="text-blue-600 font-semibold mb-4">CEO, Marketing Lead & Photographer</p><p class="text-gray-700">Christian brings business acumen and artistic vision to every project, specializing in wedding and commercial photography.</p></div>' },
        { content: '<div class="text-center"><h3 class="text-2xl font-bold mb-2">Caitie</h3><p class="text-purple-600 font-semibold mb-4">Co-Owner, Photographer & Editor</p><p class="text-gray-700">Caitie\'s creative direction and meticulous editing bring each image to life with artistic excellence.</p></div>' }
      ]
    }
  } as ColumnsComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'lg' } } as SpacerComponent)

  // Our approach
  components.push({
    id: id(),
    type: 'text',
    data: {
      content: '<h2 class="text-3xl font-bold mb-4">Our Approach</h2><p class="text-lg text-gray-600 mb-4">We believe every client deserves a personalized experience. From our first conversation to the final delivery, we focus on understanding your vision and bringing it to life through thoughtful, artistic photography.</p><p class="text-lg text-gray-600">Whether you\'re celebrating a wedding, building your brand, or capturing family moments, we\'re here to create images you\'ll treasure forever.</p>',
      alignment: 'center',
      size: 'md',
      animation: 'slide-up'
    }
  } as TextComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'md' } } as SpacerComponent)

  // Contact Form
  components.push({
    id: id(),
    type: 'contactForm',
    data: {
      heading: 'Send Us a Message',
      subheading: 'Tell us about your photography needs and we’ll reply within 24 hours.',
      animation: 'fade-in'
    }
  } as ContactFormComponent)

  // CTA
  components.push({
    id: id(),
    type: 'button',
    data: {
      text: 'Book a Session',
      link: '/book-a-session',
      style: 'primary',
      alignment: 'center',
      animation: 'hover-zoom'
    }
  } as ButtonComponent)

  return components
}

// Helper: Build a Services page template
function buildServicesTemplate(): PageComponent[] {
  const id = () => `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const components: PageComponent[] = []

  // Hero
  components.push({
    id: id(),
    type: 'hero',
    data: {
      title: 'Photography Services',
      subtitle: 'Professional photography capturing life\'s most precious moments with artistic excellence',
      backgroundImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop',
      buttonText: 'Explore Our Services',
      buttonLink: '#services',
      alignment: 'center',
      overlay: 60,
      titleColor: 'text-white',
      subtitleColor: 'text-amber-50',
      buttonStyle: 'primary',
      animation: 'fade-in',
      buttonAnimation: 'hover-zoom',
      fullBleed: true
    }
  } as HeroComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'lg' } } as SpacerComponent)

  // Services overview
  components.push({
    id: id(),
    type: 'text',
    data: {
      content: '<h2 class="text-4xl font-bold mb-4">Our Photography Services</h2><p class="text-lg text-gray-600">From weddings to portraits, events to commercial projects - we bring professional craftsmanship to every session.</p>',
      alignment: 'center',
      size: 'lg',
      animation: 'fade-in'
    }
  } as TextComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'md' } } as SpacerComponent)

  // Service columns
  components.push({
    id: id(),
    type: 'columns',
    data: {
      animation: 'fade-in',
      columns: [
        { content: '<div class="text-center p-4"><span class="text-4xl mb-3 block">💍</span><h3 class="text-xl font-bold mb-2">Wedding Photography</h3><p class="text-gray-600">Romantic, timeless wedding photography capturing your special day.</p></div>' },
        { content: '<div class="text-center p-4"><span class="text-4xl mb-3 block">👨‍👩‍👧‍👦</span><h3 class="text-xl font-bold mb-2">Portrait Photography</h3><p class="text-gray-600">Family portraits, senior photos, and professional headshots.</p></div>' },
        { content: '<div class="text-center p-4"><span class="text-4xl mb-3 block">🎉</span><h3 class="text-xl font-bold mb-2">Event Photography</h3><p class="text-gray-600">Corporate events, parties, and special occasions.</p></div>' }
      ]
    }
  } as ColumnsComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'md' } } as SpacerComponent)

  components.push({
    id: id(),
    type: 'columns',
    data: {
      animation: 'slide-up',
      columns: [
        { content: '<div class="text-center p-4"><span class="text-4xl mb-3 block">📸</span><h3 class="text-xl font-bold mb-2">Commercial Photography</h3><p class="text-gray-600">Product photography and brand imagery for businesses.</p></div>' },
        { content: '<div class="text-center p-4"><span class="text-4xl mb-3 block">🎨</span><h3 class="text-xl font-bold mb-2">Creative Sessions</h3><p class="text-gray-600">Artistic portraits and unique creative concepts.</p></div>' },
        { content: '<div class="text-center p-4"><span class="text-4xl mb-3 block">🏢</span><h3 class="text-xl font-bold mb-2">Real Estate</h3><p class="text-gray-600">Professional property photography for listings.</p></div>' }
      ]
    }
  } as ColumnsComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'lg' } } as SpacerComponent)

  // CTA
  components.push({
    id: id(),
    type: 'text',
    data: {
      content: '<h2 class="text-3xl font-bold mb-2">Ready to Book Your Session?</h2><p class="text-lg text-gray-600">Let\'s discuss your photography needs and create something beautiful together.</p>',
      alignment: 'center',
      size: 'md',
      animation: 'fade-in'
    }
  } as TextComponent)

  components.push({
    id: id(),
    type: 'button',
    data: {
      text: 'Book Now',
      link: '/book-a-session',
      style: 'primary',
      alignment: 'center',
      animation: 'hover-zoom'
    }
  } as ButtonComponent)

  return components
}

// Helper: Build a Contact page template
function buildContactTemplate(): PageComponent[] {
  const id = () => `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const components: PageComponent[] = []

  // Hero
  components.push({
    id: id(),
    type: 'hero',
    data: {
      title: 'Contact Us',
      subtitle: 'Get in touch to discuss your photography needs, book a session, or ask any questions',
      backgroundImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000&auto=format&fit=crop',
      buttonText: 'Send a Message',
      buttonLink: '#contact',
      alignment: 'center',
      overlay: 50,
      titleColor: 'text-white',
      subtitleColor: 'text-gray-200',
      buttonStyle: 'primary',
      animation: 'fade-in',
      buttonAnimation: 'hover-zoom',
      fullBleed: true
    }
  } as HeroComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'lg' } } as SpacerComponent)

  // Contact info
  components.push({
    id: id(),
    type: 'columns',
    data: {
      animation: 'fade-in',
      columns: [
        { content: '<div class="text-center"><span class="text-4xl mb-3 block">📧</span><h3 class="text-xl font-bold mb-2">Email</h3><p class="text-gray-600">contact@studio37.cc</p><p class="text-sm text-gray-500 mt-2">We respond within 24 hours</p></div>' },
        { content: '<div class="text-center"><span class="text-4xl mb-3 block">📞</span><h3 class="text-xl font-bold mb-2">Phone</h3><p class="text-gray-600">(xxx) xxx-xxxx</p><p class="text-sm text-gray-500 mt-2">Mon-Fri, 9AM-6PM CST</p></div>' },
        { content: '<div class="text-center"><span class="text-4xl mb-3 block">📍</span><h3 class="text-xl font-bold mb-2">Location</h3><p class="text-gray-600">Pinehurst, TX 77362</p><p class="text-sm text-gray-500 mt-2">Serving Montgomery County</p></div>' }
      ]
    }
  } as ColumnsComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'lg' } } as SpacerComponent)

  // Business hours & info
  components.push({
    id: id(),
    type: 'text',
    data: {
      content: '<h2 class="text-3xl font-bold mb-4">Let\'s Create Together</h2><p class="text-lg text-gray-600 mb-4">Whether you\'re planning a wedding, need professional headshots, or want to capture family memories, we\'d love to hear from you.</p><p class="text-gray-600">Fill out the form on our contact page or reach out directly via email or phone. We\'ll respond promptly to discuss your vision and how we can bring it to life.</p>',
      alignment: 'center',
      size: 'md',
      animation: 'slide-up'
    }
  } as TextComponent)

  components.push({ id: id(), type: 'spacer', data: { height: 'md' } } as SpacerComponent)

  // CTA
  components.push({
    id: id(),
    type: 'button',
    data: {
      text: 'Book a Session',
      link: '/book-a-session',
      style: 'primary',
      alignment: 'center',
      animation: 'hover-zoom'
    }
  } as ButtonComponent)

  return components
}

// Helper: Build a Services + Pricing template
function buildServicesPricingTemplate(): PageComponent[] {
  const id = () => `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const components: PageComponent[] = []

  // Hero
  components.push({
    id: id(),
    type: 'hero',
    data: {
      title: 'Services & Pricing',
      subtitle: 'Clear packages and pro results for portraits, events, and brands',
      backgroundImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop',
      buttonText: 'Book a Session',
      buttonLink: '/book-a-session',
      alignment: 'center',
      overlay: 55,
      titleColor: 'text-white',
      subtitleColor: 'text-amber-50',
      buttonStyle: 'primary',
      animation: 'fade-in',
      buttonAnimation: 'hover-zoom',
      fullBleed: true
    }
  } as HeroComponent)

  // Services Grid
  components.push({
    id: id(),
    type: 'servicesGrid',
    data: {
      heading: 'Our Photography Services',
      subheading: 'From intimate portraits to brand visuals, tailored to your needs',
      services: [
        {
          image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
          title: 'Portrait Sessions',
          description: 'Headshots, family portraits, senior photos—studio or on-location.',
          features: ['Studio or outdoor', 'Multiple outfits', 'Retouched images']
        },
        {
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
          title: 'Weddings',
          description: 'Timeless coverage of your day, from details to dance floor.',
          features: ['Engagement session', 'Full-day options', 'Online gallery']
        },
        {
          image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
          title: 'Commercial',
          description: 'Product and brand imagery that elevates your business.',
          features: ['Product shots', 'Brand imagery', 'Usage rights']
        }
      ],
      columns: 3,
      animation: 'fade-in'
    }
  } as ServicesGridComponent)

  // Pricing Table
  components.push({
    id: id(),
    type: 'pricingTable',
    data: {
      heading: 'Packages & Pricing',
      subheading: 'Simple packages for every need',
      plans: [
        { title: 'Basic', price: '$199', period: 'per session', features: ['30 min session', '10 edited photos', 'Online gallery'], ctaText: 'Book Basic', ctaLink: '/book-a-session', highlight: false },
        { title: 'Standard', price: '$349', period: 'per session', features: ['60 min session', '25 edited photos', 'Online gallery', 'Print rights'], ctaText: 'Book Standard', ctaLink: '/book-a-session', highlight: true },
        { title: 'Premium', price: '$599', period: 'per session', features: ['120 min session', '50 edited photos', 'Online gallery', 'Print rights', 'Priority turnaround'], ctaText: 'Book Premium', ctaLink: '/book-a-session', highlight: false }
      ],
      columns: 3,
      animation: 'fade-in',
      style: 'light',
      variant: 'card',
      showFeatureChecks: true
    }
  } as PricingTableComponent)

  // CTA Banner
  components.push({
    id: id(),
    type: 'ctaBanner',
    data: {
      heading: 'Ready to Book Your Session?',
      subheading: "Let's create something beautiful together.",
      primaryButtonText: 'Book Now',
      primaryButtonLink: '/book-a-session',
      secondaryButtonText: 'Contact Us',
      secondaryButtonLink: '/contact',
      backgroundColor: '#0f172a',
      overlay: 60,
      textColor: 'text-white',
      fullBleed: true,
      animation: 'fade-in'
    }
  } as CTABannerComponent)

  return components
}

// Helper: Build a dedicated FAQ page template
function buildFAQPageTemplate(): PageComponent[] {
  const id = () => `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const components: PageComponent[] = []

  // Hero
  components.push({
    id: id(),
    type: 'hero',
    data: {
      title: 'Frequently Asked Questions',
      subtitle: 'Answers about booking, turnaround, travel, and more',
      backgroundImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop',
      buttonText: 'Book a Session',
      buttonLink: '/book-a-session',
      alignment: 'center',
      overlay: 50,
      titleColor: 'text-white',
      subtitleColor: 'text-amber-50',
      buttonStyle: 'primary',
      animation: 'fade-in',
      buttonAnimation: 'hover-zoom',
      fullBleed: true
    }
  } as HeroComponent)

  // FAQ
  components.push({
    id: id(),
    type: 'faq',
    data: {
      heading: 'Your Questions, Answered',
      items: [
        { question: 'How do I book?', answer: 'Use the Book a Session page or contact us. We confirm within 24 hours.' },
        { question: 'What is the turnaround?', answer: 'Most sessions are delivered within 48 hours.' },
        { question: 'Do you travel?', answer: 'Yes, we serve Tomball, Magnolia, Pinehurst and surrounding areas.' }
      ],
      columns: 1,
      animation: 'fade-in'
    }
  } as FAQComponent)

  // CTA Button
  components.push({
    id: id(),
    type: 'button',
    data: {
      text: 'Still have questions? Contact us →',
      link: '/contact',
      style: 'primary',
      alignment: 'center',
      animation: 'hover-zoom'
    }
  } as ButtonComponent)

  return components
}
// Helper: Build a Lead Gen Landing template
function buildLeadGenTemplate(): PageComponent[] {
  const id = () => `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const components: PageComponent[] = []

  // Hero with strong CTA
  components.push({
    id: id(),
    type: 'hero',
    data: {
      title: 'Tomball • Magnolia • Pinehurst',
      subtitle: 'Artistic portraits and commercial photography with professional craftsmanship',
      backgroundImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop',
      buttonText: 'Get Your Quote',
      buttonLink: '#contact',
      secondaryButtonText: 'View Gallery',
      secondaryButtonLink: '/gallery',
      alignment: 'center',
      overlay: 55,
      titleColor: 'text-white',
      subtitleColor: 'text-amber-50',
      buttonStyle: 'primary',
      animation: 'fade-in',
      buttonAnimation: 'hover-zoom',
      fullBleed: true
    }
  } as HeroComponent)

  // Badges / social proof
  components.push({
    id: id(),
    type: 'badges',
    data: {
      badges: [
        { icon: 'google', label: '5.0 • Google Reviews', sublabel: '★★★★★', color: '#34a853', href: 'https://www.google.com/search' },
        { icon: 'thumbtack', label: 'Thumbtack Top Pro', sublabel: 'Highly Rated', color: '#15a6ff', href: 'https://www.thumbtack.com' },
        { icon: 'shield', label: 'Certified Professional Photographer', sublabel: 'Studio 37', color: '#0ea5e9' }
      ],
      alignment: 'center',
      size: 'md',
      style: 'pill',
      animation: 'fade-in'
    }
  } as BadgesComponent)

  // Icon features
  components.push({
    id: id(),
    type: 'iconFeatures',
    data: {
      heading: 'Why Choose Studio 37',
      subheading: 'Professional, fast, and premium results',
      features: [
        { icon: '📸', title: 'Professional Gear', description: 'Top-tier cameras and lighting' },
        { icon: '⚡', title: 'Fast Turnaround', description: 'Edited photos within 48 hours' },
        { icon: '💎', title: 'Premium Quality', description: 'Expert retouching and delivery' },
        { icon: '🎨', title: 'Creative Direction', description: 'Concepts tailored to your vision' }
      ],
      columns: 4,
      animation: 'fade-in'
    }
  } as IconFeaturesComponent)

  // Stats
  components.push({
    id: id(),
    type: 'stats',
    data: {
      heading: 'Our Track Record',
      stats: [
        { icon: '👥', number: '150', label: 'Business Clients', suffix: '+' },
        { icon: '📸', number: '800', label: 'Projects Completed', suffix: '+' },
        { icon: '⭐', number: '95', label: 'Client Retention', suffix: '%' }
      ],
      columns: 3,
      style: 'cards',
      animation: 'fade-in'
    }
  } as StatsComponent)

  // CTA Banner
  components.push({
    id: id(),
    type: 'ctaBanner',
    data: {
      heading: 'Ready to Get a Quote?',
      subheading: 'Tell us about your project and we’ll respond today.',
      primaryButtonText: 'Get Started',
      primaryButtonLink: '#contact',
      secondaryButtonText: 'View Packages',
      secondaryButtonLink: '/services',
      backgroundColor: '#0f172a',
      overlay: 60,
      textColor: 'text-white',
      fullBleed: true,
      animation: 'fade-in'
    }
  } as CTABannerComponent)

  // Contact form
  components.push({
    id: id(),
    type: 'contactForm',
    data: {
      heading: 'Get Your Free Quote',
      subheading: 'Share a few details and we’ll follow up right away.',
      animation: 'fade-in'
    }
  } as ContactFormComponent)

  // FAQ
  components.push({
    id: id(),
    type: 'faq',
    data: {
      heading: 'Frequently Asked Questions',
      items: [
        { question: 'How fast is turnaround?', answer: 'Most sessions are delivered within <strong>48 hours</strong>.' },
        { question: 'Do you travel?', answer: 'Yes, we serve Tomball, Magnolia, Pinehurst and surrounding areas.' },
        { question: 'How do I book?', answer: 'Use the <a href="/book-a-session">Book a Session</a> page or contact us.' }
      ],
      columns: 1,
      animation: 'fade-in'
    }
  } as FAQComponent)

  // Newsletter
  components.push({
    id: id(),
    type: 'newsletterSignup',
    data: {
      heading: 'Get 10% Off Your First Session',
      subheading: 'Subscribe for tips, behind-the-scenes, and special offers.',
      disclaimer: 'By subscribing, you agree to receive marketing emails. Unsubscribe anytime.',
      style: 'card',
      animation: 'fade-in'
    }
  } as NewsletterComponent)

  return components
}

// Apply template to the current editor state and notify parent
function applyHomepageTemplate(this: void) {
  // This will be rebound in the component scope below
}

// Individual Component Renderers
function HeroRenderer({ data }: { data: HeroComponent['data'] }) {
  const buttonStyleClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30',
    outline: 'border-2 border-white text-white hover:bg-white/10'
  }
  const anim = data.animation || 'none'
  const animClass = anim === 'fade-in' ? 'animate-fadeIn' : anim === 'slide-up' ? 'animate-slideUp' : anim === 'zoom' ? 'animate-zoom' : ''
  const buttonHoverZoom = (data.buttonAnimation || 'none') === 'hover-zoom' ? 'transition-transform duration-300 hover:scale-105' : ''
  const heightClasses = 'min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh]'
  
  return (
    <div className={`relative ${heightClasses} flex items-center justify-center text-white overflow-hidden ${animClass}`}>
      {data.backgroundImage && (
        <Image src={data.backgroundImage} alt="" fill className="object-cover" />
      )}
      <div 
        className="absolute inset-0 bg-black/60"
        style={{ backgroundColor: `rgba(0,0,0,${Math.min(Math.max(Number(data.overlay ?? 50), 0), 100) / 100})` }}
      />
      <div className={`relative z-10 text-${data.alignment} max-w-4xl px-8`}>
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${data.titleColor || 'text-white'}`} dangerouslySetInnerHTML={{ __html: data.title }} />
        <p className={`text-lg md:text-xl mb-6 ${data.subtitleColor || 'text-amber-50'}`} dangerouslySetInnerHTML={{ __html: data.subtitle }} />
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {data.buttonText && (
            <a href={data.buttonLink} className={`inline-block px-6 py-3 rounded-lg transition no-underline ${buttonStyleClasses[data.buttonStyle || 'primary']} ${buttonHoverZoom}`}>
              {data.buttonText}
            </a>
          )}
          {data.secondaryButtonText && (
            <a href={data.secondaryButtonLink || '#'} className={`inline-block px-6 py-3 rounded-lg transition no-underline ${buttonStyleClasses.outline} ${buttonHoverZoom}`}>
              {data.secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function TextRenderer({ data }: { data: TextComponent['data'] }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl'
  }
  const anim = data.animation || 'none'
  const animClass = anim === 'fade-in' ? 'animate-fadeIn' : anim === 'slide-up' ? 'animate-slideUp' : anim === 'zoom' ? 'animate-zoom' : ''
  
  return (
    <div className={`p-8 text-${data.alignment} ${sizeClasses[data.size]} ${animClass}`}>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  )
}

function ImageRenderer({ data }: { data: ImageComponent['data'] }) {
  const widthClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full'
  }
  
  const animationClasses = {
    none: '',
    'fade-in': 'animate-fadeIn',
    'slide-up': 'animate-slideUp',
    'zoom': 'animate-zoom',
    'hover-zoom': 'transition-transform duration-300 hover:scale-105'
  }
  
  const imageElement = (
    <div className={`mx-auto ${widthClasses[data.width]}`}>
      {data.url && (
        <div className={`relative aspect-video ${animationClasses[data.animation || 'none']} overflow-hidden`}>
          <Image src={data.url} alt={data.alt} fill className="object-cover rounded-lg" />
        </div>
      )}
      {data.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">{data.caption}</p>
      )}
    </div>
  )
  
  return (
    <div className="p-8">
      {data.link ? (
        <a href={data.link} className="block cursor-pointer">
          {imageElement}
        </a>
      ) : imageElement}
    </div>
  )
}

function ButtonRenderer({ data }: { data: ButtonComponent['data'] }) {
  const styleClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
  }
  const anim = data.animation || 'none'
  const animClass = anim === 'fade-in' ? 'animate-fadeIn' : anim === 'slide-up' ? 'animate-slideUp' : anim === 'zoom' ? 'animate-zoom' : ''
  const hoverZoom = anim === 'hover-zoom' ? 'transition-transform duration-300 hover:scale-105' : ''
  return (
    <div className={`p-8 text-${data.alignment} ${animClass}`}>
      <a
        href={data.link}
        className={`inline-block px-6 py-3 rounded-lg transition no-underline ${styleClasses[data.style]} ${hoverZoom}`}
      >
        {data.text}
      </a>
    </div>
  )
}

function ColumnsRenderer({ data }: { data: ColumnsComponent['data'] }) {
  const count = Math.min(Math.max(data.columns.length || 2, 1), 4)
  const gridClass =
    count === 1
      ? 'grid-cols-1'
      : count === 2
      ? 'grid-cols-2'
      : count === 3
      ? 'grid-cols-3'
      : 'grid-cols-4'
  const anim = data.animation || 'none'
  const animClass = anim === 'fade-in' ? 'animate-fadeIn' : anim === 'slide-up' ? 'animate-slideUp' : anim === 'zoom' ? 'animate-zoom' : ''
  return (
    <div className={`p-8 ${animClass}`}>
      <div className={`grid ${gridClass} gap-6`}>
        {data.columns.map((col, i) => (
          <div key={i} className="space-y-4">
            {col.image && (
              <div className="relative aspect-video">
                <Image src={col.image} alt="" fill className="object-cover rounded-lg" />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: col.content }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SpacerRenderer({ data }: { data: SpacerComponent['data'] }) {
  const heights = {
    sm: 'h-8',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32'
  }
  
  return <div className={heights[data.height]} />
}

function SEOFooterRenderer({ data }: { data: SEOFooterComponent['data'] }) {
  return (
    <footer className="p-8 bg-gray-50 border-t">
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />
      <p className="text-xs text-gray-500 mt-3">SEO footer preview</p>
    </footer>
  )
}

// Badges Renderer (Editor Preview)
function BadgesRenderer({ data }: { data: BadgesComponent['data'] }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }
  const containerAlign = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  const Icon = ({ name, className }: { name: BadgesComponent['data']['badges'][number]['icon']; className?: string }) => {
    const cls = className || 'h-4 w-4'
    switch (name) {
      case 'star':
      case 'yelp':
      case 'google':
        return (
          <svg className={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        )
      case 'thumbtack':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14 2l8 8-5.5 1.5L10.5 17 7 13.5l5.5-6.5L14 2z" />
          </svg>
        )
      case 'shield':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l7 3v6c0 5.55-3.84 10.74-7 12-3.16-1.26-7-6.45-7-12V5l7-3z" />
            <path d="M10 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )
      case 'camera':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 3l2 2h2l2-2h3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4z" />
            <circle cx="12" cy="13" r="4" fill="currentColor" />
          </svg>
        )
      case 'check':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z" />
          </svg>
        )
      default:
        return null
    }
  }

  const badgeBase = data.style === 'solid'
    ? 'bg-primary-600 text-white'
    : data.style === 'outline'
    ? 'border border-gray-300 text-gray-800 bg-white'
    : 'bg-white/90 border border-gray-200 text-gray-800 rounded-full'

  return (
    <div className={`p-6 ${data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''}`}>
      <div className={`flex flex-wrap gap-2 ${containerAlign[data.alignment || 'center']}`}>
        {(data.badges || []).map((b, i) => {
          const styleColor = b.color && b.color.startsWith('#') ? { color: b.color } as React.CSSProperties : undefined
          const colorClass = b.color && b.color.startsWith('text-') ? b.color : ''
          const content = (
            <span className={`inline-flex items-center gap-2 ${sizeClasses[data.size || 'md']} ${badgeBase}`}>
              <span className={`inline-flex items-center ${colorClass}`} style={styleColor}>
                <Icon name={b.icon} />
              </span>
              <span className="font-medium">{b.label}</span>
              {b.sublabel && <span className="text-xs opacity-80">{b.sublabel}</span>}
            </span>
          )
          return b.href ? (
            <a key={i} href={b.href} className="no-underline" target="_blank" rel="noopener noreferrer">{content}</a>
          ) : (
            <span key={i}>{content}</span>
          )
        })}
      </div>
    </div>
  )
}

// Services Grid Renderer (Editor Preview)
function ServicesGridRenderer({ data }: { data: ServicesGridComponent['data'] }) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`p-8 ${data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.heading}</h2>
            {data.subheading && <p className="text-lg text-gray-600">{data.subheading}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols[data.columns || 3]} gap-6`}>
          {(data.services || []).map((service, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {service.image && (
                <div className="aspect-video relative overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                {service.description && <p className="text-gray-600 mb-4">{service.description}</p>}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2">
                    {service.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Stats Renderer (Editor Preview)
function StatsRenderer({ data }: { data: StatsComponent['data'] }) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  const styleClasses = {
    default: '',
    cards: 'bg-white rounded-lg shadow-md p-6',
    minimal: 'border-b border-gray-200 pb-4'
  }

  return (
    <div className={`p-8 ${data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{data.heading}</h2>
        )}
        <div className={`grid grid-cols-1 ${gridCols[data.columns || 3]} gap-6`}>
          {(data.stats || []).map((stat, i) => (
            <div key={i} className={`text-center ${styleClasses[data.style || 'default']}`}>
              {stat.icon && (
                <div className="text-4xl mb-3">{stat.icon}</div>
              )}
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stat.number}{stat.suffix || ''}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// CTA Banner Renderer (Editor Preview)
function CTABannerRenderer({ data }: { data: CTABannerComponent['data'] }) {
  const overlayAlpha = Math.min(Math.max(Number(data.overlay ?? 60), 0), 100) / 100
  const animClass = data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''

  return (
    <div className={`relative min-h-[300px] flex items-center justify-center overflow-hidden ${data.fullBleed ? '' : 'rounded-lg'} ${animClass}`}>
      {data.backgroundImage && (
        <Image src={data.backgroundImage} alt="CTA Background" fill className="object-cover" />
      )}
      {!data.backgroundImage && data.backgroundColor && (
        <div className="absolute inset-0" style={{ backgroundColor: data.backgroundColor }} />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />
      <div className={`relative z-10 max-w-4xl w-full px-6 text-center py-12`}>
        {data.heading && (
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${data.textColor || 'text-white'}`}>
            {data.heading}
          </h2>
        )}
        {data.subheading && (
          <p className={`text-lg md:text-xl mb-6 opacity-90 ${data.textColor || 'text-white'}`}>
            {data.subheading}
          </p>
        )}
        {(data.primaryButtonText || data.secondaryButtonText) && (
          <div className="flex flex-wrap gap-3 justify-center">
            {data.primaryButtonText && (
              <a href={data.primaryButtonLink || '#'} className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition no-underline">
                {data.primaryButtonText}
              </a>
            )}
            {data.secondaryButtonText && (
              <a href={data.secondaryButtonLink || '#'} className="inline-block px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition no-underline">
                {data.secondaryButtonText}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Icon Features Renderer (Editor Preview)
function IconFeaturesRenderer({ data }: { data: IconFeaturesComponent['data'] }) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }
  const animClass = data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''

  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.heading}</h2>
            {data.subheading && <p className="text-lg text-gray-600">{data.subheading}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols[data.columns || 3]} gap-6`}>
          {(data.features || []).map((feature, i) => (
            <div key={i} className="text-center p-6">
              {feature.icon && (
                <div className="text-5xl mb-4">{feature.icon}</div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Logo Renderer (Editor Preview)
function LogoRenderer({ data }: { data: LogoComponent['data'] }) {
  const sizeMap: Record<string,string> = { sm: 'text-xl', md: 'text-2xl md:text-3xl', lg: 'text-4xl md:text-5xl' }
  const alignMap: Record<string,string> = { left: 'justify-start text-left', center: 'justify-center text-center', right: 'justify-end text-right' }
  const anim = data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''

  const content = (
    <div className={`flex items-center gap-3 ${sizeMap[data.size || 'md']}`}>
      {data.mode === 'image' && data.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.imageUrl} alt={data.text || 'Logo'} className="h-10 w-auto object-contain" />
      ) : (
        <div className="flex items-center gap-2">
          {data.showCamera && (
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill={data.accentColor || '#b46e14'} aria-hidden="true"><path d="M9 3l2 2h2l2-2h3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4z"/><circle cx="12" cy="13" r="4" fill="currentColor"/></svg>
          )}
          <div>
            <div className="font-serif font-bold leading-none" style={{ color: data.color || '#111827' }}>{data.text || 'Studio 37'}</div>
            {data.subtext && <div className="text-sm tracking-wide" style={{ color: data.accentColor || '#b46e14' }}>{data.subtext}</div>}
          </div>
        </div>
      )}
    </div>
  )

  const wrapped = data.link ? <a href={data.link} className="no-underline">{content}</a> : content

  return (
    <div className={`p-4 ${anim}`}>
      <div className={`flex ${alignMap[data.alignment || 'left']}`}>{wrapped}</div>
    </div>
  )
}

// Contact Form Renderer (Editor Preview)
function ContactFormRenderer({ data }: { data: ContactFormComponent['data'] }) {
  const animClass = data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''
  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-3xl mx-auto">
        {(data.heading || data.subheading) && (
          <div className="text-center mb-6">
            {data.heading && <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.heading}</h2>}
            {data.subheading && <p className="text-gray-600">{data.subheading}</p>}
          </div>
        )}
        <div className="bg-gray-50 border rounded-lg p-6 text-gray-600">
          <div className="text-sm mb-3">Contact form preview</div>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="border rounded px-3 py-2" placeholder="Full Name" disabled />
            <input className="border rounded px-3 py-2" placeholder="Email" disabled />
            <input className="border rounded px-3 py-2" placeholder="Phone" disabled />
            <select className="border rounded px-3 py-2" disabled><option>Service Interest</option></select>
            <select className="border rounded px-3 py-2" disabled><option>Budget Range</option></select>
            <input className="border rounded px-3 py-2" placeholder="Event Date" disabled />
          </div>
          <textarea className="border rounded px-3 py-2 mt-4 w-full" placeholder="Message" rows={3} disabled />
          <button className="btn-primary mt-4 opacity-60 cursor-not-allowed" disabled>Get Your Quote</button>
        </div>
      </div>
    </div>
  )
}

// Newsletter Renderer (Editor Preview)
function NewsletterRenderer({ data }: { data: NewsletterComponent['data'] }) {
  const animClass = data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''
  const wrapperClass = data.style === 'banner' ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'
  return (
    <div className={`p-8 ${animClass}`}>
      <div className={`max-w-3xl mx-auto border rounded-xl p-6 ${wrapperClass}`}>
        {(data.heading || data.subheading) && (
          <div className="text-center mb-6">
            {data.heading && <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.heading}</h2>}
            {data.subheading && <p className="text-gray-600">{data.subheading}</p>}
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Full Name" disabled />
          <input className="border rounded px-3 py-2" placeholder="Email" disabled />
          <input className="border rounded px-3 py-2" placeholder="Phone" disabled />
        </div>
        <button className="btn-primary mt-4 opacity-60 cursor-not-allowed" disabled>Subscribe</button>
        {data.disclaimer && <p className="text-xs text-gray-500 mt-2 text-center">{data.disclaimer}</p>}
      </div>
    </div>
  )
}

// FAQ Renderer (Editor Preview)
function FAQRenderer({ data }: { data: FAQComponent['data'] }) {
  const animClass = data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''
  const gridCols = (data.columns || 1) === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'
  const items = data.items || []
  const mid = Math.ceil(items.length / (data.columns || 1))
  const col1 = items.slice(0, (data.columns || 1) === 2 ? mid : items.length)
  const col2 = (data.columns || 1) === 2 ? items.slice(mid) : []
  const renderCol = (arr: typeof items) => (
    <div className="space-y-3">
      {arr.map((qa, i) => (
        <details key={i} className="group bg-white border rounded-lg p-4">
          <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
            <span>{qa.question}</span>
            <span className="ml-4 text-gray-400 group-open:rotate-180 transition">⌄</span>
          </summary>
          <div className="mt-2 text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: qa.answer }} />
          </div>
        </details>
      ))}
    </div>
  )
  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-5xl mx-auto">
        {data.heading && <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{data.heading}</h2>}
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {renderCol(col1)}
          {col2.length > 0 && renderCol(col2)}
        </div>
      </div>
    </div>
  )
}

// Pricing Table Renderer (Editor Preview)
function PricingTableRenderer({ data }: { data: PricingTableComponent['data'] }) {
  const animClass = data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }[data.columns || 3]
  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {(data.heading || data.subheading) && (
          <div className="text-center mb-8">
            {data.heading && <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.heading}</h2>}
            {data.subheading && <p className="text-lg text-gray-600">{data.subheading}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {(data.plans || []).map((plan, i) => (
            <div key={i} className={`rounded-xl border ${plan.highlight ? 'border-primary-300 ring-1 ring-primary-200 bg-primary-50/30' : 'border-gray-200 bg-white'} p-6 flex flex-col`}>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                <div className="mt-2 text-3xl font-extrabold text-gray-900">{plan.price} {plan.period && <span className="text-sm text-gray-500 font-medium">/ {plan.period}</span>}</div>
              </div>
              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-gray-700">
                      {(data.showFeatureChecks ?? true) && (
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {plan.ctaText && (
                <a href={plan.ctaLink || '#'} className={`mt-auto inline-block px-5 py-2 rounded-lg text-center no-underline ${plan.highlight ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border border-primary-600 text-primary-700 hover:bg-primary-50'}`}>
                  {plan.ctaText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Slideshow Hero Renderer (Editor Preview)
function SlideshowHeroRenderer({ data }: { data: SlideshowHeroComponent['data'] }) {
  const [idx, setIdx] = React.useState(0)
  React.useEffect(() => {
    if (!data.slides || data.slides.length < 2) return
    const id = setInterval(() => setIdx((i) => (i + 1) % data.slides.length), Math.max(1500, data.intervalMs || 5000))
    return () => clearInterval(id)
  }, [data.slides?.length, data.intervalMs])
  const slide = data.slides?.[idx]
  const overlayAlpha = Math.min(Math.max(Number(data.overlay ?? 60), 0), 100) / 100
  const buttonStyleClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30',
    outline: 'border-2 border-white text-white hover:bg-white/10'
  }
  const hoverZoom = (data.buttonAnimation || 'none') === 'hover-zoom' ? 'transition-transform duration-300 hover:scale-105' : ''
  return (
    <div className={`relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden ${data.fullBleed ? '' : 'rounded-lg'}`}>
      {slide && (
        <Image src={slide.image} alt={slide.title || 'Slide'} fill className="object-cover" />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />
      <div className={`relative z-10 max-w-4xl w-full px-6 text-${data.alignment || 'center'}`}>
        {data.title && <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${data.titleColor || 'text-white'}`} dangerouslySetInnerHTML={{ __html: data.title }} />}
        {data.subtitle && <p className={`text-lg md:text-xl mb-6 opacity-90 ${data.subtitleColor || 'text-amber-50'}`} dangerouslySetInnerHTML={{ __html: data.subtitle }} />}
        {data.buttonText && (
          <a href={data.buttonLink || '#'} className={`inline-block px-6 py-3 rounded-lg transition no-underline ${buttonStyleClasses[data.buttonStyle || 'primary']} ${hoverZoom}`}>
            {data.buttonText}
          </a>
        )}
        {slide?.category && <div className="mt-3 text-sm opacity-80">{slide.category}</div>}
      </div>
    </div>
  )
}

// Testimonials Renderer (Editor Preview)
function TestimonialsRenderer({ data }: { data: TestimonialsComponent['data'] }) {
  const [idx, setIdx] = React.useState(0)
  React.useEffect(() => {
    if (!data.testimonials || data.testimonials.length < 2) return
    const id = setInterval(() => setIdx((i) => (i + 1) % data.testimonials.length), 5000)
    return () => clearInterval(id)
  }, [data.testimonials?.length])
  const t = data.testimonials?.[idx]
  return (
    <div className={`p-8 ${data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''}`}>
      <div className="max-w-3xl mx-auto text-center">
        {t?.avatar && <img src={t.avatar} alt={t.author || 'Client'} className="mx-auto h-16 w-16 rounded-full object-cover mb-4" />}
        {t?.quote && <blockquote className="text-xl italic text-gray-800">"{t.quote}"</blockquote>}
        {(t?.author || t?.subtext) && (
          <div className="mt-3 text-gray-600">
            {t?.author && <div className="font-medium">{t.author}</div>}
            {t?.subtext && <div className="text-sm opacity-80">{t.subtext}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

// Gallery Highlights Renderer (Editor Preview)
function GalleryHighlightsRenderer({ data }: { data: GalleryHighlightsComponent['data'] }) {
  return (
    <div className={`p-8 ${data.animation === 'fade-in' ? 'animate-fadeIn' : data.animation === 'slide-up' ? 'animate-slideUp' : data.animation === 'zoom' ? 'animate-zoom' : ''}`}>
      <div className="border rounded-lg p-6 bg-gray-50">
        <h4 className="font-semibold mb-2">Gallery Highlights (Preview)</h4>
        <p className="text-sm text-gray-600">This will show featured images from the database when published.</p>
        <div className="mt-3 text-sm">
          <div><span className="font-medium">Categories:</span> {data.categories?.length ? data.categories.join(', ') : 'All'}</div>
          <div><span className="font-medium">Featured only:</span> {String(data.featuredOnly ?? true)}</div>
          <div><span className="font-medium">Limit:</span> {data.limit || 6}</div>
          {data.collections && <div><span className="font-medium">Collections:</span> {data.collections.length ? data.collections.join(', ') : 'Any'}</div>}
          {data.tags && <div><span className="font-medium">Tags:</span> {data.tags.length ? data.tags.join(', ') : 'Any'}</div>}
          {typeof data.limitPerCategory === 'number' && data.limitPerCategory > 0 && (
            <div><span className="font-medium">Limit per category:</span> {data.limitPerCategory}</div>
          )}
          <div><span className="font-medium">Group:</span> {data.group || '—'}</div>
          <div><span className="font-medium">Sort:</span> {(data.sortBy || 'display_order')} · {(data.sortDir || 'asc')}</div>
        </div>
      </div>
    </div>
  )
}

// Widget Embed Renderer (Editor Preview)
function WidgetEmbedRenderer({ data }: { data: WidgetEmbedComponent['data'] }) {
  return (
    <div className="p-6">
      <div className="border rounded-lg p-6 bg-gray-50">
        <h4 className="font-semibold mb-2">{data.provider ? `${data.provider[0].toUpperCase()}${data.provider.slice(1)}` : 'Custom'} Widget</h4>
        <p className="text-sm text-gray-600">Preview only. Third-party scripts run on the published page.</p>
        <div className="mt-3 text-xs text-gray-500">
          <div>Scripts: {data.scriptSrcs?.length || 0}</div>
          <div>Style reset: {String(data.styleReset ?? true)}</div>
        </div>
        <div className="mt-3 text-xs text-gray-500 line-clamp-3">
          {(data.html || '').slice(0, 200) || '<no html>'}
        </div>
      </div>
    </div>
  )
}

// Logo Properties
function LogoProperties({ data, onUpdate }: { data: LogoComponent['data']; onUpdate: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Mode</label>
          <select value={data.mode} onChange={(e)=>onUpdate({ mode: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="svg">SVG Wordmark</option>
            <option value="image">Image URL</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <select value={data.size || 'md'} onChange={(e)=>onUpdate({ size: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select value={data.alignment || 'left'} onChange={(e)=>onUpdate({ alignment: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {data.mode === 'image' ? (
        <div>
          <label className="block text-sm font-medium mb-1">Logo Image URL</label>
          <input type="url" value={data.imageUrl || ''} onChange={(e)=>onUpdate({ imageUrl: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="https://res.cloudinary.com/.../logo.png" />
          <p className="text-xs text-gray-500 mt-1">Upload to Cloudinary and paste the URL here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Text</label>
              <input type="text" value={data.text || ''} onChange={(e)=>onUpdate({ text: e.target.value })} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtext</label>
              <input type="text" value={data.subtext || ''} onChange={(e)=>onUpdate({ subtext: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Photography" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <input type="text" value={data.color || ''} onChange={(e)=>onUpdate({ color: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="#111827" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Accent Color</label>
              <input type="text" value={data.accentColor || ''} onChange={(e)=>onUpdate({ accentColor: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="#b46e14" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id="showCamera" type="checkbox" checked={!!data.showCamera} onChange={(e)=>onUpdate({ showCamera: e.target.checked })} />
            <label htmlFor="showCamera" className="text-sm">Show camera icon</label>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Link (optional)</label>
        <input type="url" value={data.link || ''} onChange={(e)=>onUpdate({ link: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="/ or https://..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select value={data.animation || 'none'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  )
}
// Component Properties Editor
function ComponentProperties({ component, onUpdate }: { component: PageComponent; onUpdate: (data: any) => void }) {
  switch (component.type) {
    case 'faq':
      return <FAQProperties data={component.data as FAQComponent['data']} onUpdate={onUpdate} />
    case 'pricingTable':
      return <PricingTableProperties data={component.data as PricingTableComponent['data']} onUpdate={onUpdate} />
    case 'contactForm':
      return <ContactFormProperties data={component.data as ContactFormComponent['data']} onUpdate={onUpdate} />
    case 'newsletterSignup':
      return <NewsletterProperties data={component.data as NewsletterComponent['data']} onUpdate={onUpdate} />
    case 'logo':
      return <LogoProperties data={component.data as LogoComponent['data']} onUpdate={onUpdate} />
    case 'hero':
      return <HeroProperties data={component.data as HeroComponent['data']} onUpdate={onUpdate} />
    case 'text':
      return <TextProperties data={component.data as TextComponent['data']} onUpdate={onUpdate} />
    case 'image':
      return <ImageProperties data={component.data as ImageComponent['data']} onUpdate={onUpdate} />
    case 'button':
      return <ButtonProperties data={component.data as ButtonComponent['data']} onUpdate={onUpdate} />
    case 'columns':
      return <ColumnsProperties data={component.data as ColumnsComponent['data']} onUpdate={onUpdate} />
    case 'spacer':
      return <SpacerProperties data={component.data as SpacerComponent['data']} onUpdate={onUpdate} />
    case 'seoFooter':
      return <SEOFooterProperties data={component.data as SEOFooterComponent['data']} onUpdate={onUpdate} />
    case 'slideshowHero':
      return <SlideshowHeroProperties data={component.data as SlideshowHeroComponent['data']} onUpdate={onUpdate} />
    case 'testimonials':
      return <TestimonialsProperties data={component.data as TestimonialsComponent['data']} onUpdate={onUpdate} />
    case 'galleryHighlights':
      return <GalleryHighlightsProperties data={component.data as GalleryHighlightsComponent['data']} onUpdate={onUpdate} />
    case 'widgetEmbed':
      return <WidgetEmbedProperties data={component.data as WidgetEmbedComponent['data']} onUpdate={onUpdate} />
    case 'badges':
      return <BadgesProperties data={component.data as BadgesComponent['data']} onUpdate={onUpdate} />
    case 'servicesGrid':
      return <ServicesGridProperties data={component.data as ServicesGridComponent['data']} onUpdate={onUpdate} />
    case 'stats':
      return <StatsProperties data={component.data as StatsComponent['data']} onUpdate={onUpdate} />
    case 'ctaBanner':
      return <CTABannerProperties data={component.data as CTABannerComponent['data']} onUpdate={onUpdate} />
    case 'iconFeatures':
      return <IconFeaturesProperties data={component.data as IconFeaturesComponent['data']} onUpdate={onUpdate} />
    default:
      return null
  }
}

// Add missing HeroProperties component
function HeroProperties({ data, onUpdate }: { data: HeroComponent['data']; onUpdate: (data: any) => void }) {
  const titleRef = React.useRef<HTMLTextAreaElement>(null)
  const subtitleRef = React.useRef<HTMLTextAreaElement>(null)

  const insertTitleFormatting = (before: string, after: string) => {
    const textarea = titleRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = data.title
    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    onUpdate({ title: newText })
    setTimeout(() => {
      textarea.focus()
      const newPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const insertSubtitleFormatting = (before: string, after: string) => {
    const textarea = subtitleRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = data.subtitle
    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    onUpdate({ subtitle: newText })
    setTimeout(() => {
      textarea.focus()
      const newPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        {/* Title Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertTitleFormatting('<strong>', '</strong>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting('<em>', '</em>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting('<br/>', '')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Line break"
          >
            ↵
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting('<span class="text-amber-300">', '</span>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Highlight (amber)"
          >
            ✨
          </button>
        </div>
        <textarea
          ref={titleRef}
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={2}
          title="Hero title"
          placeholder="Enter hero title (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">Tip: Use &lt;br/&gt; for line breaks, &lt;strong&gt; for bold</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Layout</label>
        <div className="flex items-center gap-2">
          <input
            id="hero-fullbleed"
            type="checkbox"
            checked={!!data.fullBleed}
            onChange={(e) => onUpdate({ fullBleed: e.target.checked })}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="hero-fullbleed" className="text-sm text-gray-700">Full width (edge-to-edge)</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Hero animation"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Animation</label>
        <select
          value={data.buttonAnimation || 'none'}
          onChange={(e) => onUpdate({ buttonAnimation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Hero button animation"
        >
          <option value="none">None</option>
          <option value="hover-zoom">Zoom on Hover</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        {/* Subtitle Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertSubtitleFormatting('<strong>', '</strong>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertSubtitleFormatting('<em>', '</em>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertSubtitleFormatting('<br/>', '')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Line break"
          >
            ↵
          </button>
        </div>
        <textarea
          ref={subtitleRef}
          value={data.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={2}
          title="Hero subtitle"
          placeholder="Enter hero subtitle (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">Tip: Use HTML tags for formatting</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Image URL</label>
        <input
          type="text"
          value={data.backgroundImage}
          onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
          className="w-full border rounded px-3 py-2 mb-2"
          title="Background image URL"
          placeholder="Paste image URL here"
        />
        <div className="mt-2 mb-2 text-xs text-gray-500">or upload:</div>
        <ImageUploader onImageUrl={(url) => onUpdate({ backgroundImage: url })} />
        {data.backgroundImage && (
          <div className="mt-2 relative aspect-video">
            <Image src={data.backgroundImage} alt="" fill className="object-cover rounded" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={data.buttonText}
          onChange={(e) => onUpdate({ buttonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button text"
          placeholder="Enter button text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Link</label>
        <input
          type="text"
          value={data.buttonLink}
          onChange={(e) => onUpdate({ buttonLink: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button link"
          placeholder="Enter button link"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Secondary Button Text (optional)</label>
        <input
          type="text"
          value={data.secondaryButtonText || ''}
          onChange={(e) => onUpdate({ secondaryButtonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Secondary button text"
          placeholder="e.g., View Portfolio"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Secondary Button Link</label>
        <input
          type="text"
          value={data.secondaryButtonLink || ''}
          onChange={(e) => onUpdate({ secondaryButtonLink: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Secondary button link"
          placeholder="e.g., /gallery"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Style</label>
        <select
          value={data.buttonStyle || 'primary'}
          onChange={(e) => onUpdate({ buttonStyle: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button style"
        >
          <option value="primary">Primary (Gold)</option>
          <option value="secondary">Secondary (Transparent)</option>
          <option value="outline">Outline (White Border)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title Color</label>
        <select
          value={data.titleColor || 'text-white'}
          onChange={(e) => onUpdate({ titleColor: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Title color"
        >
          <option value="text-white">White</option>
          <option value="text-amber-200">Amber Light</option>
          <option value="text-amber-50">Amber Pale</option>
          <option value="text-gray-900">Dark Gray</option>
          <option value="text-primary-600">Primary (Gold)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtitle Color</label>
        <select
          value={data.subtitleColor || 'text-amber-50'}
          onChange={(e) => onUpdate({ subtitleColor: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Subtitle color"
        >
          <option value="text-amber-50">Amber Pale</option>
          <option value="text-white">White</option>
          <option value="text-amber-200">Amber Light</option>
          <option value="text-gray-100">Light Gray</option>
          <option value="text-gray-800">Dark Gray</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Hero alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Overlay Darkness (%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.overlay}
          onChange={(e) => onUpdate({ overlay: parseInt(e.target.value) })}
          className="w-full"
          title="Overlay darkness percentage"
          aria-label="Overlay darkness percentage"
        />
      </div>
    </div>
  )
}

// Contact Form Properties
function ContactFormProperties({ data, onUpdate }: { data: ContactFormComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Get in Touch" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <textarea value={data.subheading || ''} onChange={(e)=>onUpdate({ subheading: e.target.value })} className="w-full border rounded px-3 py-2" rows={2} placeholder="Tell us about your photography needs and we’ll reply within 24 hours." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select value={data.animation || 'fade-in'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  )
}

// Newsletter Signup Properties
function NewsletterProperties({ data, onUpdate }: { data: NewsletterComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Get 10% Off Your First Session" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <textarea value={data.subheading || ''} onChange={(e)=>onUpdate({ subheading: e.target.value })} className="w-full border rounded px-3 py-2" rows={2} placeholder="Subscribe for tips, behind-the-scenes, and special offers." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Disclaimer</label>
        <input type="text" value={data.disclaimer || ''} onChange={(e)=>onUpdate({ disclaimer: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="By subscribing, you agree to receive marketing emails. Unsubscribe anytime." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select value={data.style || 'card'} onChange={(e)=>onUpdate({ style: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="card">Card</option>
            <option value="banner">Banner</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select value={data.animation || 'fade-in'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// FAQ Properties
function FAQProperties({ data, onUpdate }: { data: FAQComponent['data']; onUpdate: (data: any) => void }) {
  const addItem = () => {
    onUpdate({ items: [...(data.items || []), { question: 'New question', answer: 'Answer...' }] })
  }
  const removeItem = (idx: number) => {
    onUpdate({ items: (data.items || []).filter((_, i) => i !== idx) })
  }
  const updateItem = (idx: number, field: 'question' | 'answer', value: string) => {
    const arr = [...(data.items || [])]
    arr[idx] = { ...arr[idx], [field]: value }
    onUpdate({ items: arr })
  }
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Frequently Asked Questions" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select value={data.columns || 1} onChange={(e)=>onUpdate({ columns: Number(e.target.value) })} className="w-full border rounded px-3 py-2">
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select value={data.animation || 'fade-in'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Questions</label>
          <button type="button" onClick={addItem} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
        </div>
        <div className="space-y-3">
          {(data.items || []).map((qa, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Item #{idx+1}</span>
                <button type="button" onClick={()=>removeItem(idx)} className="text-red-600 text-xs hover:underline">Remove</button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Question</label>
                <input type="text" value={qa.question || ''} onChange={(e)=>updateItem(idx,'question', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="What is included?" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Answer (HTML allowed)</label>
                <textarea value={qa.answer || ''} onChange={(e)=>updateItem(idx,'answer', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-mono" rows={3} placeholder="Answer details..." />
              </div>
            </div>
          ))}
          {!data.items?.length && <p className="text-sm text-gray-500">No questions yet. Add your first FAQ item.</p>}
        </div>
      </div>
    </div>
  )
}

// Pricing Table Properties
function PricingTableProperties({ data, onUpdate }: { data: PricingTableComponent['data']; onUpdate: (data: any) => void }) {
  const addPlan = () => {
    onUpdate({ plans: [...(data.plans || []), { title: 'New Plan', price: '$0', period: '', features: [], ctaText: 'Choose', ctaLink: '#', highlight: false }] })
  }
  const removePlan = (idx:number) => {
    onUpdate({ plans: (data.plans || []).filter((_,i)=>i!==idx) })
  }
  const updatePlan = (idx:number, field: keyof PricingTableComponent['data']['plans'][number], value: any) => {
    const arr = [...(data.plans || [])]
    // @ts-ignore
    arr[idx] = { ...arr[idx], [field]: value }
    onUpdate({ plans: arr })
  }
  const addFeature = (idx:number) => {
    const arr = [...(data.plans || [])]
    arr[idx].features = [...(arr[idx].features || []), 'New feature']
    onUpdate({ plans: arr })
  }
  const updateFeature = (planIdx:number, featIdx:number, value:string) => {
    const arr = [...(data.plans || [])]
    arr[planIdx].features[featIdx] = value
    onUpdate({ plans: arr })
  }
  const removeFeature = (planIdx:number, featIdx:number) => {
    const arr = [...(data.plans || [])]
    arr[planIdx].features = arr[planIdx].features.filter((_,i)=>i!==featIdx)
    onUpdate({ plans: arr })
  }
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Packages & Pricing" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <input type="text" value={data.subheading || ''} onChange={(e)=>onUpdate({ subheading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Simple packages for every need" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select value={data.columns || 3} onChange={(e)=>onUpdate({ columns: Number(e.target.value) })} className="w-full border rounded px-3 py-2">
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select value={data.animation || 'fade-in'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select value={data.style || 'light'} onChange={(e)=>onUpdate({ style: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Variant</label>
          <select value={data.variant || 'card'} onChange={(e)=>onUpdate({ variant: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="card">Cards</option>
            <option value="flat">Flat</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input id="pricing-checkmarks" type="checkbox" checked={data.showFeatureChecks ?? true} onChange={(e)=>onUpdate({ showFeatureChecks: e.target.checked })} className="h-4 w-4" />
          <label htmlFor="pricing-checkmarks" className="text-sm">Show checkmarks</label>
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Plans</label>
          <button type="button" onClick={addPlan} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add Plan</button>
        </div>
        <div className="space-y-3">
          {(data.plans || []).map((p, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Plan #{idx+1}</span>
                <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={!!p.highlight} onChange={(e)=>updatePlan(idx,'highlight', e.target.checked)} /> Highlight</label>
                <button type="button" onClick={()=>removePlan(idx)} className="text-red-600 text-xs hover:underline">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Title</label>
                  <input type="text" value={p.title || ''} onChange={(e)=>updatePlan(idx,'title', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Price</label>
                  <input type="text" value={p.price || ''} onChange={(e)=>updatePlan(idx,'price', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Period</label>
                  <input type="text" value={p.period || ''} onChange={(e)=>updatePlan(idx,'period', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="per session" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">CTA Text</label>
                  <input type="text" value={p.ctaText || ''} onChange={(e)=>updatePlan(idx,'ctaText', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Book Now" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">CTA Link</label>
                <input type="text" value={p.ctaLink || ''} onChange={(e)=>updatePlan(idx,'ctaLink', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="/book-a-session" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium">Features</label>
                  <button type="button" onClick={()=>addFeature(idx)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
                </div>
                {(p.features || []).map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2 mb-1">
                    <input type="text" value={f} onChange={(e)=>updateFeature(idx, fi, e.target.value)} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Feature" />
                    <button type="button" onClick={()=>removeFeature(idx, fi)} className="text-red-600 text-xs hover:underline">×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!data.plans?.length && <p className="text-sm text-gray-500">No plans yet. Add your first plan above.</p>}
        </div>
      </div>
    </div>
  )
}

// Gallery Highlights Properties
function GalleryHighlightsProperties({ data, onUpdate }: { data: GalleryHighlightsComponent['data']; onUpdate: (data: any) => void }) {
  const parseList = (s: string) => s.split(',').map(v => v.trim()).filter(Boolean)
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Categories (comma-separated)</label>
        <input type="text" value={(data.categories || []).join(', ')} onChange={(e)=>onUpdate({ categories: parseList(e.target.value) })} className="w-full border rounded px-3 py-2" placeholder="wedding, portrait, event" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <input id="gh-featured" type="checkbox" checked={data.featuredOnly ?? true} onChange={(e)=>onUpdate({ featuredOnly: e.target.checked })} />
          <label htmlFor="gh-featured" className="text-sm">Featured only</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Limit</label>
          <input type="number" min={1} value={Number(data.limit || 6)} onChange={(e)=>onUpdate({ limit: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Limit per Category (optional)</label>
          <input type="number" min={0} value={Number(data.limitPerCategory || 0)} onChange={(e)=>onUpdate({ limitPerCategory: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Group</label>
          <input type="text" value={data.group || ''} onChange={(e)=>onUpdate({ group: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="e.g., homepage, fall-campaign" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Collections (comma-separated)</label>
        <input type="text" value={(data.collections || []).join(', ')} onChange={(e)=>onUpdate({ collections: parseList(e.target.value) })} className="w-full border rounded px-3 py-2" placeholder="studio, on-location, products" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
        <input type="text" value={(data.tags || []).join(', ')} onChange={(e)=>onUpdate({ tags: parseList(e.target.value) })} className="w-full border rounded px-3 py-2" placeholder="best, hero, cover, bts" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select value={data.sortBy || 'display_order'} onChange={(e)=>onUpdate({ sortBy: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="display_order">Display Order</option>
            <option value="created_at">Created At</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sort Direction</label>
          <select value={data.sortDir || 'asc'} onChange={(e)=>onUpdate({ sortDir: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select value={data.animation || 'fade-in'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  )
}

// Add missing TextProperties component
function TextProperties({ data, onUpdate }: { data: TextComponent['data']; onUpdate: (data: any) => void }) {
  const [cursorPos, setCursorPos] = React.useState<number>(0)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const insertFormatting = (before: string, after: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = data.content
    const selectedText = text.substring(start, end)
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    onUpdate({ content: newText })
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus()
      const newPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertFormatting('<strong>', '</strong>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<em>', '</em>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<u>', '</u>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white underline"
            title="Underline"
          >
            U
          </button>
          <span className="border-l mx-1"></span>
          <button
            type="button"
            onClick={() => insertFormatting('<h2 class="text-2xl font-bold mb-2">', '</h2>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<h3 class="text-xl font-bold mb-2">', '</h3>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Heading 3"
          >
            H3
          </button>
          <span className="border-l mx-1"></span>
          <button
            type="button"
            onClick={() => insertFormatting('<p class="text-lg">', '</p>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Large text"
          >
            Large
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<p class="text-sm">', '</p>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Small text"
          >
            Small
          </button>
        </div>
        
        <textarea
          ref={textareaRef}
          value={data.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={8}
          title="Text content"
          placeholder="Enter text content (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Select text and click formatting buttons, or use HTML tags directly
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Text alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <select
          value={data.size}
          onChange={(e) => onUpdate({ size: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Text size"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || 'none'}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Text animation"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  )
}

// Add missing ImageProperties component
function ImageProperties({ data, onUpdate }: { data: ImageComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="text"
          value={data.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image URL"
          placeholder="Enter image URL"
          aria-label="Image URL"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alt Text</label>
        <input
          type="text"
          value={data.alt}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Alt text"
          placeholder="Enter alt text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Caption</label>
        <input
          type="text"
          value={data.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image caption"
          placeholder="Enter caption"
        />
        <div className="mt-2 mb-2 text-xs text-gray-500">or upload:</div>
        <ImageUploader onImageUrl={(url) => onUpdate({ url })} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Link To (optional)</label>
        <input
          type="text"
          value={data.link || ''}
          onChange={(e) => onUpdate({ link: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image link"
          placeholder="/gallery or https://example.com"
        />
        <p className="text-xs text-gray-500 mt-1">Make image clickable - links to another page</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || 'none'}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image animation"
        >
          <option value="none">None</option>
          <option value="hover-zoom">Zoom on Hover</option>
          <option value="fade-in">Fade In (scroll)</option>
          <option value="slide-up">Slide Up (scroll)</option>
          <option value="zoom">Zoom In (scroll)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Width</label>
        <select
          value={data.width}
          onChange={(e) => onUpdate({ width: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image width"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="full">Full Width</option>
        </select>
      </div>
    </div>
  )
}

function ButtonProperties({ data, onUpdate }: { data: ButtonComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={data.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button text"
          placeholder="Enter button text"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Link</label>
        <input
          type="text"
          value={data.link}
          onChange={(e) => onUpdate({ link: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button link"
          placeholder="Enter button link"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Style</label>
        <select
          value={data.style}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button style"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || 'none'}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button animation"
        >
          <option value="none">None</option>
          <option value="hover-zoom">Zoom on Hover</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  )
}

function ColumnsProperties({ data, onUpdate }: { data: ColumnsComponent['data']; onUpdate: (data: any) => void }) {
  const columnRefs = React.useRef<(HTMLTextAreaElement | null)[]>([])

  const insertColumnFormatting = (colIndex: number, before: string, after: string) => {
    const textarea = columnRefs.current[colIndex]
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = data.columns[colIndex].content
    const selectedText = text.substring(start, end)
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    const newColumns = [...data.columns]
    newColumns[colIndex].content = newText
    onUpdate({ columns: newColumns })
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus()
      const newPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || 'none'}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Columns animation"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
      {data.columns.map((col, i) => (
        <div key={i} className="border rounded p-3 space-y-2">
          <h4 className="font-medium">Column {i + 1}</h4>
          
          {/* Formatting Toolbar for each column */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border rounded">
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, '<strong>', '</strong>')}
              className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, '<em>', '</em>')}
              className="px-2 py-1 text-xs border rounded hover:bg-white italic"
              title="Italic"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, '<u>', '</u>')}
              className="px-2 py-1 text-xs border rounded hover:bg-white underline"
              title="Underline"
            >
              U
            </button>
            <span className="border-l mx-1"></span>
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, '<h3 class="text-xl font-bold mb-2">', '</h3>')}
              className="px-2 py-1 text-xs border rounded hover:bg-white"
              title="Heading"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, '<p class="text-lg">', '</p>')}
              className="px-2 py-1 text-xs border rounded hover:bg-white"
              title="Large text"
            >
              Large
            </button>
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, '<p class="text-sm">', '</p>')}
              className="px-2 py-1 text-xs border rounded hover:bg-white"
              title="Small text"
            >
              Small
            </button>
          </div>
          
          <textarea
            ref={(el) => {
              columnRefs.current[i] = el
            }}
            value={col.content}
            onChange={(e) => {
              const newColumns = [...data.columns]
              newColumns[i].content = e.target.value
              onUpdate({ columns: newColumns })
            }}
            className="w-full border rounded px-2 py-1 text-sm font-mono"
            rows={4}
            title={`Column ${i + 1} content`}
            placeholder={`Enter content for column ${i + 1} (HTML allowed)`}
          />
        </div>
      ))}
      <p className="text-xs text-gray-500">
        Tip: Select text and click formatting buttons to add title/body styles
      </p>
    </div>
  )
}

function SpacerProperties({ data, onUpdate }: { data: SpacerComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="spacer-height" className="block text-sm font-medium mb-1">Height</label>
        <select
          id="spacer-height"
          value={data.height}
          onChange={(e) => onUpdate({ height: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="sm">Small (2rem)</option>
          <option value="md">Medium (4rem)</option>
          <option value="lg">Large (6rem)</option>
          <option value="xl">Extra Large (8rem)</option>
        </select>
      </div>
    </div>
  )
}

function SEOFooterProperties({ data, onUpdate }: { data: SEOFooterComponent['data']; onUpdate: (data: any) => void }) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const insertFormatting = (before: string, after: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = data.content
    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    onUpdate({ content: newText })
    setTimeout(() => {
      textarea.focus()
      const newPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Footer HTML</label>
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button type="button" onClick={() => insertFormatting('<strong>', '</strong>')} className="px-2 py-1 text-xs border rounded hover:bg-white font-bold">B</button>
          <button type="button" onClick={() => insertFormatting('<em>', '</em>')} className="px-2 py-1 text-xs border rounded hover:bg-white italic">I</button>
          <button type="button" onClick={() => insertFormatting('<u>', '</u>')} className="px-2 py-1 text-xs border rounded hover:bg-white underline">U</button>
          <span className="border-l mx-1"></span>
          <button type="button" onClick={() => insertFormatting('<h3 class=\"text-lg font-bold mb-2\">', '</h3>')} className="px-2 py-1 text-xs border rounded hover:bg-white">H3</button>
          <button type="button" onClick={() => insertFormatting('<p class=\"text-sm\">', '</p>')} className="px-2 py-1 text-xs border rounded hover:bg-white">P</button>
        </div>
        <textarea
          ref={textareaRef}
          value={data.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={8}
          placeholder="Enter footer HTML (e.g., NAP, service areas, internal links)"
        />
        <p className="text-xs text-gray-500 mt-1">Tip: Include business name, address, phone, key services and service areas.</p>
      </div>
      <div className="flex items-center gap-2">
        <input id="seo-footer-schema" type="checkbox" checked={!!data.includeSchema} onChange={(e)=>onUpdate({ includeSchema: e.target.checked })} className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
        <label htmlFor="seo-footer-schema" className="text-sm">Embed LocalBusiness JSON-LD</label>
      </div>
    </div>
  )
}

function SlideshowHeroProperties({ data, onUpdate }: { data: SlideshowHeroComponent['data']; onUpdate: (data: any) => void }) {
  const titleRef = React.useRef<HTMLTextAreaElement>(null)
  const subtitleRef = React.useRef<HTMLTextAreaElement>(null)

  const insertTitleFormatting = (before: string, after: string) => {
    const textarea = titleRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = data.title || ''
    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    onUpdate({ title: newText })
    setTimeout(() => {
      textarea.focus()
      const newPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const insertSubtitleFormatting = (before: string, after: string) => {
    const textarea = subtitleRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = data.subtitle || ''
    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    onUpdate({ subtitle: newText })
    setTimeout(() => {
      textarea.focus()
      const newPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const addSlide = () => {
    onUpdate({ slides: [...(data.slides || []), { image: '', category: '', title: '' }] })
  }
  const removeSlide = (idx: number) => {
    onUpdate({ slides: data.slides?.filter((_, i) => i !== idx) || [] })
  }
  const updateSlide = (idx: number, field: keyof typeof data.slides[0], value: string) => {
    const newSlides = [...(data.slides || [])]
    newSlides[idx] = { ...newSlides[idx], [field]: value }
    onUpdate({ slides: newSlides })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Main Title</label>
        {/* Title Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertTitleFormatting('<strong>', '</strong>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting('<em>', '</em>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting('<br/>', '')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Line break"
          >
            ↵
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting('<span class="text-amber-300">', '</span>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Highlight (amber)"
          >
            ✨
          </button>
        </div>
        <textarea
          ref={titleRef}
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={2}
          placeholder="Studio 37 (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">Use HTML for formatting</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        {/* Subtitle Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertSubtitleFormatting('<strong>', '</strong>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertSubtitleFormatting('<em>', '</em>')}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertSubtitleFormatting('<br/>', '')}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Line break"
          >
            ↵
          </button>
        </div>
        <textarea
          ref={subtitleRef}
          value={data.subtitle || ''}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={2}
          placeholder="Professional Photography (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">Use HTML for formatting</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Button Text</label>
          <input type="text" value={data.buttonText || ''} onChange={(e) => onUpdate({ buttonText: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Book Now" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Button Link</label>
          <input type="text" value={data.buttonLink || ''} onChange={(e) => onUpdate({ buttonLink: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="/book-a-session" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Interval (ms)</label>
          <input type="number" value={data.intervalMs || 5000} onChange={(e) => onUpdate({ intervalMs: Number(e.target.value) })} className="w-full border rounded px-3 py-2" min="1500" step="500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Overlay Opacity (%)</label>
          <input type="number" value={data.overlay ?? 60} onChange={(e) => onUpdate({ overlay: Number(e.target.value) })} className="w-full border rounded px-3 py-2" min="0" max="100" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Alignment</label>
          <select value={data.alignment || 'center'} onChange={(e) => onUpdate({ alignment: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Button Style</label>
          <select value={data.buttonStyle || 'primary'} onChange={(e) => onUpdate({ buttonStyle: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Title Color</label>
          <select value={data.titleColor || 'text-white'} onChange={(e) => onUpdate({ titleColor: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="text-white">White</option>
            <option value="text-amber-50">Light Amber</option>
            <option value="text-amber-200">Amber</option>
            <option value="text-gray-100">Light Gray</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle Color</label>
          <select value={data.subtitleColor || 'text-amber-50'} onChange={(e) => onUpdate({ subtitleColor: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="text-white">White</option>
            <option value="text-amber-50">Light Amber</option>
            <option value="text-amber-200">Amber</option>
            <option value="text-gray-100">Light Gray</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Button Animation</label>
          <select value={data.buttonAnimation || 'none'} onChange={(e) => onUpdate({ buttonAnimation: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="none">None</option>
            <option value="hover-zoom">Hover Zoom</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input id="slideshow-fullbleed" type="checkbox" checked={!!data.fullBleed} onChange={(e) => onUpdate({ fullBleed: e.target.checked })} className="h-4 w-4" />
          <label htmlFor="slideshow-fullbleed" className="text-sm">Full Bleed</label>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Slides</label>
          <button type="button" onClick={addSlide} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Slide</button>
        </div>
        {data.slides?.map((slide, idx) => (
          <div key={idx} className="border rounded p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Slide {idx + 1}</h4>
              <button type="button" onClick={() => removeSlide(idx)} className="text-red-600 text-xs hover:underline">Remove</button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Image URL</label>
              <input type="text" value={slide.image || ''} onChange={(e) => updateSlide(idx, 'image', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Category</label>
              <input type="text" value={slide.category || ''} onChange={(e) => updateSlide(idx, 'category', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Creative Portraits" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Title (optional)</label>
              <input type="text" value={slide.title || ''} onChange={(e) => updateSlide(idx, 'title', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Slide Title" />
            </div>
          </div>
        ))}
        {!data.slides?.length && <p className="text-sm text-gray-500">No slides yet. Add your first slide above.</p>}
      </div>
    </div>
  )
}

function TestimonialsProperties({ data, onUpdate }: { data: TestimonialsComponent['data']; onUpdate: (data: any) => void }) {
  const addTestimonial = () => {
    onUpdate({ testimonials: [...(data.testimonials || []), { quote: '', author: '', subtext: '', avatar: '' }] })
  }
  const removeTestimonial = (idx: number) => {
    onUpdate({ testimonials: data.testimonials?.filter((_, i) => i !== idx) || [] })
  }
  const updateTestimonial = (idx: number, field: keyof typeof data.testimonials[0], value: string) => {
    const newTestimonials = [...(data.testimonials || [])]
    newTestimonials[idx] = { ...newTestimonials[idx], [field]: value }
    onUpdate({ testimonials: newTestimonials })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select value={data.animation || 'fade-in'} onChange={(e) => onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Testimonials</label>
          <button type="button" onClick={addTestimonial} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Testimonial</button>
        </div>
        {data.testimonials?.map((t, idx) => (
          <div key={idx} className="border rounded p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Testimonial {idx + 1}</h4>
              <button type="button" onClick={() => removeTestimonial(idx)} className="text-red-600 text-xs hover:underline">Remove</button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Quote</label>
              <textarea value={t.quote || ''} onChange={(e) => updateTestimonial(idx, 'quote', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={3} placeholder="Their testimonial..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Author</label>
              <input type="text" value={t.author || ''} onChange={(e) => updateTestimonial(idx, 'author', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Client Name" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Subtext (Role/Location)</label>
              <input type="text" value={t.subtext || ''} onChange={(e) => updateTestimonial(idx, 'subtext', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Client from Houston, TX" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Avatar URL (optional)</label>
              <input type="text" value={t.avatar || ''} onChange={(e) => updateTestimonial(idx, 'avatar', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="https://..." />
            </div>
          </div>
        ))}
        {!data.testimonials?.length && <p className="text-sm text-gray-500">No testimonials yet. Add your first testimonial above.</p>}
      </div>
    </div>
  )
}

function WidgetEmbedProperties({ data, onUpdate }: { data: WidgetEmbedComponent['data']; onUpdate: (data:any)=>void }) {
  const [scriptUrl, setScriptUrl] = React.useState('')
  const addScript = () => {
    const url = scriptUrl.trim()
    if (!url) return
    onUpdate({ scriptSrcs: [...(data.scriptSrcs || []), url] })
    setScriptUrl('')
  }
  const removeScript = (idx:number) => {
    onUpdate({ scriptSrcs: (data.scriptSrcs || []).filter((_,i)=>i!==idx) })
  }
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Provider</label>
        <select value={data.provider || 'thumbtack'} onChange={(e)=>onUpdate({ provider: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="thumbtack">Thumbtack</option>
          <option value="google">Google</option>
          <option value="yelp">Yelp</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">HTML Snippet</label>
        <textarea value={data.html || ''} onChange={(e)=>onUpdate({ html: e.target.value })} className="w-full border rounded px-3 py-2 font-mono text-xs" rows={6} placeholder="Paste the widget HTML (without <script> tags is okay)" />
  <p className="text-xs text-gray-500 mt-1">If your snippet includes a &lt;script src=...&gt;, we\'ll try to detect it too.</p>
      </div>
      <div className="border-t pt-3">
        <label className="block text-sm font-medium mb-2">Script URLs</label>
        <div className="flex gap-2 mb-2">
          <input type="url" value={scriptUrl} onChange={(e)=>setScriptUrl(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addScript() }}} className="flex-1 border rounded px-3 py-2 text-sm" placeholder="https://..." />
          <button type="button" onClick={addScript} className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
        </div>
        <div className="space-y-1">
          {(data.scriptSrcs || []).map((src, idx)=> (
            <div key={idx} className="flex items-center justify-between border rounded px-3 py-2 text-xs bg-gray-50">
              <span className="truncate mr-2">{src}</span>
              <button type="button" onClick={()=>removeScript(idx)} className="text-red-600 hover:underline">Remove</button>
            </div>
          ))}
          {!data.scriptSrcs?.length && <p className="text-xs text-gray-500">No scripts yet. Add at least one script URL (e.g., the Thumbtack widget script).</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input id="widget-style-reset" type="checkbox" checked={data.styleReset ?? true} onChange={(e)=>onUpdate({ styleReset: e.target.checked })} className="h-4 w-4" />
        <label htmlFor="widget-style-reset" className="text-sm">Reset styles inside widget (recommended)</label>
      </div>
      {data.provider === 'thumbtack' && (
        <div className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded p-2">
          Tip: Paste the Thumbtack script URL like <code>https://www.thumbtack.com/profile/widgets/scripts/?service_pk=YOUR_SERVICE_PK&widget_id=review&type=one</code>. Use minimal HTML like <code>&lt;div id=\"tt-dynamic\"&gt;&lt;/div&gt;</code>. The style reset here fixes the oversized fonts/colors in your screenshot.
        </div>
      )}
    </div>
  )
}

function BadgesProperties({ data, onUpdate }: { data: BadgesComponent['data']; onUpdate: (data: any) => void }) {
  const addBadge = () => {
    const next = { icon: 'star' as const, label: 'New Badge', sublabel: '', color: '', href: '' }
    onUpdate({ badges: [...(data.badges || []), next] })
  }
  const removeBadge = (idx: number) => {
    onUpdate({ badges: (data.badges || []).filter((_, i) => i !== idx) })
  }
  const updateBadge = (idx: number, field: keyof BadgesComponent['data']['badges'][number], value: string) => {
    const arr = [...(data.badges || [])]
    //@ts-ignore
    arr[idx] = { ...arr[idx], [field]: value }
    onUpdate({ badges: arr })
  }

  const applyPreset = (name: 'yelp' | 'thumbtack' | 'google' | 'certified') => {
    let preset: BadgesComponent['data']['badges'] = []
    if (name === 'yelp') {
      preset = [{ icon: 'yelp', label: '5.0 • Yelp Reviews', sublabel: '★★★★★', color: '#d32323', href: 'https://www.yelp.com' }]
    } else if (name === 'thumbtack') {
      preset = [{ icon: 'thumbtack', label: 'Thumbtack Top Pro', sublabel: 'Highly Rated', color: '#15a6ff', href: 'https://www.thumbtack.com' }]
    } else if (name === 'google') {
      preset = [{ icon: 'google', label: '5.0 • Google Reviews', sublabel: '★★★★★', color: '#34a853', href: 'https://www.google.com/search' }]
    } else if (name === 'certified') {
      preset = [{ icon: 'shield', label: 'Certified Professional Photographer', sublabel: 'Studio 37', color: '#0ea5e9' }]
    }
    onUpdate({ badges: [...(data.badges || []), ...preset] })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select value={data.alignment || 'center'} onChange={(e)=>onUpdate({ alignment: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <select value={data.size || 'md'} onChange={(e)=>onUpdate({ size: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select value={data.style || 'pill'} onChange={(e)=>onUpdate({ style: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="pill">Pill</option>
            <option value="solid">Solid</option>
            <option value="outline">Outline</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select value={data.animation || 'fade-in'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Badges</label>
          <button type="button" onClick={addBadge} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add Badge</button>
        </div>
        <div className="space-y-3">
          {(data.badges || []).map((b, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Badge #{idx+1}</span>
                <button type="button" onClick={()=>removeBadge(idx)} className="text-red-600 text-xs hover:underline">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Icon</label>
                  <select value={b.icon} onChange={(e)=>updateBadge(idx,'icon', e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                    <option value="star">Star</option>
                    <option value="yelp">Yelp (star)</option>
                    <option value="google">Google (star)</option>
                    <option value="thumbtack">Thumbtack</option>
                    <option value="shield">Shield</option>
                    <option value="camera">Camera</option>
                    <option value="check">Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Color (hex or CSS)</label>
                  <input type="text" value={b.color || ''} onChange={(e)=>updateBadge(idx,'color', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="#d32323 or text-red-600" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Label</label>
                <input type="text" value={b.label || ''} onChange={(e)=>updateBadge(idx,'label', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Badge label" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Sublabel (optional)</label>
                <input type="text" value={b.sublabel || ''} onChange={(e)=>updateBadge(idx,'sublabel', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="e.g., ★★★★★ or Highly Rated" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Link (optional)</label>
                <input type="url" value={b.href || ''} onChange={(e)=>updateBadge(idx,'href', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="https://..." />
              </div>
            </div>
          ))}
          {!data.badges?.length && <p className="text-sm text-gray-500">No badges yet. Use presets below or add your first badge.</p>}
        </div>
      </div>

      <div className="border-t pt-4">
        <label className="block text-sm font-medium mb-2">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={()=>applyPreset('yelp')} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">Add Yelp 5-Star</button>
          <button type="button" onClick={()=>applyPreset('google')} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">Add Google 5-Star</button>
          <button type="button" onClick={()=>applyPreset('thumbtack')} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">Add Thumbtack Top Pro</button>
          <button type="button" onClick={()=>applyPreset('certified')} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">Add Certified Photographer</button>
        </div>
      </div>
    </div>
  )
}

// Services Grid Properties
function ServicesGridProperties({ data, onUpdate }: { data: ServicesGridComponent['data']; onUpdate: (data: any) => void }) {
  const addService = () => {
    const next = { image: '', title: 'New Service', description: '', features: [] }
    onUpdate({ services: [...(data.services || []), next] })
  }
  const removeService = (idx: number) => {
    onUpdate({ services: (data.services || []).filter((_, i) => i !== idx) })
  }
  const updateService = (idx: number, field: keyof ServicesGridComponent['data']['services'][number], value: any) => {
    const arr = [...(data.services || [])]
    arr[idx] = { ...arr[idx], [field]: value }
    onUpdate({ services: arr })
  }
  const addFeature = (serviceIdx: number) => {
    const arr = [...(data.services || [])]
    arr[serviceIdx].features = [...(arr[serviceIdx].features || []), 'New feature']
    onUpdate({ services: arr })
  }
  const removeFeature = (serviceIdx: number, featureIdx: number) => {
    const arr = [...(data.services || [])]
    arr[serviceIdx].features = arr[serviceIdx].features.filter((_, i) => i !== featureIdx)
    onUpdate({ services: arr })
  }
  const updateFeature = (serviceIdx: number, featureIdx: number, value: string) => {
    const arr = [...(data.services || [])]
    arr[serviceIdx].features[featureIdx] = value
    onUpdate({ services: arr })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Our Services" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <input type="text" value={data.subheading || ''} onChange={(e)=>onUpdate({ subheading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="What we offer" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select value={data.columns || 3} onChange={(e)=>onUpdate({ columns: Number(e.target.value) })} className="w-full border rounded px-3 py-2">
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select value={data.animation || 'none'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Services</label>
          <button type="button" onClick={addService} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add Service</button>
        </div>
        <div className="space-y-3">
          {(data.services || []).map((s, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Service #{idx+1}</span>
                <button type="button" onClick={()=>removeService(idx)} className="text-red-600 text-xs hover:underline">Remove</button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Image URL</label>
                <input type="url" value={s.image || ''} onChange={(e)=>updateService(idx,'image', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <input type="text" value={s.title || ''} onChange={(e)=>updateService(idx,'title', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Service name" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description</label>
                <textarea value={s.description || ''} onChange={(e)=>updateService(idx,'description', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={2} placeholder="Service description" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium">Features</label>
                  <button type="button" onClick={()=>addFeature(idx)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
                </div>
                {(s.features || []).map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2 mb-1">
                    <input type="text" value={f} onChange={(e)=>updateFeature(idx, fi, e.target.value)} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Feature" />
                    <button type="button" onClick={()=>removeFeature(idx, fi)} className="text-red-600 text-xs hover:underline">×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!data.services?.length && <p className="text-sm text-gray-500">No services yet. Add your first service above.</p>}
        </div>
      </div>
    </div>
  )
}

// Stats Properties
function StatsProperties({ data, onUpdate }: { data: StatsComponent['data']; onUpdate: (data: any) => void }) {
  const addStat = () => {
    const next = { icon: '📊', number: '0', label: 'New Stat', suffix: '' }
    onUpdate({ stats: [...(data.stats || []), next] })
  }
  const removeStat = (idx: number) => {
    onUpdate({ stats: (data.stats || []).filter((_, i) => i !== idx) })
  }
  const updateStat = (idx: number, field: keyof StatsComponent['data']['stats'][number], value: string) => {
    const arr = [...(data.stats || [])]
    arr[idx] = { ...arr[idx], [field]: value }
    onUpdate({ stats: arr })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Our Impact" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select value={data.columns || 3} onChange={(e)=>onUpdate({ columns: Number(e.target.value) })} className="w-full border rounded px-3 py-2">
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select value={data.style || 'default'} onChange={(e)=>onUpdate({ style: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="default">Default</option>
            <option value="cards">Cards</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select value={data.animation || 'none'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Statistics</label>
          <button type="button" onClick={addStat} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add Stat</button>
        </div>
        <div className="space-y-3">
          {(data.stats || []).map((s, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Stat #{idx+1}</span>
                <button type="button" onClick={()=>removeStat(idx)} className="text-red-600 text-xs hover:underline">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Icon (emoji or text)</label>
                  <input type="text" value={s.icon || ''} onChange={(e)=>updateStat(idx,'icon', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="📊 or icon" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Number</label>
                  <input type="text" value={s.number || ''} onChange={(e)=>updateStat(idx,'number', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="150" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Suffix (optional)</label>
                  <input type="text" value={s.suffix || ''} onChange={(e)=>updateStat(idx,'suffix', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="+ or %" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Label</label>
                  <input type="text" value={s.label || ''} onChange={(e)=>updateStat(idx,'label', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Happy Clients" />
                </div>
              </div>
            </div>
          ))}
          {!data.stats?.length && <p className="text-sm text-gray-500">No stats yet. Add your first statistic above.</p>}
        </div>
      </div>
    </div>
  )
}

// CTA Banner Properties
function CTABannerProperties({ data, onUpdate }: { data: CTABannerComponent['data']; onUpdate: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Ready to get started?" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <textarea value={data.subheading || ''} onChange={(e)=>onUpdate({ subheading: e.target.value })} className="w-full border rounded px-3 py-2" rows={2} placeholder="Let's make something amazing together" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Primary Button Text</label>
          <input type="text" value={data.primaryButtonText || ''} onChange={(e)=>onUpdate({ primaryButtonText: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Book Now" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Primary Button Link</label>
          <input type="url" value={data.primaryButtonLink || ''} onChange={(e)=>onUpdate({ primaryButtonLink: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="/book-a-session" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Secondary Button Text</label>
          <input type="text" value={data.secondaryButtonText || ''} onChange={(e)=>onUpdate({ secondaryButtonText: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Learn More" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Secondary Button Link</label>
          <input type="url" value={data.secondaryButtonLink || ''} onChange={(e)=>onUpdate({ secondaryButtonLink: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="/about" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Image URL (optional)</label>
        <input type="url" value={data.backgroundImage || ''} onChange={(e)=>onUpdate({ backgroundImage: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="https://..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input type="color" value={data.backgroundColor || '#0f172a'} onChange={(e)=>onUpdate({ backgroundColor: e.target.value })} className="w-full border rounded px-3 py-2 h-10" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Overlay Opacity (%)</label>
          <input type="number" min="0" max="100" value={data.overlay || 60} onChange={(e)=>onUpdate({ overlay: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <select value={data.textColor || 'text-white'} onChange={(e)=>onUpdate({ textColor: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="text-white">White</option>
            <option value="text-gray-900">Dark</option>
            <option value="text-primary-600">Primary</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select value={data.animation || 'fade-in'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.fullBleed ?? true} onChange={(e)=>onUpdate({ fullBleed: e.target.checked })} />
          <span className="text-sm font-medium">Full Bleed (edge-to-edge)</span>
        </label>
      </div>
    </div>
  )
}

// Icon Features Properties
function IconFeaturesProperties({ data, onUpdate }: { data: IconFeaturesComponent['data']; onUpdate: (data: any) => void }) {
  const addFeature = () => {
    const next = { icon: '✨', title: 'New Feature', description: 'Feature description' }
    onUpdate({ features: [...(data.features || []), next] })
  }
  const removeFeature = (idx: number) => {
    onUpdate({ features: (data.features || []).filter((_, i) => i !== idx) })
  }
  const updateFeature = (idx: number, field: keyof IconFeaturesComponent['data']['features'][number], value: string) => {
    const arr = [...(data.features || [])]
    arr[idx] = { ...arr[idx], [field]: value }
    onUpdate({ features: arr })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Why Choose Us" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <input type="text" value={data.subheading || ''} onChange={(e)=>onUpdate({ subheading: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="What makes us different" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select value={data.columns || 4} onChange={(e)=>onUpdate({ columns: Number(e.target.value) })} className="w-full border rounded px-3 py-2">
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select value={data.animation || 'fade-in'} onChange={(e)=>onUpdate({ animation: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Features</label>
          <button type="button" onClick={addFeature} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add Feature</button>
        </div>
        <div className="space-y-3">
          {(data.features || []).map((f, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Feature #{idx+1}</span>
                <button type="button" onClick={()=>removeFeature(idx)} className="text-red-600 text-xs hover:underline">Remove</button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Icon (emoji or text)</label>
                <input type="text" value={f.icon || ''} onChange={(e)=>updateFeature(idx,'icon', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="📸 or icon" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <input type="text" value={f.title || ''} onChange={(e)=>updateFeature(idx,'title', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="Feature name" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description</label>
                <textarea value={f.description || ''} onChange={(e)=>updateFeature(idx,'description', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={2} placeholder="Feature description" />
              </div>
            </div>
          ))}
          {!data.features?.length && <p className="text-sm text-gray-500">No features yet. Add your first feature above.</p>}
        </div>
      </div>
    </div>
  )
}
