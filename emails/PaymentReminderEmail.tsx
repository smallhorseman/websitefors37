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

interface PaymentReminderEmailProps {
  firstName?: string
  sessionType?: string
  sessionDate?: string
  amountDue?: string
  dueDate?: string
  invoiceNumber?: string
  paymentLink?: string
}

export default function PaymentReminderEmail({
  firstName = '',
  sessionType = 'Photography Session',
  sessionDate = '',
  amountDue = '0',
  dueDate = '',
  invoiceNumber = '',
  paymentLink = 'https://www.studio37.cc/contact',
}: PaymentReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment reminder for your Studio37 session</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Reminder</Heading>
          
          <Text style={text}>
            Hi {firstName},
          </Text>

          <Text style={text}>
            We hope you're as excited as we are about your upcoming {sessionType}!
          </Text>

          <Text style={text}>
            This is a friendly reminder that your remaining balance is due before your session.
          </Text>

          <Section style={paymentBox}>
            <div style={amountRow}>
              <span style={amountLabel}>Amount Due:</span>
              <span style={amountValue}>${amountDue}</span>
            </div>
            
            {dueDate && (
              <div style={detailRow}>
                <span style={label}>Due Date:</span>
                <span style={value}>{dueDate}</span>
              </div>
            )}
            
            {sessionDate && (
              <div style={detailRow}>
                <span style={label}>Session Date:</span>
                <span style={value}>{sessionDate}</span>
              </div>
            )}
            
            {invoiceNumber && (
              <div style={detailRow}>
                <span style={label}>Invoice:</span>
                <span style={value}>#{invoiceNumber}</span>
              </div>
            )}
          </Section>

          <div style={buttonContainer}>
            <Button href={paymentLink} style={button}>
              Make Payment
            </Button>
          </div>

          <Section style={section}>
            <Heading as="h3" style={h3}>Payment Methods</Heading>
            <ul style={list}>
              <li>Credit/Debit Card (online)</li>
              <li>PayPal or Venmo</li>
              <li>Cash or Check (in person)</li>
              <li>Bank transfer (ACH)</li>
            </ul>
          </Section>

          <Hr style={hr} />

          <Text style={callout}>
            <strong>Questions about your invoice?</strong><br />
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

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: '700',
  margin: '40px 0 20px',
  padding: '0 40px',
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

const paymentBox = {
  backgroundColor: '#fffbeb',
  border: '2px solid #f59e0b',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
}

const amountRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '16px',
  marginBottom: '16px',
  borderBottom: '1px solid #fbbf24',
}

const amountLabel = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
}

const amountValue = {
  color: '#b46e14',
  fontSize: '32px',
  fontWeight: '700',
}

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
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
  backgroundColor: '#10b981',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
}

const section = {
  padding: '0 40px',
  margin: '24px 0',
}

const list = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  marginLeft: '20px',
  paddingLeft: '0',
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
