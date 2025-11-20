"use client"

import React from 'react'
import EditableChrome from '../editor/EditableChrome'

export interface LeadSignupBlockClientProps {
  variantStrategy?: 'random' | 'short' | 'long'
  headingShort?: string
  headingLong?: string
  subheadingShort?: string
  subheadingLong?: string
  showIframe?: string | boolean
  animation?: string
  buttonText?: string
  buttonVariant?: 'primary' | 'outline'
}

// Client-only Lead Signup CTA Block with A/B variant and lazy iframe
export default function LeadSignupBlockClient({
  variantStrategy = 'random',
  headingShort = 'Get SMS Photo Updates',
  headingLong = 'Get Exclusive Studio37 SMS Updates (Mini Sessions, Promos, Tips)',
  subheadingShort = 'Be first to know about mini sessions & promos.',
  subheadingLong = 'Join our SMS list for first-access to mini sessions, seasonal promotions, and professional photography tips. Unsubscribe anytime.',
  showIframe = 'false',
  animation = 'fade-in',
  buttonText = 'Join SMS List',
  buttonVariant = 'primary'
}: LeadSignupBlockClientProps) {
  const animClass = animation === 'fade-in'
    ? 'animate-fadeIn'
    : animation === 'slide-up'
      ? 'animate-slideUp'
      : animation === 'zoom'
        ? 'animate-zoom'
        : ''

  // Variant assignment persisted in localStorage
  const [assigned, setAssigned] = React.useState<'short' | 'long'>('short')
  React.useEffect(() => {
    const existing = window.localStorage.getItem('lead_signup_variant') as 'short' | 'long' | null
    if (existing) {
      setAssigned(existing)
    } else {
      const v = variantStrategy === 'random'
        ? (Math.random() < 0.5 ? 'short' : 'long')
        : (variantStrategy === 'long' ? 'long' : 'short')
      window.localStorage.setItem('lead_signup_variant', v)
      setAssigned(v)
    }
  }, [variantStrategy])

  const heading = assigned === 'short' ? headingShort : headingLong
  const subheading = assigned === 'short' ? subheadingShort : subheadingLong

  const [iframeVisible, setIframeVisible] = React.useState(false)
  const [iframeLoaded, setIframeLoaded] = React.useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)

  const revealIframe = () => {
    setIframeVisible(true)
    if ((window as any).gtag) {
      (window as any).gtag('event', 'lead_signup_block_cta_click', { variant: assigned })
    }
  }

  // Impression tracking
  React.useEffect(() => {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'lead_signup_block_impression', { variant: assigned })
    }
  }, [assigned])

  // Iframe visible tracking
  React.useEffect(() => {
    if (iframeVisible && (window as any).gtag) {
      (window as any).gtag('event', 'lead_signup_block_iframe_visible', { variant: assigned })
    }
  }, [iframeVisible, assigned])

  const showFrameProp = String(showIframe) === 'true'
  const btnClass = buttonVariant === 'outline'
    ? 'border border-amber-600 text-amber-700 hover:bg-amber-50'
    : 'bg-amber-600 text-white hover:bg-amber-700'

  return (
    <section className={`py-12 md:py-16 px-6 md:px-8 bg-white ${animClass} rounded-lg border border-amber-200`}> 
      <EditableChrome label="Lead Signup" block="LeadSignupBlock" anchorId="lead-signup" />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-amber-800 mb-3">{heading}</h2>
        {subheading && <p className="text-amber-700 mb-6 leading-relaxed">{subheading}</p>}
        {!iframeVisible && !showFrameProp && (
          <button
            type="button"
            onClick={revealIframe}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-md font-medium transition shadow-sm ${btnClass}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            {buttonText}
          </button>
        )}
        {(iframeVisible || showFrameProp) && (
          <div className="mt-6 relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-amber-100 rounded-md">
                <span className="text-amber-500 text-sm">Loading form…</span>
              </div>
            )}
            <iframe
              ref={iframeRef}
              onLoad={() => { setIframeLoaded(true); if ((window as any).gtag) { (window as any).gtag('event', 'lead_signup_block_iframe_loaded', { variant: assigned }) } }}
              title="Studio37 SMS Updates Form"
              className="w-full rounded-md border border-amber-300 shadow-sm bg-white"
              style={{ minHeight: 370 }}
              loading="lazy"
              src="https://app2.simpletexting.com/join/joinWebForm?webFormId=691e36a1ebc0c10f6c32bfe6&c=USA"
            />
          </div>
        )}
        <p className="mt-4 text-xs text-amber-600">Your phone number stays private. Standard messaging rates apply. Opt-out anytime.</p>
      </div>
    </section>
  )
}
