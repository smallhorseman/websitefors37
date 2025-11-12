// Local Business SEO Configuration
export const businessInfo = {
  name: 'Studio37',
  legalName: 'Studio37 Photography',
  description: 'Professional photography services in Pinehurst, Texas. Specializing in wedding, portrait, event, and commercial photography.',
  address: {
    streetAddress: '1701 Goodson Loop Unit 80',
    addressLocality: 'Pinehurst',
    addressRegion: 'TX',
    postalCode: '77362',
    addressCountry: 'US',
    fullAddress: '1701 Goodson Loop Unit 80, Pinehurst, TX 77362'
  },
  contact: {
    phone: '832-713-9944',
    email: 'sales@studio37.cc',
    website: 'https://www.studio37.cc'
  },
  geo: {
    latitude: 30.1647,  // Approximate coordinates for Pinehurst, TX
    longitude: -95.4677
  },
  serviceAreas: [
    'Pinehurst',
    'Montgomery',
    'Spring',
    'Tomball',
    'Magnolia',
    'The Woodlands',
    'Conroe',
    'Houston'
  ],
  services: [
    'Wedding Photography',
    'Portrait Photography',
    'Event Photography',
    'Commercial Photography',
    'Family Portraits',
    'Corporate Headshots',
    'Engagement Sessions',
    'Bridal Photography'
  ],
  socialMedia: {
    facebook: 'https://facebook.com/studio37photography',
    instagram: 'https://instagram.com/studio37photography',
    twitter: 'https://twitter.com/studio37photo'
  },
  businessHours: {
    monday: '9:00-18:00',
    tuesday: '9:00-18:00',
    wednesday: '9:00-18:00',
    thursday: '9:00-18:00',
    friday: '9:00-18:00',
    saturday: '10:00-16:00',
    sunday: 'Closed'
  }
}

// Generate structured data for local business
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': businessInfo.contact.website,
    name: businessInfo.legalName,
    alternateName: businessInfo.name,
    description: businessInfo.description,
    url: businessInfo.contact.website,
    telephone: businessInfo.contact.phone,
    email: businessInfo.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.address.streetAddress,
      addressLocality: businessInfo.address.addressLocality,
      addressRegion: businessInfo.address.addressRegion,
      postalCode: businessInfo.address.postalCode,
      addressCountry: businessInfo.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: businessInfo.geo.latitude,
      longitude: businessInfo.geo.longitude
    },
    areaServed: businessInfo.serviceAreas.map(area => ({
      '@type': 'City',
      name: area
    })),
    serviceType: businessInfo.services,
    openingHours: Object.entries(businessInfo.businessHours).map(([day, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
      opens: hours === 'Closed' ? null : hours.split('-')[0],
      closes: hours === 'Closed' ? null : hours.split('-')[1]
    })).filter(hours => hours.opens),
    sameAs: Object.values(businessInfo.socialMedia),
    priceRange: '$$',
    paymentAccepted: 'Cash, Credit Card, Check, PayPal',
    currenciesAccepted: 'USD'
  }
}

// Generate service-specific structured data
export function generateServiceSchema(serviceName: string, serviceDescription: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: businessInfo.legalName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: businessInfo.address.streetAddress,
        addressLocality: businessInfo.address.addressLocality,
        addressRegion: businessInfo.address.addressRegion,
        postalCode: businessInfo.address.postalCode,
        addressCountry: businessInfo.address.addressCountry
      },
      telephone: businessInfo.contact.phone,
      url: businessInfo.contact.website
    },
    areaServed: businessInfo.serviceAreas
  }
}