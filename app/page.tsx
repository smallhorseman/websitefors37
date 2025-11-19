import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import LazyMount from "@/components/LazyMount";
import { generateSEOMetadata } from "@/lib/seo-helpers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
// Note: MDX builder components are dynamically imported only when needed

// Lazy load below-the-fold components for better initial page load
const Services = dynamic(() => import("@/components/Services"), {
  loading: () => <div className="h-96 bg-gray-50" style={{ contentVisibility: 'auto' }} />,
});
const CommercialHighlightGallery = dynamic(
  () => import("@/components/CommercialHighlightGallery"),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-white" style={{ contentVisibility: 'auto' }} />,
  }
);
const PortraitHighlightGallery = dynamic(
  () => import("@/components/PortraitHighlightGallery"),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-gray-50" style={{ contentVisibility: 'auto' }} />,
  }
);
const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  loading: () => <div className="h-96 bg-white" style={{ contentVisibility: 'auto' }} />,
});

// Defer newsletter modal - loads after page is interactive
const DiscountNewsletterModal = dynamic(
  () => import("@/components/DiscountNewsletterModal"),
  {
    ssr: false,
    loading: () => null,
  }
);

export const metadata = generateSEOMetadata({
  title: "Professional Photography Services in Pinehurst, TX",
  description:
    "Studio37 offers professional wedding, portrait, event, and commercial photography services in Pinehurst, Texas and surrounding areas. Serving Montgomery County, The Woodlands, and Houston.",
  keywords: [
    "wedding photography Pinehurst TX",
    "portrait photographer Texas",
    "event photography Montgomery County",
    "commercial photography The Woodlands",
    "professional photographer near me",
    "family portraits Pinehurst",
    "engagement photography Texas",
  ],
  canonicalUrl: "https://studio37.cc",
  pageType: "website",
});

// Try to import rehype-raw, but fall back gracefully if not available
let rehypeRaw: any;
try {
  rehypeRaw = require("rehype-raw");
} catch {
  console.warn(
    "rehype-raw not available on home page; raw HTML in MDX will not be parsed"
  );
}

export default async function HomePage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  // If an editor-managed home page exists in content_pages (slug 'home'), render it.
  // Otherwise, fall back to the static homepage sections below.
  const supabase = createServerComponentClient({ cookies });
  const { data: siteSettings } = await supabase
    .from("settings")
    .select("*")
    .single();
  const { data: page } = await supabase
    .from("content_pages")
    .select("*")
    .eq("slug", "home")
    .eq("published", true)
    .maybeSingle();

  if (page?.content) {
    const { MDXBuilderComponents } = await import("@/components/BuilderRuntime")
    const { getPageConfigs, selectProps, getPageLayout } = await import("@/lib/pageConfigs")
    const EditableChrome = (await import("@/components/editor/EditableChrome")).default

    const useDraft = (searchParams?.edit === '1')
    const currentPath = "/"
    const [configs, layout] = await Promise.all([
      getPageConfigs(currentPath),
      getPageLayout(currentPath, useDraft)
    ])

    // If a persisted layout exists for this path, render from it instead of MDX
    if (layout && Array.isArray(layout.blocks) && layout.blocks.length > 0) {
      return (
        <div className="min-h-screen">
          {layout.blocks.map((blk, i) => {
            const Comp: any = (MDXBuilderComponents as any)[blk.type]
            if (!Comp) return null
            const override = blk.id ? configs.get(blk.id) : undefined
            return (
              <div key={blk.id || i} className="relative">
                <EditableChrome label={String(blk.type).replace(/Block$/, '').replace(/([a-z])([A-Z])/g,'$1 $2')} block={blk.type} anchorId={blk.id} />
                <Comp {...(blk.props || {})} _overrides={selectProps(override as any, useDraft)} />
              </div>
            )
          })}
        </div>
      )
    }

    // Fallback to MDX-rendered content with inline overrides
    // Wrap components to inject _overrides prop based on block anchorId
    const defaultAnchorIds: Record<string,string> = {
      LogoBlock:'logo', HeroBlock:'hero', TextBlock:'text', ImageBlock:'image', ButtonBlock:'button', ColumnsBlock:'columns', SpacerBlock:'spacer', SeoFooterBlock:'seo-footer', BadgesBlock:'badges', SlideshowHeroBlock:'slideshow-hero', TestimonialsBlock:'testimonials', GalleryHighlightsBlock:'gallery-highlights', WidgetEmbedBlock:'widget-embed', ServicesGridBlock:'services-grid', StatsBlock:'stats', CTABannerBlock:'cta-banner', IconFeaturesBlock:'icon-features', ContactFormBlock:'contact-form', NewsletterBlock:'newsletter', FAQBlock:'faq', PricingTableBlock:'pricing-table', PricingCalculatorBlock:'pricing-calculator'
    }
    const wrappedComponents = Object.fromEntries(
      Object.entries(MDXBuilderComponents).map(([name, Component]) => [
        name,
        (props: any) => {
          let anchorId = props.id || props.anchorId || defaultAnchorIds[name] || name
          const override = anchorId ? configs.get(anchorId) : undefined
          return (
            <div className="relative">
              <EditableChrome label={name.replace(/Block$/, '').replace(/([a-z])([A-Z])/g,'$1 $2')} block={name} anchorId={anchorId} />
              <Component {...props} _overrides={selectProps(override as any, useDraft)} />
            </div>
          )
        }
      ])
    )
    
    return (
      <div className="min-h-screen">
        <MDXRemote
          source={page.content}
          options={{
            mdxOptions: {
              rehypePlugins: rehypeRaw
                ? [rehypeRaw as any, [rehypeHighlight, {}] as any]
                : [[rehypeHighlight, {}] as any],
            },
          }}
          components={wrappedComponents as any}
        />
      </div>
    );
  }

  // Static fallback homepage
  return (
    <>
      <LocalBusinessSchema />
      <Hero />
      <LazyMount minHeight={400}>
        <PortraitHighlightGallery />
      </LazyMount>
      <LazyMount minHeight={400}>
        <Services />
      </LazyMount>
      <LazyMount minHeight={400}>
        <CommercialHighlightGallery />
      </LazyMount>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Capture Your Story?
            </h2>
            <p className="text-lg text-gray-700">
              Let's discuss your photography needs and create something
              beautiful together.
            </p>
          </div>
          <LeadCaptureForm />
        </div>
      </section>
      <LazyMount minHeight={400}>
        <Testimonials />
      </LazyMount>
      <DiscountNewsletterModal />
    </>
  );
}
