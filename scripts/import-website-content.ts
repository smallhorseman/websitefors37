#!/usr/bin/env tsx
/**
 * Website Content Importer for Chatbot Training
 * 
 * This script scrapes your website content and imports it into the chatbot_training table
 * so the AI can answer questions about your services, packages, policies, etc.
 * 
 * Usage:
 *   npm install -D tsx
 *   npx tsx scripts/import-website-content.ts
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studio37.cc';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface TrainingEntry {
  category: string;
  question: string;
  answer: string;
  keywords?: string[];
  is_active: boolean;
  source_url?: string;
}

/**
 * Fetch and parse content from your website pages
 */
async function scrapeWebsiteContent(): Promise<TrainingEntry[]> {
  const entries: TrainingEntry[] = [];
  
  console.log('🔍 Fetching website content from Supabase...');
  
  // Add service-specific content from static pages
  entries.push(...getServicePageContent());
  
  // Fetch content pages (About, Services, etc.)
  const { data: contentPages } = await supabase
    .from('content_pages')
    .select('slug, title, content, excerpt')
    .eq('status', 'published');
  
  if (contentPages) {
    console.log(`✓ Found ${contentPages.length} content pages`);
    for (const page of contentPages) {
      // Clean HTML/MDX to plain text
      const cleanContent = stripHtml(page.content || '');
      const excerpt = page.excerpt || cleanContent.substring(0, 300);
      
      entries.push({
        category: getCategoryFromSlug(page.slug),
        question: `What is ${page.title}?`,
        answer: excerpt,
        keywords: extractKeywords(page.title + ' ' + cleanContent),
        is_active: true,
        source_url: `${SITE_URL}/${page.slug}`,
      });
      
      // Split long content into sections
      const sections = splitIntoSections(cleanContent, page.title);
      entries.push(...sections);
    }
  }
  
  // Fetch blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, content, excerpt, category')
    .eq('status', 'published')
    .limit(20);
  
  if (blogPosts) {
    console.log(`✓ Found ${blogPosts.length} blog posts`);
    for (const post of blogPosts) {
      const cleanContent = stripHtml(post.content || '');
      const excerpt = post.excerpt || cleanContent.substring(0, 300);
      
      entries.push({
        category: 'blog',
        question: `Tell me about ${post.title}`,
        answer: `${excerpt}\n\nRead more: ${SITE_URL}/blog/${post.slug}`,
        keywords: extractKeywords(post.title + ' ' + post.category),
        is_active: true,
        source_url: `${SITE_URL}/blog/${post.slug}`,
      });
    }
  }
  
  // Fetch gallery images (portfolio examples)
  const { data: galleryImages } = await supabase
    .from('gallery_images')
    .select('title, description, category, tags')
    .eq('is_featured', true)
    .limit(10);
  
  if (galleryImages) {
    console.log(`✓ Found ${galleryImages.length} featured gallery images`);
    const portfolioSummary = galleryImages
      .map(img => `${img.title}: ${img.description || 'Featured work'}`)
      .join('\n');
    
    entries.push({
      category: 'portfolio',
      question: 'Can I see examples of your work?',
      answer: `Absolutely! Here are some featured examples from our portfolio:\n\n${portfolioSummary}\n\nYou can [view our full gallery](${SITE_URL}/gallery) to see more.`,
      keywords: ['portfolio', 'examples', 'work', 'gallery', 'photos'],
      is_active: true,
      source_url: `${SITE_URL}/gallery`,
    });
  }
  
  // Fetch settings (for business info)
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .single();
  
  if (settings) {
    console.log('✓ Found business settings');
    
    // Business hours
    if (settings.business_hours) {
      entries.push({
        category: 'general',
        question: 'What are your business hours?',
        answer: settings.business_hours,
        keywords: ['hours', 'open', 'schedule', 'availability'],
        is_active: true,
      });
    }
    
    // Contact info
    if (settings.contact_email) {
      entries.push({
        category: 'contact',
        question: 'How can I contact you?',
        answer: `You can reach us at ${settings.contact_email}${settings.contact_phone ? ` or call ${settings.contact_phone}` : ''}. You can also [send us a message](${SITE_URL}/contact) through our contact form.`,
        keywords: ['contact', 'email', 'phone', 'reach', 'message'],
        is_active: true,
        source_url: `${SITE_URL}/contact`,
      });
    }
    
    // Booking info
    entries.push({
      category: 'booking',
      question: 'How do I book a session?',
      answer: `Booking is easy! You can [schedule a consultation](${SITE_URL}/book-a-session) through our online calendar. We'll discuss your needs and find the perfect time for your session.`,
      keywords: ['book', 'schedule', 'appointment', 'session', 'consultation'],
      is_active: true,
      source_url: `${SITE_URL}/book-a-session`,
    });
  }
  
  // Add manual curated entries (FAQs, policies)
  entries.push(...getCuratedEntries());
  
  console.log(`\n✓ Generated ${entries.length} training entries`);
  return entries;
}

/**
 * Get category from page slug
 */
function getCategoryFromSlug(slug: string): string {
  if (slug.includes('service')) return 'services';
  if (slug.includes('about')) return 'general';
  if (slug.includes('pricing') || slug.includes('package')) return 'pricing';
  if (slug.includes('policy') || slug.includes('terms')) return 'policies';
  if (slug.includes('faq')) return 'general';
  return 'general';
}

/**
 * Extract service page content from static pages
 * These are the detailed service pages like /services/portrait-photography
 */
function getServicePageContent(): TrainingEntry[] {
  console.log('📄 Adding service page content...');
  
  const services = [
    {
      name: 'Portrait Photography',
      slug: 'portrait-photography',
      types: ['Family Portraits', 'Senior Portraits', 'Headshots', 'Maternity Sessions'],
      description: 'Professional portrait photography in Pinehurst, Texas. From family sessions to senior portraits, we create timeless images you\'ll treasure forever.',
      packages: {
        mini: { price: '$200', duration: '30 minutes', photos: '15+ edited photos', features: ['Digital gallery'] },
        standard: { price: '$350', duration: '60 minutes', photos: '30+ edited photos', features: ['Multiple outfits/looks', 'Digital gallery'] },
        extended: { price: '$500', duration: '90 minutes', photos: '50+ edited photos', features: ['Multiple locations', 'Multiple outfits', 'Digital gallery', 'Print credit'] }
      },
      serviceAreas: ['Pinehurst TX', 'The Woodlands TX', 'Montgomery TX', 'Spring TX', 'Tomball TX', 'Magnolia TX', 'Conroe TX', 'Houston TX']
    },
    {
      name: 'Wedding Photography',
      slug: 'wedding-photography',
      types: ['Full Day Coverage', 'Engagement Sessions', 'Bridal Portraits', 'Ceremony Only'],
      description: 'Award-winning wedding photography capturing your special day with artistry and emotion. Serving Pinehurst, The Woodlands, and greater Houston area.',
      packages: {
        essential: { price: '$1,800', duration: '6 hours', photos: '300+ edited photos', features: ['Two photographers', 'Online gallery', 'Print release'] },
        premium: { price: '$2,800', duration: '8 hours', photos: '500+ edited photos', features: ['Two photographers', 'Engagement session', 'Online gallery', 'Print release', 'Premium album'] },
        luxury: { price: '$4,200', duration: '10 hours', photos: '700+ edited photos', features: ['Two photographers', 'Engagement session', 'Bridal session', 'Premium album', 'Parent albums', 'Print release'] }
      },
      serviceAreas: ['Pinehurst TX', 'The Woodlands TX', 'Montgomery County TX', 'Houston TX', 'Destination weddings available']
    },
    {
      name: 'Event Photography',
      slug: 'event-photography',
      types: ['Corporate Events', 'Birthday Parties', 'Graduations', 'Special Occasions'],
      description: 'Professional event photography capturing every special moment. Corporate events, birthday parties, graduations, and more throughout Montgomery County.',
      packages: {
        basic: { price: '$400', duration: '2 hours', photos: '100+ edited photos', features: ['Digital gallery', 'Online sharing'] },
        standard: { price: '$700', duration: '4 hours', photos: '200+ edited photos', features: ['Digital gallery', 'Online sharing', 'Same-week delivery'] },
        full: { price: '$1,000', duration: '6 hours', photos: '300+ edited photos', features: ['Digital gallery', 'Online sharing', 'Same-week delivery', 'Print credit'] }
      },
      serviceAreas: ['Pinehurst TX', 'The Woodlands TX', 'Montgomery County', 'Houston area']
    },
    {
      name: 'Commercial Photography',
      slug: 'commercial-photography',
      types: ['Real Estate', 'Product Photography', 'Business Headshots', 'Brand Photography'],
      description: 'Professional commercial photography for businesses in Pinehurst and The Woodlands. Real estate, products, headshots, and brand imagery.',
      packages: {
        headshots: { price: '$150/person', duration: '30 minutes', photos: '5+ edited photos', features: ['Professional retouching', 'Multiple backgrounds', 'Digital delivery'] },
        product: { price: '$300', duration: 'Per session', photos: '10-20 images', features: ['White background', 'Lifestyle shots', 'E-commerce ready'] },
        realEstate: { price: '$200', duration: 'Per property', photos: '25+ photos', features: ['Interior & exterior', 'HDR processing', '24-hour delivery'] },
        brand: { price: '$800', duration: '4 hours', photos: '50+ images', features: ['Multiple looks', 'Location scouting', 'Brand consultation', 'Social media ready'] }
      },
      serviceAreas: ['Pinehurst TX', 'The Woodlands TX', 'Montgomery County', 'Greater Houston']
    }
  ];

  const entries: TrainingEntry[] = [];

  for (const service of services) {
    // Main service description
    entries.push({
      category: 'services',
      question: `Tell me about your ${service.name.toLowerCase()} services`,
      answer: `${service.description}\n\nWe offer:\n${service.types.map(t => `• ${t}`).join('\n')}\n\n[Learn more about our ${service.name.toLowerCase()}](${SITE_URL}/services/${service.slug})`,
      keywords: extractKeywords(service.name + ' ' + service.types.join(' ')),
      is_active: true,
      source_url: `${SITE_URL}/services/${service.slug}`,
    });

    // Package pricing questions
    const packageList = Object.entries(service.packages).map(([name, pkg]: [string, any]) => 
      `**${name.charAt(0).toUpperCase() + name.slice(1)} Package** (${pkg.price}): ${pkg.duration} • ${pkg.photos} • ${pkg.features.join(', ')}`
    ).join('\n\n');

    entries.push({
      category: 'pricing',
      question: `How much does ${service.name.toLowerCase()} cost?`,
      answer: `Our ${service.name.toLowerCase()} packages range from ${Object.values(service.packages as any)[0].price} to ${Object.values(service.packages as any)[Object.values(service.packages).length - 1].price}. Here's a breakdown:\n\n${packageList}\n\nAll packages include professional editing and digital delivery. [View full details](${SITE_URL}/services/${service.slug}) or [contact us](${SITE_URL}/contact) for custom quotes!`,
      keywords: [...extractKeywords(service.name), 'pricing', 'cost', 'price', 'package', 'how much'],
      is_active: true,
      source_url: `${SITE_URL}/services/${service.slug}`,
    });

    // What's included questions
    entries.push({
      category: 'pricing',
      question: `What's included in your ${service.name.toLowerCase()} packages?`,
      answer: `Great question! Our ${service.name.toLowerCase()} packages include:\n\n${packageList}\n\nAll photos are professionally edited and delivered through a private online gallery. You'll receive high-resolution digital files with print rights. [Book a consultation](${SITE_URL}/book-a-session) to discuss which package is right for you!`,
      keywords: [...extractKeywords(service.name), 'included', 'what you get', 'package details', 'deliverables'],
      is_active: true,
      source_url: `${SITE_URL}/services/${service.slug}`,
    });

    // Service types/specializations
    for (const type of service.types) {
      entries.push({
        category: 'services',
        question: `Do you offer ${type.toLowerCase()}?`,
        answer: `Yes! ${type} is one of our specialties in ${service.name.toLowerCase()}. ${service.description.split('.')[0]}. [View our ${service.name.toLowerCase()} portfolio](${SITE_URL}/gallery) or [schedule a consultation](${SITE_URL}/book-a-session) to discuss your ${type.toLowerCase()} needs!`,
        keywords: extractKeywords(type + ' ' + service.name),
        is_active: true,
        source_url: `${SITE_URL}/services/${service.slug}`,
      });
    }

    // Service area coverage
    entries.push({
      category: 'general',
      question: `Do you provide ${service.name.toLowerCase()} in my area?`,
      answer: `We provide ${service.name.toLowerCase()} services throughout ${service.serviceAreas.slice(0, 3).join(', ')}, and surrounding areas including ${service.serviceAreas.slice(3).join(', ')}. [Contact us](${SITE_URL}/contact) to confirm we serve your location!`,
      keywords: [...extractKeywords(service.name), 'location', 'area', 'travel', 'where', 'serve'],
      is_active: true,
      source_url: `${SITE_URL}/services/${service.slug}`,
    });
  }

  console.log(`✓ Generated ${entries.length} service page entries`);
  return entries;
}

/**
 * Get category from page slug
 */
function getCategoryFromSlug(slug: string): string {
  if (slug.includes('service')) return 'services';
  if (slug.includes('about')) return 'general';
  if (slug.includes('pricing') || slug.includes('package')) return 'pricing';
  if (slug.includes('policy') || slug.includes('terms')) return 'policies';
  if (slug.includes('faq')) return 'general';
  return 'general';
}

/**
 * Strip HTML/MDX tags to plain text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/[#*_`]/g, '') // Remove markdown syntax
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an', 'is', 'are', 'was', 'were']);
  const words = text.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3 && !commonWords.has(word));
  
  // Get unique words, max 10
  return [...new Set(words)].slice(0, 10);
}

/**
 * Split long content into smaller training sections
 */
function splitIntoSections(content: string, pageTitle: string): TrainingEntry[] {
  const sections: TrainingEntry[] = [];
  
  // Split by paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  
  for (let i = 0; i < Math.min(paragraphs.length, 3); i++) {
    const para = paragraphs[i].trim();
    if (para.length > 100) {
      sections.push({
        category: getCategoryFromSlug(pageTitle.toLowerCase()),
        question: `Tell me more about ${pageTitle}`,
        answer: para,
        keywords: extractKeywords(para),
        is_active: true,
      });
    }
  }
  
  return sections;
}

/**
 * Manually curated FAQs and policies
 */
function getCuratedEntries(): TrainingEntry[] {
  return [
    // Pricing FAQs
    {
      category: 'pricing',
      question: 'Do you have payment plans?',
      answer: 'Yes! We offer flexible payment plans to make professional photography accessible. Typically, we require a 50% deposit to secure your date, with the remaining balance due before your session. We accept credit cards, PayPal, and bank transfers.',
      keywords: ['payment', 'plans', 'deposit', 'pricing', 'cost'],
      is_active: true,
    },
    {
      category: 'pricing',
      question: 'What is included in your packages?',
      answer: 'Our packages vary by service type, but generally include: professional photography session, image editing and retouching, online gallery for viewing and sharing, and high-resolution digital downloads. Specific details depend on the package you choose. [View our services](${SITE_URL}/services) for more details.',
      keywords: ['package', 'included', 'what you get', 'deliverables'],
      is_active: true,
      source_url: `${SITE_URL}/services`,
    },
    
    // Booking & Policies
    {
      category: 'policies',
      question: 'What is your cancellation policy?',
      answer: 'We understand that plans change. If you need to reschedule, please give us at least 48 hours notice and we\'ll work with you to find a new date. Cancellations within 48 hours may forfeit the deposit. For weather-related cancellations, we\'ll always reschedule at no extra charge.',
      keywords: ['cancel', 'cancellation', 'reschedule', 'refund', 'policy'],
      is_active: true,
    },
    {
      category: 'booking',
      question: 'How far in advance should I book?',
      answer: 'For best availability, we recommend booking 4-6 weeks in advance, especially for weekend sessions. However, we can often accommodate last-minute bookings within a week if our schedule allows. [Check our calendar](${SITE_URL}/book-a-session) to see available dates.',
      keywords: ['advance', 'how soon', 'when to book', 'availability'],
      is_active: true,
      source_url: `${SITE_URL}/book-a-session`,
    },
    
    // Services
    {
      category: 'services',
      question: 'What types of photography do you offer?',
      answer: 'We specialize in wedding photography, portrait sessions (individuals, couples, families), event photography, and commercial photography. Each service can be customized to your specific needs. [Explore our services](${SITE_URL}/services) to learn more about each option.',
      keywords: ['services', 'types', 'what do you do', 'offer'],
      is_active: true,
      source_url: `${SITE_URL}/services`,
    },
    {
      category: 'services',
      question: 'Do you travel for sessions?',
      answer: 'Yes! We love traveling for sessions. We\'re based in Pinehurst, TX and serve the Houston area. For locations outside our local area, travel fees may apply depending on distance. Destination weddings and special events are welcome - just ask!',
      keywords: ['travel', 'location', 'destination', 'where', 'area'],
      is_active: true,
    },
    
    // Process
    {
      category: 'general',
      question: 'How long until I receive my photos?',
      answer: 'Turnaround time varies by service. Portrait sessions typically take 1-2 weeks, while wedding galleries are delivered within 4-6 weeks. You\'ll receive a private online gallery where you can view, download, and share your images.',
      keywords: ['turnaround', 'how long', 'when', 'receive', 'delivery'],
      is_active: true,
    },
    {
      category: 'general',
      question: 'Can I get prints?',
      answer: 'Absolutely! While we provide high-resolution digital files that you can print anywhere, we also offer professional printing services. We can arrange prints, albums, and wall art at competitive prices with guaranteed quality.',
      keywords: ['prints', 'printing', 'physical', 'albums', 'wall art'],
      is_active: true,
    },
  ];
}

/**
 * Import training data into Supabase
 */
async function importTrainingData(entries: TrainingEntry[]) {
  console.log('\n📤 Importing training data to Supabase...');
  
  // Clear existing auto-imported entries (keep manual ones)
  const { error: deleteError } = await supabase
    .from('chatbot_training')
    .delete()
    .not('source_url', 'is', null); // Only delete entries with source_url (auto-imported)
  
  if (deleteError) {
    console.warn('⚠️ Could not clear existing entries:', deleteError.message);
  } else {
    console.log('✓ Cleared existing auto-imported entries');
  }
  
  // Insert new entries in batches
  const batchSize = 50;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const { error } = await supabase
      .from('chatbot_training')
      .insert(batch);
    
    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`✓ Imported batch ${i / batchSize + 1} (${batch.length} entries)`);
    }
  }
  
  console.log('\n✅ Import complete!');
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting website content import...\n');
  
  try {
    const entries = await scrapeWebsiteContent();
    await importTrainingData(entries);
    
    console.log('\n🎉 Success! Your chatbot now has access to all website content.');
    console.log(`📊 Total entries: ${entries.length}`);
    console.log('\nYou can view and edit training data at: /admin/ai-training');
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

main();
