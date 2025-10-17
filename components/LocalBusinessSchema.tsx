'use client'

import Script from 'next/script'
import { generateLocalBusinessSchema } from '@/lib/seo-config'

export default function LocalBusinessSchema() {
  const schema = generateLocalBusinessSchema()

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}