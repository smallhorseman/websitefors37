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

interface ContactFormConfirmationEmailProps {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  message?: string
  submittedAt?: string
}

export default function ContactFormConfirmationEmail({
  firstName = '',
  lastName = '',
  email = '',
  phone = '',
  message = '',
  submittedAt = new Date().toLocaleString(),
}: ContactFormConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for contacting Studio37! We'll respond soon.</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <Heading style={h1}>Message Received! ✓</Heading>
          </div>
          
          <Text style={text}>
            Hi {firstName} {lastName},
          </Text>

          <Text style={text}>
            Thank you for reaching out to Studio37 Photography! We've received your message and will get back to you within 24 hours (usually much sooner!).
          </Text>

          <Section style={messageBox}>
            <Heading as="h2" style={h2}>Your Message</Heading>
            <Text style={timestamp}>Submitted: {submittedAt}</Text>
            
            <div style={detailRow}>
              <span style={label}>Email:</span>
              <span style={value}>{email}</span>
            </div>
            
            {phone && (
              <div style={detailRow}>
                <span style={label}>Phone:</span>
                <span style={value}>{phone}</span>
              </div>
            )}
            
            {message && (
              <div style={messageContent}>
                <span style={label}>Message:</span>
                <Text style={messageText}>{message}</Text>
              </div>
            )}
          </Section>

          <Section style={quickLinksSection}>
            <Heading as="h3" style={h3}>While You Wait...</Heading>
            <Text style={text}>
              Check out what you can do with Studio37:
            </Text>
            <ul style={list}>
              <li><Link href="https://www.studio37.cc/gallery">View our portfolio</Link></li>
              <li><Link href="https://www.studio37.cc/services">Explore photography packages</Link></li>
              <li><Link href="https://www.studio37.cc/about">Learn about our team</Link></li>
              <li><Link href="https://www.studio37.cc/blog">Read photography tips</Link></li>
            </ul>
          </Section>

          <div style={urgentBox}>
            <Text style={urgentText}>
              <strong>Need immediate assistance?</strong><br />
              Call or text us: <Link href="tel:8327139944">832-713-9944</Link>
            </Text>
          </div>

          <Hr style={hr} />

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
  backgroundColor: '#10b981',
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
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 12px 0',
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

const messageBox = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
}

const timestamp = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0 0 16px 0',
}

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
  fontSize: '14px',
}

const label = {
  color: '#6b7280',
  fontWeight: '500',
}

const value = {
  color: '#1f2937',
  fontWeight: '600',
}

const messageContent = {
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid #d1d5db',
}

const messageText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0 0 0',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#ffffff',
  padding: '12px',
  borderRadius: '4px',
}

const quickLinksSection = {
  padding: '0 40px',
  margin: '24px 0',
}

const list = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  marginLeft: '20px',
  paddingLeft: '0',
}

const urgentBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 40px',
  textAlign: 'center' as const,
}

const urgentText = {
  color: '#1f2937',
  fontSize: '15px',
  margin: '0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 40px',
  textAlign: 'center' as const,
  marginTop: '32px',
}
