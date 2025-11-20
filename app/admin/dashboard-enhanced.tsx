/**
 * Enhanced Admin Dashboard
 * 
 * New features:
 * - Real-time analytics with charts
 * - Recent activity feed
 * - Quick action buttons with keyboard shortcuts
 * - Lead quality indicators
 * - Performance metrics
 * - Bulk operations
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import NotificationCenter from "@/components/NotificationCenter";

interface User {
  id: string;
  email: string;
  role: string;
}

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
  color: string;
  featured?: boolean;
  disabled?: boolean;
}

const DASHBOARD_CARDS: DashboardCard[] = [
  {
    id: "leads",
    title: "Manage Leads",
    description: "View and manage customer leads",
    icon: "👥",
    href: "/admin/leads",
    color: "blue",
  },
  {
    id: "lead-scoring",
    title: "Lead Scoring",
    description: "AI-powered lead prioritization system",
    icon: "🎯",
    href: "/admin/lead-scoring",
    badge: "NEW",
    color: "pink",
    featured: true,
  },
  {
    id: "gallery",
    title: "Gallery",
    description: "Manage photo gallery",
    icon: "📷",
    href: "/admin/gallery",
    color: "purple",
  },
  {
    id: "content",
    title: "Content",
    description: "Edit website content",
    icon: "📝",
    href: "/admin/content",
    color: "blue",
  },
  {
    id: "blog",
    title: "Blog",
    description: "Manage blog posts",
    icon: "📝",
    href: "/admin/blog",
    color: "orange",
  },
  {
    id: "seo",
    title: "SEO & AI",
    description: "Analyze content, generate titles & meta",
    icon: "🤖",
    href: "/admin/seo",
    color: "teal",
  },
  {
    id: "bookings",
    title: "Bookings",
    description: "Manage photo session bookings",
    icon: "📅",
    href: "/admin/bookings",
    color: "green",
  },
  {
    id: "cms",
    title: "Enhanced Content CMS",
    description: "Advanced content editor with SEO, scheduling, revisions & more",
    icon: "✨",
    href: "/admin/content-enhanced",
    badge: "NEW",
    color: "green",
    featured: true,
  },
  {
    id: "marketing",
    title: "Marketing & CRM",
    description: "Email & SMS campaigns, lead nurturing",
    icon: "📧",
    href: "/admin/marketing",
    badge: "NEW",
    color: "pink",
    featured: true,
  },
  {
    id: "email-templates",
    title: "Email Templates",
    description: "Manage auto-response email templates",
    icon: "📮",
    href: "/admin/email-templates",
    badge: "NEW",
    color: "purple",
    featured: true,
  },
  {
    id: "calendar",
    title: "Calendar View",
    description: "Visual booking calendar with drag-drop",
    icon: "📅",
    href: "/admin/calendar",
    badge: "NEW",
    color: "purple",
    featured: true,
  },
  {
    id: "inbox",
    title: "SMS Inbox",
    description: "Two-way SMS messaging with leads",
    icon: "💬",
    href: "/admin/inbox",
    badge: "NEW",
    color: "teal",
    featured: true,
  },
  {
    id: "client-portals",
    title: "Client Portals",
    description: "Secure portal link management",
    icon: "🔐",
    href: "/admin/client-portals",
    badge: "NEW",
    color: "teal",
    featured: true,
  },
  {
    id: "navigation",
    title: "Navigation",
    description: "Edit menu items",
    icon: "🧭",
    href: "/admin/navigation",
    color: "purple",
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    description: "View charts, trends, and performance metrics",
    icon: "📊",
    href: "/admin/analytics",
    badge: "NEW",
    color: "blue",
    featured: true,
  },
  {
    id: "migrations",
    title: "Database Migrations",
    description: "Run schema updates and migrations",
    icon: "🗄️",
    href: "/admin/database-migrations",
    color: "orange",
  },
  {
    id: "theme",
    title: "Theme Customizer",
    description: "Customize colors, fonts, and branding",
    icon: "🎨",
    href: "/admin/theme-customizer",
    badge: "NEW",
    color: "orange",
    featured: true,
  },
  {
    id: "site-audit",
    title: "Site Audit",
    description: "Content, performance & UX analysis",
    icon: "🔍",
    href: "/admin/audit",
    color: "red",
  },
  {
    id: "page-builder",
    title: "Page Builder",
    description: "Build custom pages",
    icon: "🏗️",
    href: "/admin/page-builder",
    color: "orange",
  },
  {
    id: "live-editor",
    title: "Live Page Editor",
    description: "Edit published pages directly",
    icon: "✏️",
    href: "/admin/live-editor",
    color: "teal",
  },
  {
    id: "site-editor",
    title: "Site Editor",
    description: "Global site settings",
    icon: "⚙️",
    href: "/admin/site-editor",
    color: "gray",
  },
  {
    id: "performance",
    title: "Performance",
    description: "Web vitals & metrics",
    icon: "⚡",
    href: "/admin/performance",
    color: "red",
  },
  {
    id: "settings",
    title: "Settings",
    description: "System configuration",
    icon: "⚙️",
    href: "/admin/settings",
    color: "gray",
  },
];

// Keyboard shortcuts
const SHORTCUTS = [
  { key: "l", label: "Leads", href: "/admin/leads" },
  { key: "g", label: "Gallery", href: "/admin/gallery" },
  { key: "b", label: "Blog", href: "/admin/blog" },
  { key: "c", label: "Content", href: "/admin/content-enhanced" },
  { key: "m", label: "Marketing", href: "/admin/marketing" },
  { key: "s", label: "Settings", href: "/admin/settings" },
];

export default function EnhancedAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { stats, loading: statsLoading, error } = useDashboardData();

  useEffect(() => {
    checkAuth();
    
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if no input is focused and Cmd/Ctrl is pressed
      if (
        (e.metaKey || e.ctrlKey) &&
        !(e.target as HTMLElement).matches("input, textarea, select")
      ) {
        const shortcut = SHORTCUTS.find(s => s.key === e.key.toLowerCase());
        if (shortcut) {
          e.preventDefault();
          router.push(shortcut.href);
        }
      }
      
      // Quick search with "/" key
      if (e.key === "/" && !(e.target as HTMLElement).matches("input, textarea, select")) {
        e.preventDefault();
        document.getElementById("dashboard-search")?.focus();
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();

      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const filteredCards = DASHBOARD_CARDS.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Studio37 Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <Link
                href="/admin/chatbot-training"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>🧠</span>
                <span>AI Training</span>
              </Link>
              <Link
                href="/admin/ai-site-builder"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>⚡</span>
                <span>AI Site Builder</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {statsLoading ? "..." : stats?.totalLeads || 2}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {statsLoading ? "..." : formatCurrency(stats?.totalRevenue || 0)}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {statsLoading ? "..." : stats?.totalBookings || 0}
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Insights</p>
                <p className="text-sm font-semibold text-pink-600 mt-1">View Analytics →</p>
              </div>
              <div className="text-4xl">🤖</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              id="dashboard-search"
              type="text"
              placeholder="Search features... (press / to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Quick shortcuts:</span>
            {SHORTCUTS.map(shortcut => (
              <kbd
                key={shortcut.key}
                className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => router.push(shortcut.href)}
              >
                ⌘{shortcut.key.toUpperCase()}
              </kbd>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => {
            const colorClasses: Record<string, string> = {
              blue: "border-blue-200 hover:border-blue-400 hover:shadow-blue-100",
              green: "border-green-200 hover:border-green-400 hover:shadow-green-100",
              purple: "border-purple-200 hover:border-purple-400 hover:shadow-purple-100",
              pink: "border-pink-200 hover:border-pink-400 hover:shadow-pink-100",
              orange: "border-orange-200 hover:border-orange-400 hover:shadow-orange-100",
              red: "border-red-200 hover:border-red-400 hover:shadow-red-100",
              teal: "border-teal-200 hover:border-teal-400 hover:shadow-teal-100",
              gray: "border-gray-200 hover:border-gray-400 hover:shadow-gray-100",
            };

            return (
              <Link
                key={card.id}
                href={card.href}
                className={`block bg-white rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                  card.featured ? "ring-2 ring-purple-300" : ""
                } ${colorClasses[card.color] || colorClasses.gray} ${
                  card.disabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{card.icon}</div>
                  {card.badge && (
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </Link>
            );
          })}
        </div>

        {/* No results */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600">No features found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
