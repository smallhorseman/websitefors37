import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Fetch and parse live HTML from a published page
 * This enables real-time SEO analysis of production content
 */
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Valid URL is required" },
        { status: 400 }
      );
    }

    // Security: only allow fetching from your own domain
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.studio37.cc";
    const urlObj = new URL(url);
    const siteUrlObj = new URL(siteUrl);

    if (urlObj.hostname !== siteUrlObj.hostname) {
      return NextResponse.json(
        { error: "Can only analyze pages from your own domain" },
        { status: 403 }
      );
    }

    // Fetch the live page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Studio37-SEO-Analyzer/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch page: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Parse key SEO elements using simple regex (lightweight alternative to full DOM parser)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    const metaDescMatch = html.match(
      /<meta\s+name=["']description["'][^>]+content=["']([^"']+)["']/i
    );
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : "";

    const canonicalMatch = html.match(
      /<link\s+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
    );
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : "";

    // Extract all headings
    const h1s = Array.from(html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi)).map((m) =>
      m[1].trim()
    );
    const h2s = Array.from(html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)).map((m) =>
      m[1].trim()
    );
    const h3s = Array.from(html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/gi)).map((m) =>
      m[1].trim()
    );

    // Extract Open Graph tags
    const ogTitleMatch = html.match(
      /<meta\s+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
    );
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : "";

    const ogDescMatch = html.match(
      /<meta\s+property=["']og:description["'][^>]+content=["']([^"']+)["']/i
    );
    const ogDescription = ogDescMatch ? ogDescMatch[1].trim() : "";

    const ogImageMatch = html.match(
      /<meta\s+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    const ogImage = ogImageMatch ? ogImageMatch[1].trim() : "";

    // Extract Twitter Card tags
    const twitterCardMatch = html.match(
      /<meta\s+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i
    );
    const twitterCard = twitterCardMatch ? twitterCardMatch[1].trim() : "";

    // Extract structured data (JSON-LD)
    const jsonLdMatches = Array.from(
      html.matchAll(
        /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
      )
    );
    const structuredData = jsonLdMatches
      .map((m) => {
        try {
          return JSON.parse(m[1]);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    // Count links
    const internalLinks = Array.from(
      html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi)
    )
      .map((m) => m[1])
      .filter(
        (href) => href.startsWith("/") || href.includes(siteUrlObj.hostname)
      );

    const externalLinks = Array.from(
      html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi)
    )
      .map((m) => m[1])
      .filter(
        (href) => href.startsWith("http") && !href.includes(siteUrlObj.hostname)
      );

    // Count images and check for alt tags
    const images = Array.from(
      html.matchAll(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi)
    );
    const imagesWithAlt = Array.from(
      html.matchAll(/<img\s+[^>]*alt=["']([^"']+)["'][^>]*>/gi)
    );
    const imagesWithoutAlt = images.length - imagesWithAlt.length;

    // Extract main content (strip scripts, styles, nav, footer)
    const contentHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");

    const plainText = contentHtml
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const wordCount = plainText.split(/\s+/).filter((w) => w.length > 0).length;

    return NextResponse.json({
      url,
      title,
      metaDescription,
      canonical,
      headings: {
        h1: h1s,
        h2: h2s,
        h3: h3s,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
      },
      twitter: {
        card: twitterCard,
      },
      structuredData,
      links: {
        internal: internalLinks.length,
        external: externalLinks.length,
      },
      images: {
        total: images.length,
        withAlt: imagesWithAlt.length,
        withoutAlt: imagesWithoutAlt,
      },
      content: {
        wordCount,
        plainText: plainText.substring(0, 5000), // First 5k chars for analysis
      },
    });
  } catch (error) {
    console.error("Live SEO analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze page",
      },
      { status: 500 }
    );
  }
}
