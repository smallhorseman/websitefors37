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

interface BookingRequestConfirmationEmailProps {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  sessionType?: string
  preferredDate?: string
  guestCount?: string
  budget?: string
  details?: string
}

export default function BookingRequestConfirmationEmail({
  firstName = '',
  lastName = '',
  email = '',
  phone = '',
  sessionType = 'Photography Session',
  preferredDate = '',
  guestCount = '',
  budget = '',
  details = '',
}: BookingRequestConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your booking request is being reviewed - Studio37</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <Heading style={h1}>Booking Request Received! 🎉</Heading>
          </div>
          
          <Text style={text}>
            Hi {firstName},
          </Text>

          <Text style={text}>
            Exciting! We've received your {sessionType} booking request. Our team is reviewing the details and will send you a custom quote within 24 hours.
          </Text>

          <Section style={requestBox}>
            <Heading as="h2" style={h2}>Your Request Summary</Heading>
            
            <table style={{width: '100%', borderCollapse: 'collapse' as const}}>
              <tbody>
                <tr>
                  <td style={label}>Service:</td>
                  <td style={{...value, textAlign: 'right' as const}}>{sessionType}</td>
                </tr>
              </tbody>
            </table>
            
            {preferredDate && (
              <table style={{width: '100%', marginTop: '10px', borderCollapse: 'collapse' as const}}>
                <tbody>
                  <tr>
                    <td style={label}>Preferred Date:</td>
                    <td style={{...value, textAlign: 'right' as const}}>{preferredDate}</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {guestCount && (
              <table style={{width: '100%', marginTop: '10px', borderCollapse: 'collapse' as const}}>
                <tbody>
                  <tr>
                    <td style={label}>Guest Count:</td>
                    <td style={{...value, textAlign: 'right' as const}}>{guestCount}</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {budget && (
              <table style={{width: '100%', marginTop: '10px', borderCollapse: 'collapse' as const}}>
                <tbody>
                  <tr>
                    <td style={label}>Budget Range:</td>
                    <td style={{...value, textAlign: 'right' as const}}>${budget}</td>
                  </tr>
                </tbody>
              </table>
            )}

            <div style={contactInfo}>
              <Text style={contactText}>
                <strong>Contact:</strong><br />
                {email}<br />
                {phone}
              </Text>
            </div>

            {details && (
              <div style={notesSection}>
                <Text style={notesLabel}>Additional Details:</Text>
                <Text style={notesText}>{details}</Text>
              </div>
            )}
          </Section>

          <Section style={nextStepsSection}>
            <Heading as="h3" style={h3}>What Happens Next?</Heading>
            <table style={{width: '100%', marginTop: '20px', borderCollapse: 'collapse' as const}}>
              <tbody>
                <tr>
                  <td style={{verticalAlign: 'top', paddingBottom: '20px'}}>
                    <table style={{width: '100%'}}>
                      <tbody>
                        <tr>
                          <td style={{width: '50px', verticalAlign: 'top', paddingRight: '16px'}}>
                            <div style={stepNumber}>1</div>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
                            <Text style={stepTitle}>Within 24 Hours</Text>
                            <Text style={stepDesc}>We'll email you a personalized quote with package options</Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{verticalAlign: 'top', paddingBottom: '20px'}}>
                    <table style={{width: '100%'}}>
                      <tbody>
                        <tr>
                          <td style={{width: '50px', verticalAlign: 'top', paddingRight: '16px'}}>
                            <div style={stepNumber}>2</div>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
                            <Text style={stepTitle}>Consultation Call</Text>
                            <Text style={stepDesc}>We'll schedule a quick call to discuss your vision</Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{verticalAlign: 'top'}}>
                    <table style={{width: '100%'}}>
                      <tbody>
                        <tr>
                          <td style={{width: '50px', verticalAlign: 'top', paddingRight: '16px'}}>
                            <div style={stepNumber}>3</div>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
                            <Text style={stepTitle}>Book Your Date</Text>
                            <Text style={stepDesc}>Reserve your session with a deposit</Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <div style={ctaContainer}>
            <Link href="https://www.studio37.cc/gallery" style={button}>
              View Our Portfolio
            </Link>
          </div>

          <Section style={urgentBox}>
            <Text style={urgentText}>
              <strong>Date almost booked?</strong> Call us for immediate availability:<br />
              <Link href="tel:8327139944" style={phoneLink}>832-713-9944</Link>
            </Text>
          </Section>

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
  background: 'linear-gradient(135deg, #b46e14 0%, #d97706 100%)',
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
  margin: '0 0 16px 0',
}

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '16px 0',
}

const requestBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
}

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
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

const contactInfo = {
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid #fbbf24',
}

const contactText = {
  color: '#374151',
  fontSize: '14px',
  margin: '0',
}

const notesSection = {
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid #fbbf24',
}

const notesLabel = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const notesText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const nextStepsSection = {
  padding: '0 40px',
  margin: '32px 0',
}

const timeline = {
  marginTop: '20px',
}

const timelineItem = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
  alignItems: 'flex-start',
}

const stepNumber = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#b46e14',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'inline-block',
  lineHeight: '36px',
  textAlign: 'center' as const,
}

const stepContent = {
  flex: '1',
}

const stepTitle = {
  color: '#1f2937',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 4px 0',
}

const stepDesc = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
}

const ctaContainer = {
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
  padding: '14px 32px',
  border: 'none',
}

const urgentBox = {
  backgroundColor: '#fee2e2',
  border: '1px solid #ef4444',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 40px',
  textAlign: 'center' as const,
}

const urgentText = {
  color: '#1f2937',
  fontSize: '14px',
  margin: '0',
}

const phoneLink = {
  color: '#dc2626',
  fontSize: '18px',
  fontWeight: '700',
  textDecoration: 'none',
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
