# Newsletter Subscription Modal Feature

## Overview
The "View Full Portfolio" button in the Gallery section now opens a newsletter subscription modal that offers users a 10% discount for subscribing. This feature captures leads with both email and phone number information.

## Files Modified/Created

### 1. NewsletterModal.tsx (NEW)
- **Location**: `/components/NewsletterModal.tsx`
- **Purpose**: Reusable modal component for newsletter subscription
- **Features**:
  - Email and phone number form fields
  - 10% discount offer messaging
  - Success state with confirmation
  - Form validation
  - Responsive design with smooth animations
  - Integration with Supabase for lead storage

### 2. Gallery.tsx (MODIFIED)
- **Location**: `/components/Gallery.tsx`
- **Changes**:
  - Added `NewsletterModal` import
  - Added modal state management (`isNewsletterModalOpen`)
  - Updated "View Full Portfolio" button to trigger modal
  - Added modal component with proper props

## Technical Implementation

### Form Fields
- **Email**: Required field with email validation
- **Phone**: Required field for contact information
- Both fields are validated before submission

### Database Integration
- Submissions are stored in the `leads` table
- Service interest set to 'newsletter_subscription'
- Budget range field used to store '10% discount offer'
- Source tracked as 'newsletter_popup'
- Status automatically set to 'new'
- Notes field populated with subscription context

### User Experience
- **Modal Trigger**: Click "View Full Portfolio" button
- **Form Submission**: Loading state with spinner
- **Success State**: Confirmation message with discount details
- **Auto-close**: Modal closes automatically after 3 seconds on success
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Styling
- Uses existing Tailwind CSS classes
- Consistent with site's design system
- Responsive across all device sizes
- Smooth animations using Framer Motion

## Benefits

### For Business
- **Lead Capture**: Collects both email and phone numbers
- **Incentive-driven**: 10% discount encourages signups
- **Qualified Leads**: Users interested in portfolio are warm prospects
- **Newsletter Growth**: Builds email marketing list

### For Users
- **Value Proposition**: Clear 10% discount offer
- **Easy Process**: Simple 2-field form
- **Instant Gratification**: Immediate confirmation
- **Portfolio Access**: Natural flow from gallery interest

## Configuration

### Environment Variables
Ensure these are set in your `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema
The modal uses the existing `leads` table with these fields:
- `email` (string)
- `phone` (string)
- `service_interest` (string)
- `budget_range` (string)
- `source` (string)
- `status` (string)
- `notes` (text)

## Future Enhancements
- Email automation for discount code delivery
- Integration with email marketing platforms
- A/B testing for different discount offers
- Analytics tracking for conversion rates
- Additional form fields for better lead qualification