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
      <Preview>We received your booking request - Studio37 will respond within 24 hours</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Booking Request Received! 🎉</Heading>
          </Section>
          
          {/* Greeting */}
          <Section style={section}>
            <Text style={greeting}>Hi {firstName},</Text>
            <Text style={paragraph}>
              Thank you for choosing Studio37! We've received your <strong>{sessionType}</strong> booking request and our team is excited to work with you.
            </Text>
          </Section>

          {/* Summary Box */}
          <Section style={summaryBox}>
            <Heading as="h2" style={h2}>📋 Your Request Summary</Heading>
            
            <table width="100%" style={detailsTable}>
              <tbody>
                <tr>
                  <td style={detailLabel}>Service</td>
                  <td style={detailValue}>{sessionType}</td>
                </tr>
                {preferredDate && (
                  <tr>
                    <td style={detailLabel}>Preferred Date</td>
                    <td style={detailValue}>{preferredDate}</td>
                  </tr>
                )}
                {budget && (
                  <tr>
                    <td style={detailLabel}>Budget Range</td>
                    <td style={detailValue}>${budget}</td>
                  </tr>
                )}
                {guestCount && (
                  <tr>
                    <td style={detailLabel}>Guest Count</td>
                    <td style={detailValue}>{guestCount}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <Hr style={divider} />

            <table width="100%" style={{marginTop: '16px'}}>
              <tbody>
                <tr>
                  <td>
                    <Text style={contactLabel}>Your Contact Info:</Text>
                    <Text style={contactDetail}>{email}</Text>
                    <Text style={contactDetail}>{phone}</Text>
                  </td>
                </tr>
              </tbody>
            </table>

            {details && (
              <>
                <Hr style={divider} />
                <Text style={notesLabel}>Additional Details:</Text>
                <Text style={notesText}>{details}</Text>
              </>
            )}
          </Section>

          {/* Next Steps */}
          <Section style={section}>
            <Heading as="h2" style={h2}>⏱️ What Happens Next?</Heading>
            
            <table width="100%" style={{marginTop: '24px'}}>
              <tbody>
                <tr>
                  <td style={{paddingBottom: '20px'}}>
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="60" style={{verticalAlign: 'top', paddingRight: '16px'}}>
                            <div style={stepBadge}>
                              <Text style={stepNumber}>1</Text>
                            </div>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
                            <Text style={stepTitle}>Within 24 Hours</Text>
                            <Text style={stepDescription}>
                              We'll email you a personalized quote with detailed package options tailored to your needs.
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{paddingBottom: '20px'}}>
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="60" style={{verticalAlign: 'top', paddingRight: '16px'}}>
                            <div style={stepBadge}>
                              <Text style={stepNumber}>2</Text>
                            </div>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
                            <Text style={stepTitle}>Consultation Call</Text>
                            <Text style={stepDescription}>
                              We'll schedule a quick call to discuss your vision, answer questions, and ensure we capture your perfect moments.
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td width="60" style={{verticalAlign: 'top', paddingRight: '16px'}}>
                            <div style={stepBadge}>
                              <Text style={stepNumber}>3</Text>
                            </div>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
                            <Text style={stepTitle}>Secure Your Date</Text>
                            <Text style={stepDescription}>
                              Reserve your session with a deposit and we'll start planning your perfect shoot!
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* CTA */}
          <Section style={{textAlign: 'center' as const, margin: '40px 0'}}>
            <Link href="https://www.studio37.cc/gallery" style={primaryButton}>
              View Our Portfolio
            </Link>
          </Section>

          {/* Urgent Contact */}
          <Section style={urgentBox}>
            <Text style={{margin: 0, fontSize: '15px', color: '#991b1b', textAlign: 'center' as const}}>
              <strong>Need immediate assistance?</strong>
            </Text>
            <Text style={{margin: '8px 0 0 0', fontSize: '14px', color: '#374151', textAlign: 'center' as const}}>
              Call us directly at <Link href="tel:8327139944" style={phoneLink}>832-713-9944</Link>
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={{borderColor: '#e5e7eb', margin: '40px 0'}} />
          
          <Text style={footer}>
            <strong>Studio37 Photography</strong><br />
            1701 Goodson Loop Unit 80, Pinehurst, TX 77362<br />
            <Link href="https://www.studio37.cc" style={footerLink}>www.studio37.cc</Link> • {' '}
            <Link href="mailto:sales@studio37.cc" style={footerLink}>sales@studio37.cc</Link> • {' '}
            <Link href="tel:8327139944" style={footerLink}>832-713-9944</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  border: '1px solid #e5e7eb',
}

const header = {
  background: 'linear-gradient(135deg, #b46e14 0%, #d97706 100%)',
  padding: '40px 24px',
  textAlign: 'center' as const,
}

const section = {
  padding: '0 32px',
  margin: '32px 0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '1.2',
}

const h2 = {
  color: '#111827',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 20px 0',
}

const greeting = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
}

const summaryBox = {
  backgroundColor: '#fffbeb',
  border: '2px solid #fbbf24',
  borderRadius: '12px',
  padding: '28px',
  margin: '32px',
}

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  marginBottom: '8px',
}

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 0',
  textAlign: 'left' as const,
}

const detailValue = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '600',
  padding: '8px 0',
  textAlign: 'right' as const,
}

const divider = {
  borderColor: '#fbbf24',
  borderWidth: '1px',
  margin: '16px 0',
}

const contactLabel = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
}

const contactDetail = {
  color: '#374151',
  fontSize: '15px',
  margin: '4px 0',
}

const notesLabel = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '16px 0 8px 0',
}

const notesText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const stepBadge = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#b46e14',
  display: 'inline-block',
  textAlign: 'center' as const,
}

const stepNumber = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '48px',
  margin: '0',
}

const stepTitle = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 6px 0',
}

const stepDescription = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const primaryButton = {
  backgroundColor: '#b46e14',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 40px',
  border: 'none',
}

const urgentBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '20px',
  margin: '32px',
}

const phoneLink = {
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
}

const footer = {
  color: '#9ca3af',
  fontSize: '13px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  padding: '0 32px 32px',
  margin: '0',
}

const footerLink = {
  color: '#6b7280',
  textDecoration: 'none',
}
