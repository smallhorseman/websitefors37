# React Email Integration Guide

Studio37 now uses **React Email** (by Resend) for professional email template rendering!

## 🎯 What is React Email?

React Email lets you build email templates using React components instead of raw HTML. Benefits:

- ✅ **Type-safe** - TypeScript support for template props
- ✅ **Reusable components** - Build once, use anywhere
- ✅ **Responsive** - Auto-optimized for all email clients
- ✅ **Preview** - See exactly how emails will look
- ✅ **Accessible** - Semantic HTML for screen readers
- ✅ **Tested** - Works in Gmail, Outlook, Apple Mail, etc.

## 📦 Installed Packages

```json
{
  "@react-email/components": "^0.0.25",
  "@react-email/render": "^1.0.1"
}
```

## 📧 Available Email Templates

### 1. Welcome Email (`welcome-email`)
**Use case:** New lead onboarding

**Props:**
- `firstName` - Recipient's first name
- `serviceType` - Type of photography service

**Features:**
- Professional Studio37 branding
- Call-to-action button
- Next steps list
- Footer with contact info

### 2. Session Reminder (`session-reminder`)
**Use case:** Appointment reminders

**Props:**
- `firstName`
- `sessionType` - Wedding, portrait, etc.
- `sessionDate`
- `sessionTime`
- `location`

**Features:**
- Highlighted session details box
- What to bring checklist
- Mobile-responsive layout

### 3. Photos Ready (`photos-ready`)
**Use case:** Gallery delivery notification

**Props:**
- `firstName`
- `sessionType`
- `galleryLink` - URL to client gallery
- `expiryDays` - How long gallery is available

**Features:**
- Big CTA button to view gallery
- Review request links (Google + Facebook)
- Urgency messaging (expiry countdown)

## 🚀 How It Works

### Automatic Template Detection

When sending an email via `/api/marketing/email/send`:

1. **Check for React component** - If template slug matches a React Email component (in `lib/emailRenderer.ts`), use React rendering
2. **Fallback to HTML** - If no React component exists, use simple `{{variable}}` substitution

### Example API Call

```typescript
// Using React Email template
fetch('/api/marketing/email/send', {
  method: 'POST',
  body: JSON.stringify({
    to: 'client@example.com',
    subject: 'Welcome to Studio37!',
    templateId: '<uuid-of-welcome-email-template>',
    variables: {
      firstName: 'Sarah',
      serviceType: 'Wedding Photography'
    }
  })
})
```

The system:
1. Fetches template from `email_templates` table
2. Checks `template.slug` → finds `'welcome-email'`
3. Renders `WelcomeEmail` React component with variables
4. Sends beautiful HTML email via Resend ✨

## 🛠️ Creating New Templates

### Step 1: Create React Component

Create file in `emails/YourTemplate.tsx`:

```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
  Button,
} from '@react-email/components'

interface YourTemplateProps {
  name?: string
  customField?: string
}

export default function YourTemplate({
  name = 'Customer',
  customField = 'default value',
}: YourTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hello {name}!</Heading>
          <Text style={text}>
            Custom content: {customField}
          </Text>
          <Button href="https://www.studio37.cc" style={button}>
            Visit Studio37
          </Button>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: '700',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
}

const button = {
  backgroundColor: '#b46e14',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '14px 20px',
}
```

### Step 2: Register in Email Renderer

Edit `lib/emailRenderer.ts`:

```typescript
import YourTemplate from '@/emails/YourTemplate'

const EMAIL_TEMPLATES = {
  'welcome-email': WelcomeEmail,
  'session-reminder': SessionReminderEmail,
  'photos-ready': PhotosReadyEmail,
  'your-template': YourTemplate, // ← Add here
}
```

### Step 3: Create Database Template

In Supabase `email_templates` table:

```sql
INSERT INTO email_templates (name, slug, subject, html_content, category)
VALUES (
  'Your Template Name',
  'your-template', -- Must match key in EMAIL_TEMPLATES
  'Email Subject Line',
  '<p>Fallback HTML if React component fails</p>',
  'general'
);
```

### Step 4: Use It!

```typescript
const { data: template } = await supabase
  .from('email_templates')
  .select('id')
  .eq('slug', 'your-template')
  .single()

await fetch('/api/marketing/email/send', {
  method: 'POST',
  body: JSON.stringify({
    to: 'test@example.com',
    subject: 'Test Email',
    templateId: template.id,
    variables: {
      name: 'John',
      customField: 'Some value'
    }
  })
})
```

## 🎨 Styling Best Practices

### Inline Styles Only
Email clients don't support CSS classes - use inline styles:

```typescript
const button = {
  backgroundColor: '#b46e14', // ✅ Works
  padding: '10px 20px',       // ✅ Works
}

// ❌ Don't use className
<button className="btn">Click</button>

// ✅ Do use style prop
<Button style={button}>Click</Button>
```

### Studio37 Brand Colors

```typescript
const colors = {
  primary: '#b46e14',      // Amber/Gold
  primaryLight: '#fef3c7', // Light yellow
  text: '#1f2937',         // Dark gray
  textLight: '#6b7280',    // Medium gray
  background: '#f6f9fc',   // Light blue-gray
}
```

### Mobile-Responsive

Use max-width containers:

```typescript
const container = {
  maxWidth: '600px',  // Standard email width
  margin: '0 auto',   // Center on desktop
  padding: '20px',    // Mobile spacing
}
```

## 🧪 Testing Templates

### Local Preview

1. Create preview page: `/admin/marketing/preview?templateId=<uuid>`
2. Adjust test data in sidebar
3. Toggle desktop/mobile view

### Send Test Email

```bash
curl -X POST https://www.studio37.cc/api/marketing/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email",
    "templateId": "<template-uuid>",
    "variables": {
      "firstName": "Test",
      "sessionType": "Wedding"
    }
  }'
```

## 📱 Email Client Compatibility

React Email components are tested across:

- ✅ Gmail (Desktop & Mobile)
- ✅ Apple Mail (iOS & macOS)
- ✅ Outlook (2016+, Office 365)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

## 🔧 Troubleshooting

### "Template not found" error
- Check `slug` in database matches key in `EMAIL_TEMPLATES`
- Verify template exists in `email_templates` table

### Variables not rendering
- Make sure prop names in React component match variable names
- Check default values in component props

### Styling broken
- Use inline styles only (no CSS classes)
- Test in email client, not browser
- Check React Email docs for component-specific quirks

## 📚 Resources

- [React Email Docs](https://react.email/docs/introduction)
- [Component Examples](https://react.email/examples)
- [Resend Integration](https://resend.com/docs/send-with-react)

---

**Next Steps:**
1. Deploy updated code with React Email packages
2. Test existing templates in preview interface
3. Create custom templates for your workflows
4. Send beautiful, professional emails! 📧
