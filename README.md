# Studio 37 Photography Website

A modern, professional photography studio website built with Next.js, featuring a CRM system, lead generation, and AI chatbot.

## 🚀 Features

- 🎨 Modern, responsive design with Tailwind CSS
- 📊 Built-in CRM and lead management system
- 🤖 AI-powered customer support chatbot (Google Gemini)
- 📝 Content management capabilities
- 🖼️ Portfolio gallery with filtering
- 📧 Lead capture forms with validation
- 🔒 Admin dashboard for lead management
- 📱 Mobile-first responsive design
- ⚡ Optimized for performance and SEO

## 🛠️ Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Netlify

## 📦 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/smallhorseman/studio37-website.git
   cd studio37-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database**
   
   Run the SQL commands from `supabase/schema.sql` in your Supabase dashboard

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Netlify Deployment

1. **Connect to Netlify**
   - Push your code to GitHub
   - Connect your repository to Netlify

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Set environment variables**
   - Add your Supabase and Gemini API keys in Netlify dashboard

## 📁 Project Structure

```text
├── app/
│   ├── api/chat/          # AI chatbot API (Gemini)
│   ├── admin/             # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ChatBot.tsx        # AI chatbot component
│   ├── Gallery.tsx        # Portfolio gallery
│   ├── Hero.tsx           # Hero section
│   ├── LeadCaptureForm.tsx # Lead generation form
│   ├── Navigation.tsx     # Main navigation
│   ├── Services.tsx       # Services section
│   └── Testimonials.tsx   # Client testimonials
├── lib/
│   └── supabase.ts        # Database client
├── supabase/
│   └── schema.sql         # Database schema
├── netlify.toml           # Netlify configuration
└── package.json           # Dependencies
```

## Admin Features

Access the admin dashboard at `/admin` to:

- View and manage leads
- Update lead status
- Content management (coming soon)
- Gallery management (coming soon)

## Support

For questions or support, please contact the development team.
