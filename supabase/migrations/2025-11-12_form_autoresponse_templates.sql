-- Add form auto-response email templates
-- These templates send immediately after form submissions for better UX

INSERT INTO email_templates (name, slug, subject, html_content, category, is_active)
VALUES
  (
    'Contact Form Confirmation',
    'contact-form-confirmation',
    'Thanks for Contacting Studio37!',
    '<p>This is a fallback template. The React Email component will be used when sending.</p>',
    'autoresponse',
    true
  ),
  (
    'Booking Request Confirmation',
    'booking-request-confirmation',
    'We Received Your Booking Request!',
    '<p>This is a fallback template. The React Email component will be used when sending.</p>',
    'autoresponse',
    true
  ),
  (
    'Coupon Delivery',
    'coupon-delivery',
    'Your Studio37 Discount Code is Ready! 🎁',
    '<p>This is a fallback template. The React Email component will be used when sending.</p>',
    'promotional',
    true
  ),
  (
    'Newsletter Welcome',
    'newsletter-welcome',
    'Welcome to Studio37 Newsletter! 📸',
    '<p>This is a fallback template. The React Email component will be used when sending.</p>',
    'newsletter',
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Add helpful comment
COMMENT ON TABLE email_templates IS 'Email templates for marketing campaigns and auto-responses. React Email components in /emails/ directory take precedence over html_content field.';
