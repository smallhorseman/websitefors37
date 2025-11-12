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
  Hr,
} from '@react-email/components'

interface NewsletterWelcomeEmailProps {
  firstName?: string
  email?: string
  subscriptionDate?: string
  frequency?: string
  unsubscribeLink?: string
}

export default function NewsletterWelcomeEmail({
  firstName = '',
  email = '',
  subscriptionDate = new Date().toLocaleDateString(),
  frequency = 'bi-weekly',
  unsubscribeLink = 'https://www.studio37.cc/unsubscribe',
}: NewsletterWelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Studio37 Photography Newsletter! 📸</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <Text style={welcomeText}>📸 Welcome to Studio37!</Text>
            <Heading style={h1}>You're In! 🎉</Heading>
          </div>
          
          <Text style={text}>
            Hi {firstName},
          </Text>

          <Text style={text}>
            Thank you for joining the Studio37 Photography newsletter! We're thrilled to have you as part of our community.
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightTitle}>✨ What to Expect</Text>
            <table style={{width: '100%', borderSpacing: 0}}>
              <tr>
                <td>
                  <Text style={{...text, padding: '4px 0', margin: 0}}>
                    <strong>Exclusive Photography Tips</strong> – Master lighting, posing, and composition
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text style={{...text, padding: '4px 0', margin: 0}}>
                    <strong>Behind-the-Scenes Stories</strong> – See how we create stunning images
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text style={{...text, padding: '4px 0', margin: 0}}>
                    <strong>Special Offers & Discounts</strong> – Newsletter-only deals just for you
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text style={{...text, padding: '4px 0', margin: 0}}>
                    <strong>New Gallery Showcases</strong> – First look at our latest work
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text style={{...text, padding: '4px 0', margin: 0}}>
                    <strong>Photography Trends & Inspiration</strong> – Stay ahead of the curve
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          <Section style={frequencyBox}>
            <Text style={frequencyText}>
              📅 You'll hear from us <strong>{frequency}</strong> with fresh content and inspiration!
            </Text>
          </Section>

          <Section style={socialBox}>
            <Heading as="h2" style={h2}>Follow Us on Social</Heading>
            <Text style={socialText}>
              Get daily inspiration and see our latest work:
            </Text>
            <table style={{width: '100%', margin: '16px auto', maxWidth: '400px'}}>
              <tr>
                <td align="center" style={{padding: '6px'}}>
                  <Link href="https://www.instagram.com/studio37photography" style={socialButton}>
                    📷 Instagram
                  </Link>
                </td>
                <td align="center" style={{padding: '6px'}}>
                  <Link href="https://www.facebook.com/studio37photography" style={socialButton}>
                    📘 Facebook
                  </Link>
                </td>
                <td align="center" style={{padding: '6px'}}>
                  <Link href="https://www.pinterest.com/studio37photography" style={socialButton}>
                    📌 Pinterest
                  </Link>
                </td>
              </tr>
            </table>
          </Section>

          <div style={ctaContainer}>
            <Link href="https://www.studio37.cc/blog" style={button}>
              Explore Our Blog
            </Link>
          </div>

          <Section style={bonusBox}>
            <Text style={bonusTitle}>🎁 Welcome Bonus</Text>
            <Text style={bonusText}>
              As a thank you for subscribing, enjoy <strong>10% off</strong> your first session when you book within 30 days!
            </Text>
            <div style={{textAlign: 'center' as const, marginTop: '16px'}}>
              <Link href="https://www.studio37.cc/book-a-session" style={bonusButton}>
                Book Now & Save
              </Link>
            </div>
          </Section>

          <Hr style={hr} />

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Subscription Details</strong><br />
              Email: {email}<br />
              Subscribed: {subscriptionDate}<br />
              Frequency: {frequency}
            </Text>
          </Section>

          <Text style={contactText}>
            <strong>Have questions?</strong> We'd love to hear from you!<br />
            <Link href="tel:8327139944">832-713-9944</Link> | <Link href="mailto:hello@studio37.cc">hello@studio37.cc</Link>
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Studio37 Photography<br />
            1701 Goodson Loop Unit 80, Pinehurst, TX 77362<br />
            <Link href="https://www.studio37.cc">www.studio37.cc</Link>
          </Text>

          <Text style={unsubscribe}>
            Not interested anymore? <Link href={unsubscribeLink}>Unsubscribe</Link>
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
  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const welcomeText = {
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

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '16px 0',
}

const highlightBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #3b82f6',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 40px',
}

const highlightTitle = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
}

const benefitsList = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
  padding: '0',
  listStyleType: 'none' as const,
}

const frequencyBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '24px 40px',
  textAlign: 'center' as const,
}

const frequencyText = {
  color: '#92400e',
  fontSize: '15px',
  margin: '0',
}

const socialBox = {
  padding: '0 40px',
  margin: '32px 0',
  textAlign: 'center' as const,
}

const socialText = {
  color: '#6b7280',
  fontSize: '15px',
  margin: '0 0 16px 0',
}

const socialLinks = {
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  flexWrap: 'wrap' as const,
}

const socialButton = {
  backgroundColor: '#f3f4f6',
  border: '2px solid #d1d5db',
  borderRadius: '8px',
  color: '#374151',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '10px 20px',
  display: 'inline-block',
  transition: 'background-color 0.2s',
}

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 40px',
  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
  border: 'none',
}

const bonusBox = {
  backgroundColor: '#fef9e7',
  border: '3px dashed #b46e14',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 40px',
  textAlign: 'center' as const,
}

const bonusTitle = {
  color: '#b46e14',
  fontSize: '22px',
  fontWeight: '800',
  margin: '0 0 12px 0',
}

const bonusText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
}

const bonusButton = {
  backgroundColor: '#b46e14',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  border: 'none',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
}

const infoBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  padding: '16px 24px',
  margin: '24px 40px',
}

const infoText = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
}

const contactText = {
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
  marginTop: '16px',
}

const unsubscribe = {
  color: '#9ca3af',
  fontSize: '11px',
  padding: '0 40px',
  textAlign: 'center' as const,
  marginTop: '16px',
}
