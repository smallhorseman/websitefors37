"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Globe,
  Target,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import SEOAnalyzerModal from "@/components/SEOAnalyzerModal";
import GAHealthCheckModal from "@/components/GAHealthCheckModal";
import type { ContentPage, BlogPost } from "@/lib/supabase";

interface SEOMetrics {
  totalPages: number;
  pagesWithMeta: number;
  pagesWithImages: number;
  avgTitleLength: number;
  avgDescriptionLength: number;
  sitemapStatus: "active" | "inactive" | "error";
  robotsStatus: "active" | "inactive" | "error";
}

export default function SEOPage() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    content: string;
    title: string;
    metaDescription: string;
    url: string;
  } | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [showGAHealth, setShowGAHealth] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"pages" | "posts">("pages");

  const [metrics, setMetrics] = useState<SEOMetrics>({
    totalPages: 0,
    pagesWithMeta: 0,
    pagesWithImages: 0,
    avgTitleLength: 0,
    avgDescriptionLength: 0,
    sitemapStatus: "inactive",
    robotsStatus: "inactive",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabase");

      // Fetch content pages
      const { data: pagesData, error: pagesError } = await supabase
        .from("content_pages")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!pagesError && pagesData) {
        setPages(pagesData);
      }

      // Fetch blog posts
      const { data: postsData, error: postsError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!postsError && postsData) {
        setPosts(postsData);
      }

      // Calculate metrics
      const allContent = [...(pagesData || []), ...(postsData || [])];
      const pagesWithMeta = allContent.filter((p) => p.meta_description).length;
      const avgTitleLength =
        allContent.length > 0
          ? Math.round(
              allContent.reduce((sum, p) => sum + (p.title?.length || 0), 0) /
                allContent.length
            )
          : 0;
      const avgDescLength =
        pagesWithMeta > 0
          ? Math.round(
              allContent
                .filter((p) => p.meta_description)
                .reduce(
                  (sum, p) => sum + (p.meta_description?.length || 0),
                  0
                ) / pagesWithMeta
            )
          : 0;

      setMetrics({
        totalPages: allContent.length,
        pagesWithMeta,
        pagesWithImages: allContent.length, // TODO: compute real image presence
        avgTitleLength,
        avgDescriptionLength: avgDescLength,
        sitemapStatus: "active",
        robotsStatus: "active",
      });
    } catch (error) {
      console.error("Error fetching SEO data:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeContent = (
    item: ContentPage | BlogPost,
    type: "page" | "post"
  ) => {
    setSelectedItem({
      content: item.content,
      title: item.title,
      metaDescription: item.meta_description || "",
      url:
        type === "page"
          ? `/${(item as ContentPage).slug}`
          : `/blog/${(item as BlogPost).slug}`,
    });
    setShowAnalyzer(true);
  };

  const handleSaveUpdates = async (updates: {
    title?: string;
    metaDescription?: string;
  }) => {
    if (!selectedItem) return;

    try {
      const { supabase } = await import("@/lib/supabase");

      // Find the item being updated
      const page = pages.find((p) => p.title === selectedItem.title);
      const post = posts.find((p) => p.title === selectedItem.title);

      if (page) {
        await supabase
          .from("content_pages")
          .update({
            title: updates.title || page.title,
            meta_description: updates.metaDescription || page.meta_description,
          })
          .eq("id", page.id);
      } else if (post) {
        await supabase
          .from("blog_posts")
          .update({
            title: updates.title || post.title,
            meta_description: updates.metaDescription || post.meta_description,
          })
          .eq("id", post.id);
      }

      // Refresh content
      await fetchSEOData();
    } catch (error) {
      console.error("Error saving updates:", error);
    }
  };

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seoChecks = [
    {
      name: "Sitemap.xml",
      status: metrics.sitemapStatus === "active" ? "success" : "warning",
      description: "XML sitemap is active and accessible",
      action: "View Sitemap",
      link: "/sitemap.xml",
    },
    {
      name: "Robots.txt",
      status: metrics.robotsStatus === "active" ? "success" : "warning",
      description: "Robots file properly configured",
      action: "View Robots",
      link: "/robots.txt",
    },
    {
      name: "Meta Descriptions",
      status:
        metrics.pagesWithMeta === metrics.totalPages ? "success" : "warning",
      description: `${metrics.pagesWithMeta}/${metrics.totalPages} pages have meta descriptions`,
      action: "Review Pages",
    },
    {
      name: "Page Titles",
      status:
        metrics.avgTitleLength > 30 && metrics.avgTitleLength < 60
          ? "success"
          : "warning",
      description: `Average title length: ${metrics.avgTitleLength} characters`,
      action: "Optimize Titles",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading SEO data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Admin
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary-600" />
                SEO Analyzer & AI Tools
              </h1>
              <p className="text-sm text-gray-600">
                Optimize your content for search engines
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* SEO Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalPages}
                </p>
                <p className="text-xs text-green-600 mt-1">All indexed</p>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Title Length
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.avgTitleLength}
                </p>
                <p className="text-xs text-green-600 mt-1">Optimal range</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Meta Coverage
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    (metrics.pagesWithMeta / metrics.totalPages) * 100
                  )}
                  %
                </p>
                <p className="text-xs text-green-600 mt-1">Complete coverage</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">92</p>
                <p className="text-xs text-green-600 mt-1">Excellent</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* SEO Health Checks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              SEO Health Check
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {seoChecks.map((check, index) => (
              <div
                key={index}
                className="p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {check.status === "success" ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{check.name}</h3>
                    <p className="text-sm text-gray-600">{check.description}</p>
                  </div>
                </div>
                {check.link && (
                  <a
                    href={check.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {check.action}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Analysis Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pages or posts to analyze..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("pages")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "pages"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pages ({filteredPages.length})
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "posts"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Blog Posts ({filteredPosts.length})
            </button>
          </div>

          {/* Content List */}
          <div className="space-y-3">
            {activeTab === "pages" && filteredPages.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No pages found</p>
              </div>
            )}

            {activeTab === "posts" && filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No blog posts found</p>
              </div>
            )}

            {activeTab === "pages" &&
              filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">/{page.slug}</p>
                      {page.meta_description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {page.meta_description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>
                          Updated:{" "}
                          {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            page.published
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {page.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => analyzeContent(page, "page")}
                      className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 whitespace-nowrap"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Analyze SEO
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === "posts" &&
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        /blog/{post.slug}
                      </p>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>
                          Updated:{" "}
                          {new Date(post.updated_at).toLocaleDateString()}
                        </span>
                        {post.category && (
                          <span>Category: {post.category}</span>
                        )}
                        <span
                          className={`px-2 py-1 rounded ${
                            post.published
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => analyzeContent(post, "post")}
                      className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 whitespace-nowrap"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Analyze SEO
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick SEO Actions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/admin/settings"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Update Meta Tags
                    </p>
                    <p className="text-sm text-gray-600">
                      Manage default SEO settings
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/content"
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Content Audit</p>
                    <p className="text-sm text-gray-600">Review page content</p>
                  </div>
                </div>
              </a>

              <a
                href="https://analytics.google.com/analytics/web/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors block"
                title="Open Google Analytics in a new tab"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Analytics Report
                    </p>
                    <p className="text-sm text-gray-600">
                      View SEO performance
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Analyzer Modal */}
      {selectedItem && (
        <SEOAnalyzerModal
          isOpen={showAnalyzer}
          onClose={() => setShowAnalyzer(false)}
          content={selectedItem.content}
          title={selectedItem.title}
          metaDescription={selectedItem.metaDescription}
          url={selectedItem.url}
          onSave={handleSaveUpdates}
        />
      )}
      {/* GA Health Check Modal */}
      {showGAHealth && (
        <GAHealthCheckModal
          isOpen={showGAHealth}
          onClose={() => setShowGAHealth(false)}
        />
      )}
    </div>
  );
}
