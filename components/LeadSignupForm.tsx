"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * LeadSignupForm
 * Lazy-loads the SimpleTexting signup iframe only when visible.
 * Skips rendering on admin routes to avoid cluttering internal tools.
 */
export default function LeadSignupForm() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Don't show on admin or login/setup routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/setup-admin")) {
    return null;
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            // Impression event (footer form)
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'lead_signup_footer_impression');
            }
            obs.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (visible && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'lead_signup_footer_visible');
    }
  }, [visible]);

  return (
    <section
      ref={ref}
      aria-label="SMS Updates Signup"
      className="mt-20 mx-auto max-w-4xl rounded-lg border border-amber-200 bg-amber-50/60 backdrop-blur-sm p-6 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-amber-800 flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          Get Studio37 SMS Updates
        </h2>
        <p className="text-sm text-amber-700 leading-relaxed">
          Be the first to hear about mini sessions, seasonal promotions, and exclusive photography tips. Join our SMS list—unsubscribe anytime.
        </p>
      </div>

      {!visible && (
        <div className="animate-pulse h-[300px] w-full rounded-md bg-amber-100 flex items-center justify-center text-amber-400 text-sm">
          Preparing signup form…
        </div>
      )}

      {visible && (
        <div className="relative">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-amber-100 rounded-md">
              <span className="text-amber-500 text-sm">Loading form…</span>
            </div>
          )}
          <iframe
            onLoad={() => { setLoaded(true); if ((window as any).gtag) { (window as any).gtag('event', 'lead_signup_footer_iframe_loaded'); } }}
            title="Studio37 SMS Updates Form"
            className="w-full rounded-md border border-amber-300 shadow-sm bg-white"
            style={{ minHeight: 370 }}
            loading="lazy"
            src="https://app2.simpletexting.com/join/joinWebForm?webFormId=691e36a1ebc0c10f6c32bfe6&c=USA"
          />
        </div>
      )}

      <noscript>
        <p className="mt-4 text-xs text-amber-600">
          JavaScript is disabled. Please visit {" "}
          <a
            href="https://app2.simpletexting.com/join/joinWebForm?webFormId=691e36a1ebc0c10f6c32bfe6&c=USA"
            className="underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            this signup form
          </a>{" "}
          directly.
        </p>
      </noscript>
    </section>
  );
}
