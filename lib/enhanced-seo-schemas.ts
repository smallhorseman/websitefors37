// Enhanced local business structured data for better Google visibility
export function generateEnhancedLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService', 'PhotographyBusiness'],
    '@id': 'https://studio37.cc/#organization',
    name: 'Studio37 Photography',
    alternateName: 'Studio37',
    legalName: 'Studio37 Photography LLC',
    description: 'Professional photography services specializing in weddings, portraits, events, and commercial photography in Pinehurst, Texas and Montgomery County.',
    url: 'https://studio37.cc',
    sameAs: [
      'https://www.facebook.com/studio37photography',
      'https://www.instagram.com/studio37photography',
      'https://www.yelp.com/biz/studio37-photography',
      'https://www.linkedin.com/company/studio37-photography'
    ],
    logo: {
      '@type': 'ImageObject',
      url: 'https://studio37.cc/logo.png',
      width: 300,
      height: 100
    },
    image: [
      'https://studio37.cc/images/studio-exterior.jpg',
      'https://studio37.cc/images/photography-equipment.jpg',
      'https://studio37.cc/images/portfolio-sample.jpg'
    ],
    telephone: '+1-832-713-9944',
    email: 'sales@studio37.cc',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1701 Goodson Loop Unit 80',
      addressLocality: 'Pinehurst',
      addressRegion: 'TX',
      postalCode: '77362',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.1647,
      longitude: -95.4677
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Pinehurst',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Texas'
        }
      },
      {
        '@type': 'City',
        name: 'The Woodlands',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Texas'
        }
      },
      {
        '@type': 'City',
        name: 'Montgomery',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Texas'
        }
      },
      {
        '@type': 'City',
        name: 'Spring',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Texas'
        }
      },
      {
        '@type': 'City',
        name: 'Tomball',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Texas'
        }
      },
      {
        '@type': 'City',
        name: 'Conroe',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Texas'
        }
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Montgomery County',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Texas'
        }
      }
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00'
      }
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Check', 'PayPal', 'Venmo'],
    currenciesAccepted: 'USD',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Photography Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wedding Photography',
            description: 'Professional wedding photography services in Pinehurst, TX and Montgomery County'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Portrait Photography',
            description: 'Family portraits, senior photos, and professional headshots'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Event Photography',
            description: 'Corporate events, parties, and special celebration photography'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Commercial Photography',
            description: 'Business photography, product shots, and professional branding'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Sarah M.'
        },
        datePublished: '2024-10-01',
        reviewBody: 'Studio37 captured our wedding beautifully! The photographer was professional, creative, and made us feel so comfortable. Highly recommend for weddings in Montgomery County.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        }
      }
    ],
    serviceType: [
      'Wedding Photography',
      'Portrait Photography', 
      'Event Photography',
      'Commercial Photography',
      'Family Photography',
      'Senior Portraits',
      'Corporate Headshots',
      'Engagement Photography'
    ],
    knowsAbout: [
      'Wedding Photography',
      'Portrait Photography',
      'Digital Photography',
      'Photo Editing',
      'Event Documentation',
      'Commercial Photography',
      'Studio Photography',
      'Outdoor Photography'
    ],
    memberOf: {
      '@type': 'Organization',
      name: 'Professional Photographers of America'
    },
    award: 'Best Wedding Photographer Montgomery County 2024'
  }
}

// Enhanced organization schema for brand recognition
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://studio37.cc/#organization',
    name: 'Studio37 Photography',
    url: 'https://studio37.cc',
    logo: {
      '@type': 'ImageObject',
      url: 'https://studio37.cc/logo.png'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-832-713-9944',
      contactType: 'Customer Service',
      areaServed: 'US',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://www.facebook.com/studio37photography',
      'https://www.instagram.com/studio37photography'
    ]
  }
}

// Website schema for better indexing
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://studio37.cc/#website',
    url: 'https://studio37.cc',
    name: 'Studio37 Photography',
    description: 'Professional photography services in Pinehurst, Texas - Wedding, Portrait, Event & Commercial Photography',
    publisher: {
      '@id': 'https://studio37.cc/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://studio37.cc/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// Breadcrumb schema for better navigation understanding
export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}