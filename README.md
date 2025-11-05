# Studio 37 Photography Website

A modern, professional photography studio website built with Next.js, featuring a CRM system, lead generation, and customer support chatbot.

## 🚀 Features

- 🎨 Modern, responsive design with Tailwind CSS
- 📊 Built-in CRM and lead management system
- 🤖 Custom lead generation chatbot
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
- **Chatbot**: Custom lead generation flow
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
   
   Create a `.env.local` file in the root directory (use `.env.example` as a template):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   # Required for server-only API routes (admin login/session)
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase database**
   
   Apply the schema and core tables in Supabase (via SQL Editor):
   - `supabase/schema-complete.sql` or run migrations under `supabase/migrations/`
   - Ensure these tables exist: `admin_users`, `admin_sessions`, `content_pages`, `blog_posts`, `gallery_images`, `settings`, `page_configs`
   - Optional seeds: `supabase/2025-11-02_settings_hero_fields.sql`, `supabase/create-ceo-user.sql`

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
   - Add your Supabase keys in Netlify dashboard
   - Include `SUPABASE_SERVICE_ROLE_KEY` as an environment variable (server-side only)

## 📁 Project Structure

```text
├── app/
│   ├── admin/             # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ChatBot.tsx        # Customer support chatbot
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
