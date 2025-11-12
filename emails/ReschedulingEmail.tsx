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

interface ReschedulingEmailProps {
  firstName?: string
  sessionType?: string
  oldDate?: string
  oldTime?: string
  newDate?: string
  newTime?: string
  location?: string
  reason?: string
}

export default function ReschedulingEmail({
  firstName = '',
  sessionType = 'Photography Session',
  oldDate = '',
  oldTime = '',
  newDate = '',
  newTime = '',
  location = 'Studio37',
  reason = '',
}: ReschedulingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Studio37 session has been rescheduled</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <Heading style={h1}>Session Rescheduled</Heading>
          </div>
          
          <Text style={text}>
            Hi {firstName},
          </Text>

          <Text style={text}>
            Your {sessionType} has been rescheduled. Here are your updated session details:
          </Text>

          {reason && (
            <Section style={reasonBox}>
              <Text style={reasonText}>
                <strong>Reason:</strong> {reason}
              </Text>
            </Section>
          )}

          {oldDate && (
            <Section style={oldDateBox}>
              <Heading as="h3" style={h3}>Previous Date</Heading>
              <Text style={strikethrough}>
                {oldDate} at {oldTime}
              </Text>
            </Section>
          )}

          <Section style={newDateBox}>
            <Heading as="h2" style={h2}>Your New Session Date ✓</Heading>
            
            <div style={detailRow}>
              <span style={label}>Date:</span>
              <span style={value}>{newDate}</span>
            </div>
            
            <div style={detailRow}>
              <span style={label}>Time:</span>
              <span style={value}>{newTime}</span>
            </div>
            
            <div style={detailRow}>
              <span style={label}>Location:</span>
              <span style={value}>{location}</span>
            </div>
          </Section>

          <div style={buttonContainer}>
            <Button href="https://www.studio37.cc/contact" style={button}>
              Add to Calendar
            </Button>
          </div>

          <Text style={text}>
            We apologize for any inconvenience and look forward to seeing you on your new date!
          </Text>

          <Hr style={hr} />

          <Text style={callout}>
            <strong>Need to make changes?</strong><br />
            Reply to this email or call us at <Link href="tel:8327139944">832-713-9944</Link>
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
  backgroundColor: '#6366f1',
  padding: '20px 40px',
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
  margin: '0 0 16px 0',
}

const h3 = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '16px 0',
}

const reasonBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 40px',
}

const reasonText = {
  color: '#1f2937',
  fontSize: '15px',
  margin: '0',
}

const oldDateBox = {
  backgroundColor: '#fee2e2',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 40px',
  textAlign: 'center' as const,
}

const strikethrough = {
  color: '#991b1b',
  fontSize: '16px',
  textDecoration: 'line-through',
  margin: '0',
}

const newDateBox = {
  backgroundColor: '#d1fae5',
  border: '2px solid #10b981',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
}

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
  fontSize: '15px',
}

const label = {
  color: '#6b7280',
  fontWeight: '500',
}

const value = {
  color: '#1f2937',
  fontWeight: '600',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#b46e14',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
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

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 40px',
  textAlign: 'center' as const,
  marginTop: '32px',
}
