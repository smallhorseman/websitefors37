import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from '@react-email/components'

interface WelcomeEmailProps {
  firstName?: string
  serviceType?: string
}

export default function WelcomeEmail({
  firstName = 'there',
  serviceType = 'photography',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Studio37 Photography!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome {firstName}!</Heading>
          
          <Text style={text}>
            Thank you for your interest in Studio37 Photography. We're excited to work with you on your {serviceType} project!
          </Text>

          <Section style={section}>
            <Heading as="h2" style={h2}>Next steps:</Heading>
            <ul style={list}>
              <li>Review your consultation notes</li>
              <li>Check available dates</li>
              <li>View our portfolio</li>
            </ul>
          </Section>

          <Button
            href="https://www.studio37.cc/book-a-session"
            style={button}
          >
            Book Your Session
          </Button>

          <Text style={text}>
            Best regards,<br />
            Studio37 Team
          </Text>

          <Text style={footer}>
            Studio37 Photography<br />
            1701 Goodson Loop Unit 80<br />
            Pinehurst, TX 77362<br />
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

const h1 = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: '700',
  margin: '40px 0 20px',
  padding: '0 40px',
}

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  margin: '20px 0 10px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '16px 0',
}

const section = {
  padding: '0 40px',
}

const list = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  marginLeft: '20px',
}

const button = {
  backgroundColor: '#b46e14',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '14px 20px',
  margin: '24px auto',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 40px',
  marginTop: '32px',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '20px',
}
