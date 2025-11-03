"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Gauge, Zap, MousePointerClick, Clock, ArrowLeft, ExternalLink } from "lucide-react";

type MetricRating = "good" | "needs-improvement" | "poor";

type Metric = {
  id: string;
  name: string;
  value: number;
  rating: MetricRating;
};

const ratingColor: Record<MetricRating, string> = {
  good: "text-green-600",
  "needs-improvement": "text-yellow-600",
  poor: "text-red-600",
};

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const webVitals = await import("web-vitals");
        const collected: Metric[] = [];
        const onMetric = (m: any) => {
          if (cancelled) return;
          collected.push({ id: m.id, name: m.name, value: m.value, rating: m.rating });
          setMetrics([...collected]);
        };
        webVitals.onLCP(onMetric);
        webVitals.onINP(onMetric);
        webVitals.onCLS(onMetric);
        webVitals.onFCP(onMetric);
        webVitals.onTTFB(onMetric);
      } catch (e) {
        console.warn("web-vitals not available", e);
        setSupported(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://studio37.cc';
  const psUrl = `https://pagespeed.web.dev/report?url=${encodeURIComponent(siteUrl)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              Back to Admin
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Gauge className="h-6 w-6 text-primary-600" />
                Performance & Web Vitals
              </h1>
              <p className="text-sm text-gray-600">Live Core Web Vitals for this page</p>
            </div>
          </div>
          <a
            href={psUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
          >
            Run PageSpeed
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="p-6">
        {!supported && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            web-vitals not available in this environment.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              <Activity className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              Waiting for metrics... interact with the page to record INP.
            </div>
          ) : (
            metrics.map((m) => (
              <div key={m.id + m.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {m.name === 'LCP' && <Zap className="h-5 w-5 text-orange-600" />}
                    {m.name === 'INP' && <MousePointerClick className="h-5 w-5 text-blue-600" />}
                    {m.name === 'CLS' && <Activity className="h-5 w-5 text-purple-600" />}
                    {m.name === 'FCP' && <Zap className="h-5 w-5 text-green-600" />}
                    {m.name === 'TTFB' && <Clock className="h-5 w-5 text-gray-600" />} 
                    <h2 className="font-semibold">{m.name}</h2>
                  </div>
                  <span className={`text-xs font-medium ${ratingColor[m.rating]}`}>{m.rating}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {m.name === 'CLS' ? m.value.toFixed(3) : Math.round(m.value)}
                  <span className="text-sm text-gray-500 ml-2">
                    {m.name === 'CLS' ? '' : 'ms'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold mb-2">Tips to improve</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Ensure hero and slideshow images have priority and proper sizes (we applied this)</li>
            <li>Prefer Cloudinary transforms and blur placeholders for large images</li>
            <li>Defer non-critical scripts and third-party widgets</li>
            <li>Minimize layout shifts: reserve space for dynamic content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
