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

interface ReviewRequestEmailProps {
  firstName?: string
  sessionType?: string
  sessionDate?: string
  googleReviewLink?: string
  facebookReviewLink?: string
}

export default function ReviewRequestEmail({
  firstName = '',
  sessionType = 'photography session',
  sessionDate = 'recently',
  googleReviewLink = 'https://www.google.com/search?q=studio37+photography',
  facebookReviewLink = 'https://www.facebook.com/studio37photography',
}: ReviewRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We'd love your feedback on your Studio37 experience! ⭐</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <Heading style={h1}>We'd Love Your Feedback! ⭐</Heading>
          </div>
          
          <Text style={text}>
            Hi {firstName},
          </Text>

          <Text style={text}>
            Thank you for choosing Studio37 for your {sessionType}! We hope you absolutely love your photos.
          </Text>

          <Text style={text}>
            Your feedback helps us improve and helps future clients make informed decisions. Would you take 2 minutes to share your experience?
          </Text>

          <Section style={reviewSection}>
            <Heading as="h2" style={h2}>Leave Us a Review</Heading>
            
            <div style={buttonGrid}>
              <div style={reviewOption}>
                <div style={iconCircle}>
                  <span style={icon}>G</span>
                </div>
                <Button href={googleReviewLink} style={googleButton}>
                  Review on Google
                </Button>
              </div>

              <div style={reviewOption}>
                <div style={iconCircle}>
                  <span style={icon}>f</span>
                </div>
                <Button href={facebookReviewLink} style={facebookButton}>
                  Review on Facebook
                </Button>
              </div>
            </div>
          </Section>

          <Section style={testimonialBox}>
            <Text style={testimonialText}>
              "Studio37 exceeded our expectations! The photos are stunning and the team was so professional. Highly recommend!" 
            </Text>
            <Text style={testimonialAuthor}>
              - Sarah M., Wedding Photography Client
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={callout}>
            <strong>Have specific feedback?</strong><br />
            We're always looking to improve! Reply to this email or call us at{' '}
            <Link href="tel:8327139944">832-713-9944</Link>
          </Text>

          <Text style={thankYou}>
            Thank you for being an amazing client!<br />
            <strong>— The Studio37 Team</strong>
          </Text>

          <Text style={footer}>
            Studio37 Photography<br />
            1701 Goodson Loop Unit 80, Pinehurst, TX 77362<br />
            <Link href="https://www.studio37.cc">www.studio37.cc</Link> |{' '}
            <Link href="mailto:sales@studio37.cc">sales@studio37.cc</Link>
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
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  padding: '24px 40px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
}

const h2 = {
  color: '#1f2937',
  fontSize: '22px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '16px 0',
}

const reviewSection = {
  padding: '32px 40px',
  margin: '24px 0',
}

const buttonGrid = {
  display: 'flex',
  flexDirection: 'row' as const,
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap' as const,
}

const reviewOption = {
  textAlign: 'center' as const,
  flex: '1',
  minWidth: '200px',
}

const iconCircle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#f3f4f6',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
}

const icon = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#b46e14',
}

const googleButton = {
  backgroundColor: '#4285f4',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  width: '100%',
  maxWidth: '200px',
}

const facebookButton = {
  backgroundColor: '#1877f2',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  width: '100%',
  maxWidth: '200px',
}

const testimonialBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #b46e14',
  padding: '20px 24px',
  margin: '24px 40px',
  borderRadius: '4px',
}

const testimonialText = {
  color: '#1f2937',
  fontSize: '15px',
  fontStyle: 'italic',
  lineHeight: '24px',
  margin: '0 0 12px 0',
}

const testimonialAuthor = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0',
  textAlign: 'right' as const,
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
}

const callout = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 40px',
  fontSize: '14px',
  color: '#374151',
  textAlign: 'center' as const,
}

const thankYou = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 40px',
  textAlign: 'center' as const,
  marginTop: '32px',
}
