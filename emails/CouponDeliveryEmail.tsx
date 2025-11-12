import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components'

interface CouponDeliveryEmailProps {
  firstName?: string
  couponCode?: string
  discountAmount?: string
  discountType?: string
  expiryDate?: string
  minPurchase?: string
  termsAndConditions?: string
}

export default function CouponDeliveryEmail({
  firstName = '',
  couponCode = 'STUDIO37',
  discountAmount = '15',
  discountType = '%',
  expiryDate = '30 days',
  minPurchase = '',
  termsAndConditions = '',
}: CouponDeliveryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Studio37 discount code is inside! {couponCode}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <Text style={celebrationText}>🎉 Special Offer Inside! 🎉</Text>
            <Heading style={h1}>Your Exclusive Discount</Heading>
          </div>
          
          <Text style={text}>
            Hi {firstName},
          </Text>

          <Text style={text}>
            Thank you for your interest in Studio37 Photography! Here's your exclusive discount code:
          </Text>

          <Section style={couponBox}>
            <div style={discountBadge}>
              <Text style={discountText}>
                {discountAmount}{discountType} OFF
              </Text>
            </div>
            
            <div style={codeBox}>
              <Text style={codeLabel}>Your Code:</Text>
              <Text style={code}>{couponCode}</Text>
            </div>

            {expiryDate && (
              <Text style={expiryText}>
                ⏰ Expires: {expiryDate}
              </Text>
            )}

            {minPurchase && (
              <Text style={minPurchaseText}>
                Minimum purchase: ${minPurchase}
              </Text>
            )}
          </Section>

          <Section style={howToUse}>
            <Heading as="h2" style={h2}>How to Redeem</Heading>
            <ol style={list}>
              <li>Choose your photography package</li>
              <li>Enter code <strong>{couponCode}</strong> at booking</li>
              <li>Enjoy your discount! 🎊</li>
            </ol>
          </Section>

          <div style={ctaContainer}>
            <Button href="https://www.studio37.cc/book-a-session" style={button}>
              Book Your Session Now
            </Button>
          </div>

          <Section style={servicesBox}>
            <Heading as="h3" style={h3}>What You Can Book</Heading>
            <ul style={servicesList}>
              <li>Wedding Photography 💒</li>
              <li>Portrait Sessions 📸</li>
              <li>Event Coverage 🎉</li>
              <li>Commercial Shoots 🏢</li>
              <li>Family Portraits 👨‍👩‍👧‍👦</li>
            </ul>
          </Section>

          {termsAndConditions && (
            <Section style={termsBox}>
              <Text style={termsTitle}>Terms & Conditions:</Text>
              <Text style={termsText}>{termsAndConditions}</Text>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={urgentText}>
            <strong>Questions?</strong> We're here to help!<br />
            <Link href="tel:8327139944">832-713-9944</Link> | <Link href="mailto:sales@studio37.cc">sales@studio37.cc</Link>
          </Text>

          <Text style={footer}>
            Studio37 Photography<br />
            1701 Goodson Loop Unit 80, Pinehurst, TX 77362<br />
            <Link href="https://www.studio37.cc">www.studio37.cc</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const celebrationText = {
  color: '#ffffff',
  fontSize: '18px',
  margin: '0 0 8px 0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
}

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '16px 0',
}

const couponBox = {
  backgroundColor: '#fef3c7',
  border: '3px dashed #f59e0b',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '32px 40px',
  textAlign: 'center' as const,
}

const discountBadge = {
  backgroundColor: '#ef4444',
  borderRadius: '50px',
  padding: '8px 24px',
  display: 'inline-block',
  marginBottom: '20px',
}

const discountText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '800',
  margin: '0',
  letterSpacing: '1px',
}

const codeBox = {
  backgroundColor: '#ffffff',
  border: '2px solid #f59e0b',
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
}

const codeLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}

const code = {
  color: '#b46e14',
  fontSize: '32px',
  fontWeight: '800',
  margin: '0',
  letterSpacing: '2px',
  fontFamily: 'monospace',
}

const expiryText = {
  color: '#dc2626',
  fontSize: '15px',
  fontWeight: '600',
  margin: '16px 0 0 0',
}

const minPurchaseText = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '8px 0 0 0',
}

const howToUse = {
  padding: '0 40px',
  margin: '32px 0',
}

const list = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  marginLeft: '20px',
  paddingLeft: '0',
}

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 40px',
  boxShadow: '0 4px 6px rgba(236, 72, 153, 0.3)',
}

const servicesBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '24px 40px',
}

const servicesList = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  marginLeft: '20px',
  paddingLeft: '0',
  listStyleType: 'none',
}

const termsBox = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 40px',
}

const termsTitle = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const termsText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
}

const urgentText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '0 40px',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 40px',
  textAlign: 'center' as const,
  marginTop: '32px',
}
