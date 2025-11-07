"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  Code,
  Monitor,
  Tablet,
  Smartphone,
  Type,
  Image as ImageIcon,
  Square,
  Columns,
  Layout,
  Save,
  Copy,
  Sparkles,
  Mail,
  DollarSign,
  HelpCircle,
  Award,
  Grid3x3,
  BarChart3,
  Megaphone,
  Star,
  BringToFront,
  Play,
  MessageSquare,
  Camera,
  ChevronDown,
  ChevronRight,
  Users,
  Instagram,
  Link2,
  LayoutGrid,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Lock,
  Unlock,
  Lightbulb,
  Wand2,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  Video,
  MapPin,
  Clock,
  TrendingUp,
  Calendar,
  ThumbsUp,
  TableProperties,
  Zap,
  Target,
  FileText,
  List,
  Navigation,
  MousePointer,
  Volume2,
  Package,
  Bell,
} from "lucide-react";
import Image from "next/image";
import ImageUploader from "./ImageUploader";
import MobilePreviewToggle from "./MobilePreviewToggle";

// Component types
type ComponentType =
  | "hero"
  | "text"
  | "image"
  | "button"
  | "columns"
  | "spacer"
  | "seoFooter"
  | "slideshowHero"
  | "testimonials"
  | "galleryHighlights"
  | "widgetEmbed"
  | "badges"
  | "servicesGrid"
  | "stats"
  | "ctaBanner"
  | "iconFeatures"
  | "logo"
  | "contactForm"
  | "newsletterSignup"
  | "faq"
  | "pricingTable"
  | "teamMembers"
  | "socialFeed"
  | "dualCTA"
  | "customCss"
  | "container"
  | "accordion"
  | "tabs"
  | "videoHero"
  | "beforeAfter"
  | "timeline"
  | "comparisonTable"
  | "mapEmbed"
  | "countdown"
  | "reviews"
  | "instagramFeed"
  | "photoGrid"
  | "clientPortal"
  | "stickyCTA"
  | "exitPopup"
  | "progressSteps"
  | "calendarWidget"
  | "trustBadges"
  | "blogCards"
  | "categoryNav"
  | "breadcrumbs"
  | "tableOfContents"
  | "relatedContent"
  | "quiz"
  | "calculator"
  | "lightbox"
  | "enhancedTabs"
  | "alertBanner"
  | "audioPlayer"
  | "viewer360"
  | "pdfEmbed"
  | "logoCarousel"
  | "liveCounter"
  | "bookingsTicker";

interface BaseComponent {
  id: string;
  type: ComponentType;
  visibility?: { mobile: boolean; tablet: boolean; desktop: boolean };
  children?: PageComponent[];
}

interface HeroComponent extends BaseComponent {
  type: "hero";
  data: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    buttonText: string;
    buttonLink: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    alignment: "left" | "center" | "right";
    overlay: number;
    titleColor: string;
    subtitleColor: string;
    buttonStyle: "primary" | "secondary" | "outline";
    animation: "none" | "fade-in" | "slide-up" | "zoom";
    buttonAnimation?: "none" | "hover-zoom";
    fullBleed?: boolean;
    overlapHeader?: boolean;
  };
}

interface TextComponent extends BaseComponent {
  type: "text";
  data: {
    content: string;
    alignment: "left" | "center" | "right";
    size: "sm" | "md" | "lg" | "xl";
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface ImageComponent extends BaseComponent {
  type: "image";
  data: {
    url: string;
    alt: string;
    caption?: string;
    width: "full" | "large" | "medium" | "small";
    link?: string;
    animation: "none" | "fade-in" | "slide-up" | "zoom" | "hover-zoom";
  };
}

interface ButtonComponent extends BaseComponent {
  type: "button";
  data: {
    text: string;
    link: string;
    style: "primary" | "secondary" | "outline";
    alignment: "left" | "center" | "right";
    animation?: "none" | "fade-in" | "slide-up" | "zoom" | "hover-zoom";
  };
}

interface ColumnsComponent extends BaseComponent {
  type: "columns";
  data: {
    columns: Array<{
      content: string;
      image?: string;
    }>;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface SpacerComponent extends BaseComponent {
  type: "spacer";
  data: {
    height: "sm" | "md" | "lg" | "xl";
  };
}

interface SEOFooterComponent extends BaseComponent {
  type: "seoFooter";
  data: {
    content: string;
    includeSchema?: boolean;
  };
}

interface CustomCssComponent extends BaseComponent {
  type: "customCss";
  data: {
    css: string;
    enabled?: boolean;
    note?: string;
  };
}

interface SlideshowHeroComponent extends BaseComponent {
  type: "slideshowHero";
  data: {
    slides: Array<{ image: string; category?: string; title?: string }>;
    intervalMs: number;
    overlay: number;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    alignment?: "left" | "center" | "right";
    titleColor?: string;
    subtitleColor?: string;
    buttonStyle?: "primary" | "secondary" | "outline";
    buttonAnimation?: "none" | "hover-zoom";
    fullBleed?: boolean;
  };
}

interface TestimonialsComponent extends BaseComponent {
  type: "testimonials";
  data: {
    testimonials: Array<{
      quote: string;
      author?: string;
      subtext?: string;
      avatar?: string;
    }>;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

// GalleryHighlightsComponent is defined once below with full organizing fields (collections, tags, group, sort, limits)

interface WidgetEmbedComponent extends BaseComponent {
  type: "widgetEmbed";
  data: {
    provider?: "thumbtack" | "google" | "yelp" | "custom";
    html: string;
    scriptSrcs: string[];
    styleReset?: boolean;
  };
}

interface GalleryHighlightsComponent extends BaseComponent {
  type: "galleryHighlights";
  data: {
    categories: string[];
    featuredOnly?: boolean;
    limit?: number;
    // New organizing fields
    collections?: string[];
    tags?: string[];
    group?: string;
    sortBy?: "display_order" | "created_at";
    sortDir?: "asc" | "desc";
    limitPerCategory?: number;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface BadgesComponent extends BaseComponent {
  type: "badges";
  data: {
    badges: Array<{
      icon:
        | "star"
        | "thumbtack"
        | "shield"
        | "camera"
        | "check"
        | "yelp"
        | "google";
      label: string;
      sublabel?: string;
      href?: string;
      color?: string;
    }>;
    alignment: "left" | "center" | "right";
    size: "sm" | "md" | "lg";
    style: "solid" | "outline" | "pill";
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface ServicesGridComponent extends BaseComponent {
  type: "servicesGrid";
  data: {
    heading?: string;
    subheading?: string;
    services: Array<{
      image: string;
      title: string;
      description: string;
      features: string[];
      link?: string;
    }>;
    columns: 2 | 3 | 4;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface StatsComponent extends BaseComponent {
  type: "stats";
  data: {
    heading?: string;
    stats: Array<{
      icon?: string;
      number: string;
      label: string;
      suffix?: string;
    }>;
    columns: 2 | 3 | 4;
    style: "default" | "cards" | "minimal" | "inline-badges";
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface CTABannerComponent extends BaseComponent {
  type: "ctaBanner";
  data: {
    heading: string;
    subheading?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    overlay?: number;
    textColor?: string;
    fullBleed?: boolean;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface IconFeaturesComponent extends BaseComponent {
  type: "iconFeatures";
  data: {
    heading?: string;
    subheading?: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    columns: 2 | 3 | 4;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface LogoComponent extends BaseComponent {
  type: "logo";
  data: {
    mode: "svg" | "image";
    text: string;
    subtext?: string;
    showCamera?: boolean;
    color?: string;
    accentColor?: string;
    imageUrl?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    // For image mode: explicit pixel height for better control
    imageHeightPx?: number;
    // For SVG wordmark: optional custom font size override (px)
    fontSizePx?: number;
    alignment?: "left" | "center" | "right";
    link?: string;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface ContactFormComponent extends BaseComponent {
  type: "contactForm";
  data: {
    heading?: string;
    subheading?: string;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface NewsletterComponent extends BaseComponent {
  type: "newsletterSignup";
  data: {
    heading?: string;
    subheading?: string;
    disclaimer?: string;
    style?: "card" | "banner";
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface FAQComponent extends BaseComponent {
  type: "faq";
  data: {
    heading?: string;
    items: Array<{ question: string; answer: string }>;
    columns?: 1 | 2;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface PricingTableComponent extends BaseComponent {
  type: "pricingTable";
  data: {
    heading?: string;
    subheading?: string;
    plans: Array<{
      title: string;
      price: string;
      period?: string;
      features: string[];
      ctaText?: string;
      ctaLink?: string;
      highlight?: boolean;
    }>;
    columns: 2 | 3 | 4;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
    // New optional styling controls
    style?: "light" | "dark";
    variant?: "card" | "flat";
    showFeatureChecks?: boolean;
  };
}

interface TeamMembersComponent extends BaseComponent {
  type: "teamMembers";
  data: {
    heading?: string;
    subheading?: string;
    members: Array<{
      name: string;
      title: string;
      image: string;
      bio: string;
      expertise: string[];
      social?: {
        instagram?: string;
        linkedin?: string;
        twitter?: string;
      };
    }>;
    columns: 2 | 3 | 4;
    layout: "cards" | "bio-left" | "bio-right" | "alternating";
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface SocialFeedComponent extends BaseComponent {
  type: "socialFeed";
  data: {
    heading?: string;
    source: "instagram" | "manual";
    username?: string;
    posts: Array<{
      image: string;
      caption: string;
      likes?: number;
      comments?: number;
      timestamp?: string;
      location?: string;
      avatar?: string;
    }>;
    limit: number;
    columns: 2 | 3 | 4;
    showEngagement?: boolean;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface DualCTAComponent extends BaseComponent {
  type: "dualCTA";
  data: {
    heading?: string;
    subheading?: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    alignment: "left" | "center" | "right";
    backgroundColor?: string;
    textColor?: string;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface ContainerComponent extends BaseComponent {
  type: "container";
  data: {
    backgroundColor?: string;
    padding?: "none" | "sm" | "md" | "lg";
    maxWidth?: "full" | "container" | "narrow";
  };
}

interface AccordionComponent extends BaseComponent {
  type: "accordion";
  data: {
    items: Array<{
      id: string;
      title: string;
      isOpen?: boolean;
    }>;
    allowMultiple?: boolean;
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

interface TabsComponent extends BaseComponent {
  type: "tabs";
  data: {
    tabs: Array<{
      id: string;
      label: string;
    }>;
    activeTab?: string;
    style?: "underline" | "pills" | "boxed";
    animation?: "none" | "fade-in" | "slide-up" | "zoom";
  };
}

// HIGH PRIORITY - Missing Essentials
interface VideoHeroComponent extends BaseComponent {
  type: "videoHero";
  data: {
    videoUrl: string;
    posterImage?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    overlay: number;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    alignment: "left" | "center" | "right";
    titleColor: string;
    subtitleColor: string;
  };
}

interface BeforeAfterComponent extends BaseComponent {
  type: "beforeAfter";
  data: {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    initialPosition?: number;
    orientation?: "horizontal" | "vertical";
  };
}

interface TimelineComponent extends BaseComponent {
  type: "timeline";
  data: {
    heading?: string;
    events: Array<{
      id: string;
      date: string;
      title: string;
      description: string;
      icon?: string;
    }>;
    orientation?: "vertical" | "horizontal";
    style?: "default" | "minimal" | "cards";
    animation?: "none" | "fade-in" | "slide-up";
  };
}

interface ComparisonTableComponent extends BaseComponent {
  type: "comparisonTable";
  data: {
    heading?: string;
    // Features hold per-plan values (indexed by plan order)
    features: Array<{
      id?: string;
      name: string;
      description?: string;
      values?: Array<string | boolean>;
    }>;
    // Plans define columns; "featured" highlights a plan
    plans: Array<{
      id?: string;
      name: string;
      featured?: boolean;
    }>;
    style?: "default" | "compact" | "cards";
  };
}

interface MapEmbedComponent extends BaseComponent {
  type: "mapEmbed";
  data: {
    address?: string;
    lat?: number;
    lng?: number;
    zoom?: number;
    height?: "sm" | "md" | "lg" | "xl";
    showMarker?: boolean;
    mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
  };
}

interface TrustBadgesComponent extends BaseComponent {
  type: "trustBadges";
  data: {
    heading?: string;
    badges: Array<{
      id?: string;
      label: string;
      description?: string;
      icon?: string; // emoji, text, or URL
    }>;
    layout?: "horizontal" | "grid";
    size?: "sm" | "md" | "lg";
  };
}

interface CountdownComponent extends BaseComponent {
  type: "countdown";
  data: {
    targetDate: string;
    heading?: string;
    subheading?: string;
    expiredMessage?: string;
    showLabels?: boolean;
    style?: "default" | "minimal" | "boxes";
    size?: "sm" | "md" | "lg";
  };
}

// CLIENT ENGAGEMENT
interface ReviewsComponent extends BaseComponent {
  type: "reviews";
  data: {
    heading?: string;
    source: "google" | "manual";
    reviews?: Array<{
      id: string;
      author: string;
      rating: number;
      text: string;
      date?: string;
      avatar?: string;
    }>;
    placeId?: string;
    displayCount?: number;
    style?: "cards" | "grid" | "carousel";
    showRating?: boolean;
  };
}

interface InstagramFeedComponent extends BaseComponent {
  type: "instagramFeed";
  data: {
    heading?: string;
    username?: string;
    accessToken?: string;
    displayCount: number;
    columns: 2 | 3 | 4 | 6;
    showCaptions?: boolean;
    style?: "grid" | "carousel";
  };
}

interface PhotoGridComponent extends BaseComponent {
  type: "photoGrid";
  data: {
    heading?: string;
    categories?: string[];
    collections?: string[];
    tags?: string[];
    layout: "grid" | "masonry" | "justified";
    columns: 2 | 3 | 4 | 5;
    gap?: "sm" | "md" | "lg";
    showFilters?: boolean;
    limit?: number;
  };
}

interface ClientPortalComponent extends BaseComponent {
  type: "clientPortal";
  data: {
    heading?: string;
    description?: string;
    loginUrl?: string;
    buttonText?: string;
    style?: "card" | "inline" | "banner";
  };
}

// CONVERSION OPTIMIZATION
interface StickyCTAComponent extends BaseComponent {
  type: "stickyCTA";
  data: {
    text: string;
    buttonText: string;
    buttonLink: string;
    position: "top" | "bottom";
    backgroundColor?: string;
    textColor?: string;
    showOnScroll?: boolean;
  };
}

interface ExitPopupComponent extends BaseComponent {
  type: "exitPopup";
  data: {
    heading: string;
    message: string;
    buttonText: string;
    buttonLink: string;
    dismissible?: boolean;
    showOnce?: boolean;
    delay?: number;
  };
}

interface ProgressStepsComponent extends BaseComponent {
  type: "progressSteps";
  data: {
    steps: Array<{
      id: string;
      title: string;
      description?: string;
      icon?: string;
    }>;
    currentStep?: number;
    style?: "horizontal" | "vertical";
    showNumbers?: boolean;
  };
}

interface CalendarWidgetComponent extends BaseComponent {
  type: "calendarWidget";
  data: {
    heading?: string;
    provider: "calendly" | "google" | "custom";
    embedUrl?: string;
    minDate?: string;
    blockedDates?: string[];
    style?: "inline" | "button";
  };
}

interface TrustBadgesComponent extends BaseComponent {
  type: "trustBadges";
  data: {
    heading?: string;
    badges: Array<{
      id: string;
      image: string;
      title: string;
      link?: string;
    }>;
    layout: "horizontal" | "grid";
    size?: "sm" | "md" | "lg";
  };
}

// CONTENT/SEO
interface BlogCardsComponent extends BaseComponent {
  type: "blogCards";
  data: {
    heading?: string;
    displayCount: number;
    layout: "grid" | "list" | "carousel";
    columns?: 2 | 3 | 4;
    showExcerpt?: boolean;
    showDate?: boolean;
    showAuthor?: boolean;
    featured?: string[];
  };
}

interface CategoryNavComponent extends BaseComponent {
  type: "categoryNav";
  data: {
    heading?: string;
    categories: Array<{
      id: string;
      name: string;
      image?: string;
      link: string;
      count?: number;
    }>;
    layout: "grid" | "carousel" | "sidebar";
    columns?: 2 | 3 | 4;
    showCounts?: boolean;
  };
}

interface BreadcrumbsComponent extends BaseComponent {
  type: "breadcrumbs";
  data: {
    items?: Array<{
      label: string;
      link: string;
    }>;
    separator?: "slash" | "chevron" | "dot";
    showHome?: boolean;
  };
}

interface TableOfContentsComponent extends BaseComponent {
  type: "tableOfContents";
  data: {
    heading?: string;
    items: Array<{
      id: string;
      label: string;
      anchor: string;
      level: number;
    }>;
    position?: "sidebar" | "top";
    sticky?: boolean;
  };
}

interface RelatedContentComponent extends BaseComponent {
  type: "relatedContent";
  data: {
    heading?: string;
    contentType: "pages" | "blog" | "gallery" | "services";
    displayCount: number;
    layout: "grid" | "list" | "carousel";
    algorithm?: "recent" | "popular" | "related";
  };
}

// INTERACTIVE
interface QuizComponent extends BaseComponent {
  type: "quiz";
  data: {
    heading: string;
    description?: string;
    questions: Array<{
      id: string;
      question: string;
      options: Array<{
        id: string;
        text: string;
        value: string;
      }>;
    }>;
    results: Record<string, {
      title: string;
      description: string;
      image?: string;
      cta?: { text: string; link: string };
    }>;
  };
}

interface CalculatorComponent extends BaseComponent {
  type: "calculator";
  data: {
    heading: string;
    description?: string;
    fields: Array<{
      id: string;
      label: string;
      type: "number" | "select" | "checkbox";
      options?: Array<{ label: string; value: number }>;
      multiplier?: number;
    }>;
    basePrice?: number;
    showBreakdown?: boolean;
  };
}

interface LightboxComponent extends BaseComponent {
  type: "lightbox";
  data: {
    triggerText: string;
    triggerStyle?: "button" | "link" | "image";
    content: string;
    image?: string;
    width?: "sm" | "md" | "lg" | "xl" | "full";
  };
}

interface EnhancedTabsComponent extends BaseComponent {
  type: "enhancedTabs";
  data: {
    tabs: Array<{
      id: string;
      label: string;
      icon?: string;
      image?: string;
    }>;
    activeTab?: string;
    style?: "underline" | "pills" | "boxed" | "vertical";
    showIcons?: boolean;
  };
}

interface AlertBannerComponent extends BaseComponent {
  type: "alertBanner";
  data: {
    message: string;
    type: "info" | "success" | "warning" | "error";
    dismissible?: boolean;
    link?: string;
    linkText?: string;
    position?: "top" | "bottom" | "inline";
  };
}

// MULTIMEDIA
interface AudioPlayerComponent extends BaseComponent {
  type: "audioPlayer";
  data: {
    audioUrl: string;
    title?: string;
    artist?: string;
    coverImage?: string;
    autoplay?: boolean;
    loop?: boolean;
    style?: "minimal" | "full" | "compact";
  };
}

interface Viewer360Component extends BaseComponent {
  type: "viewer360";
  data: {
    imageUrl: string;
    autoRotate?: boolean;
    height?: "sm" | "md" | "lg" | "xl";
    controls?: boolean;
  };
}

interface PDFEmbedComponent extends BaseComponent {
  type: "pdfEmbed";
  data: {
    pdfUrl: string;
    downloadable?: boolean;
    height?: "sm" | "md" | "lg" | "xl";
    title?: string;
  };
}

// SOCIAL PROOF
interface LogoCarouselComponent extends BaseComponent {
  type: "logoCarousel";
  data: {
    heading?: string;
    logos: Array<{
      id: string;
      image: string;
      alt: string;
      link?: string;
    }>;
    autoplay?: boolean;
    speed?: number;
    grayscale?: boolean;
  };
}

interface LiveCounterComponent extends BaseComponent {
  type: "liveCounter";
  data: {
    counters: Array<{
      id: string;
      label: string;
      targetValue: number;
      suffix?: string;
      prefix?: string;
      icon?: string;
    }>;
    duration?: number;
    style?: "default" | "minimal" | "badges";
  };
}

interface BookingsTickerComponent extends BaseComponent {
  type: "bookingsTicker";
  data: {
    items: Array<{
      id: string;
      name: string;
      location?: string;
      service?: string;
      timeAgo: string;
    }>;
    position: "top" | "bottom" | "corner";
    displayDuration?: number;
    interval?: number;
  };
}

type PageComponent =
  | HeroComponent
  | TextComponent
  | ImageComponent
  | ButtonComponent
  | ColumnsComponent
  | SpacerComponent
  | SEOFooterComponent
  | SlideshowHeroComponent
  | TestimonialsComponent
  | GalleryHighlightsComponent
  | WidgetEmbedComponent
  | BadgesComponent
  | ServicesGridComponent
  | StatsComponent
  | CTABannerComponent
  | IconFeaturesComponent
  | LogoComponent
  | ContactFormComponent
  | NewsletterComponent
  | FAQComponent
  | PricingTableComponent
  | TeamMembersComponent
  | SocialFeedComponent
  | DualCTAComponent
  | CustomCssComponent
  | ContainerComponent
  | AccordionComponent
  | TabsComponent
  | VideoHeroComponent
  | BeforeAfterComponent
  | TimelineComponent
  | ComparisonTableComponent
  | MapEmbedComponent
  | CountdownComponent
  | ReviewsComponent
  | InstagramFeedComponent
  | PhotoGridComponent
  | ClientPortalComponent
  | StickyCTAComponent
  | ExitPopupComponent
  | ProgressStepsComponent
  | CalendarWidgetComponent
  | TrustBadgesComponent
  | BlogCardsComponent
  | CategoryNavComponent
  | BreadcrumbsComponent
  | TableOfContentsComponent
  | RelatedContentComponent
  | QuizComponent
  | CalculatorComponent
  | LightboxComponent
  | EnhancedTabsComponent
  | AlertBannerComponent
  | AudioPlayerComponent
  | Viewer360Component
  | PDFEmbedComponent
  | LogoCarouselComponent
  | LiveCounterComponent
  | BookingsTickerComponent;

interface VisualEditorProps {
  initialComponents?: PageComponent[];
  onSave: (components: PageComponent[]) => void;
  onChange?: (components: PageComponent[]) => void;
  slug?: string;
  onImportFromPublished?: () => void | Promise<void>;
}

export default function VisualEditor({
  initialComponents = [],
  onSave,
  onChange,
  slug,
  onImportFromPublished,
}: VisualEditorProps) {
  const [components, setComponents] =
    useState<PageComponent[]>(initialComponents);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  // Sync components when initialComponents changes (for Live Editor page switching)
  useEffect(() => {
    setComponents(initialComponents);
    setHistory([initialComponents]);
    setHistoryIndex(0);
    setSelectedComponent(null);
  }, [initialComponents]);

  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState<PageComponent[][]>([
    initialComponents,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "basic",
    "layout",
    "content",
    "forms",
    "marketing",
  ]);
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [copiedComponent, setCopiedComponent] = useState<PageComponent | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [componentSearchQuery, setComponentSearchQuery] = useState('');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [lockedComponents, setLockedComponents] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [useAISource, setUseAISource] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [propertiesExpanded, setPropertiesExpanded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem('ve:propertiesExpanded');
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('ve:propertiesExpanded', JSON.stringify(propertiesExpanded));
    } catch {}
  }, [propertiesExpanded]);

  // Custom properties panel width (drag-resize)
  const [propertiesWidth, setPropertiesWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return 320;
    try {
      const raw = localStorage.getItem('ve:propertiesWidth');
      return raw ? Number(JSON.parse(raw)) : 320;
    } catch {
      return 320;
    }
  });
  const [isResizing, setIsResizing] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem('ve:propertiesWidth', JSON.stringify(propertiesWidth));
    } catch {}
  }, [propertiesWidth]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setPropertiesWidth(Math.max(280, Math.min(800, newWidth)));
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Quick properties mode (compact editors)
  const [quickPropertiesMode, setQuickPropertiesMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem('ve:quickPropsMode');
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('ve:quickPropsMode', JSON.stringify(quickPropertiesMode));
    } catch {}
  }, [quickPropertiesMode]);

  // Memoize the selected component with stable reference
  const selectedComponentData = React.useMemo(() => {
    if (!selectedComponent) return null;
    return components.find((c) => c.id === selectedComponent) || null;
  }, [selectedComponent, components]);

  // Keep a stable reference updated synchronously to prevent re-renders
  const selectedComponentDataStableRef = React.useRef<PageComponent | null>(null);
  if (selectedComponentData && selectedComponentData.id === selectedComponent) {
    selectedComponentDataStableRef.current = selectedComponentData;
  } else if (!selectedComponent) {
    selectedComponentDataStableRef.current = null;
  }

  type Suggestion = {
    id: string;
    type: PageComponent["type"];
    title: string;
    description: string;
    rationale: string;
    insertAfterId?: string | null;
  };

  const computeSuggestions = React.useCallback((): Suggestion[] => {
    const result: Suggestion[] = [];
    const types = components.map((c) => c.type);
    const has = (t: PageComponent["type"]) => types.includes(t);
    const findId = (t: PageComponent["type"]) => components.find((c) => c.type === t)?.id || null;

    // CTA after Testimonials
    if (has("testimonials") && !has("ctaBanner")) {
      result.push({
        id: `sugg-${Date.now()}-cta1`,
        type: "ctaBanner",
        title: "Add Call-to-Action",
        description: "Convert social proof into action with a bold CTA banner.",
        rationale: "Testimonials build trust; a CTA turns trust into clicks.",
        insertAfterId: findId("testimonials"),
      });
    }
    // Contact form if missing
    if (!has("contactForm")) {
      result.push({
        id: `sugg-${Date.now()}-contact`,
        type: "contactForm",
        title: "Add Contact Form",
        description: "Make it easy for visitors to reach you directly.",
        rationale: "Every marketing page benefits from a simple contact path.",
        insertAfterId: null,
      });
    }
    // FAQ if services are present but no FAQ
    if (has("servicesGrid") && !has("faq")) {
      result.push({
        id: `sugg-${Date.now()}-faq`,
        type: "faq",
        title: "Add FAQ",
        description: "Answer common objections and reduce friction.",
        rationale: "Services pages convert better with concise FAQs.",
        insertAfterId: findId("servicesGrid"),
      });
    }
    // Newsletter if missing
    if (!has("newsletterSignup")) {
      result.push({
        id: `sugg-${Date.now()}-newsletter`,
        type: "newsletterSignup",
        title: "Capture Emails",
        description: "Build an audience with a lightweight newsletter signup.",
        rationale: "Email converts higher than social; always offer opt-in.",
        insertAfterId: null,
      });
    }
    // Social feed after gallery highlights
    if (has("galleryHighlights") && !has("socialFeed")) {
      result.push({
        id: `sugg-${Date.now()}-social`,
        type: "socialFeed",
        title: "Show Social Feed",
        description: "Keep the page fresh with latest posts.",
        rationale: "After visuals, show recent activity to signal recency.",
        insertAfterId: findId("galleryHighlights"),
      });
    }
    // Pricing after testimonials (if not present)
    if (has("testimonials") && !has("pricingTable")) {
      result.push({
        id: `sugg-${Date.now()}-pricing`,
        type: "pricingTable",
        title: "Clarify Pricing",
        description: "Help visitors self-qualify with transparent pricing tiers.",
        rationale: "Trust + pricing transparency increases conversions.",
        insertAfterId: findId("testimonials"),
      });
    }
    // SEO Footer if page is long and footer missing
    const longPage = components.length >= 8;
    if (longPage && !has("seoFooter")) {
      result.push({
        id: `sugg-${Date.now()}-seofooter`,
        type: "seoFooter",
        title: "Add SEO Footer",
        description: "Extra internal links and locality signals at the bottom.",
        rationale: "Long pages benefit from structured footer links.",
        insertAfterId: null,
      });
    }
    return result;
  }, [components]);

  const suggestions = React.useMemo(() => computeSuggestions(), [computeSuggestions]);

  // Fetch AI-powered suggestions from server
  const fetchAISuggestions = React.useCallback(async () => {
    try {
      setAiError(null);
      setAiLoading(true);
      const res = await fetch('/api/ai/page-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components, slug, maxSuggestions: 6 }),
      });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({}))).error || `Request failed (${res.status})`;
        throw new Error(msg);
      }
      const data = await res.json();
      const results: Array<{ type: PageComponent["type"]; title: string; description: string; rationale: string; afterType?: PageComponent["type"]; }> = data.suggestions || [];
      const mapAfterTypeToId = (t?: PageComponent["type"]) => (t ? components.find(c => c.type === t)?.id || null : null);
      const ai: Suggestion[] = results.map((s, idx) => ({
        id: `ai-sugg-${Date.now()}-${idx}`,
        type: s.type,
        title: s.title || componentMetadata[s.type]?.name || s.type,
        description: s.description || '',
        rationale: s.rationale || '',
        insertAfterId: mapAfterTypeToId(s.afterType),
      }));
      setAiSuggestions(ai);
    } catch (err: any) {
      console.error('AI suggestions failed:', err);
      setAiError(err?.message || 'Failed to load AI suggestions');
      setAiSuggestions(null);
    } finally {
      setAiLoading(false);
    }
  }, [components, slug]);

  // When opening the drawer, try AI first (fallback to rule-based shown automatically)
  useEffect(() => {
    if (showSuggestions) {
      if (useAISource) fetchAISuggestions();
    } else {
      // Reset error/loading states when closing
      setAiLoading(false);
      setAiError(null);
    }
  }, [showSuggestions, useAISource, fetchAISuggestions]);

  const suggestionsToRender: Suggestion[] = React.useMemo(() => {
    if (useAISource) {
      if (aiSuggestions && aiSuggestions.length > 0) return aiSuggestions;
      // If AI empty or failed, fall back to rule-based
      return suggestions;
    }
    return suggestions;
  }, [useAISource, aiSuggestions, suggestions]);

  const addSuggestedComponent = (type: PageComponent["type"], afterId?: string | null) => {
    if (afterId) {
      const index = components.findIndex((c) => c.id === afterId);
      if (index >= 0) {
        const newComp = buildComponent(type);
        const updated = [...components];
        updated.splice(index + 1, 0, newComp);
        notify(updated);
        setSelectedComponent(newComp.id);
        return;
      }
    }
    // Fallback: add to end
    addComponent(type);
  };


  // Default to hiding side panels on small screens
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSmall = window.matchMedia("(max-width: 767px)").matches;
      if (isSmall) {
        setShowLeftDrawer(false);
        setShowRightDrawer(false);
      }
    }
  }, []);

  const applyHomepageTemplate = () => {
    const tpl = buildHomepageTemplate();
    notify(tpl);
    if (tpl.length) setSelectedComponent(tpl[0].id);
  };

  const notify = (next: PageComponent[]) => {
    setComponents(next);
    if (onChange) onChange(next);

    // Update history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(next);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Mark as unsaved and trigger auto-save
    setSaveStatus('unsaved');
    scheduleAutoSave(next);
  };

  // Version History (snapshots)
  type Snapshot = { id: string; createdAt: number; label?: string; components: PageComponent[] };
  const storageKey = `ve:snapshots:${slug || 'default'}`;
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => {
    if (typeof window === 'undefined') return [] as Snapshot[];
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as Snapshot[]) : [];
    } catch {
      return [] as Snapshot[];
    }
  });
  const createSnapshot = (label?: string) => {
    const snap: Snapshot = {
      id: `snap-${Date.now()}`,
      createdAt: Date.now(),
      label,
      components: JSON.parse(JSON.stringify(components)),
    };
    setSnapshots((prev) => [snap, ...prev].slice(0, 50));
  };
  const restoreSnapshot = (id: string) => {
    const snap = snapshots.find((s) => s.id === id);
    if (!snap) return;
    notify(JSON.parse(JSON.stringify(snap.components)));
  };
  const deleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  };
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(snapshots));
    } catch {}
  }, [storageKey, snapshots]);

  const scheduleAutoSave = (components: PageComponent[]) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      handleAutoSave(components);
    }, 30000); // 30 seconds
  };

  const handleAutoSave = async (componentsToSave: PageComponent[]) => {
    setSaveStatus('saving');
    try {
      await onSave(componentsToSave);
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('unsaved');
    }
  };

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents(history[newIndex]);
      if (onChange) onChange(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents(history[newIndex]);
      if (onChange) onChange(history[newIndex]);
    }
  };

  const duplicateComponent = (id: string) => {
    const component = components.find((c) => c.id === id);
    if (!component) return;

    const duplicated: PageComponent = {
      ...component,
      id: `component-${Date.now()}`,
      data: { ...component.data },
    } as PageComponent;

    const index = components.findIndex((c) => c.id === id);
    const updated = [...components];
    updated.splice(index + 1, 0, duplicated);
    notify(updated);
    setSelectedComponent(duplicated.id);
  };

  const moveComponent = (id: string, delta: -1 | 1) => {
    if (lockedComponents.includes(id)) return; // Prevent moving locked components
    const index = components.findIndex((c) => c.id === id);
    if (index < 0) return;
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= components.length) return;
    const updated = [...components];
    const [item] = updated.splice(index, 1);
    updated.splice(newIndex, 0, item);
    notify(updated);
    setSelectedComponent(item.id);
  };

  // Component metadata for search
  const componentMetadata: Record<string, { name: string; category: string; keywords: string[] }> = {
    text: { name: 'Text Block', category: 'basic', keywords: ['paragraph', 'content', 'writing'] },
    image: { name: 'Image', category: 'basic', keywords: ['photo', 'picture', 'media'] },
    button: { name: 'Button', category: 'basic', keywords: ['cta', 'link', 'action'] },
    spacer: { name: 'Spacer', category: 'basic', keywords: ['space', 'gap', 'margin'] },
    hero: { name: 'Hero Section', category: 'layout', keywords: ['banner', 'header', 'intro'] },
    slideshowHero: { name: 'Slideshow Hero', category: 'layout', keywords: ['carousel', 'slider', 'rotating'] },
    columns: { name: 'Columns', category: 'layout', keywords: ['grid', 'layout', 'multi'] },
    ctaBanner: { name: 'CTA Banner', category: 'layout', keywords: ['call to action', 'promo', 'banner'] },
    dualCTA: { name: 'Dual CTA', category: 'layout', keywords: ['two buttons', 'double', 'split'] },
    container: { name: 'Container', category: 'layout', keywords: ['wrapper', 'section', 'group', 'nesting'] },
    accordion: { name: 'Accordion', category: 'layout', keywords: ['collapse', 'expandable', 'faq', 'nesting'] },
    tabs: { name: 'Tabs', category: 'layout', keywords: ['tabbed', 'sections', 'panels', 'nesting'] },
    galleryHighlights: { name: 'Gallery Highlights', category: 'content', keywords: ['photos', 'portfolio', 'showcase'] },
    teamMembers: { name: 'Team Members', category: 'content', keywords: ['staff', 'people', 'about'] },
    socialFeed: { name: 'Social Feed', category: 'content', keywords: ['instagram', 'posts', 'social media'] },
    testimonials: { name: 'Testimonials', category: 'content', keywords: ['reviews', 'feedback', 'quotes'] },
    faq: { name: 'FAQ', category: 'content', keywords: ['questions', 'help', 'answers'] },
    iconFeatures: { name: 'Icon Features', category: 'content', keywords: ['services', 'benefits', 'features'] },
    logo: { name: 'Logo', category: 'content', keywords: ['brand', 'identity', 'mark'] },
    contactForm: { name: 'Contact Form', category: 'forms', keywords: ['email', 'message', 'inquiry'] },
    newsletterSignup: { name: 'Newsletter Signup', category: 'forms', keywords: ['subscribe', 'email list', 'updates'] },
    badges: { name: 'Badges', category: 'marketing', keywords: ['awards', 'trust', 'credentials'] },
    servicesGrid: { name: 'Services Grid', category: 'marketing', keywords: ['offerings', 'packages', 'products'] },
    stats: { name: 'Stats/Numbers', category: 'marketing', keywords: ['metrics', 'achievements', 'counters'] },
    pricingTable: { name: 'Pricing Table', category: 'marketing', keywords: ['plans', 'packages', 'cost'] },
    widgetEmbed: { name: 'Embed Widget', category: 'advanced', keywords: ['code', 'iframe', 'integration'] },
    seoFooter: { name: 'SEO Footer', category: 'advanced', keywords: ['bottom', 'links', 'seo'] },
    customCss: { name: 'Custom CSS', category: 'advanced', keywords: ['style', 'css', 'advanced'] },
    
    // HIGH PRIORITY - Multimedia
    videoHero: { name: 'Video Hero', category: 'multimedia', keywords: ['video', 'banner', 'background', 'motion'] },
    beforeAfter: { name: 'Before/After Slider', category: 'multimedia', keywords: ['comparison', 'slider', 'transform', 'edit'] },
    photoGrid: { name: 'Photo Grid', category: 'multimedia', keywords: ['masonry', 'gallery', 'portfolio', 'filter'] },
    audioPlayer: { name: 'Audio Player', category: 'multimedia', keywords: ['music', 'sound', 'podcast', 'testimonial'] },
    viewer360: { name: '360° Viewer', category: 'multimedia', keywords: ['panorama', 'virtual', 'tour', 'rotate'] },
    pdfEmbed: { name: 'PDF Embed', category: 'multimedia', keywords: ['document', 'download', 'pdf', 'guide'] },
    
    // Client Engagement
    reviews: { name: 'Reviews', category: 'engagement', keywords: ['testimonials', 'google', 'ratings', 'stars'] },
    instagramFeed: { name: 'Instagram Feed', category: 'engagement', keywords: ['social', 'photos', 'feed', 'instagram'] },
    clientPortal: { name: 'Client Portal', category: 'engagement', keywords: ['login', 'access', 'client', 'download'] },
    
    // Conversion
    stickyCTA: { name: 'Sticky CTA Bar', category: 'conversion', keywords: ['floating', 'fixed', 'bar', 'persistent'] },
    countdown: { name: 'Countdown Timer', category: 'conversion', keywords: ['urgency', 'deadline', 'timer', 'offer'] },
    progressSteps: { name: 'Progress Steps', category: 'conversion', keywords: ['wizard', 'steps', 'process', 'guide'] },
    calendarWidget: { name: 'Calendar Widget', category: 'conversion', keywords: ['booking', 'schedule', 'appointment', 'calendly'] },
    trustBadges: { name: 'Trust Badges', category: 'conversion', keywords: ['certifications', 'awards', 'trust', 'seals'] },
    exitPopup: { name: 'Exit Popup', category: 'conversion', keywords: ['modal', 'exit intent', 'offer', 'lead capture'] },
    
    // Content & SEO
    timeline: { name: 'Timeline', category: 'contentNav', keywords: ['history', 'process', 'steps', 'journey'] },
    comparisonTable: { name: 'Comparison Table', category: 'contentNav', keywords: ['compare', 'features', 'packages', 'pricing'] },
    blogCards: { name: 'Blog Cards', category: 'contentNav', keywords: ['posts', 'articles', 'blog', 'news'] },
    categoryNav: { name: 'Category Navigation', category: 'contentNav', keywords: ['browse', 'filter', 'categories', 'menu'] },
    breadcrumbs: { name: 'Breadcrumbs', category: 'contentNav', keywords: ['navigation', 'path', 'seo', 'hierarchy'] },
    tableOfContents: { name: 'Table of Contents', category: 'contentNav', keywords: ['toc', 'navigation', 'anchor', 'jump'] },
    relatedContent: { name: 'Related Content', category: 'contentNav', keywords: ['suggestions', 'recommended', 'related', 'similar'] },
    mapEmbed: { name: 'Map Embed', category: 'contentNav', keywords: ['google maps', 'location', 'address', 'directions'] },
    
    // Interactive
    quiz: { name: 'Quiz/Survey', category: 'interactive', keywords: ['questionnaire', 'form', 'interactive', 'quiz'] },
    calculator: { name: 'Cost Calculator', category: 'interactive', keywords: ['price', 'estimate', 'quote', 'calculator'] },
    lightbox: { name: 'Lightbox/Modal', category: 'interactive', keywords: ['popup', 'modal', 'overlay', 'dialog'] },
    enhancedTabs: { name: 'Enhanced Tabs', category: 'interactive', keywords: ['tabs', 'icons', 'navigation', 'sections'] },
    alertBanner: { name: 'Alert Banner', category: 'interactive', keywords: ['notification', 'message', 'alert', 'announcement'] },
    
    // Social Proof
    logoCarousel: { name: 'Logo Carousel', category: 'social', keywords: ['clients', 'partners', 'brands', 'carousel'] },
    liveCounter: { name: 'Live Counter', category: 'social', keywords: ['stats', 'animated', 'numbers', 'metrics'] },
    bookingsTicker: { name: 'Bookings Ticker', category: 'social', keywords: ['notifications', 'social proof', 'recent', 'activity'] },
  };

  // Filter components based on search query
  const filterComponents = (type: string): boolean => {
    if (!componentSearchQuery.trim()) return true;
    
    const query = componentSearchQuery.toLowerCase();
    const meta = componentMetadata[type];
    if (!meta) return false;
    
    return (
      meta.name.toLowerCase().includes(query) ||
      meta.category.toLowerCase().includes(query) ||
      meta.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  };

  // Auto-expand categories when searching
  React.useEffect(() => {
    if (componentSearchQuery.trim()) {
      // Expand all categories to show search results
      setExpandedCategories(['basic', 'layout', 'content', 'forms', 'marketing', 'advanced']);
    }
  }, [componentSearchQuery]);

  // Check if category has any matching components
  const categoryHasResults = (category: string): boolean => {
    if (!componentSearchQuery.trim()) return true;
    return Object.keys(componentMetadata).some(
      type => componentMetadata[type].category === category && filterComponents(type)
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Visibility helper
  const isVisibleInCurrentView = (comp: PageComponent) => {
    const v = (comp as any).visibility;
    if (!v) return true;
    if (viewMode === 'mobile') return v.mobile !== false;
    if (viewMode === 'tablet') return v.tablet !== false;
    return v.desktop !== false;
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (
        (e.target as HTMLElement).tagName === "INPUT" ||
        (e.target as HTMLElement).tagName === "TEXTAREA" ||
        (e.target as HTMLElement).contentEditable === "true"
      ) {
        return;
      }

      const isMod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+Z - Undo
      if (isMod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } 
      // Cmd/Ctrl+Shift+Z or Cmd/Ctrl+Y - Redo
      else if (isMod && ((e.key === "z" && e.shiftKey) || e.key === "y")) {
        e.preventDefault();
        handleRedo();
      } 
      // Cmd/Ctrl+D - Duplicate
      else if (isMod && e.key === "d" && selectedComponent) {
        e.preventDefault();
        duplicateComponent(selectedComponent);
      } 
      // Cmd/Ctrl+S - Save
      else if (isMod && e.key === "s") {
        e.preventDefault();
        setSaveStatus('saving');
        onSave(components).then(() => {
          setSaveStatus('saved');
          setLastSaved(new Date());
        }).catch(() => setSaveStatus('unsaved'));
      }
      // Cmd/Ctrl+C - Copy
      else if (isMod && e.key === "c" && selectedComponent) {
        e.preventDefault();
        const component = components.find((c) => c.id === selectedComponent);
        if (component) {
          setCopiedComponent(component);
        }
      }
      // Cmd/Ctrl+V - Paste
      else if (isMod && e.key === "v" && copiedComponent) {
        e.preventDefault();
        const duplicated: PageComponent = {
          ...copiedComponent,
          id: `component-${Date.now()}`,
          data: { ...copiedComponent.data },
        } as PageComponent;
        
        const index = selectedComponent 
          ? components.findIndex((c) => c.id === selectedComponent)
          : components.length - 1;
        
        const updated = [...components];
        updated.splice(index + 1, 0, duplicated);
        notify(updated);
        setSelectedComponent(duplicated.id);
      }
      // Cmd/Ctrl+Shift+Up - Move component up
      else if (isMod && e.shiftKey && e.key === "ArrowUp" && selectedComponent) {
        e.preventDefault();
        moveComponent(selectedComponent, -1);
      }
      // Cmd/Ctrl+Shift+Down - Move component down
      else if (isMod && e.shiftKey && e.key === "ArrowDown" && selectedComponent) {
        e.preventDefault();
        moveComponent(selectedComponent, 1);
      }
      // Arrow Up - Select previous component
      else if (e.key === "ArrowUp" && !isMod && selectedComponent) {
        e.preventDefault();
        const index = components.findIndex((c) => c.id === selectedComponent);
        if (index > 0) {
          setSelectedComponent(components[index - 1].id);
        }
      }
      // Arrow Down - Select next component
      else if (e.key === "ArrowDown" && !isMod && selectedComponent) {
        e.preventDefault();
        const index = components.findIndex((c) => c.id === selectedComponent);
        if (index < components.length - 1) {
          setSelectedComponent(components[index + 1].id);
        }
      }
      // Tab - Select next component
      else if (e.key === "Tab" && !e.shiftKey && !isMod) {
        e.preventDefault();
        if (!selectedComponent && components.length > 0) {
          setSelectedComponent(components[0].id);
        } else if (selectedComponent) {
          const index = components.findIndex((c) => c.id === selectedComponent);
          if (index < components.length - 1) {
            setSelectedComponent(components[index + 1].id);
          }
        }
      }
      // Shift+Tab - Select previous component
      else if (e.key === "Tab" && e.shiftKey && !isMod) {
        e.preventDefault();
        if (selectedComponent) {
          const index = components.findIndex((c) => c.id === selectedComponent);
          if (index > 0) {
            setSelectedComponent(components[index - 1].id);
          }
        }
      }
      // Escape - Deselect
      else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedComponent(null);
        setQuickEditId(null);
      }
      // Delete - Delete component
      else if (e.key === "Delete" && selectedComponent) {
        e.preventDefault();
        if (!isLocked(selectedComponent)) {
          deleteComponent(selectedComponent);
        }
      }
      // Enter - Enter quick edit mode
      else if (e.key === "Enter" && selectedComponent && !quickEditId) {
        e.preventDefault();
        const component = components.find((c) => c.id === selectedComponent);
        if (component && ['text', 'button', 'image'].includes(component.type) && !isLocked(selectedComponent)) {
          setQuickEditId(selectedComponent);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [components, selectedComponent, history, historyIndex, copiedComponent, quickEditId, lockedComponents]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    notify(items);
  };

  const addComponent = (type: ComponentType) => {
    const newComponent: PageComponent = {
      id: `component-${Date.now()}`,
      type,
      data: getDefaultData(type),
      visibility: { mobile: true, tablet: true, desktop: true },
    } as PageComponent;

    notify([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  };


  const getDefaultData = (type: ComponentType): any => {
    switch (type) {
      case "hero":
        return {
          title: "Studio 37",
          subtitle:
            "Capturing your precious moments with artistic excellence and professional craftsmanship",
          backgroundImage: "",
          buttonText: "Book Your Session",
          buttonLink: "/book-a-session",
          secondaryButtonText: "View Portfolio",
          secondaryButtonLink: "/gallery",
          alignment: "center",
          overlay: 50,
          titleColor: "text-white",
          subtitleColor: "text-white",
          buttonStyle: "primary",
          animation: "fade-in",
          buttonAnimation: "hover-zoom",
          fullBleed: true,
          overlapHeader: true,
        };
      case "text":
        return {
          content: "Enter your text here...",
          alignment: "left",
          size: "md",
          animation: "none",
        };
      case "image":
        return {
          url: "",
          alt: "Image",
          caption: "",
          width: "full",
          link: "",
          animation: "none",
        };
      case "button":
        return {
          text: "Click Here",
          link: "#",
          style: "primary",
          alignment: "center",
          animation: "none",
        };
      case "columns":
        return {
          columns: [
            { content: "Column 1 content" },
            { content: "Column 2 content" },
          ],
          animation: "none",
        };
      case "spacer":
        return { height: "md" };
      case "seoFooter":
        return {
          content:
            '<h3 class="text-lg font-bold mb-2">About Studio37</h3><p class="text-sm">Professional photography serving Pinehurst, Tomball, Magnolia, The Woodlands, Conroe, Spring, and surrounding areas within 50 miles. Specializing in portraits, weddings, events, and commercial photography.</p><h3 class="text-lg font-bold mt-4 mb-2">Contact</h3><p class="text-sm">Studio37 • 832-713-9944 • sales@studio37.cc • 1701 Goodson Loop, TRLR 80, Pinehurst, TX 77362</p>',
          includeSchema: true,
        };
      case "customCss":
        return {
          css: "/* Page-specific CSS here */\n/* Example: .btn-primary { border-radius: 9999px; } */",
          enabled: true,
          note: "Styles apply inside the preview and published page. Use carefully.",
        };
      case "slideshowHero":
        return {
          slides: [
            {
              image:
                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
              category: "creative portraits",
            },
            {
              image:
                "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1600&auto=format&fit=crop",
              category: "brand photography",
            },
          ],
          intervalMs: 5000,
          overlay: 60,
          title: "Studio 37",
          subtitle: "Artistic excellence, professional craft",
          buttonText: "Book Your Session",
          buttonLink: "/book-a-session",
          alignment: "center",
          titleColor: "text-white",
          subtitleColor: "text-amber-50",
          buttonStyle: "primary",
          buttonAnimation: "hover-zoom",
          fullBleed: true,
        };
      case "testimonials":
        return {
          testimonials: [
            {
              quote: "Absolutely stunning photos and a wonderful experience.",
              author: "A Happy Client",
            },
            {
              quote: "Professional, friendly, and incredible results!",
              author: "Another Client",
            },
          ],
          animation: "fade-in",
        };
      case "galleryHighlights":
        return {
          categories: [],
          featuredOnly: true,
          limit: 6,
          collections: [],
          tags: [],
          group: "",
          sortBy: "display_order",
          sortDir: "asc",
          limitPerCategory: 0,
          animation: "fade-in",
        };
      case "widgetEmbed":
        return {
          provider: "thumbtack",
          html: '<div id="tt-dynamic"></div>',
          scriptSrcs: [
            "https://www.thumbtack.com/profile/widgets/scripts/?service_pk=YOUR_SERVICE_PK&widget_id=review&type=one",
          ],
          styleReset: true,
        };
      case "badges":
        return {
          badges: [
            {
              icon: "yelp",
              label: "5.0 • Yelp Reviews",
              sublabel: "★★★★★",
              color: "#d32323",
              href: "https://www.yelp.com",
            },
            {
              icon: "thumbtack",
              label: "Thumbtack Top Pro",
              sublabel: "Highly Rated",
              color: "#15a6ff",
              href: "https://www.thumbtack.com",
            },
            {
              icon: "shield",
              label: "Certified Professional Photographer",
              sublabel: "Studio 37",
              color: "#0ea5e9",
            },
          ],
          alignment: "center",
          size: "md",
          style: "pill",
          animation: "fade-in",
        };
      case "servicesGrid":
        return {
          heading: "Our Photography Services",
          subheading:
            "From intimate portraits to grand celebrations, we offer comprehensive photography services tailored to your unique needs.",
          services: [
            {
              image:
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
              title: "Wedding Photography",
              description:
                "Capture your special day with romantic and timeless images that tell your love story.",
              features: [
                "Full day coverage",
                "Engagement session",
                "Digital gallery",
                "Print options",
              ],
            },
            {
              image:
                "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop",
              title: "Portrait Sessions",
              description:
                "Professional headshots, family portraits, and individual sessions in studio or on location.",
              features: [
                "Studio or outdoor",
                "Multiple outfits",
                "Retouched images",
                "Same day preview",
              ],
            },
            {
              image:
                "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop",
              title: "Event Photography",
              description:
                "Document your corporate events, parties, and celebrations with candid and posed shots.",
              features: [
                "Event coverage",
                "Candid moments",
                "Group photos",
                "Quick turnaround",
              ],
            },
            {
              image:
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
              title: "Commercial Photography",
              description:
                "Product photography, business headshots, and marketing materials for your brand.",
              features: [
                "Product shots",
                "Brand imagery",
                "Marketing content",
                "Commercial rights",
              ],
            },
          ],
          columns: 2,
          animation: "fade-in",
        };
      case "stats":
        return {
          heading: "",
          stats: [
            {
              icon: "👥",
              number: "150",
              label: "Business Clients",
              suffix: "+",
            },
            {
              icon: "📸",
              number: "800",
              label: "Projects Completed",
              suffix: "+",
            },
            {
              icon: "⭐",
              number: "95",
              label: "Client Retention",
              suffix: "%",
            },
          ],
          columns: 3,
          style: "cards",
          animation: "fade-in",
        };
      case "ctaBanner":
        return {
          heading: "Ready to Capture Your Moments?",
          subheading:
            "Book your session today and let's create something amazing together",
          primaryButtonText: "Book Now",
          primaryButtonLink: "/book-a-session",
          secondaryButtonText: "View Gallery",
          secondaryButtonLink: "/gallery",
          backgroundImage: "",
          backgroundColor: "#0f172a",
          overlay: 60,
          textColor: "text-white",
          fullBleed: true,
          animation: "fade-in",
        };
      case "iconFeatures":
        return {
          heading: "Why Choose Studio 37",
          subheading: "Professional photography services you can trust",
          features: [
            {
              icon: "📸",
              title: "Professional Equipment",
              description:
                "State-of-the-art cameras and lighting for stunning results",
            },
            {
              icon: "⚡",
              title: "Quick Turnaround",
              description: "Get your edited photos within 48 hours",
            },
            {
              icon: "💎",
              title: "Premium Quality",
              description: "High-resolution images with expert editing",
            },
            {
              icon: "🎨",
              title: "Creative Direction",
              description: "Unique concepts tailored to your vision",
            },
          ],
          columns: 4,
          animation: "fade-in",
        };
      case "logo":
        return {
          mode: "svg",
          text: "Studio 37",
          subtext: "Photography",
          showCamera: true,
          color: "#111827",
          accentColor: "#b46e14",
          imageUrl: "",
          size: "xl",
          imageHeightPx: 64,
          alignment: "left",
          link: "/",
          animation: "none",
        };
      case "contactForm":
        return {
          heading: "Get in Touch",
          subheading:
            "Tell us about your photography needs and we’ll reply within 24 hours.",
          animation: "fade-in",
        };
      case "newsletterSignup":
        return {
          heading: "Get 10% Off Your First Session",
          subheading:
            "Subscribe for tips, behind-the-scenes, and special offers.",
          disclaimer:
            "By subscribing, you agree to receive marketing emails. Unsubscribe anytime.",
          style: "card",
          animation: "fade-in",
        };
      case "faq":
        return {
          heading: "Frequently Asked Questions",
          items: [
            {
              question: "How do I book a session?",
              answer:
                "Use the Book a Session page or contact us with your date and details.",
            },
            {
              question: "How quickly will I receive photos?",
              answer: "Typical turnaround is 48 hours for most sessions.",
            },
          ],
          columns: 1,
          animation: "fade-in",
        };
      case "pricingTable":
        return {
          heading: "Packages & Pricing",
          subheading: "Simple packages for every need",
          plans: [
            {
              title: "Basic",
              price: "$199",
              period: "per session",
              features: [
                "30 min session",
                "10 edited photos",
                "Online gallery",
              ],
              ctaText: "Book Basic",
              ctaLink: "/book-a-session",
              highlight: false,
            },
            {
              title: "Standard",
              price: "$349",
              period: "per session",
              features: [
                "60 min session",
                "25 edited photos",
                "Online gallery",
                "Print rights",
              ],
              ctaText: "Book Standard",
              ctaLink: "/book-a-session",
              highlight: true,
            },
            {
              title: "Premium",
              price: "$599",
              period: "per session",
              features: [
                "120 min session",
                "50 edited photos",
                "Online gallery",
                "Print rights",
                "Priority turnaround",
              ],
              ctaText: "Book Premium",
              ctaLink: "/book-a-session",
              highlight: false,
            },
          ],
          columns: 3,
          animation: "fade-in",
          style: "light",
          variant: "card",
          showFeatureChecks: true,
        };
      case "teamMembers":
        return {
          heading: "Meet Your Photography Team",
          subheading:
            "Christian and Caitie bring together years of experience, artistic vision, and genuine passion for storytelling through photography.",
          members: [
            {
              name: "Christian",
              title: "CEO, Marketing Lead & Photographer",
              image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
              bio: "Christian brings business acumen and artistic vision to every project, specializing in wedding and commercial photography.",
              expertise: [
                "Wedding Photography",
                "5+ years experience",
                "Client Relations",
              ],
              social: {
                instagram: "https://instagram.com/studio37photography",
              },
            },
            {
              name: "Caitie",
              title: "Co-Owner, Photographer & Editor",
              image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
              bio: "Caitie's artistic eye and attention to detail ensure every image tells a perfect story.",
              expertise: [
                "Portrait Photography",
                "Expert Photo Editor",
                "Creative Direction",
              ],
              social: {
                instagram: "https://instagram.com/studio37photography",
              },
            },
          ],
          columns: 2,
          layout: "cards",
          animation: "fade-in",
        };
      case "socialFeed":
        return {
          heading: "Behind the Scenes",
          source: "manual",
          username: "@studio37photography",
          posts: [
            {
              image:
                "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=600&fit=crop",
              caption:
                "🎬 Behind the scenes of today's portrait session! The magic happens when natural light meets genuine emotion. #BehindTheScenes #Photography",
              likes: 47,
              comments: 12,
              timestamp: "2 hours ago",
              location: "Pinehurst, TX",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            },
            {
              image:
                "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&h=600&fit=crop",
              caption:
                "✨ Editing session in progress! There's something deeply satisfying about bringing out the perfect tones. #PhotoEditing",
              likes: 32,
              comments: 8,
              timestamp: "1 day ago",
              location: "Studio37",
              avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            },
          ],
          limit: 6,
          columns: 3,
          showEngagement: true,
          animation: "fade-in",
        };
      case "dualCTA":
        return {
          heading: "Ready to Work with Studio37?",
          subheading:
            "Let's discuss your photography needs and create beautiful memories together.",
          primaryButtonText: "Get In Touch",
          primaryButtonLink: "/contact",
          secondaryButtonText: "View Our Work",
          secondaryButtonLink: "/gallery",
          alignment: "center",
          backgroundColor: "",
          textColor: "text-gray-900",
          animation: "fade-in",
        };
      case "container":
        return {
          backgroundColor: "",
          padding: "md",
          maxWidth: "container",
        };
      case "accordion":
        return {
          items: [
            { id: `acc-item-${Date.now()}-1`, title: "First Item", isOpen: true },
            { id: `acc-item-${Date.now()}-2`, title: "Second Item", isOpen: false },
          ],
          allowMultiple: false,
          animation: "fade-in",
        };
      case "tabs":
        return {
          tabs: [
            { id: `tab-${Date.now()}-1`, label: "Tab 1" },
            { id: `tab-${Date.now()}-2`, label: "Tab 2" },
          ],
          activeTab: `tab-${Date.now()}-1`,
          style: "underline",
          animation: "fade-in",
        };
      
      // HIGH PRIORITY - Missing Essentials
      case "videoHero":
        return {
          videoUrl: "",
          posterImage: "",
          title: "Stunning Video Showcase",
          subtitle: "Experience the moment",
          buttonText: "Learn More",
          buttonLink: "#",
          overlay: 40,
          autoplay: true,
          loop: true,
          muted: true,
          alignment: "center",
          titleColor: "text-white",
          subtitleColor: "text-white",
        };
      
      case "beforeAfter":
        return {
          beforeImage: "",
          afterImage: "",
          beforeLabel: "Before",
          afterLabel: "After",
          initialPosition: 50,
          orientation: "horizontal",
        };
      
      case "timeline":
        return {
          heading: "Our Journey",
          events: [
            { id: `event-1`, date: "2020", title: "Started Studio 37", description: "Founded with a passion for photography", icon: "camera" },
            { id: `event-2`, date: "2022", title: "Expanded Services", description: "Added commercial photography", icon: "award" },
          ],
          orientation: "vertical",
          style: "default",
          animation: "fade-in",
        };
      
      case "comparisonTable":
        return {
          heading: "Compare Packages",
          features: [
            { id: "f1", name: "Edited Photos", description: "High-resolution edited images" },
            { id: "f2", name: "Shooting Time", description: "Duration of photo session" },
            { id: "f3", name: "Locations", description: "Number of locations included" },
          ],
          plans: [
            { id: "p1", name: "Basic", values: { f1: "10", f2: "1 hour", f3: "1" } },
            { id: "p2", name: "Standard", values: { f1: "25", f2: "2 hours", f3: "2" }, highlight: true },
            { id: "p3", name: "Premium", values: { f1: "50", f2: "4 hours", f3: "3" } },
          ],
          style: "default",
        };
      
      case "mapEmbed":
        return {
          address: "1701 Goodson Loop, TRLR 80, Pinehurst, TX 77362",
          zoom: 14,
          height: "md",
          showMarker: true,
          mapType: "roadmap",
        };
      
      case "countdown":
        return {
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          heading: "Limited Time Offer",
          subheading: "Book your session before time runs out!",
          expiredMessage: "Offer has ended",
          showLabels: true,
          style: "default",
          size: "md",
        };
      
      // CLIENT ENGAGEMENT
      case "reviews":
        return {
          heading: "What Our Clients Say",
          source: "manual",
          reviews: [
            { id: "r1", author: "Sarah J.", rating: 5, text: "Amazing photography! Highly recommend.", date: "2024-01-15" },
            { id: "r2", author: "Mike T.", rating: 5, text: "Professional and creative. Love the results!", date: "2024-01-10" },
          ],
          displayCount: 3,
          style: "cards",
          showRating: true,
        };
      
      case "instagramFeed":
        return {
          heading: "Follow Us on Instagram",
          username: "@studio37",
          displayCount: 6,
          columns: 3,
          showCaptions: false,
          style: "grid",
        };
      
      case "photoGrid":
        return {
          heading: "Photo Gallery",
          categories: [],
          layout: "masonry",
          columns: 3,
          gap: "md",
          showFilters: true,
          limit: 12,
        };
      
      case "clientPortal":
        return {
          heading: "Client Login",
          description: "Access your photos and downloads",
          loginUrl: "/client-portal",
          buttonText: "Access Portal",
          style: "card",
        };
      
      // CONVERSION OPTIMIZATION
      case "stickyCTA":
        return {
          text: "Ready to book your session?",
          buttonText: "Book Now",
          buttonLink: "/book-a-session",
          position: "bottom",
          backgroundColor: "#b46e14",
          textColor: "#ffffff",
          showOnScroll: true,
        };
      
      case "exitPopup":
        return {
          heading: "Wait! Don't Miss Out",
          message: "Get 10% off your first session when you book today!",
          buttonText: "Claim Offer",
          buttonLink: "/book-a-session",
          dismissible: true,
          showOnce: true,
          delay: 0,
        };
      
      case "progressSteps":
        return {
          steps: [
            { id: "s1", title: "Choose Package", description: "Select your photography package", icon: "package" },
            { id: "s2", title: "Pick Date", description: "Select your preferred date", icon: "calendar" },
            { id: "s3", title: "Confirm", description: "Complete your booking", icon: "check" },
          ],
          currentStep: 0,
          style: "horizontal",
          showNumbers: true,
        };
      
      case "calendarWidget":
        return {
          heading: "Schedule Your Session",
          provider: "calendly",
          embedUrl: "",
          style: "inline",
        };
      
      case "trustBadges":
        return {
          heading: "Trusted & Certified",
          badges: [
            { id: "b1", image: "", title: "Professional Photographer Association" },
            { id: "b2", image: "", title: "Award Winning Studio" },
          ],
          layout: "horizontal",
          size: "md",
        };
      
      // CONTENT/SEO
      case "blogCards":
        return {
          heading: "Latest from Our Blog",
          displayCount: 3,
          layout: "grid",
          columns: 3,
          showExcerpt: true,
          showDate: true,
          showAuthor: false,
        };
      
      case "categoryNav":
        return {
          heading: "Browse by Category",
          categories: [
            { id: "c1", name: "Portraits", link: "/gallery?category=portraits", count: 45 },
            { id: "c2", name: "Weddings", link: "/gallery?category=weddings", count: 32 },
            { id: "c3", name: "Events", link: "/gallery?category=events", count: 28 },
          ],
          layout: "grid",
          columns: 3,
          showCounts: true,
        };
      
      case "breadcrumbs":
        return {
          items: [
            { label: "Home", link: "/" },
            { label: "Services", link: "/services" },
          ],
          separator: "chevron",
          showHome: true,
        };
      
      case "tableOfContents":
        return {
          heading: "On This Page",
          items: [],
          position: "sidebar",
          sticky: true,
        };
      
      case "relatedContent":
        return {
          heading: "You Might Also Like",
          contentType: "blog",
          displayCount: 3,
          layout: "grid",
          algorithm: "related",
        };
      
      // INTERACTIVE
      case "quiz":
        return {
          heading: "Find Your Perfect Photography Style",
          description: "Take our quick quiz to discover which photography package suits you best",
          questions: [
            {
              id: "q1",
              question: "What type of photography are you interested in?",
              options: [
                { id: "o1", text: "Portraits", value: "portraits" },
                { id: "o2", text: "Events", value: "events" },
                { id: "o3", text: "Commercial", value: "commercial" },
              ],
            },
          ],
          results: {
            portraits: { title: "Portrait Package", description: "Perfect for individual and family portraits", cta: { text: "Book Now", link: "/book-a-session" } },
            events: { title: "Event Package", description: "Ideal for capturing special occasions", cta: { text: "Learn More", link: "/services" } },
            commercial: { title: "Commercial Package", description: "Professional business photography", cta: { text: "Get Quote", link: "/contact" } },
          },
        };
      
      case "calculator":
        return {
          heading: "Estimate Your Photography Cost",
          description: "Get an instant quote based on your needs",
          fields: [
            { id: "f1", label: "Number of Hours", type: "number", multiplier: 200 },
            { id: "f2", label: "Number of Locations", type: "select", options: [{ label: "1", value: 0 }, { label: "2", value: 150 }, { label: "3+", value: 300 }] },
            { id: "f3", label: "Include Editing", type: "checkbox", multiplier: 100 },
          ],
          basePrice: 300,
          showBreakdown: true,
        };
      
      case "lightbox":
        return {
          triggerText: "View Details",
          triggerStyle: "button",
          content: "Add your content here...",
          width: "md",
        };
      
      case "enhancedTabs":
        return {
          tabs: [
            { id: "t1", label: "Overview", icon: "eye" },
            { id: "t2", label: "Details", icon: "info" },
          ],
          activeTab: "t1",
          style: "pills",
          showIcons: true,
        };
      
      case "alertBanner":
        return {
          message: "📸 Special offer: Book your session this month and save 15%!",
          type: "info",
          dismissible: true,
          linkText: "Learn More",
          link: "/book-a-session",
          position: "top",
        };
      
      // MULTIMEDIA
      case "audioPlayer":
        return {
          audioUrl: "",
          title: "Audio Title",
          artist: "Artist Name",
          autoplay: false,
          loop: false,
          style: "full",
        };
      
      case "viewer360":
        return {
          imageUrl: "",
          autoRotate: false,
          height: "md",
          controls: true,
        };
      
      case "pdfEmbed":
        return {
          pdfUrl: "",
          downloadable: true,
          height: "lg",
          title: "Document",
        };
      
      // SOCIAL PROOF
      case "logoCarousel":
        return {
          heading: "Trusted By Leading Brands",
          logos: [
            { id: "l1", image: "", alt: "Client 1" },
            { id: "l2", image: "", alt: "Client 2" },
          ],
          autoplay: true,
          speed: 3000,
          grayscale: true,
        };
      
      case "liveCounter":
        return {
          counters: [
            { id: "c1", label: "Happy Clients", targetValue: 500, suffix: "+" },
            { id: "c2", label: "Photos Taken", targetValue: 10000, suffix: "+" },
            { id: "c3", label: "Years Experience", targetValue: 5, suffix: "" },
          ],
          duration: 2000,
          style: "default",
        };
      
      case "bookingsTicker":
        return {
          items: [
            { id: "bt1", name: "Sarah", location: "Houston", service: "Portrait Session", timeAgo: "2 hours ago" },
            { id: "bt2", name: "Mike", location: "The Woodlands", service: "Wedding Package", timeAgo: "5 hours ago" },
          ],
          position: "corner",
          displayDuration: 5000,
          interval: 10000,
        };
      
      default:
        return {};
    }
  };

  const updateComponent = (id: string, data: any) => {
    if (lockedComponents.includes(id)) return; // Prevent editing locked components
    const updated = components.map((c) =>
      c.id === id ? { ...c, data: { ...c.data, ...data } } : c
    );
    notify(updated);
  };

  const updateComponentVisibility = (
    id: string,
    change: Partial<{ mobile: boolean; tablet: boolean; desktop: boolean }>
  ) => {
    const updated = components.map((c) => {
      if (c.id !== id) return c;
      const nextVis = {
        mobile: true,
        tablet: true,
        desktop: true,
        ...(c as any).visibility,
        ...change,
      };
      return { ...(c as any), visibility: nextVis } as PageComponent;
    });
    notify(updated);
  };

  // Helper: Add a child component to a container
  const addChildToContainer = (parentId: string, childComponent: PageComponent, itemId?: string, tabId?: string) => {
    const updated = components.map((c) => {
      if (c.id !== parentId) return c;
      
      // Annotate child with parent context if needed
      const annotatedChild = itemId 
        ? { ...childComponent, parentItemId: itemId } as any
        : tabId
        ? { ...childComponent, parentTabId: tabId } as any
        : childComponent;
      
      return {
        ...c,
        children: [...(c.children || []), annotatedChild],
      } as PageComponent;
    });
    notify(updated);
    return annotatedChild.id;
  };

  // Helper: Remove a child from a container
  const removeChildFromContainer = (parentId: string, childId: string) => {
    const updated = components.map((c) => {
      if (c.id !== parentId) return c;
      return {
        ...c,
        children: (c.children || []).filter((ch) => ch.id !== childId),
      } as PageComponent;
    });
    notify(updated);
  };

  // Helper: Find if a component has nested children
  const hasChildren = (comp: PageComponent): boolean => {
    return ['container', 'accordion', 'tabs'].includes(comp.type);
  };

  const deleteComponent = (id: string) => {
    if (lockedComponents.includes(id)) return; // Prevent deleting locked components
    notify(components.filter((c) => c.id !== id));
    if (selectedComponent === id) setSelectedComponent(null);
    setSelectedComponents(prev => prev.filter(cid => cid !== id));
  };

  // Bulk operations
  const handleComponentClick = (id: string, event: React.MouseEvent) => {
    const isMod = event.metaKey || event.ctrlKey;
    
    if (isMod) {
      // Multi-select mode
      event.stopPropagation();
      setSelectedComponents(prev => 
        prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
      );
    } else {
      // Single select mode
      setSelectedComponent(id);
      setSelectedComponents([]);
    }
  };

  const bulkDelete = () => {
    if (selectedComponents.length === 0) return;
    // Filter out locked components
    const unlockedSelected = selectedComponents.filter(id => !lockedComponents.includes(id));
    notify(components.filter((c) => !unlockedSelected.includes(c.id)));
    setSelectedComponents([]);
    setSelectedComponent(null);
  };

  const bulkDuplicate = () => {
    if (selectedComponents.length === 0) return;
    const duplicated: PageComponent[] = [];
    selectedComponents.forEach(id => {
      const component = components.find(c => c.id === id);
      if (component) {
        duplicated.push({
          ...component,
          id: `component-${Date.now()}-${Math.random()}`,
          data: { ...component.data },
        } as PageComponent);
      }
    });
    notify([...components, ...duplicated]);
    setSelectedComponents([]);
  };

  // Component locking
  const toggleLock = (id: string) => {
    setLockedComponents(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const isLocked = (id: string) => lockedComponents.includes(id);
  // Export/Import functionality
  const exportPage = () => {
    const pageData = {
      components,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        slug: slug || 'unnamed-page',
      }
    };
    const json = JSON.stringify(pageData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slug || 'page'}-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);
        if (data.components && Array.isArray(data.components)) {
          notify(data.components);
          setSelectedComponent(null);
          alert(`Successfully imported ${data.components.length} components!`);
        } else {
          alert('Invalid page format');
        }
      } catch (error) {
        alert('Error reading file');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be imported again
    event.target.value = '';
  };


  // Viewport width is now handled by MobilePreviewToggle

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar - Component Library (desktop) */}
      {!previewMode && (
        <div className="hidden md:block w-64 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Components</h2>
            
            {/* Search bar */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={componentSearchQuery}
                onChange={(e) => setComponentSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {componentSearchQuery && (
                <button
                  onClick={() => setComponentSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  title="Clear search"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
            
            {!!onImportFromPublished && !!slug && (
              <button
                onClick={() => onImportFromPublished?.()}
                className="mt-3 w-full px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                title={`Import published /${slug} into builder`}
              >
                Import from published
              </button>
            )}
            {/* Template selector dropdown */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Quick Start Templates
              </label>
              <select
                onChange={(e) => {
                  const template = e.target.value;
                  if (!template) return;

                  let newComponents: PageComponent[] = [];
                  switch (template) {
                    case "home":
                      newComponents = buildHomepageTemplate();
                      break;
                    case "about":
                      newComponents = buildAboutTemplate();
                      break;
                    case "services":
                      newComponents = buildServicesTemplate();
                      break;
                    case "contact":
                      newComponents = buildContactTemplate();
                      break;
                    case "leadgen":
                      newComponents = buildLeadGenTemplate();
                      break;
                    case "servicesPricing":
                      newComponents = buildServicesPricingTemplate();
                      break;
                    case "faq":
                      newComponents = buildFAQPageTemplate();
                      break;
                    case "portfolio":
                      newComponents = buildPortfolioTemplate();
                      break;
                    case "promo":
                      newComponents = buildPromoLandingTemplate();
                      break;
                    case "blog":
                      newComponents = buildBlogTemplate();
                      break;
                    case "quiz":
                      newComponents = buildQuizTemplate();
                      break;
                    case "event":
                      newComponents = buildEventInfoTemplate();
                      break;
                    case "real-estate":
                      newComponents = buildRealEstateTemplate();
                      break;
                    case "restaurant":
                      newComponents = buildRestaurantTemplate();
                      break;
                    case "saas":
                      newComponents = buildSaaSTemplate();
                      break;
                  }

                  if (newComponents.length > 0) {
                    setComponents(newComponents);
                    setSelectedComponent(null);
                    onChange?.(newComponents);
                    // Reset dropdown
                    e.target.value = "";
                  }
                }}
                className="w-full px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50"
                defaultValue=""
              >
                <option value="">Choose a template...</option>
                <option value="home">📱 Homepage Template</option>
                <option value="about">👥 About Page Template</option>
                <option value="services">📸 Services Page Template</option>
                <option value="contact">📧 Contact Page Template</option>
                <option value="leadgen">🚀 Lead Gen Landing</option>
                <option value="servicesPricing">💼 Services + Pricing</option>
                <option value="faq">❓ FAQ Page Template</option>
                <option value="portfolio">🎨 Portfolio Showcase</option>
                <option value="promo">🎁 Promo/Sale Landing</option>
                <option value="blog">📝 Blog/Content Page</option>
                <option value="quiz">🎯 Quiz & Calculator</option>
                <option value="event">💒 Wedding/Event Info</option>
                <option value="real-estate">🏠 Real Estate Photography</option>
                <option value="restaurant">🍽️ Restaurant & Food</option>
                <option value="saas">💼 SaaS & Brand Photography</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto">
            {/* Basic Components */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("basic")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Basic</span>
                {expandedCategories.includes("basic") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("basic") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('text') && (
                  <button
                    onClick={() => addComponent("text")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Type className="h-4 w-4" />
                    <span>Text Block</span>
                  </button>
                  )}
                  {filterComponents('image') && (
                  <button
                    onClick={() => addComponent("image")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Image</span>
                  </button>
                  )}
                  {filterComponents('button') && (
                  <button
                    onClick={() => addComponent("button")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Square className="h-4 w-4" />
                    <span>Button</span>
                  </button>
                  )}
                  {filterComponents('spacer') && (
                  <button
                    onClick={() => addComponent("spacer")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <span className="h-4 w-4 flex items-center justify-center text-xs">
                      ⬍
                    </span>
                    <span>Spacer</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Layout Components */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("layout")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Layout</span>
                {expandedCategories.includes("layout") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("layout") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('hero') && (
                  <button
                    onClick={() => addComponent("hero")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Hero Section</span>
                  </button>
                  )}
                  {filterComponents('slideshowHero') && (
                  <button
                    onClick={() => addComponent("slideshowHero")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Play className="h-4 w-4" />
                    <span>Slideshow Hero</span>
                  </button>
                  )}
                  {filterComponents('columns') && (
                  <button
                    onClick={() => addComponent("columns")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Columns className="h-4 w-4" />
                    <span>Columns</span>
                  </button>
                  )}
                  {filterComponents('ctaBanner') && (
                  <button
                    onClick={() => addComponent("ctaBanner")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Megaphone className="h-4 w-4" />
                    <span>CTA Banner</span>
                  </button>
                  )}
                  {filterComponents('dualCTA') && (
                  <button
                    onClick={() => addComponent("dualCTA")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Link2 className="h-4 w-4" />
                    <span>Dual CTA</span>
                  </button>
                  )}
                  {filterComponents('container') && (
                  <button
                    onClick={() => addComponent("container")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Square className="h-4 w-4" />
                    <span>Container</span>
                  </button>
                  )}
                  {filterComponents('accordion') && (
                  <button
                    onClick={() => addComponent("accordion")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span>Accordion</span>
                  </button>
                  )}
                  {filterComponents('tabs') && (
                  <button
                    onClick={() => addComponent("tabs")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Layout className="h-4 w-4" />
                    <span>Tabs</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Content Components */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("content")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Content</span>
                {expandedCategories.includes("content") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("content") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('galleryHighlights') && (
                  <button
                    onClick={() => addComponent("galleryHighlights")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Gallery Highlights</span>
                  </button>
                  )}
                  {filterComponents('teamMembers') && (
                  <button
                    onClick={() => addComponent("teamMembers")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Users className="h-4 w-4" />
                    <span>Team Members</span>
                  </button>
                  )}
                  {filterComponents('socialFeed') && (
                  <button
                    onClick={() => addComponent("socialFeed")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Social Feed</span>
                  </button>
                  )}
                  {filterComponents('testimonials') && (
                  <button
                    onClick={() => addComponent("testimonials")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Testimonials</span>
                  </button>
                  )}
                  {filterComponents('faq') && (
                  <button
                    onClick={() => addComponent("faq")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>FAQ</span>
                  </button>
                  )}
                  {filterComponents('iconFeatures') && (
                  <button
                    onClick={() => addComponent("iconFeatures")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    <span>Icon Features</span>
                  </button>
                  )}
                  {filterComponents('logo') && (
                  <button
                    onClick={() => addComponent("logo")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <BringToFront className="h-4 w-4" />
                    <span>Logo</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Forms */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("forms")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Forms</span>
                {expandedCategories.includes("forms") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("forms") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('contactForm') && (
                  <button
                    onClick={() => addComponent("contactForm")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact Form</span>
                  </button>
                  )}
                  {filterComponents('newsletterSignup') && (
                  <button
                    onClick={() => addComponent("newsletterSignup")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Newsletter Signup</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Marketing */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("marketing")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Marketing</span>
                {expandedCategories.includes("marketing") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("marketing") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('badges') && (
                  <button
                    onClick={() => addComponent("badges")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Award className="h-4 w-4" />
                    <span>Badges</span>
                  </button>
                  )}
                  {filterComponents('servicesGrid') && (
                  <button
                    onClick={() => addComponent("servicesGrid")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    <span>Services Grid</span>
                  </button>
                  )}
                  {filterComponents('stats') && (
                  <button
                    onClick={() => addComponent("stats")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Stats/Numbers</span>
                  </button>
                  )}
                  {filterComponents('pricingTable') && (
                  <button
                    onClick={() => addComponent("pricingTable")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Pricing Table</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Advanced */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("advanced")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Advanced</span>
                {expandedCategories.includes("advanced") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("advanced") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('widgetEmbed') && (
                  <button
                    onClick={() => addComponent("widgetEmbed")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Code className="h-4 w-4" />
                    <span>Embed Widget</span>
                  </button>
                  )}
                  {filterComponents('seoFooter') && (
                  <button
                    onClick={() => addComponent("seoFooter")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Layout className="h-4 w-4" />
                    <span>SEO Footer</span>
                  </button>
                  )}
                  {filterComponents('customCss') && (
                  <button
                    onClick={() => addComponent("customCss")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Code className="h-4 w-4" />
                    <span>Custom CSS</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* HIGH PRIORITY - Multimedia & Interactive */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("multimedia")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Multimedia</span>
                {expandedCategories.includes("multimedia") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("multimedia") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('videoHero') && (
                  <button
                    onClick={() => addComponent("videoHero")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Video className="h-4 w-4" />
                    <span>Video Hero</span>
                  </button>
                  )}
                  {filterComponents('beforeAfter') && (
                  <button
                    onClick={() => addComponent("beforeAfter")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Before/After Slider</span>
                  </button>
                  )}
                  {filterComponents('photoGrid') && (
                  <button
                    onClick={() => addComponent("photoGrid")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Photo Grid</span>
                  </button>
                  )}
                  {filterComponents('audioPlayer') && (
                  <button
                    onClick={() => addComponent("audioPlayer")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Audio Player</span>
                  </button>
                  )}
                  {filterComponents('viewer360') && (
                  <button
                    onClick={() => addComponent("viewer360")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>360° Viewer</span>
                  </button>
                  )}
                  {filterComponents('pdfEmbed') && (
                  <button
                    onClick={() => addComponent("pdfEmbed")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span>PDF Embed</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Client Engagement */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("engagement")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Client Engagement</span>
                {expandedCategories.includes("engagement") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("engagement") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('reviews') && (
                  <button
                    onClick={() => addComponent("reviews")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Reviews</span>
                  </button>
                  )}
                  {filterComponents('instagramFeed') && (
                  <button
                    onClick={() => addComponent("instagramFeed")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram Feed</span>
                  </button>
                  )}
                  {filterComponents('clientPortal') && (
                  <button
                    onClick={() => addComponent("clientPortal")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Users className="h-4 w-4" />
                    <span>Client Portal</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Conversion Tools */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("conversion")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Conversion</span>
                {expandedCategories.includes("conversion") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("conversion") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('stickyCTA') && (
                  <button
                    onClick={() => addComponent("stickyCTA")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Target className="h-4 w-4" />
                    <span>Sticky CTA Bar</span>
                  </button>
                  )}
                  {filterComponents('countdown') && (
                  <button
                    onClick={() => addComponent("countdown")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Countdown Timer</span>
                  </button>
                  )}
                  {filterComponents('progressSteps') && (
                  <button
                    onClick={() => addComponent("progressSteps")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <List className="h-4 w-4" />
                    <span>Progress Steps</span>
                  </button>
                  )}
                  {filterComponents('calendarWidget') && (
                  <button
                    onClick={() => addComponent("calendarWidget")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Calendar Widget</span>
                  </button>
                  )}
                  {filterComponents('trustBadges') && (
                  <button
                    onClick={() => addComponent("trustBadges")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Award className="h-4 w-4" />
                    <span>Trust Badges</span>
                  </button>
                  )}
                  {filterComponents('exitPopup') && (
                  <button
                    onClick={() => addComponent("exitPopup")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Exit Popup</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Content & Navigation */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("contentNav")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Content & SEO</span>
                {expandedCategories.includes("contentNav") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("contentNav") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('timeline') && (
                  <button
                    onClick={() => addComponent("timeline")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Timeline</span>
                  </button>
                  )}
                  {filterComponents('comparisonTable') && (
                  <button
                    onClick={() => addComponent("comparisonTable")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <TableProperties className="h-4 w-4" />
                    <span>Comparison Table</span>
                  </button>
                  )}
                  {filterComponents('blogCards') && (
                  <button
                    onClick={() => addComponent("blogCards")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Blog Cards</span>
                  </button>
                  )}
                  {filterComponents('categoryNav') && (
                  <button
                    onClick={() => addComponent("categoryNav")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Category Navigation</span>
                  </button>
                  )}
                  {filterComponents('breadcrumbs') && (
                  <button
                    onClick={() => addComponent("breadcrumbs")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span>Breadcrumbs</span>
                  </button>
                  )}
                  {filterComponents('tableOfContents') && (
                  <button
                    onClick={() => addComponent("tableOfContents")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <List className="h-4 w-4" />
                    <span>Table of Contents</span>
                  </button>
                  )}
                  {filterComponents('relatedContent') && (
                  <button
                    onClick={() => addComponent("relatedContent")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Link2 className="h-4 w-4" />
                    <span>Related Content</span>
                  </button>
                  )}
                  {filterComponents('mapEmbed') && (
                  <button
                    onClick={() => addComponent("mapEmbed")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Map Embed</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Interactive Elements */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("interactive")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Interactive</span>
                {expandedCategories.includes("interactive") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("interactive") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('quiz') && (
                  <button
                    onClick={() => addComponent("quiz")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Quiz/Survey</span>
                  </button>
                  )}
                  {filterComponents('calculator') && (
                  <button
                    onClick={() => addComponent("calculator")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Cost Calculator</span>
                  </button>
                  )}
                  {filterComponents('lightbox') && (
                  <button
                    onClick={() => addComponent("lightbox")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <MousePointer className="h-4 w-4" />
                    <span>Lightbox/Modal</span>
                  </button>
                  )}
                  {filterComponents('enhancedTabs') && (
                  <button
                    onClick={() => addComponent("enhancedTabs")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Layout className="h-4 w-4" />
                    <span>Enhanced Tabs</span>
                  </button>
                  )}
                  {filterComponents('alertBanner') && (
                  <button
                    onClick={() => addComponent("alertBanner")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Alert Banner</span>
                  </button>
                  )}
                </div>
              )}
            </div>

            {/* Social Proof */}
            <div className="border-b">
              <button
                onClick={() => toggleCategory("social")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
              >
                <span>Social Proof</span>
                {expandedCategories.includes("social") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes("social") && (
                <div className="p-2 space-y-1 bg-gray-50">
                  {filterComponents('logoCarousel') && (
                  <button
                    onClick={() => addComponent("logoCarousel")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Package className="h-4 w-4" />
                    <span>Logo Carousel</span>
                  </button>
                  )}
                  {filterComponents('liveCounter') && (
                  <button
                    onClick={() => addComponent("liveCounter")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Live Counter</span>
                  </button>
                  )}
                  {filterComponents('bookingsTicker') && (
                  <button
                    onClick={() => addComponent("bookingsTicker")}
                    className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Bookings Ticker</span>
                  </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Left Drawer (mobile) */}
      {!previewMode && (
        <div
          className={`md:hidden fixed inset-0 z-50 ${
            showLeftDrawer ? "" : "pointer-events-none"
          }`}
          aria-hidden={!showLeftDrawer}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity ${
              showLeftDrawer ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowLeftDrawer(false)}
          />
          {/* Panel */}
          <div
            className={`absolute left-0 top-0 h-full w-72 bg-white border-r shadow-xl transform transition-transform ${
              showLeftDrawer ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">Components</h2>
              <button
                className="px-2 py-1 text-sm border rounded"
                onClick={() => setShowLeftDrawer(false)}
              >
                Close
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-56px)]">
              {/* Replicate component library content */}
              <div className="p-4 border-b">
                {/* Search bar for mobile */}
                <div className="mb-3 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={componentSearchQuery}
                    onChange={(e) => setComponentSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {componentSearchQuery && (
                    <button
                      onClick={() => setComponentSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                      title="Clear search"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  )}
                </div>
                
                {!!onImportFromPublished && !!slug && (
                  <button
                    onClick={() => onImportFromPublished?.()}
                    className="w-full px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                    title={`Import published /${slug} into builder`}
                  >
                    Import from published
                  </button>
                )}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quick Start Templates
                  </label>
                  <select
                    onChange={(e) => {
                      const template = e.target.value;
                      if (!template) return;

                      let newComponents: PageComponent[] = [];
                      switch (template) {
                        case "home":
                          newComponents = buildHomepageTemplate();
                          break;
                        case "about":
                          newComponents = buildAboutTemplate();
                          break;
                        case "services":
                          newComponents = buildServicesTemplate();
                          break;
                        case "contact":
                          newComponents = buildContactTemplate();
                          break;
                        case "leadgen":
                          newComponents = buildLeadGenTemplate();
                          break;
                        case "servicesPricing":
                          newComponents = buildServicesPricingTemplate();
                          break;
                        case "faq":
                          newComponents = buildFAQPageTemplate();
                          break;
                        case "portfolio":
                          newComponents = buildPortfolioTemplate();
                          break;
                        case "promo":
                          newComponents = buildPromoLandingTemplate();
                          break;
                        case "blog":
                          newComponents = buildBlogTemplate();
                          break;
                        case "quiz":
                          newComponents = buildQuizTemplate();
                          break;
                        case "event":
                          newComponents = buildEventInfoTemplate();
                          break;
                        case "real-estate":
                          newComponents = buildRealEstateTemplate();
                          break;
                        case "restaurant":
                          newComponents = buildRestaurantTemplate();
                          break;
                        case "saas":
                          newComponents = buildSaaSTemplate();
                          break;
                      }

                      if (newComponents.length > 0) {
                        setComponents(newComponents);
                        setSelectedComponent(null);
                        onChange?.(newComponents);
                        e.target.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50"
                    defaultValue=""
                  >
                    <option value="">Choose a template...</option>
                    <option value="home">📱 Homepage Template</option>
                    <option value="about">👥 About Page Template</option>
                    <option value="services">📸 Services Page Template</option>
                    <option value="contact">📧 Contact Page Template</option>
                    <option value="leadgen">🚀 Lead Gen Landing</option>
                    <option value="servicesPricing">💼 Services + Pricing</option>
                    <option value="faq">❓ FAQ Page Template</option>
                    <option value="portfolio">🎨 Portfolio Showcase</option>
                    <option value="promo">🎁 Promo/Sale Landing</option>
                    <option value="blog">📝 Blog/Content Page</option>
                    <option value="quiz">🎯 Quiz & Calculator</option>
                    <option value="event">💒 Wedding/Event Info</option>
                    <option value="real-estate">🏠 Real Estate Photography</option>
                    <option value="restaurant">🍽️ Restaurant & Food</option>
                    <option value="saas">💼 SaaS & Brand Photography</option>
                  </select>
                </div>
              </div>

              {/* Reuse the same categories UI */}
              <div className="overflow-y-auto">
                {/* We reuse the exact same sections from the desktop sidebar by
                    calling the same JSX as below. To avoid duplication, in a larger refactor we would extract a component.
                    For now, mirror the minimal buttons most used on mobile. */}
                <div className="border-b">
                  <button
                    onClick={() => toggleCategory("basic")}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
                  >
                    <span>Basic</span>
                    {expandedCategories.includes("basic") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategories.includes("basic") && (
                    <div className="p-2 space-y-1 bg-gray-50">
                      <button
                        onClick={() => addComponent("text")}
                        className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                      >
                        <Type className="h-4 w-4" />
                        <span>Text Block</span>
                      </button>
                      <button
                        onClick={() => addComponent("image")}
                        className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span>Image</span>
                      </button>
                      <button
                        onClick={() => addComponent("button")}
                        className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                      >
                        <Square className="h-4 w-4" />
                        <span>Button</span>
                      </button>
                      <button
                        onClick={() => addComponent("spacer")}
                        className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                      >
                        <span className="h-4 w-4 flex items-center justify-center text-xs">
                          ⬍
                        </span>
                        <span>Spacer</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="border-b">
                  <button
                    onClick={() => toggleCategory("layout")}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-sm"
                  >
                    <span>Layout</span>
                    {expandedCategories.includes("layout") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategories.includes("layout") && (
                    <div className="p-2 space-y-1 bg-gray-50">
                      <button
                        onClick={() => addComponent("hero")}
                        className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Hero Section</span>
                      </button>
                      <button
                        onClick={() => addComponent("columns")}
                        className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                      >
                        <Columns className="h-4 w-4" />
                        <span>Columns</span>
                      </button>
                      <button
                        onClick={() => addComponent("ctaBanner")}
                        className="w-full flex items-center gap-2 p-2 bg-white hover:bg-gray-100 rounded transition text-sm"
                      >
                        <Megaphone className="h-4 w-4" />
                        <span>CTA Banner</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile toggles to open side panels */}
            <div className="md:hidden flex items-center gap-1 mr-1">
              <button
                onClick={() => setShowLeftDrawer(true)}
                className="p-2 rounded hover:bg-gray-100"
                title="Open components"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowRightDrawer(true)}
                disabled={!selectedComponent}
                className={`p-2 rounded ${
                  selectedComponent ? "hover:bg-gray-100" : "opacity-30 cursor-not-allowed"
                }`}
                title="Open properties"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className={`p-2 rounded ${
                historyIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              title="Undo (⌘+Z)"
            >
              ↶
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className={`p-2 rounded ${
                historyIndex === history.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              title="Redo (⌘+⇧+Z)"
            >
              ↷
            </button>
            
            {/* Bulk Actions Toolbar (shows when multiple components selected) */}
            {selectedComponents.length > 0 && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-300 rounded">
                  <span className="text-sm font-medium text-blue-700">
                    {selectedComponents.length} selected
                  </span>
                  <button
                    onClick={bulkDuplicate}
                    className="p-1.5 hover:bg-blue-100 rounded text-blue-700"
                    title="Duplicate selected"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="p-1.5 hover:bg-red-100 rounded text-red-600"
                    title="Delete selected"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedComponents([])}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                    title="Clear selection"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-2 rounded ${
                viewMode === "desktop"
                  ? "bg-primary-100 text-primary-600"
                  : "hover:bg-gray-100"
              }`}
              title="Desktop view"
            >
              <Monitor className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("tablet")}
              className={`p-2 rounded ${
                viewMode === "tablet"
                  ? "bg-primary-100 text-primary-600"
                  : "hover:bg-gray-100"
              }`}
              title="Tablet view"
            >
              <Tablet className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-2 rounded ${
                viewMode === "mobile"
                  ? "bg-primary-100 text-primary-600"
                  : "hover:bg-gray-100"
              }`}
              title="Mobile view"
            >
              <Smartphone className="h-5 w-5" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button
              onClick={() => setShowGrid((g) => !g)}
              className={`p-2 rounded ${showGrid ? "bg-primary-100 text-primary-600" : "hover:bg-gray-100"}`}
              title="Toggle grid overlay"
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowVersions(true)}
              className="p-2 rounded hover:bg-gray-100"
              title="Versions"
            >
              Versions
            </button>
            <button
              onClick={() => setShowSuggestions(true)}
              className="p-2 rounded hover:bg-gray-100"
              title="AI Suggestions"
            >
              <Sparkles className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                previewMode
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {previewMode ? (
                <Code className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {previewMode ? "Edit" : "Preview"}
            </button>

            {/* Export/Import buttons */}
            <button
              onClick={exportPage}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2 text-sm"
              title="Export page as JSON"
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export</span>
            </button>
            
            <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2 text-sm cursor-pointer">
              <Upload className="h-4 w-4" />
              <span className="hidden md:inline">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={importPage}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                setSaveStatus('saving');
                onSave(components).then(() => {
                  setSaveStatus('saved');
                  setLastSaved(new Date());
                }).catch(() => setSaveStatus('unsaved'));
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2"
              title="Save (⌘+S)"
              disabled={saveStatus === 'saving'}
            >
              <Save className="h-4 w-4" />
              Save Page
            </button>

            {/* Save Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded text-sm border border-gray-200">
              {saveStatus === 'saved' && (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 font-medium">Saved</span>
                  {lastSaved && (
                    <span className="text-gray-500 text-xs">
                      {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </>
              )}
              {saveStatus === 'unsaved' && (
                <>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  <span className="text-amber-700 font-medium">Unsaved</span>
                </>
              )}
              {saveStatus === 'saving' && (
                <>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-blue-700 font-medium">Saving...</span>
                </>
              )}
            </div>

            <div className="ml-2 px-3 py-2 bg-gray-100 rounded text-sm text-gray-600">
              {components.length} component{components.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 min-h-0">
          <MobilePreviewToggle mode={viewMode} onModeChange={setViewMode} showControls={false}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="page-builder">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[600px] relative"
                  >
                    {showGrid && (
                      <div className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.06)_0,rgba(0,0,0,0.06)_1px,transparent_1px,transparent_20px),repeating-linear-gradient(90deg,rgba(0,0,0,0.06)_0,rgba(0,0,0,0.06)_1px,transparent_1px,transparent_20px)]"></div>
                    )}
                    {components.length === 0 && (
                      <div className="flex items-center justify-center h-96 text-gray-400">
                        <div className="text-center">
                          <Plus className="h-12 w-12 mx-auto mb-2" />
                          <p>Drag components here to start building</p>
                        </div>
                      </div>
                    )}

                    {components.map((component, index) => (
                      <Draggable
                        key={component.id}
                        draggableId={component.id}
                        index={index}
                        isDragDisabled={previewMode || isLocked(component.id)}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`relative group ${
                              selectedComponent === component.id
                                ? "ring-2 ring-primary-500"
                                : selectedComponents.includes(component.id)
                                ? "ring-2 ring-blue-400 bg-blue-50"
                                : isLocked(component.id)
                                ? "ring-2 ring-amber-300 bg-amber-50/30"
                                : ""
                            } ${snapshot.isDragging ? "opacity-50" : ""}`}
                            onClick={(e) => {
                              if (!previewMode) {
                                handleComponentClick(component.id, e);
                              }
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              // Activate quick edit on double-click for text/button/image (if not locked)
                              if (['text', 'button', 'image'].includes(component.type) && !previewMode && !isLocked(component.id)) {
                                setQuickEditId(component.id);
                              }
                            }}
                          >
                            {/* Quick Edit Mode */}
                            {quickEditId === component.id && !previewMode ? (
                              <div className="p-4 bg-blue-50 border-2 border-blue-400 rounded">
                                {component.type === 'text' && (
                                  <div>
                                    <div
                                      contentEditable
                                      suppressContentEditableWarning
                                      className="min-h-[100px] p-2 bg-white border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      onBlur={(e) => {
                                        updateComponent(component.id, {
                                          content: e.currentTarget.textContent || '',
                                        });
                                        setQuickEditId(null);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          setQuickEditId(null);
                                          e.preventDefault();
                                        }
                                      }}
                                      dangerouslySetInnerHTML={{ __html: component.data.content || '' }}
                                    />
                                    <div className="mt-2 text-xs text-gray-600">
                                      Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> or click outside to finish editing
                                    </div>
                                  </div>
                                )}
                                {component.type === 'button' && (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Button Text
                                      </label>
                                      <input
                                        type="text"
                                        defaultValue={component.data.text}
                                        className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onBlur={(e) => {
                                          updateComponent(component.id, {
                                            text: e.target.value,
                                          });
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setQuickEditId(null);
                                            e.preventDefault();
                                          } else if (e.key === 'Enter') {
                                            e.currentTarget.blur();
                                          }
                                        }}
                                        autoFocus
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Link URL
                                      </label>
                                      <input
                                        type="url"
                                        defaultValue={component.data.link}
                                        className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onBlur={(e) => {
                                          updateComponent(component.id, {
                                            link: e.target.value,
                                          });
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setQuickEditId(null);
                                            e.preventDefault();
                                          } else if (e.key === 'Enter') {
                                            e.currentTarget.blur();
                                          }
                                        }}
                                      />
                                    </div>
                                    <button
                                      onClick={() => setQuickEditId(null)}
                                      className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                      Done Editing
                                    </button>
                                  </div>
                                )}
                                {component.type === 'image' && (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Image URL
                                      </label>
                                      <input
                                        type="url"
                                        defaultValue={component.data.src}
                                        className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onBlur={(e) => {
                                          updateComponent(component.id, {
                                            src: e.target.value,
                                          });
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setQuickEditId(null);
                                            e.preventDefault();
                                          } else if (e.key === 'Enter') {
                                            e.currentTarget.blur();
                                          }
                                        }}
                                        autoFocus
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Alt Text
                                      </label>
                                      <input
                                        type="text"
                                        defaultValue={component.data.alt}
                                        className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onBlur={(e) => {
                                          updateComponent(component.id, {
                                            alt: e.target.value,
                                          });
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setQuickEditId(null);
                                            e.preventDefault();
                                          } else if (e.key === 'Enter') {
                                            e.currentTarget.blur();
                                          }
                                        }}
                                      />
                                    </div>
                                    {component.data.src && (
                                      <div className="border border-gray-200 rounded overflow-hidden">
                                        <img
                                          src={component.data.src}
                                          alt={component.data.alt || 'Preview'}
                                          className="w-full h-auto"
                                        />
                                      </div>
                                    )}
                                    <button
                                      onClick={() => setQuickEditId(null)}
                                      className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                      Done Editing
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                            {!previewMode && (
                              <div className="absolute top-2 right-2 z-10 flex gap-2 md:gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                {/* Lock indicator - always visible when locked */}
                                {isLocked(component.id) && (
                                  <div className="p-2 sm:p-1 bg-amber-100 rounded shadow border border-amber-300">
                                    <Lock className="h-5 w-5 text-amber-600" />
                                  </div>
                                )}
                                <div
                                  {...provided.dragHandleProps}
                                  className={`p-2 sm:p-1 bg-white rounded shadow hover:bg-gray-50 ${
                                    isLocked(component.id) ? "cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing"
                                  }`}
                                  title={isLocked(component.id) ? "Component is locked" : "Drag to reorder"}
                                  aria-label="Drag to reorder"
                                >
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                {/* Visibility quick toggles */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateComponentVisibility(component.id, { desktop: !(((component as any).visibility?.desktop) ?? true) });
                                  }}
                                  className={`p-2 sm:p-1 bg-white rounded shadow hover:bg-gray-50 ${(((component as any).visibility?.desktop) ?? true) ? 'text-gray-700' : 'opacity-40'}`}
                                  title={(((component as any).visibility?.desktop) ?? true) ? 'Visible on Desktop' : 'Hidden on Desktop'}
                                  aria-label="Toggle desktop visibility"
                                >
                                  <Monitor className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateComponentVisibility(component.id, { tablet: !(((component as any).visibility?.tablet) ?? true) });
                                  }}
                                  className={`p-2 sm:p-1 bg-white rounded shadow hover:bg-gray-50 ${(((component as any).visibility?.tablet) ?? true) ? 'text-gray-700' : 'opacity-40'}`}
                                  title={(((component as any).visibility?.tablet) ?? true) ? 'Visible on Tablet' : 'Hidden on Tablet'}
                                  aria-label="Toggle tablet visibility"
                                >
                                  <Tablet className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateComponentVisibility(component.id, { mobile: !(((component as any).visibility?.mobile) ?? true) });
                                  }}
                                  className={`p-2 sm:p-1 bg-white rounded shadow hover:bg-gray-50 ${(((component as any).visibility?.mobile) ?? true) ? 'text-gray-700' : 'opacity-40'}`}
                                  title={(((component as any).visibility?.mobile) ?? true) ? 'Visible on Mobile' : 'Hidden on Mobile'}
                                  aria-label="Toggle mobile visibility"
                                >
                                  <Smartphone className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveComponent(component.id, -1);
                                  }}
                                  disabled={index === 0 || isLocked(component.id)}
                                  className={`p-2 sm:p-1 bg-white rounded shadow hover:bg-gray-50 ${
                                    (index === 0 || isLocked(component.id)) ? "opacity-40 cursor-not-allowed" : ""
                                  }`}
                                  title={isLocked(component.id) ? "Locked" : "Move up"}
                                  aria-label="Move component up"
                                >
                                  <ArrowUp className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveComponent(component.id, 1);
                                  }}
                                  disabled={index === components.length - 1 || isLocked(component.id)}
                                  className={`p-2 sm:p-1 bg-white rounded shadow hover:bg-gray-50 ${
                                    (index === components.length - 1 || isLocked(component.id)) ? "opacity-40 cursor-not-allowed" : ""
                                  }`}
                                  title={isLocked(component.id) ? "Locked" : "Move down"}
                                  aria-label="Move component down"
                                >
                                  <ArrowDown className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLock(component.id);
                                  }}
                                  className={`p-2 sm:p-1 bg-white rounded shadow ${
                                    isLocked(component.id) 
                                      ? "hover:bg-green-50 text-amber-600" 
                                      : "hover:bg-amber-50 text-gray-600"
                                  }`}
                                  title={isLocked(component.id) ? "Unlock component" : "Lock component"}
                                  aria-label={isLocked(component.id) ? "Unlock component" : "Lock component"}
                                >
                                  {isLocked(component.id) ? (
                                    <Lock className="h-5 w-5" />
                                  ) : (
                                    <Unlock className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateComponent(component.id);
                                  }}
                                  className="p-2 sm:p-1 bg-white rounded shadow hover:bg-blue-50 text-blue-600"
                                  title="Duplicate (⌘+D)"
                                  aria-label="Duplicate component"
                                >
                                  <Copy className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteComponent(component.id);
                                  }}
                                  disabled={isLocked(component.id)}
                                  className={`p-2 sm:p-1 bg-white rounded shadow ${
                                    isLocked(component.id)
                                      ? "opacity-40 cursor-not-allowed"
                                      : "hover:bg-red-50 text-red-600"
                                  }`}
                                  title={isLocked(component.id) ? "Locked" : "Delete (Del)"}
                                  aria-label="Delete component"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            )}

                            {isVisibleInCurrentView(component) ? (
                              <ComponentRenderer component={component} />
                            ) : (
                              <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 text-sm rounded">
                                Hidden on {viewMode} (toggle visibility to show)
                              </div>
                            )}
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </MobilePreviewToggle>
        </div>
      </div>

      {/* Right Sidebar - Properties (desktop) */}
      {!previewMode && selectedComponent && (
        <div 
          className="hidden md:block bg-white border-l overflow-y-auto relative"
          style={{ width: `${propertiesWidth}px` }}
        >
          {/* Drag resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary-300 transition-colors z-10"
            onMouseDown={() => setIsResizing(true)}
            title="Drag to resize"
          />
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Properties</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs border rounded overflow-hidden">
                <button
                  className={`px-2 py-1 ${quickPropertiesMode ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                  onClick={() => setQuickPropertiesMode(true)}
                  title="Quick properties"
                >Quick</button>
                <button
                  className={`px-2 py-1 ${!quickPropertiesMode ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                  onClick={() => setQuickPropertiesMode(false)}
                  title="Full properties"
                >Full</button>
              </div>
              <button
                className="px-2 py-1 text-xs border rounded"
                onClick={() => {
                  if (propertiesWidth <= 320) {
                    setPropertiesWidth(450);
                  } else if (propertiesWidth <= 450) {
                    setPropertiesWidth(600);
                  } else {
                    setPropertiesWidth(320);
                  }
                }}
                title="Cycle panel width (or drag left edge)"
              >
                {propertiesWidth <= 320 ? 'Expand' : propertiesWidth <= 450 ? 'Wider' : 'Shrink'}
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Per-device visibility controls */}
            <div className="mb-4 p-3 border rounded bg-gray-50">
              <div className="text-sm font-medium mb-2">Visibility</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateComponentVisibility(selectedComponent!, { desktop: !((components.find((c) => c.id === selectedComponent) as any)?.visibility?.desktop ?? true) })}
                  className={`px-2 py-1 rounded border ${((components.find((c) => c.id === selectedComponent) as any)?.visibility?.desktop ?? true) ? 'bg-white' : 'bg-gray-100 opacity-70'}`}
                  title="Toggle desktop visibility"
                >
                  <span className="inline-flex items-center gap-1 text-sm"><Monitor className="h-4 w-4" /> Desktop</span>
                </button>
                <button
                  onClick={() => updateComponentVisibility(selectedComponent!, { tablet: !((components.find((c) => c.id === selectedComponent) as any)?.visibility?.tablet ?? true) })}
                  className={`px-2 py-1 rounded border ${((components.find((c) => c.id === selectedComponent) as any)?.visibility?.tablet ?? true) ? 'bg-white' : 'bg-gray-100 opacity-70'}`}
                  title="Toggle tablet visibility"
                >
                  <span className="inline-flex items-center gap-1 text-sm"><Tablet className="h-4 w-4" /> Tablet</span>
                </button>
                <button
                  onClick={() => updateComponentVisibility(selectedComponent!, { mobile: !((components.find((c) => c.id === selectedComponent) as any)?.visibility?.mobile ?? true) })}
                  className={`px-2 py-1 rounded border ${((components.find((c) => c.id === selectedComponent) as any)?.visibility?.mobile ?? true) ? 'bg-white' : 'bg-gray-100 opacity-70'}`}
                  title="Toggle mobile visibility"
                >
                  <span className="inline-flex items-center gap-1 text-sm"><Smartphone className="h-4 w-4" /> Mobile</span>
                </button>
              </div>
            </div>

            {selectedComponent && selectedComponentDataStableRef.current && (
              <ComponentPropertiesWrapper
                key={selectedComponent}
                component={selectedComponentDataStableRef.current}
                quickMode={quickPropertiesMode}
                onUpdate={(data) => updateComponent(selectedComponent!, data)}
              />
            )}
          </div>
        </div>
      )}

      {/* Right Drawer (mobile) */}
      {!previewMode && (
        <div
          className={`md:hidden fixed inset-0 z-50 ${
            showRightDrawer ? "" : "pointer-events-none"
          }`}
          aria-hidden={!showRightDrawer}
        >
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity ${
              showRightDrawer ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowRightDrawer(false)}
          />
          <div
            className={`absolute right-0 top-0 h-full w-80 bg-white border-l shadow-xl transform transition-transform ${
              showRightDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">Properties</h2>
              <button
                className="px-2 py-1 text-sm border rounded"
                onClick={() => setShowRightDrawer(false)}
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
              {selectedComponent && selectedComponentDataStableRef.current ? (
                <ComponentPropertiesWrapper
                  key={selectedComponent}
                  component={selectedComponentDataStableRef.current}
                  quickMode={quickPropertiesMode}
                  onUpdate={(data) => updateComponent(selectedComponent!, data)}
                />
              ) : (
                <p className="text-sm text-gray-500">Select a component to edit its properties.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Drawer */}
      {showSuggestions && (
        <div className="fixed inset-0 z-50" aria-modal>
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSuggestions(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[380px] bg-white shadow-xl border-l flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold">Suggestions</h3>
                <span className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-[11px] ${useAISource ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-700'}`}>
                  {useAISource ? 'AI' : 'Rule-based'}
                </span>
              </div>
              <button
                className="px-2 py-1 text-sm border rounded"
                onClick={() => setShowSuggestions(false)}
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              {/* Header controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <button
                    className={`px-2 py-1 rounded border ${useAISource ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-50`}
                    onClick={() => { setUseAISource(true); fetchAISuggestions(); }}
                    title="Use AI suggestions"
                  >
                    Use AI
                  </button>
                  <button
                    className={`px-2 py-1 rounded border ${!useAISource ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-50`}
                    onClick={() => setUseAISource(false)}
                    title="Use built-in suggestions"
                  >
                    Use Rule-based
                  </button>
                </div>
                {useAISource && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchAISuggestions()}
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-50 inline-flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Refresh
                    </button>
                  </div>
                )}
              </div>

              {/* Loading / Error states */}
              {useAISource && aiLoading && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Wand2 className="h-4 w-4 animate-pulse text-primary-500" /> Generating suggestions...
                </div>
              )}
              {useAISource && aiError && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {aiError}
                </div>
              )}

              {suggestionsToRender.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No suggestions right now. Keep building!
                </div>
              ) : (
                suggestionsToRender.map((s) => (
                  <div key={s.id} className="border rounded p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{s.rationale}</div>
                      </div>
                      <button
                        onClick={() => addSuggestedComponent(s.type, s.insertAfterId)}
                        className="px-2 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-wide text-gray-400">
                      Suggested block: <span className="font-semibold text-gray-500">{componentMetadata[s.type]?.name || s.type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Versions Drawer */}
      {showVersions && (
        <div className="fixed inset-0 z-50" aria-modal>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowVersions(false)} />
          <div className="absolute right-0 top-0 h-full w-[420px] bg-white shadow-xl border-l flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Versions</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => createSnapshot()}
                  className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Create Snapshot
                </button>
                <button className="px-2 py-1 text-sm border rounded" onClick={() => setShowVersions(false)}>
                  Close
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              {snapshots.length === 0 ? (
                <div className="text-sm text-gray-500">No snapshots yet. Click "Create Snapshot" to save the current page state locally.</div>
              ) : (
                snapshots.map((s) => (
                  <div key={s.id} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium">{s.label || new Date(s.createdAt).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => restoreSnapshot(s.id)}
                          className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => deleteSnapshot(s.id)}
                          className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Team Members Properties
function TeamMembersProperties({
  data,
  onUpdate,
}: {
  data: TeamMembersComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addMember = () => {
    const next = {
      name: "Team Member",
      title: "Role",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Brief bio...",
      expertise: ["Skill 1", "Skill 2"],
      social: { instagram: "" },
    };
    onUpdate({ members: [...(data.members || []), next] });
  };
  const removeMember = (idx: number) => {
    onUpdate({ members: (data.members || []).filter((_, i) => i !== idx) });
  };
  const updateMember = (
    idx: number,
    field: keyof TeamMembersComponent["data"]["members"][number],
    value: any
  ) => {
    const arr = [...(data.members || [])];
    arr[idx] = { ...arr[idx], [field]: value };
    onUpdate({ members: arr });
  };
  const addExpertise = (memberIdx: number) => {
    const arr = [...(data.members || [])];
    arr[memberIdx].expertise = [
      ...(arr[memberIdx].expertise || []),
      "New skill",
    ];
    onUpdate({ members: arr });
  };
  const updateExpertise = (
    memberIdx: number,
    expertiseIdx: number,
    value: string
  ) => {
    const arr = [...(data.members || [])];
    arr[memberIdx].expertise[expertiseIdx] = value;
    onUpdate({ members: arr });
  };
  const removeExpertise = (memberIdx: number, expertiseIdx: number) => {
    const arr = [...(data.members || [])];
    arr[memberIdx].expertise = arr[memberIdx].expertise.filter(
      (_, i) => i !== expertiseIdx
    );
    onUpdate({ members: arr });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Meet Your Team"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <textarea
          value={data.subheading || ""}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={2}
          placeholder="Our talented team brings expertise and passion"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select
            value={data.columns || 2}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Layout</label>
          <select
            value={data.layout || "cards"}
            onChange={(e) => onUpdate({ layout: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="cards">Cards</option>
            <option value="bio-left">Bio Left</option>
            <option value="bio-right">Bio Right</option>
            <option value="alternating">Alternating</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Team Members</label>
          <button
            type="button"
            onClick={addMember}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Member
          </button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(data.members || []).map((m, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Member #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeMember(idx)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={m.name || ""}
                    onChange={(e) => updateMember(idx, "name", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Christian"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={m.title || ""}
                    onChange={(e) => updateMember(idx, "title", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="CEO & Photographer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={m.image || ""}
                  onChange={(e) => updateMember(idx, "image", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Bio</label>
                <textarea
                  value={m.bio || ""}
                  onChange={(e) => updateMember(idx, "bio", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  rows={2}
                  placeholder="Brief bio..."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium">Expertise</label>
                  <button
                    type="button"
                    onClick={() => addExpertise(idx)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                {(m.expertise || []).map((exp, ei) => (
                  <div key={ei} className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => updateExpertise(idx, ei, e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-xs"
                      placeholder="Skill"
                    />
                    <button
                      type="button"
                      onClick={() => removeExpertise(idx, ei)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Instagram URL (optional)
                </label>
                <input
                  type="url"
                  value={m.social?.instagram || ""}
                  onChange={(e) =>
                    updateMember(idx, "social", {
                      ...m.social,
                      instagram: e.target.value,
                    })
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          ))}
          {!data.members?.length && (
            <p className="text-sm text-gray-500">
              No members yet. Add your first team member above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Social Feed Properties
function SocialFeedProperties({
  data,
  onUpdate,
}: {
  data: SocialFeedComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addPost = () => {
    const next = {
      image:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=600&fit=crop",
      caption: "Behind the scenes...",
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      location: "",
      avatar: "",
    };
    onUpdate({ posts: [...(data.posts || []), next] });
  };
  const removePost = (idx: number) => {
    onUpdate({ posts: (data.posts || []).filter((_, i) => i !== idx) });
  };
  const updatePost = (
    idx: number,
    field: keyof SocialFeedComponent["data"]["posts"][number],
    value: any
  ) => {
    const arr = [...(data.posts || [])];
    arr[idx] = { ...arr[idx], [field]: value };
    onUpdate({ posts: arr });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Behind the Scenes"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <select
            value={data.source || "manual"}
            onChange={(e) => onUpdate({ source: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="instagram">Instagram (future)</option>
            <option value="manual">Manual Posts</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={data.username || ""}
            onChange={(e) => onUpdate({ username: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="@studio37photography"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Limit</label>
          <input
            type="number"
            min={1}
            max={12}
            value={data.limit || 6}
            onChange={(e) => onUpdate({ limit: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select
            value={data.columns || 3}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="show-engagement"
            type="checkbox"
            checked={data.showEngagement ?? true}
            onChange={(e) => onUpdate({ showEngagement: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="show-engagement" className="text-sm">
            Show likes/comments
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Posts</label>
          <button
            type="button"
            onClick={addPost}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Post
          </button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(data.posts || []).map((p, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Post #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removePost(idx)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={p.image || ""}
                  onChange={(e) => updatePost(idx, "image", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Caption
                </label>
                <textarea
                  value={p.caption || ""}
                  onChange={(e) => updatePost(idx, "caption", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  rows={2}
                  placeholder="Behind the scenes of today's shoot..."
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Likes
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={p.likes || 0}
                    onChange={(e) =>
                      updatePost(idx, "likes", Number(e.target.value))
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Comments
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={p.comments || 0}
                    onChange={(e) =>
                      updatePost(idx, "comments", Number(e.target.value))
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Timestamp
                  </label>
                  <input
                    type="text"
                    value={p.timestamp || ""}
                    onChange={(e) =>
                      updatePost(idx, "timestamp", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="2 hours ago"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={p.location || ""}
                    onChange={(e) =>
                      updatePost(idx, "location", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Pinehurst, TX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Avatar URL (optional)
                </label>
                <input
                  type="url"
                  value={p.avatar || ""}
                  onChange={(e) => updatePost(idx, "avatar", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}
          {!data.posts?.length && (
            <p className="text-sm text-gray-500">
              No posts yet. Add your first post above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Dual CTA Properties
function DualCTAProperties({
  data,
  onUpdate,
}: {
  data: DualCTAComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Ready to Work with Us?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <textarea
          value={data.subheading || ""}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={2}
          placeholder="Let's create something beautiful together"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Primary Button Text
          </label>
          <input
            type="text"
            value={data.primaryButtonText || ""}
            onChange={(e) => onUpdate({ primaryButtonText: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Get In Touch"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Primary Button Link
          </label>
          <input
            type="url"
            value={data.primaryButtonLink || ""}
            onChange={(e) => onUpdate({ primaryButtonLink: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="/contact"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Secondary Button Text
          </label>
          <input
            type="text"
            value={data.secondaryButtonText || ""}
            onChange={(e) => onUpdate({ secondaryButtonText: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="View Our Work"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Secondary Button Link
          </label>
          <input
            type="url"
            value={data.secondaryButtonLink || ""}
            onChange={(e) => onUpdate({ secondaryButtonLink: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="/gallery"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Alignment</label>
          <select
            value={data.alignment || "center"}
            onChange={(e) => onUpdate({ alignment: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={data.backgroundColor || "#ffffff"}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="w-full border rounded px-3 py-2 h-10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <select
            value={data.textColor || "text-gray-900"}
            onChange={(e) => onUpdate({ textColor: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="text-white">White</option>
            <option value="text-gray-900">Dark Gray</option>
            <option value="text-primary-600">Primary</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}

// Container Renderer
function ContainerRenderer({ component }: { component: ContainerComponent }) {
  const { data, children = [] } = component;
  const paddingClass = {
    none: "p-0",
    sm: "p-4",
    md: "p-8",
    lg: "p-12",
  }[data.padding || "md"];
  
  const maxWidthClass = {
    full: "max-w-full",
    container: "max-w-7xl mx-auto",
    narrow: "max-w-4xl mx-auto",
  }[data.maxWidth || "container"];

  return (
    <div 
      className={`${paddingClass} ${maxWidthClass}`}
      style={{ backgroundColor: data.backgroundColor || "transparent" }}
    >
      {children.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-gray-500 text-sm">
          Drop components here
        </div>
      ) : (
        <div className="space-y-4">
          {children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      )}
    </div>
  );
}

// Accordion Renderer
function AccordionRenderer({ component }: { component: AccordionComponent }) {
  const { data, children = [] } = component;
  const [openItems, setOpenItems] = React.useState<string[]>(
    data.items?.filter(i => i.isOpen).map(i => i.id) || []
  );

  const toggleItem = (id: string) => {
    if (data.allowMultiple) {
      setOpenItems(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className="space-y-2">
      {data.items?.map((item, idx) => {
        const isOpen = openItems.includes(item.id);
        const itemChildren = children.filter(c => (c as any).parentItemId === item.id);
        
        return (
          <div key={item.id} className="border rounded overflow-hidden">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 text-left"
            >
              <span className="font-medium">{item.title}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="p-4 bg-white">
                {itemChildren.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500 text-sm">
                    Drop components here
                  </div>
                ) : (
                  <div className="space-y-2">
                    {itemChildren.map(child => (
                      <ComponentRenderer key={child.id} component={child} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Tabs Renderer
function TabsRenderer({ component }: { component: TabsComponent }) {
  const { data, children = [] } = component;
  const [activeTab, setActiveTab] = React.useState(data.activeTab || data.tabs?.[0]?.id || '');

  const styleClasses = {
    underline: "border-b-2 border-primary-600",
    pills: "bg-primary-100 text-primary-700 rounded-full",
    boxed: "border border-gray-300 rounded bg-white",
  }[data.style || "underline"];

  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200">
        {data.tabs?.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition ${
                isActive 
                  ? styleClasses 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {data.tabs?.map(tab => {
          if (tab.id !== activeTab) return null;
          const tabChildren = children.filter(c => (c as any).parentTabId === tab.id);
          
          return (
            <div key={tab.id}>
              {tabChildren.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-gray-500 text-sm">
                  Drop components here
                </div>
              ) : (
                <div className="space-y-4">
                  {tabChildren.map(child => (
                    <ComponentRenderer key={child.id} component={child} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== NEW COMPONENT RENDERERS ==========

// MULTIMEDIA COMPONENTS
function VideoHeroRenderer({ data }: { data: VideoHeroComponent['data'] }) {
  return (
    <div className="relative w-full h-96 bg-gray-900 overflow-hidden">
      {data.videoUrl ? (
        <video 
          src={data.videoUrl}
          poster={data.posterImage}
          autoPlay={data.autoplay}
          loop={data.loop}
          muted={data.muted}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            <Video className="h-16 w-16 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Add video URL</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black" style={{ opacity: data.overlay / 100 }} />
      <div className={`relative h-full flex flex-col justify-center items-${data.alignment} px-8 text-${data.alignment}`}>
        {data.title && <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${data.titleColor}`}>{data.title}</h1>}
        {data.subtitle && <p className={`text-xl mb-6 ${data.subtitleColor}`}>{data.subtitle}</p>}
        {data.buttonText && (
          <a href={data.buttonLink} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            {data.buttonText}
          </a>
        )}
      </div>
    </div>
  );
}

function BeforeAfterRenderer({ data }: { data: BeforeAfterComponent['data'] }) {
  const [position, setPosition] = React.useState(data.initialPosition || 50);
  
  return (
    <div className="relative w-full h-96 bg-gray-100 overflow-hidden">
      {data.beforeImage && data.afterImage ? (
        <div className="relative h-full">
          <div className="absolute inset-0">
            <img src={data.afterImage} alt={data.afterLabel || "After"} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <img src={data.beforeImage} alt={data.beforeLabel || "Before"} className="w-full h-full object-cover" />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="absolute top-1/2 left-0 w-full -translate-y-1/2 opacity-0 cursor-ew-resize"
          />
          <div className="absolute top-1/2 -translate-y-1/2 w-1 h-full bg-white shadow-lg" style={{ left: `${position}%` }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <LayoutGrid className="h-4 w-4" />
            </div>
          </div>
          {data.beforeLabel && <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded">{data.beforeLabel}</div>}
          {data.afterLabel && <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded">{data.afterLabel}</div>}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <LayoutGrid className="h-16 w-16 mx-auto mb-2" />
            <p>Add before and after images</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoGridRenderer({ data }: { data: PhotoGridComponent['data'] }) {
  const columns = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5' }[data.columns];
  const gap = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }[data.gap || 'md'];
  
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-3xl font-bold mb-6">{data.heading}</h2>}
      {data.showFilters && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button className="px-4 py-2 bg-primary-600 text-white rounded">All</button>
          {data.categories?.map((cat, i) => (
            <button key={i} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">{cat}</button>
          ))}
        </div>
      )}
      <div className={`grid ${columns} ${gap}`}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-square bg-gray-200 rounded overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Camera className="h-12 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AudioPlayerRenderer({ data }: { data: AudioPlayerComponent['data'] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
      {data.coverImage && (
        <img src={data.coverImage} alt={data.title || 'Audio'} className="w-full aspect-square object-cover rounded-lg mb-4" />
      )}
      <div className="text-center mb-4">
        {data.title && <h3 className="font-bold text-lg">{data.title}</h3>}
        {data.artist && <p className="text-gray-600">{data.artist}</p>}
      </div>
      <audio controls className="w-full" src={data.audioUrl}>
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}

function Viewer360Renderer({ data }: { data: Viewer360Component['data'] }) {
  const height = { sm: 'h-64', md: 'h-96', lg: 'h-[32rem]', xl: 'h-[40rem]' }[data.height || 'md'];
  
  return (
    <div className={`relative ${height} bg-gray-900 rounded-lg overflow-hidden`}>
      {data.imageUrl ? (
        <img src={data.imageUrl} alt="360 view" className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          <div className="text-center">
            <RefreshCw className="h-16 w-16 mx-auto mb-2 opacity-50" />
            <p>Add 360° image</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
        Drag to rotate
      </div>
    </div>
  );
}

function PDFEmbedRenderer({ data }: { data: PDFEmbedComponent['data'] }) {
  const height = { sm: 'h-96', md: 'h-[32rem]', lg: 'h-[40rem]', xl: 'h-[48rem]' }[data.height || 'lg'];
  
  return (
    <div className="py-4">
      {data.title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{data.title}</h3>
          {data.downloadable && data.pdfUrl && (
            <a href={data.pdfUrl} download className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              <Download className="h-4 w-4" />
              Download
            </a>
          )}
        </div>
      )}
      <div className={`${height} bg-gray-100 rounded border`}>
        {data.pdfUrl ? (
          <iframe src={data.pdfUrl} className="w-full h-full" title={data.title || 'PDF'} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-2" />
              <p>Add PDF URL</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CLIENT ENGAGEMENT
function ReviewsRenderer({ data }: { data: ReviewsComponent['data'] }) {
  const reviews = data.reviews || [];
  
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-3xl font-bold mb-6 text-center">{data.heading}</h2>}
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-3">
              {review.avatar && <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full" />}
              <div>
                <p className="font-bold">{review.author}</p>
                <div className="flex text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.text}</p>
            {review.date && <p className="text-sm text-gray-500 mt-2">{review.date}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function InstagramFeedRenderer({ data }: { data: InstagramFeedComponent['data'] }) {
  const columns = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 6: 'grid-cols-6' }[data.columns];
  
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-3xl font-bold mb-6 text-center">{data.heading}</h2>}
      <div className={`grid ${columns} gap-4`}>
        {[...Array(data.displayCount)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Instagram className="h-12 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientPortalRenderer({ data }: { data: ClientPortalComponent['data'] }) {
  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Users className="h-16 w-16 mx-auto mb-4 text-primary-600" />
        {data.heading && <h2 className="text-2xl font-bold mb-2">{data.heading}</h2>}
        {data.description && <p className="text-gray-600 mb-6">{data.description}</p>}
        <a 
          href={data.loginUrl || '#'} 
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          {data.buttonText || 'Access Portal'}
        </a>
      </div>
    </div>
  );
}

// CONVERSION
function StickyCTARenderer({ data }: { data: StickyCTAComponent['data'] }) {
  return (
    <div 
      className={`${data.position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-40 py-3 px-4 shadow-lg`}
      style={{ backgroundColor: data.backgroundColor, color: data.textColor }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="font-medium">{data.text}</p>
        <a 
          href={data.buttonLink} 
          className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 whitespace-nowrap"
        >
          {data.buttonText}
        </a>
      </div>
    </div>
  );
}

function CountdownRenderer({ data }: { data: CountdownComponent['data'] }) {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  React.useEffect(() => {
    const target = new Date(data.targetDate).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data.targetDate]);
  
  const size = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl' }[data.size || 'md'];
  
  return (
    <div className="py-8 text-center">
      {data.heading && <h2 className="text-3xl font-bold mb-2">{data.heading}</h2>}
      {data.subheading && <p className="text-gray-600 mb-6">{data.subheading}</p>}
      <div className="flex justify-center gap-4">
        {['days', 'hours', 'minutes', 'seconds'].map(unit => (
          <div key={unit} className="flex flex-col items-center">
            <div className={`${size} font-bold text-primary-600`}>
              {timeLeft[unit as keyof typeof timeLeft]}
            </div>
            {data.showLabels && <div className="text-sm text-gray-500 capitalize">{unit}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressStepsRenderer({ data }: { data: ProgressStepsComponent['data'] }) {
  const current = data.currentStep || 0;
  const steps = data.steps || [];
  
  return (
    <div className="py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                i <= current ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {data.showNumbers ? i + 1 : <span>✓</span>}
              </div>
              <p className="mt-2 text-sm font-medium">{step.title}</p>
              {step.description && <p className="text-xs text-gray-500">{step.description}</p>}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 ${i < current ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function CalendarWidgetRenderer({ data }: { data: CalendarWidgetComponent['data'] }) {
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-3xl font-bold mb-6 text-center">{data.heading}</h2>}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-primary-600" />
        <p className="text-center text-gray-600 mb-4">Calendar widget will be embedded here</p>
        {data.embedUrl && <p className="text-xs text-gray-500 text-center break-all">{data.embedUrl}</p>}
      </div>
    </div>
  );
}

function TrustBadgesRenderer({ data }: { data: TrustBadgesComponent['data'] }) {
  const size = { sm: 'h-12', md: 'h-16', lg: 'h-20' }[data.size || 'md'];
  const badges = data.badges || [];
  
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-2xl font-bold mb-6 text-center">{data.heading}</h2>}
      <div className={`flex ${data.layout === 'grid' ? 'flex-wrap' : ''} items-center justify-center gap-6`}>
        {badges.map(badge => (
          <div key={badge.id} className="grayscale hover:grayscale-0 transition">
            {badge.image ? (
              <img src={badge.image} alt={badge.title} className={size} />
            ) : (
              <div className={`${size} w-24 bg-gray-200 rounded flex items-center justify-center`}>
                <Award className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExitPopupRenderer({ data }: { data: ExitPopupComponent['data'] }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
        {data.dismissible && (
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        )}
        <h2 className="text-2xl font-bold mb-4">{data.heading}</h2>
        <p className="text-gray-600 mb-6">{data.message}</p>
        <a 
          href={data.buttonLink} 
          className="block w-full text-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {data.buttonText}
        </a>
      </div>
    </div>
  );
}

// CONTENT/SEO
function TimelineRenderer({ data }: { data: TimelineComponent['data'] }) {
  const events = data.events || [];
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-3xl font-bold mb-8 text-center">{data.heading}</h2>}
      <div className="max-w-4xl mx-auto">
        {events.map((event, i) => (
          <div key={event.id} className="flex gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                {event.icon && String(event.icon).trim().length > 0 ? (
                  <span className="text-xl leading-none">{event.icon}</span>
                ) : (
                  i + 1
                )}
              </div>
              {i < events.length - 1 && <div className="w-1 flex-1 bg-primary-200 mt-2" />}
            </div>
            <div className="flex-1 pb-8">
              <div className="text-sm text-primary-600 font-bold">{event.date}</div>
              <h3 className="text-xl font-bold mt-1">{event.title}</h3>
              <p className="text-gray-600 mt-2">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonTableRenderer({ data }: { data: ComparisonTableComponent['data'] }) {
  const plans = data.plans || [];
  const features = data.features || [];
  
  return (
    <div className="py-8 overflow-x-auto">
      {data.heading && <h2 className="text-3xl font-bold mb-6 text-center">{data.heading}</h2>}
      <table className="w-full max-w-5xl mx-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left border">Feature</th>
            {plans.map(plan => (
              <th key={plan.name} className={`p-4 text-center border ${plan.featured ? 'bg-primary-50' : ''}`}>
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={i}>
              <td className="p-4 border font-medium">{feature.name}</td>
              {feature.values?.map((value, j) => (
                <td key={j} className={`p-4 border text-center ${plans[j]?.featured ? 'bg-primary-50' : ''}`}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlogCardsRenderer({ data }: { data: BlogCardsComponent['data'] }) {
  const columns = data.columns ? { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[data.columns] : '';
  
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-3xl font-bold mb-6">{data.heading}</h2>}
      <div className={`grid gap-6 ${columns}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Blog Post Title {i}</h3>
              {data.showExcerpt && <p className="text-gray-600 mb-3">Preview of blog post content...</p>}
              <div className="flex gap-4 text-sm text-gray-500">
                {data.showDate && <span>Jan 1, 2025</span>}
                {data.showAuthor && <span>Author Name</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryNavRenderer({ data }: { data: CategoryNavComponent['data'] }) {
  const columns = data.columns ? { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[data.columns] : '';
  const categories = data.categories || [];
  
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-3xl font-bold mb-6 text-center">{data.heading}</h2>}
      <div className={`grid gap-4 ${columns}`}>
        {categories.map(cat => (
          <a key={cat.id} href={cat.link} className="relative group overflow-hidden rounded-lg shadow-lg aspect-video">
            {cat.image ? (
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-2xl font-bold">{cat.name}</h3>
              {data.showCounts && cat.count && <p className="text-sm">{cat.count} items</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function BreadcrumbsRenderer({ data }: { data: BreadcrumbsComponent['data'] }) {
  const separator = { slash: '/', chevron: '›', dot: '•' }[data.separator || 'chevron'];
  
  return (
    <nav className="py-4">
      <ol className="flex items-center gap-2 text-sm">
        {data.showHome && (
          <>
            <li><a href="/" className="text-primary-600 hover:underline">Home</a></li>
            <li className="text-gray-400">{separator}</li>
          </>
        )}
        {data.items?.map((item, i) => (
          <React.Fragment key={i}>
            <li>
              <a href={item.link} className={i === data.items!.length - 1 ? 'text-gray-600' : 'text-primary-600 hover:underline'}>
                {item.label}
              </a>
            </li>
            {i < data.items!.length - 1 && <li className="text-gray-400">{separator}</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

function TableOfContentsRenderer({ data }: { data: TableOfContentsComponent['data'] }) {
  const items = data.items || [];
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 max-w-xs">
      {data.heading && <h3 className="font-bold text-lg mb-4">{data.heading}</h3>}
      <nav>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} style={{ paddingLeft: `${item.level * 12}px` }}>
              <a href={`#${item.anchor}`} className="text-primary-600 hover:underline text-sm">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function RelatedContentRenderer({ data }: { data: RelatedContentComponent['data'] }) {
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-2xl font-bold mb-6">{data.heading}</h2>}
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-40 bg-gray-200" />
            <div className="p-4">
              <h3 className="font-bold mb-2">Related Item {i}</h3>
              <p className="text-sm text-gray-600">Brief description...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapEmbedRenderer({ data }: { data: MapEmbedComponent['data'] }) {
  const height = { sm: 'h-64', md: 'h-96', lg: 'h-[32rem]', xl: 'h-[40rem]' }[data.height || 'md'];
  
  return (
    <div className={`${height} bg-gray-200 rounded-lg overflow-hidden`}>
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MapPin className="h-16 w-16 mx-auto mb-2" />
          <p className="font-medium">Map Embed</p>
          {data.address && <p className="text-sm">{data.address}</p>}
        </div>
      </div>
    </div>
  );
}

// INTERACTIVE
function QuizRenderer({ data }: { data: QuizComponent['data'] }) {
  const [currentQ, setCurrentQ] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const questions = data.questions || [];
  
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2">{data.heading}</h2>
        {data.description && <p className="text-gray-600 mb-6">{data.description}</p>}
        
        {currentQ < questions.length ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">Question {currentQ + 1} of {questions.length}</p>
            <h3 className="text-xl font-bold mb-4">{questions[currentQ].question}</h3>
            <div className="space-y-3">
              {(questions[currentQ].options || []).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setAnswers({...answers, [data.questions[currentQ].id]: opt.value});
                    setCurrentQ(currentQ + 1);
                  }}
                  className="w-full p-4 text-left border-2 rounded-lg hover:border-primary-600 transition"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
            <p className="text-gray-600">View your results</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CalculatorRenderer({ data }: { data: CalculatorComponent['data'] }) {
  const [values, setValues] = React.useState<Record<string, number>>({});
  const fields = data.fields || [];
  const total = (data.basePrice || 0) + fields.reduce((sum, field) => {
    const val = values[field.id] || 0;
    return sum + (val * (field.multiplier || 0));
  }, 0);
  
  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-2">{data.heading}</h2>
        {data.description && <p className="text-gray-600 mb-6">{data.description}</p>}
        
        <div className="space-y-4 mb-6">
          {fields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium mb-2">{field.label}</label>
              {field.type === 'number' && (
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded"
                  onChange={(e) => setValues({...values, [field.id]: Number(e.target.value)})}
                />
              )}
              {field.type === 'select' && (
                <select
                  className="w-full px-4 py-2 border rounded"
                  onChange={(e) => setValues({...values, [field.id]: Number(e.target.value)})}
                >
                  {(field.options || []).map(opt => (
                    <option key={opt.label} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Estimated Total:</span>
            <span className="text-3xl font-bold text-primary-600">${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LightboxRenderer({ data }: { data: LightboxComponent['data'] }) {
  return (
    <div className="py-4">
      <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
        {data.triggerText}
      </button>
    </div>
  );
}

function EnhancedTabsRenderer({ data }: { data: EnhancedTabsComponent['data'] }) {
  const tabs = data.tabs || [];
  const [active, setActive] = React.useState(data.activeTab || tabs[0]?.id);
  
  return (
    <div className="py-4">
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition ${
              active === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent'
            }`}
          >
            {data.showIcons && tab.icon && <Eye className="h-4 w-4" />}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded">
        Tab content for {data.tabs.find(t => t.id === active)?.label}
      </div>
    </div>
  );
}

function AlertBannerRenderer({ data }: { data: AlertBannerComponent['data'] }) {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
  }[data.type];
  
  return (
    <div className={`${colors} border-l-4 p-4 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <p>{data.message}</p>
      </div>
      <div className="flex items-center gap-3">
        {data.link && <a href={data.link} className="underline font-medium">{data.linkText}</a>}
        {data.dismissible && <button className="p-1"><X className="h-4 w-4" /></button>}
      </div>
    </div>
  );
}

// SOCIAL PROOF
function LogoCarouselRenderer({ data }: { data: LogoCarouselComponent['data'] }) {
  const logos = data.logos || [];
  
  return (
    <div className="py-8">
      {data.heading && <h2 className="text-2xl font-bold mb-6 text-center">{data.heading}</h2>}
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {logos.map(logo => (
          <div key={logo.id} className={`h-16 ${data.grayscale ? 'grayscale hover:grayscale-0' : ''} transition`}>
            {logo.image ? (
              <img src={logo.image} alt={logo.alt} className="h-full object-contain" />
            ) : (
              <div className="h-full w-24 bg-gray-200 rounded flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveCounterRenderer({ data }: { data: LiveCounterComponent['data'] }) {
  return (
    <div className="py-8">
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {data.counters.map(counter => (
          <div key={counter.id} className="text-center">
            <div className="text-5xl font-bold text-primary-600 mb-2">
              {counter.prefix}{counter.targetValue}{counter.suffix}
            </div>
            <div className="text-gray-600">{counter.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsTickerRenderer({ data }: { data: BookingsTickerComponent['data'] }) {
  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <div>
          <p className="font-bold">{data.items[0]?.name} just booked!</p>
          <p className="text-sm text-gray-600">{data.items[0]?.service} • {data.items[0]?.timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

// Component Renderer
function ComponentRenderer({ component }: { component: PageComponent }) {
  switch (component.type) {
    case "faq":
      return <FAQRenderer data={(component as any).data} />;
    case "pricingTable":
      return <PricingTableRenderer data={(component as any).data} />;
    case "teamMembers":
      return <TeamMembersRenderer data={(component as any).data} />;
    case "socialFeed":
      return <SocialFeedRenderer data={(component as any).data} />;
    case "dualCTA":
      return <DualCTARenderer data={(component as any).data} />;
    case "contactForm":
      return <ContactFormRenderer data={(component as any).data} />;
    case "newsletterSignup":
      return <NewsletterRenderer data={(component as any).data} />;
    case "logo":
      return <LogoRenderer data={(component as any).data} />;
    case "hero":
      return <HeroRenderer data={component.data} />;
    case "text":
      return <TextRenderer data={component.data} />;
    case "image":
      return <ImageRenderer data={component.data} />;
    case "button":
      return <ButtonRenderer data={component.data} />;
    case "columns":
      return <ColumnsRenderer data={component.data} />;
    case "slideshowHero":
      return <SlideshowHeroRenderer data={(component as any).data} />;
    case "testimonials":
      return <TestimonialsRenderer data={(component as any).data} />;
    case "galleryHighlights":
      return <GalleryHighlightsRenderer data={(component as any).data} />;
    case "widgetEmbed":
      return <WidgetEmbedRenderer data={(component as any).data} />;
    case "badges":
      return <BadgesRenderer data={(component as any).data} />;
    case "servicesGrid":
      return <ServicesGridRenderer data={(component as any).data} />;
    case "stats":
      return <StatsRenderer data={(component as any).data} />;
    case "ctaBanner":
      return <CTABannerRenderer data={(component as any).data} />;
    case "iconFeatures":
      return <IconFeaturesRenderer data={(component as any).data} />;
    case "spacer":
      return <SpacerRenderer data={component.data} />;
    case "seoFooter":
      return <SEOFooterRenderer data={component.data} />;
    case "customCss":
      return (component as any).data?.enabled ? (
        <style dangerouslySetInnerHTML={{ __html: String((component as any).data?.css || '') }} />
      ) : null;
    case "container":
      return <ContainerRenderer component={component as ContainerComponent} />;
    case "accordion":
      return <AccordionRenderer component={component as AccordionComponent} />;
    case "tabs":
      return <TabsRenderer component={component as TabsComponent} />;
    
    // MULTIMEDIA COMPONENTS
    case "videoHero":
      return <VideoHeroRenderer data={(component as VideoHeroComponent).data} />;
    case "beforeAfter":
      return <BeforeAfterRenderer data={(component as BeforeAfterComponent).data} />;
    case "photoGrid":
      return <PhotoGridRenderer data={(component as PhotoGridComponent).data} />;
    case "audioPlayer":
      return <AudioPlayerRenderer data={(component as AudioPlayerComponent).data} />;
    case "viewer360":
      return <Viewer360Renderer data={(component as Viewer360Component).data} />;
    case "pdfEmbed":
      return <PDFEmbedRenderer data={(component as PDFEmbedComponent).data} />;
    
    // CLIENT ENGAGEMENT
    case "reviews":
      return <ReviewsRenderer data={(component as ReviewsComponent).data} />;
    case "instagramFeed":
      return <InstagramFeedRenderer data={(component as InstagramFeedComponent).data} />;
    case "clientPortal":
      return <ClientPortalRenderer data={(component as ClientPortalComponent).data} />;
    
    // CONVERSION
    case "stickyCTA":
      return <StickyCTARenderer data={(component as StickyCTAComponent).data} />;
    case "countdown":
      return <CountdownRenderer data={(component as CountdownComponent).data} />;
    case "progressSteps":
      return <ProgressStepsRenderer data={(component as ProgressStepsComponent).data} />;
    case "calendarWidget":
      return <CalendarWidgetRenderer data={(component as CalendarWidgetComponent).data} />;
    case "trustBadges":
      return <TrustBadgesRenderer data={(component as TrustBadgesComponent).data} />;
    case "exitPopup":
      return <ExitPopupRenderer data={(component as ExitPopupComponent).data} />;
    
    // CONTENT/SEO
    case "timeline":
      return <TimelineRenderer data={(component as TimelineComponent).data} />;
    case "comparisonTable":
      return <ComparisonTableRenderer data={(component as ComparisonTableComponent).data} />;
    case "blogCards":
      return <BlogCardsRenderer data={(component as BlogCardsComponent).data} />;
    case "categoryNav":
      return <CategoryNavRenderer data={(component as CategoryNavComponent).data} />;
    case "breadcrumbs":
      return <BreadcrumbsRenderer data={(component as BreadcrumbsComponent).data} />;
    case "tableOfContents":
      return <TableOfContentsRenderer data={(component as TableOfContentsComponent).data} />;
    case "relatedContent":
      return <RelatedContentRenderer data={(component as RelatedContentComponent).data} />;
    case "mapEmbed":
      return <MapEmbedRenderer data={(component as MapEmbedComponent).data} />;
    
    // INTERACTIVE
    case "quiz":
      return <QuizRenderer data={(component as QuizComponent).data} />;
    case "calculator":
      return <CalculatorRenderer data={(component as CalculatorComponent).data} />;
    case "lightbox":
      return <LightboxRenderer data={(component as LightboxComponent).data} />;
    case "enhancedTabs":
      return <EnhancedTabsRenderer data={(component as EnhancedTabsComponent).data} />;
    case "alertBanner":
      return <AlertBannerRenderer data={(component as AlertBannerComponent).data} />;
    
    // SOCIAL PROOF
    case "logoCarousel":
      return <LogoCarouselRenderer data={(component as LogoCarouselComponent).data} />;
    case "liveCounter":
      return <LiveCounterRenderer data={(component as LiveCounterComponent).data} />;
    case "bookingsTicker":
      return <BookingsTickerRenderer data={(component as BookingsTickerComponent).data} />;
    
    default:
      return null;
  }
}

// Helper: Build a starter homepage template approximating the current static homepage
function buildHomepageTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero with dual CTAs - matching live site design with real background
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Studio 37",
      subtitle:
        "Capturing your precious moments with artistic excellence and professional craftsmanship",
      backgroundImage:
        "https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg",
      buttonText: "Book Your Session",
      buttonLink: "/book-a-session",
      secondaryButtonText: "View Portfolio",
      secondaryButtonLink: "/gallery",
      alignment: "center",
      overlay: 50,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      animation: "fade-in",
      buttonAnimation: "hover-zoom",
      fullBleed: true,
    },
  } as HeroComponent);

  // Spacer
  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Services Grid - Full service offering matching live site
  components.push({
    id: id(),
    type: "servicesGrid",
    data: {
      heading: "Our Photography Services",
      subheading:
        "From intimate portraits to grand celebrations, we offer comprehensive photography services tailored to your unique needs.",
      services: [
        {
          image:
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
          title: "Wedding Photography",
          description:
            "Capture your special day with romantic and timeless images that tell your love story.",
          features: [
            "Full day coverage",
            "Engagement session",
            "Digital gallery",
            "Print options",
          ],
          link: "/services/wedding-photography",
        },
        {
          image:
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop",
          title: "Portrait Sessions",
          description:
            "Professional headshots, family portraits, and individual sessions in studio or on location.",
          features: [
            "Studio or outdoor",
            "Multiple outfits",
            "Retouched images",
            "Same day preview",
          ],
          link: "/services/portrait-photography",
        },
        {
          image:
            "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop",
          title: "Event Photography",
          description:
            "Document your corporate events, parties, and celebrations with candid and posed shots.",
          features: [
            "Event coverage",
            "Candid moments",
            "Group photos",
            "Quick turnaround",
          ],
          link: "/services/event-photography",
        },
        {
          image:
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
          title: "Commercial Photography",
          description:
            "Product photography, business headshots, and marketing materials for your brand.",
          features: [
            "Product shots",
            "Brand imagery",
            "Marketing content",
            "Commercial rights",
          ],
          link: "/services/commercial-photography",
        },
      ],
      columns: 2,
      animation: "fade-in",
    },
  } as ServicesGridComponent);

  // Spacer
  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Commercial Photography Showcase Section
  components.push({
    id: id(),
    type: "text",
    data: {
      content:
        '<h2 class="text-3xl md:text-4xl font-bold mb-4">Commercial Photography Showcase</h2><p class="text-lg text-gray-600">Professional photography solutions that elevate your brand, showcase your products, and tell your business story with compelling visual content.</p>',
      alignment: "center",
      size: "lg",
      animation: "fade-in",
    },
  } as TextComponent);

  // Stats Block - Business credibility
  components.push({
    id: id(),
    type: "stats",
    data: {
      heading: "",
      stats: [
        {
          icon: "👥",
          number: "150",
          label: "Business Clients",
          suffix: "+",
        },
        {
          icon: "📸",
          number: "800",
          label: "Projects Completed",
          suffix: "+",
        },
        {
          icon: "⭐",
          number: "95",
          label: "Client Retention",
          suffix: "%",
        },
      ],
      columns: 3,
      style: "cards",
      animation: "fade-in",
    },
  } as StatsComponent);

  // Gallery Highlights - Commercial categories
  components.push({
    id: id(),
    type: "galleryHighlights",
    data: {
      categories: [
        "product photography",
        "brand photography",
        "corporate headshots",
        "real estate",
      ],
      collections: [],
      tags: [],
      group: "",
      featuredOnly: true,
      limit: 8,
      limitPerCategory: 2,
      sortBy: "display_order",
      sortDir: "asc",
      animation: "fade-in",
    },
  } as GalleryHighlightsComponent);

  // Spacer
  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // CTA Banner - Business focus
  components.push({
    id: id(),
    type: "ctaBanner",
    data: {
      heading: "Ready to Elevate Your Business Visuals?",
      subheading:
        "From product photography to corporate events, we help businesses create compelling visual content that drives results and enhances your brand image.",
      primaryButtonText: "View Commercial Services",
      primaryButtonLink: "/services/commercial-photography",
      secondaryButtonText: "Request Quote",
      secondaryButtonLink: "/contact",
      backgroundImage: "",
      backgroundColor: "#0f172a",
      overlay: 60,
      textColor: "text-white",
      fullBleed: true,
      animation: "fade-in",
    },
  } as CTABannerComponent);

  // Spacer
  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Lead capture prompt + button
  components.push({
    id: id(),
    type: "text",
    data: {
      content:
        '<h2 class="text-3xl font-bold mb-2">Ready to Capture Your Story?</h2><p class="text-lg text-gray-600">Let\'s discuss your photography needs and create something beautiful together.</p>',
      alignment: "center",
      size: "md",
      animation: "fade-in",
    },
  } as TextComponent);
  components.push({
    id: id(),
    type: "button",
    data: {
      text: "Book a Session",
      link: "/book-a-session",
      style: "primary",
      alignment: "center",
      animation: "hover-zoom",
    },
  } as ButtonComponent);

  // Spacer
  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Testimonials
  components.push({
    id: id(),
    type: "testimonials",
    data: {
      testimonials: [
        {
          quote:
            "Absolutely stunning photos and a wonderful experience from start to finish.",
          author: "Emily R.",
          subtext: "Brand Manager, Houston, TX",
          avatar:
            "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=256&auto=format&fit=crop",
        },
        {
          quote:
            "Our team headshots and product images elevated our entire website.",
          author: "Michael T.",
          subtext: "Founder, Pinehurst, TX",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
        },
        {
          quote:
            "Professional, creative, and fast. The photos captured our brand perfectly.",
          author: "Sofia L.",
          subtext: "Marketing Director, The Woodlands, TX",
          avatar:
            "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop",
        },
      ],
      animation: "fade-in",
    },
  } as TestimonialsComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Trust Badges - NEW
  components.push({
    id: id(),
    type: "trustBadges",
    data: {
      heading: "Why Choose Studio37?",
      layout: "horizontal",
      size: "md",
      badges: [
        { id: id(), icon: "⭐", label: "5-Star Rated", description: "200+ Reviews" },
        { id: id(), icon: "📸", label: "Pro Equipment", description: "Latest Technology" },
        { id: id(), icon: "⚡", label: "48hr Delivery", description: "Fast Turnaround" },
        { id: id(), icon: "💯", label: "100% Satisfaction", description: "Guaranteed" },
      ],
    },
  } as TrustBadgesComponent);

  // Newsletter signup
  components.push({
    id: id(),
    type: "newsletterSignup",
    data: {
      heading: "Get 10% Off Your First Session",
      subheading: "Subscribe for tips, behind-the-scenes, and special offers.",
      disclaimer:
        "By subscribing, you agree to receive marketing emails. Unsubscribe anytime.",
      style: "card",
      animation: "fade-in",
    },
  } as NewsletterComponent);

  // Optional SEO footer - Complete contact info
  components.push({
    id: id(),
    type: "seoFooter",
    data: {
      content:
        '<h3 class="text-lg font-bold mb-2">About Studio37</h3><p class="text-sm">Professional photography serving Pinehurst, Tomball, Magnolia, The Woodlands, Conroe, Spring, and surrounding areas within 50 miles. Specializing in portraits, weddings, events, and commercial photography.</p><h3 class="text-lg font-bold mt-4 mb-2">Contact</h3><p class="text-sm">Studio37 • 832-713-9944 • sales@studio37.cc • 1701 Goodson Loop, TRLR 80, Pinehurst, TX 77362</p>',
      includeSchema: true,
    },
  } as SEOFooterComponent);

  return components;
}

// Helper: Build an About page template
function buildAboutTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "About Studio37 Photography",
      subtitle:
        "Meet the passionate photographers behind your most precious moments",
      backgroundImage:
        "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2000&auto=format&fit=crop",
      buttonText: "View Our Work",
      buttonLink: "/gallery",
      alignment: "center",
      overlay: 60,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      animation: "fade-in",
      buttonAnimation: "hover-zoom",
      fullBleed: true,
    },
  } as HeroComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Introduction
  components.push({
    id: id(),
    type: "text",
    data: {
      content:
        '<h2 class="text-4xl font-bold mb-4">Meet Your Photography Team</h2><p class="text-lg text-gray-600">Christian and Caitie bring together years of experience, artistic vision, and genuine passion for storytelling through photography.</p>',
      alignment: "center",
      size: "lg",
      animation: "fade-in",
    },
  } as TextComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Team members
  components.push({
    id: id(),
    type: "columns",
    data: {
      animation: "fade-in",
      columns: [
        {
          content:
            '<div class="text-center"><h3 class="text-2xl font-bold mb-2">Christian</h3><p class="text-blue-600 font-semibold mb-4">CEO, Marketing Lead & Photographer</p><p class="text-gray-700">Christian brings business acumen and artistic vision to every project, specializing in wedding and commercial photography.</p></div>',
        },
        {
          content:
            '<div class="text-center"><h3 class="text-2xl font-bold mb-2">Caitie</h3><p class="text-purple-600 font-semibold mb-4">Co-Owner, Photographer & Editor</p><p class="text-gray-700">Caitie\'s creative direction and meticulous editing bring each image to life with artistic excellence.</p></div>',
        },
      ],
    },
  } as ColumnsComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Our approach
  components.push({
    id: id(),
    type: "text",
    data: {
      content:
        '<h2 class="text-3xl font-bold mb-4">Our Approach</h2><p class="text-lg text-gray-600 mb-4">We believe every client deserves a personalized experience. From our first conversation to the final delivery, we focus on understanding your vision and bringing it to life through thoughtful, artistic photography.</p><p class="text-lg text-gray-600">Whether you\'re celebrating a wedding, building your brand, or capturing family moments, we\'re here to create images you\'ll treasure forever.</p>',
      alignment: "center",
      size: "md",
      animation: "slide-up",
    },
  } as TextComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Timeline - NEW: Our Story
  components.push({
    id: id(),
    type: "timeline",
    data: {
      heading: "Our Journey",
      orientation: "vertical",
      style: "modern",
      animation: "fade-in",
      items: [
        { id: "1", date: "2018", icon: "📸", title: "The Beginning", description: "Christian started Studio37 with a camera and a dream" },
        { id: "2", date: "2019", icon: "💑", title: "Partnership Formed", description: "Caitie joined as co-owner and lead editor" },
        { id: "3", date: "2021", icon: "🏆", title: "Award Recognition", description: "Won Best Local Photographer in The Woodlands" },
        { id: "4", date: "2023", icon: "🚀", title: "Business Expansion", description: "Opened commercial photography division" },
        { id: "5", date: "2025", icon: "⭐", title: "Today", description: "Serving 150+ clients with 5-star rated service" },
      ],
    },
  } as TimelineComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Logo Carousel - NEW: Clients we've worked with
  components.push({
    id: id(),
    type: "logoCarousel",
    data: {
      heading: "Trusted By",
      autoplay: true,
      speed: 3000,
      grayscale: true,
      logos: [
        { id: "1", image: "https://via.placeholder.com/150x60?text=Client+1", alt: "Client 1", link: "" },
        { id: "2", image: "https://via.placeholder.com/150x60?text=Client+2", alt: "Client 2", link: "" },
        { id: "3", image: "https://via.placeholder.com/150x60?text=Client+3", alt: "Client 3", link: "" },
        { id: "4", image: "https://via.placeholder.com/150x60?text=Client+4", alt: "Client 4", link: "" },
      ],
    },
  } as LogoCarouselComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Contact Form
  components.push({
    id: id(),
    type: "contactForm",
    data: {
      heading: "Send Us a Message",
      subheading:
        "Tell us about your photography needs and we’ll reply within 24 hours.",
      animation: "fade-in",
    },
  } as ContactFormComponent);

  // CTA
  components.push({
    id: id(),
    type: "button",
    data: {
      text: "Book a Session",
      link: "/book-a-session",
      style: "primary",
      alignment: "center",
      animation: "hover-zoom",
    },
  } as ButtonComponent);

  return components;
}

// Helper: Build a Services page template
function buildServicesTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Photography Services",
      subtitle:
        "Professional photography capturing life's most precious moments with artistic excellence",
      backgroundImage:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop",
      buttonText: "Explore Our Services",
      buttonLink: "#services",
      alignment: "center",
      overlay: 60,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      animation: "fade-in",
      buttonAnimation: "hover-zoom",
      fullBleed: true,
    },
  } as HeroComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Services overview
  components.push({
    id: id(),
    type: "text",
    data: {
      content:
        '<h2 class="text-4xl font-bold mb-4">Our Photography Services</h2><p class="text-lg text-gray-600">From weddings to portraits, events to commercial projects - we bring professional craftsmanship to every session.</p>',
      alignment: "center",
      size: "lg",
      animation: "fade-in",
    },
  } as TextComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Service columns
  components.push({
    id: id(),
    type: "columns",
    data: {
      animation: "fade-in",
      columns: [
        {
          content:
            '<div class="text-center p-4"><span class="text-4xl mb-3 block">💍</span><h3 class="text-xl font-bold mb-2">Wedding Photography</h3><p class="text-gray-600">Romantic, timeless wedding photography capturing your special day.</p></div>',
        },
        {
          content:
            '<div class="text-center p-4"><span class="text-4xl mb-3 block">👨‍👩‍👧‍👦</span><h3 class="text-xl font-bold mb-2">Portrait Photography</h3><p class="text-gray-600">Family portraits, senior photos, and professional headshots.</p></div>',
        },
        {
          content:
            '<div class="text-center p-4"><span class="text-4xl mb-3 block">🎉</span><h3 class="text-xl font-bold mb-2">Event Photography</h3><p class="text-gray-600">Corporate events, parties, and special occasions.</p></div>',
        },
      ],
    },
  } as ColumnsComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  components.push({
    id: id(),
    type: "columns",
    data: {
      animation: "slide-up",
      columns: [
        {
          content:
            '<div class="text-center p-4"><span class="text-4xl mb-3 block">📸</span><h3 class="text-xl font-bold mb-2">Commercial Photography</h3><p class="text-gray-600">Product photography and brand imagery for businesses.</p></div>',
        },
        {
          content:
            '<div class="text-center p-4"><span class="text-4xl mb-3 block">🎨</span><h3 class="text-xl font-bold mb-2">Creative Sessions</h3><p class="text-gray-600">Artistic portraits and unique creative concepts.</p></div>',
        },
        {
          content:
            '<div class="text-center p-4"><span class="text-4xl mb-3 block">🏢</span><h3 class="text-xl font-bold mb-2">Real Estate</h3><p class="text-gray-600">Professional property photography for listings.</p></div>',
        },
      ],
    },
  } as ColumnsComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Before/After - NEW: Show editing quality
  components.push({
    id: id(),
    type: "beforeAfter",
    data: {
      beforeImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
      beforeLabel: "Before Editing",
      afterLabel: "After Professional Edit",
      initialPosition: 50,
    },
  } as BeforeAfterComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // CTA
  components.push({
    id: id(),
    type: "text",
    data: {
      content:
        '<h2 class="text-3xl font-bold mb-2">Ready to Book Your Session?</h2><p class="text-lg text-gray-600">Let\'s discuss your photography needs and create something beautiful together.</p>',
      alignment: "center",
      size: "md",
      animation: "fade-in",
    },
  } as TextComponent);

  components.push({
    id: id(),
    type: "button",
    data: {
      text: "Book Now",
      link: "/book-a-session",
      style: "primary",
      alignment: "center",
      animation: "hover-zoom",
    },
  } as ButtonComponent);

  return components;
}

// Helper: Build a Contact page template
function buildContactTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Contact Us",
      subtitle:
        "Get in touch to discuss your photography needs, book a session, or ask any questions",
      backgroundImage:
        "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000&auto=format&fit=crop",
      buttonText: "Send a Message",
      buttonLink: "#contact",
      alignment: "center",
      overlay: 50,
      titleColor: "text-white",
      subtitleColor: "text-gray-200",
      buttonStyle: "primary",
      animation: "fade-in",
      buttonAnimation: "hover-zoom",
      fullBleed: true,
    },
  } as HeroComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Contact info
  components.push({
    id: id(),
    type: "columns",
    data: {
      animation: "fade-in",
      columns: [
        {
          content:
            '<div class="text-center"><span class="text-4xl mb-3 block">📧</span><h3 class="text-xl font-bold mb-2">Email</h3><p class="text-gray-600">sales@studio37.cc</p><p class="text-sm text-gray-500 mt-2">We respond within 24 hours</p></div>',
        },
        {
          content:
            '<div class="text-center"><span class="text-4xl mb-3 block">📞</span><h3 class="text-xl font-bold mb-2">Phone</h3><p class="text-gray-600">832-713-9944</p><p class="text-sm text-gray-500 mt-2">Available Mon-Fri 9am-6pm</p></div>',
        },
        {
          content:
            '<div class="text-center"><span class="text-4xl mb-3 block">📞</span><h3 class="text-xl font-bold mb-2">Phone</h3><p class="text-gray-600">(xxx) xxx-xxxx</p><p class="text-sm text-gray-500 mt-2">Mon-Fri, 9AM-6PM CST</p></div>',
        },
        {
          content:
            '<div class="text-center"><span class="text-4xl mb-3 block">📍</span><h3 class="text-xl font-bold mb-2">Location</h3><p class="text-gray-600">Pinehurst, TX 77362</p><p class="text-sm text-gray-500 mt-2">Serving Montgomery County</p></div>',
        },
      ],
    },
  } as ColumnsComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Business hours & info
  components.push({
    id: id(),
    type: "text",
    data: {
      content:
        '<h2 class="text-3xl font-bold mb-4">Let\'s Create Together</h2><p class="text-lg text-gray-600 mb-4">Whether you\'re planning a wedding, need professional headshots, or want to capture family memories, we\'d love to hear from you.</p><p class="text-gray-600">Fill out the form on our contact page or reach out directly via email or phone. We\'ll respond promptly to discuss your vision and how we can bring it to life.</p>',
      alignment: "center",
      size: "md",
      animation: "slide-up",
    },
  } as TextComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Map Embed - NEW
  components.push({
    id: id(),
    type: "mapEmbed",
    data: {
      address: "1701 Goodson Loop, TRLR 80, Pinehurst, TX 77362",
      zoom: 14,
      height: 400,
      showMarker: true,
      mapType: "roadmap",
    },
  } as MapEmbedComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // CTA
  components.push({
    id: id(),
    type: "button",
    data: {
      text: "Book a Session",
      link: "/book-a-session",
      style: "primary",
      alignment: "center",
      animation: "hover-zoom",
    },
  } as ButtonComponent);

  return components;
}

// Helper: Build a Services + Pricing template
function buildServicesPricingTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Services & Pricing",
      subtitle:
        "Clear packages and pro results for portraits, events, and brands",
      backgroundImage:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop",
      buttonText: "Book a Session",
      buttonLink: "/book-a-session",
      alignment: "center",
      overlay: 55,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      animation: "fade-in",
      buttonAnimation: "hover-zoom",
      fullBleed: true,
    },
  } as HeroComponent);

  // Services Grid
  components.push({
    id: id(),
    type: "servicesGrid",
    data: {
      heading: "Our Photography Services",
      subheading:
        "From intimate portraits to brand visuals, tailored to your needs",
      services: [
        {
          image:
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop",
          title: "Portrait Sessions",
          description:
            "Headshots, family portraits, senior photos—studio or on-location.",
          features: [
            "Studio or outdoor",
            "Multiple outfits",
            "Retouched images",
          ],
        },
        {
          image:
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
          title: "Weddings",
          description:
            "Timeless coverage of your day, from details to dance floor.",
          features: [
            "Engagement session",
            "Full-day options",
            "Online gallery",
          ],
        },
        {
          image:
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
          title: "Commercial",
          description: "Product and brand imagery that elevates your business.",
          features: ["Product shots", "Brand imagery", "Usage rights"],
        },
      ],
      columns: 3,
      animation: "fade-in",
    },
  } as ServicesGridComponent);

  // Pricing Table
  components.push({
    id: id(),
    type: "pricingTable",
    data: {
      heading: "Packages & Pricing",
      subheading: "Simple packages for every need",
      plans: [
        {
          title: "Basic",
          price: "$199",
          period: "per session",
          features: ["30 min session", "10 edited photos", "Online gallery"],
          ctaText: "Book Basic",
          ctaLink: "/book-a-session",
          highlight: false,
        },
        {
          title: "Standard",
          price: "$349",
          period: "per session",
          features: [
            "60 min session",
            "25 edited photos",
            "Online gallery",
            "Print rights",
          ],
          ctaText: "Book Standard",
          ctaLink: "/book-a-session",
          highlight: true,
        },
        {
          title: "Premium",
          price: "$599",
          period: "per session",
          features: [
            "120 min session",
            "50 edited photos",
            "Online gallery",
            "Print rights",
            "Priority turnaround",
          ],
          ctaText: "Book Premium",
          ctaLink: "/book-a-session",
          highlight: false,
        },
      ],
      columns: 3,
      animation: "fade-in",
      style: "light",
      variant: "card",
      showFeatureChecks: true,
    },
  } as PricingTableComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Comparison Table - NEW
  components.push({
    id: id(),
    type: "comparisonTable",
    data: {
      heading: "Compare Our Packages",
      style: "default",
      plans: [
        { id: id(), name: "Basic", featured: false },
        { id: id(), name: "Standard", featured: true },
        { id: id(), name: "Premium", featured: false },
      ],
      features: [
        { id: id(), name: "Session Duration", values: ["30 min", "60 min", "120 min"] },
        { id: id(), name: "Edited Photos", values: ["10", "25", "50"] },
        { id: id(), name: "Online Gallery", values: ["✅", "✅", "✅"] },
        { id: id(), name: "Print Rights", values: ["❌", "✅", "✅"] },
        { id: id(), name: "Priority Turnaround", values: ["❌", "❌", "✅"] },
        { id: id(), name: "Price", values: ["$199", "$349", "$599"] },
      ],
    },
  } as ComparisonTableComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // CTA Banner
  components.push({
    id: id(),
    type: "ctaBanner",
    data: {
      heading: "Ready to Book Your Session?",
      subheading: "Let's create something beautiful together.",
      primaryButtonText: "Book Now",
      primaryButtonLink: "/book-a-session",
      secondaryButtonText: "Contact Us",
      secondaryButtonLink: "/contact",
      backgroundColor: "#0f172a",
      overlay: 60,
      textColor: "text-white",
      fullBleed: true,
      animation: "fade-in",
    },
  } as CTABannerComponent);

  return components;
}

// Helper: Build a dedicated FAQ page template
function buildFAQPageTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Frequently Asked Questions",
      subtitle: "Answers about booking, turnaround, travel, and more",
      backgroundImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop",
      buttonText: "Book a Session",
      buttonLink: "/book-a-session",
      alignment: "center",
      overlay: 50,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      animation: "fade-in",
      buttonAnimation: "hover-zoom",
      fullBleed: true,
    },
  } as HeroComponent);

  // FAQ
  components.push({
    id: id(),
    type: "faq",
    data: {
      heading: "Your Questions, Answered",
      items: [
        {
          question: "How do I book?",
          answer:
            "Use the Book a Session page or contact us. We confirm within 24 hours.",
        },
        {
          question: "What is the turnaround?",
          answer: "Most sessions are delivered within 48 hours.",
        },
        {
          question: "Do you travel?",
          answer:
            "Yes, we serve Tomball, Magnolia, Pinehurst and surrounding areas.",
        },
      ],
      columns: 1,
      animation: "fade-in",
    },
  } as FAQComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Table of Contents - NEW
  components.push({
    id: id(),
    type: "tableOfContents",
    data: {
      heading: "Quick Navigation",
      position: "left",
      sticky: true,
      items: [
        { id: "1", label: "Booking", url: "#booking", level: 1, children: [] },
        { id: "2", label: "Pricing", url: "#pricing", level: 1, children: [] },
        { id: "3", label: "Services", url: "#services", level: 1, children: [] },
        { id: "4", label: "Turnaround", url: "#turnaround", level: 1, children: [] },
      ],
    },
  } as TableOfContentsComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // CTA Button
  components.push({
    id: id(),
    type: "button",
    data: {
      text: "Still have questions? Contact us →",
      link: "/contact",
      style: "primary",
      alignment: "center",
      animation: "hover-zoom",
    },
  } as ButtonComponent);

  return components;
}
// Helper: Build a Lead Gen Landing template
function buildLeadGenTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero with strong CTA
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Tomball • Magnolia • Pinehurst",
      subtitle:
        "Artistic portraits and commercial photography with professional craftsmanship",
      backgroundImage:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop",
      buttonText: "Get Your Quote",
      buttonLink: "#contact",
      secondaryButtonText: "View Gallery",
      secondaryButtonLink: "/gallery",
      alignment: "center",
      overlay: 55,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      animation: "fade-in",
      buttonAnimation: "hover-zoom",
      fullBleed: true,
    },
  } as HeroComponent);

  // Badges / social proof
  components.push({
    id: id(),
    type: "badges",
    data: {
      badges: [
        {
          icon: "google",
          label: "5.0 • Google Reviews",
          sublabel: "★★★★★",
          color: "#34a853",
          href: "https://www.google.com/search",
        },
        {
          icon: "thumbtack",
          label: "Thumbtack Top Pro",
          sublabel: "Highly Rated",
          color: "#15a6ff",
          href: "https://www.thumbtack.com",
        },
        {
          icon: "shield",
          label: "Certified Professional Photographer",
          sublabel: "Studio 37",
          color: "#0ea5e9",
        },
      ],
      alignment: "center",
      size: "md",
      style: "pill",
      animation: "fade-in",
    },
  } as BadgesComponent);

  // Icon features
  components.push({
    id: id(),
    type: "iconFeatures",
    data: {
      heading: "Why Choose Studio 37",
      subheading: "Professional, fast, and premium results",
      features: [
        {
          icon: "📸",
          title: "Professional Gear",
          description: "Top-tier cameras and lighting",
        },
        {
          icon: "⚡",
          title: "Fast Turnaround",
          description: "Edited photos within 48 hours",
        },
        {
          icon: "💎",
          title: "Premium Quality",
          description: "Expert retouching and delivery",
        },
        {
          icon: "🎨",
          title: "Creative Direction",
          description: "Concepts tailored to your vision",
        },
      ],
      columns: 4,
      animation: "fade-in",
    },
  } as IconFeaturesComponent);

  // Stats
  components.push({
    id: id(),
    type: "stats",
    data: {
      heading: "Our Track Record",
      stats: [
        { icon: "👥", number: "150", label: "Business Clients", suffix: "+" },
        { icon: "📸", number: "800", label: "Projects Completed", suffix: "+" },
        { icon: "⭐", number: "95", label: "Client Retention", suffix: "%" },
      ],
      columns: 3,
      style: "cards",
      animation: "fade-in",
    },
  } as StatsComponent);

  // Sticky CTA - NEW
  components.push({
    id: id(),
    type: "stickyCTA",
    data: {
      text: "Limited spots available this month!",
      buttonText: "Get Your Quote Now",
      buttonLink: "#contact",
      position: "bottom",
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
    },
  } as StickyCTAComponent);

  // CTA Banner
  components.push({
    id: id(),
    type: "ctaBanner",
    data: {
      heading: "Ready to Get a Quote?",
      subheading: "Tell us about your project and we’ll respond today.",
      primaryButtonText: "Get Started",
      primaryButtonLink: "#contact",
      secondaryButtonText: "View Packages",
      secondaryButtonLink: "/services",
      backgroundColor: "#0f172a",
      overlay: 60,
      textColor: "text-white",
      fullBleed: true,
      animation: "fade-in",
    },
  } as CTABannerComponent);

  // Contact form
  components.push({
    id: id(),
    type: "contactForm",
    data: {
      heading: "Get Your Free Quote",
      subheading: "Share a few details and we’ll follow up right away.",
      animation: "fade-in",
    },
  } as ContactFormComponent);

  // FAQ
  components.push({
    id: id(),
    type: "faq",
    data: {
      heading: "Frequently Asked Questions",
      items: [
        {
          question: "How fast is turnaround?",
          answer:
            "Most sessions are delivered within <strong>48 hours</strong>.",
        },
        {
          question: "Do you travel?",
          answer:
            "Yes, we serve Tomball, Magnolia, Pinehurst and surrounding areas.",
        },
        {
          question: "How do I book?",
          answer:
            'Use the <a href="/book-a-session">Book a Session</a> page or contact us.',
        },
      ],
      columns: 1,
      animation: "fade-in",
    },
  } as FAQComponent);

  // Newsletter
  components.push({
    id: id(),
    type: "newsletterSignup",
    data: {
      heading: "Get 10% Off Your First Session",
      subheading: "Subscribe for tips, behind-the-scenes, and special offers.",
      disclaimer:
        "By subscribing, you agree to receive marketing emails. Unsubscribe anytime.",
      style: "card",
      animation: "fade-in",
    },
  } as NewsletterComponent);

  return components;
}

// Build Portfolio Showcase Template with new components
function buildPortfolioTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Video Hero
  components.push({
    id: id(),
    type: "videoHero",
    data: {
      videoUrl: "https://example.com/portfolio-video.mp4",
      posterImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop",
      title: "Portfolio Showcase",
      subtitle: "See our work come to life",
      buttonText: "View Full Portfolio",
      buttonLink: "/gallery",
      overlay: 40,
      autoplay: true,
      loop: true,
      muted: true,
    },
  } as VideoHeroComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Photo Grid
  components.push({
    id: id(),
    type: "photoGrid",
    data: {
      heading: "Recent Projects",
      layout: "masonry",
      columns: 3,
      gap: 16,
      showFilters: true,
      limit: 12,
    },
  } as PhotoGridComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Before/After
  components.push({
    id: id(),
    type: "beforeAfter",
    data: {
      beforeImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
      beforeLabel: "Original",
      afterLabel: "Edited",
      initialPosition: 50,
    },
  } as BeforeAfterComponent);

  // Instagram Feed
  components.push({
    id: id(),
    type: "instagramFeed",
    data: {
      heading: "Follow Our Journey @studio37",
      username: "studio37photography",
      displayCount: 8,
      columns: 4,
      showCaptions: false,
      style: "grid",
    },
  } as InstagramFeedComponent);

  // CTA
  components.push({
    id: id(),
    type: "ctaBanner",
    data: {
      heading: "Love What You See?",
      subheading: "Let's create something amazing together",
      primaryButtonText: "Book Your Session",
      primaryButtonLink: "/book-a-session",
      secondaryButtonText: "Contact Us",
      secondaryButtonLink: "/contact",
      backgroundColor: "#0f172a",
      textColor: "text-white",
      fullBleed: true,
      animation: "fade-in",
    },
  } as CTABannerComponent);

  return components;
}

// Build Promo/Sale Landing Page Template
function buildPromoLandingTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Alert Banner
  components.push({
    id: id(),
    type: "alertBanner",
    data: {
      message: "Limited Time Offer: 20% off all sessions booked this week!",
      type: "success",
      dismissible: false,
      link: "#booking",
      linkText: "Book Now",
      position: "top",
    },
  } as AlertBannerComponent);

  // Hero with Countdown
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Spring Photography Sale",
      subtitle: "Book now and save 20% on all photography sessions",
      backgroundImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop",
      buttonText: "Book Your Session",
      buttonLink: "#booking",
      alignment: "center",
      overlay: 50,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      animation: "fade-in",
      fullBleed: true,
    },
  } as HeroComponent);

  // Countdown Timer
  components.push({
    id: id(),
    type: "countdown",
    data: {
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      heading: "Sale Ends In:",
      subheading: "",
      expiredMessage: "Sale has ended. Check back for future promotions!",
      showLabels: true,
      style: "modern",
      size: "large",
    },
  } as CountdownComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Trust Badges
  components.push({
    id: id(),
    type: "trustBadges",
    data: {
      heading: "Why Choose Studio37?",
      layout: "horizontal",
      size: "md",
      badges: [
        { id: id(), icon: "⭐", label: "5-Star Rated", description: "200+ Reviews" },
        { id: id(), icon: "📸", label: "Pro Equipment", description: "Latest Tech" },
        { id: id(), icon: "💯", label: "Satisfaction Guaranteed", description: "100% Money Back" },
        { id: id(), icon: "⚡", label: "48hr Turnaround", description: "Fast Delivery" },
      ],
    },
  } as TrustBadgesComponent);

  // Pricing
  components.push({
    id: id(),
    type: "pricingTable",
    data: {
      heading: "Limited Time Pricing",
      subheading: "Save 20% when you book this week",
      plans: [
        {
          title: "Mini Session",
          price: "$159",
          period: "was $199",
          features: ["30 min session", "10 edited photos", "Online gallery"],
          ctaText: "Book Now",
          ctaLink: "#booking",
          highlight: false,
        },
        {
          title: "Standard",
          price: "$279",
          period: "was $349",
          features: ["60 min session", "25 edited photos", "Print rights"],
          ctaText: "Book Now",
          ctaLink: "#booking",
          highlight: true,
        },
        {
          title: "Premium",
          price: "$479",
          period: "was $599",
          features: ["120 min session", "50 edited photos", "Priority delivery"],
          ctaText: "Book Now",
          ctaLink: "#booking",
          highlight: false,
        },
      ],
      columns: 3,
      animation: "fade-in",
    },
  } as PricingTableComponent);

  // Live Counter (social proof)
  components.push({
    id: id(),
    type: "liveCounter",
    data: {
      counters: [
        { label: "Sessions Booked This Week", value: 47, prefix: "", suffix: "" },
        { label: "Spots Remaining", value: 8, prefix: "Only ", suffix: " Left!" },
      ],
      duration: 2000,
      style: "bold",
    },
  } as LiveCounterComponent);

  // Exit Intent Popup
  components.push({
    id: id(),
    type: "exitPopup",
    data: {
      heading: "Wait! Don't Miss Out",
      message: "Get an exclusive 25% discount code when you subscribe to our newsletter!",
      buttonText: "Get My Discount",
      buttonLink: "#newsletter",
      dismissible: true,
      showOnce: true,
    },
  } as ExitPopupComponent);

  // Newsletter
  components.push({
    id: id(),
    type: "newsletterSignup",
    data: {
      heading: "Get 25% Off + Exclusive Tips",
      subheading: "Subscribe to receive your discount code and photography tips",
      style: "card",
      animation: "fade-in",
    },
  } as NewsletterComponent);

  return components;
}

// Build Blog/Content Page Template
function buildBlogTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Breadcrumbs
  components.push({
    id: id(),
    type: "breadcrumbs",
    data: {
      items: [
        { label: "Home", url: "/" },
        { label: "Blog", url: "/blog" },
      ],
      separator: "chevron",
      showHome: true,
    },
  } as BreadcrumbsComponent);

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Photography Blog & Tips",
      subtitle: "Insights, tutorials, and stories from behind the lens",
      backgroundImage: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=2000&auto=format&fit=crop",
      alignment: "center",
      overlay: 60,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      fullBleed: true,
    },
  } as HeroComponent);

  // Category Nav
  components.push({
    id: id(),
    type: "categoryNav",
    data: {
      heading: "Browse by Category",
      layout: "grid",
      columns: 4,
      showCounts: true,
      categories: [
        { name: "Wedding Tips", slug: "wedding-tips", count: 12, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop" },
        { name: "Portrait Photography", slug: "portraits", count: 18, image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop" },
        { name: "Editing Tutorials", slug: "editing", count: 24, image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop" },
        { name: "Behind the Scenes", slug: "bts", count: 15, image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop" },
      ],
    },
  } as CategoryNavComponent);

  // Blog Cards
  components.push({
    id: id(),
    type: "blogCards",
    data: {
      heading: "Recent Posts",
      displayCount: 6,
      layout: "grid",
      columns: 3,
      showExcerpt: true,
      showDate: true,
      showAuthor: true,
      posts: [
        {
          title: "5 Tips for Perfect Golden Hour Photos",
          excerpt: "Learn how to capture stunning images during magic hour with these pro tips...",
          image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600&h=400&fit=crop",
          date: "2025-11-01",
          author: "Christian",
          slug: "golden-hour-tips",
        },
        {
          title: "What to Wear for Your Portrait Session",
          excerpt: "Choosing the right outfit can make or break your photos. Here's our guide...",
          image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop",
          date: "2025-10-28",
          author: "Caitie",
          slug: "what-to-wear",
        },
        {
          title: "Behind the Scenes: Wedding Day Workflow",
          excerpt: "Ever wonder what a wedding photographer's timeline looks like? Let's dive in...",
          image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop",
          date: "2025-10-20",
          author: "Christian",
          slug: "wedding-workflow",
        },
      ],
    },
  } as BlogCardsComponent);

  // Newsletter
  components.push({
    id: id(),
    type: "newsletterSignup",
    data: {
      heading: "Get Photography Tips in Your Inbox",
      subheading: "Weekly tutorials, inspiration, and exclusive offers",
      style: "card",
      animation: "fade-in",
    },
  } as NewsletterComponent);

  return components;
}

// Build Real Estate Template
function buildRealEstateTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Professional Real Estate Photography",
      subtitle: "Stunning photos that sell properties faster",
      backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop",
      buttonText: "View Portfolio",
      buttonLink: "#gallery",
      alignment: "center",
      overlay: 50,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      fullBleed: true,
    },
  } as HeroComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Features Grid
  components.push({
    id: id(),
    type: "featuresGrid",
    data: {
      heading: "Why Choose Professional Photography?",
      subheading: "Make your listings stand out with high-quality visuals",
      items: [
        {
          icon: "📸",
          title: "HDR Photography",
          description: "Perfectly balanced exposures that showcase every detail of the property",
        },
        {
          icon: "🎥",
          title: "Video Walkthroughs",
          description: "Engaging video tours that give buyers a true sense of the space",
        },
        {
          icon: "🚁",
          title: "Drone Aerials",
          description: "Stunning bird's-eye views highlighting the property and surroundings",
        },
        {
          icon: "✨",
          title: "Virtual Staging",
          description: "Digital furniture placement to help buyers visualize potential",
        },
        {
          icon: "⚡",
          title: "24-Hour Turnaround",
          description: "Fast delivery so you can list properties quickly",
        },
        {
          icon: "💼",
          title: "MLS Ready",
          description: "Properly sized and optimized images for all listing platforms",
        },
      ],
      columns: 3,
      animation: "fade-in",
    },
  } as FeaturesGridComponent);

  // Gallery
  components.push({
    id: id(),
    type: "gallery",
    data: {
      heading: "Recent Property Shoots",
      layout: "masonry",
      columns: 3,
      showFilters: true,
      images: [
        { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", alt: "Modern living room", category: "Interior" },
        { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", alt: "Luxury kitchen", category: "Interior" },
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", alt: "Home exterior", category: "Exterior" },
        { url: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop", alt: "Master bedroom", category: "Interior" },
        { url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop", alt: "Backyard view", category: "Exterior" },
        { url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop", alt: "Modern bathroom", category: "Interior" },
      ],
    },
  } as GalleryComponent);

  // Before/After
  components.push({
    id: id(),
    type: "beforeAfter",
    data: {
      heading: "The Power of Professional Photography",
      subheading: "See how quality photos transform listings",
      beforeImage: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&h=800&fit=crop&auto=format&q=50",
      afterImage: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&h=800&fit=crop&auto=format&q=90",
      beforeLabel: "Phone Photo",
      afterLabel: "Professional Shot",
      orientation: "horizontal",
      defaultPosition: 50,
    },
  } as BeforeAfterComponent);

  // Pricing
  components.push({
    id: id(),
    type: "pricingTable",
    data: {
      heading: "Real Estate Photography Packages",
      subheading: "Choose the package that fits your listing needs",
      plans: [
        {
          name: "Essential",
          price: 150,
          period: "per property",
          features: [
            "Up to 25 HDR photos",
            "Interior & exterior shots",
            "24-hour delivery",
            "MLS-ready format",
            "Basic editing included",
          ],
          buttonText: "Book Now",
          buttonLink: "/book-a-session",
          highlight: false,
        },
        {
          name: "Premium",
          price: 275,
          period: "per property",
          features: [
            "Up to 40 HDR photos",
            "Twilight exterior shots",
            "Drone aerial views",
            "Video walkthrough (2 min)",
            "Same-day rush available",
            "Virtual staging (2 rooms)",
          ],
          buttonText: "Most Popular",
          buttonLink: "/book-a-session",
          highlight: true,
        },
        {
          name: "Luxury",
          price: 450,
          period: "per property",
          features: [
            "Unlimited HDR photos",
            "4K video tour (5 min)",
            "Drone aerial video",
            "Floor plan included",
            "3D virtual tour (Matterport)",
            "Virtual staging (all rooms)",
            "Priority scheduling",
          ],
          buttonText: "Book Now",
          buttonLink: "/book-a-session",
          highlight: false,
        },
      ],
      columns: 3,
      animation: "fade-in",
    },
  } as PricingTableComponent);

  // Testimonials
  components.push({
    id: id(),
    type: "testimonials",
    data: {
      heading: "What Agents Say",
      style: "cards",
      autoplay: true,
      interval: 5000,
      items: [
        {
          text: "My listings sell 40% faster since I started using these photos. Buyers always comment on how stunning the images are!",
          author: "Sarah Johnson",
          role: "Realtor, Keller Williams",
          avatar: "https://i.pravatar.cc/150?img=5",
          rating: 5,
        },
        {
          text: "The drone footage is a game-changer for larger properties. Professional, reliable, and always on time.",
          author: "Michael Chen",
          role: "Broker, RE/MAX",
          avatar: "https://i.pravatar.cc/150?img=12",
          rating: 5,
        },
        {
          text: "Fast turnaround and incredible quality. I recommend these services to all my fellow agents.",
          author: "Emily Rodriguez",
          role: "Agent, Century 21",
          avatar: "https://i.pravatar.cc/150?img=9",
          rating: 5,
        },
      ],
    },
  } as TestimonialsComponent);

  // FAQ
  components.push({
    id: id(),
    type: "faq",
    data: {
      heading: "Frequently Asked Questions",
      layout: "accordion",
      columns: 1,
      items: [
        {
          question: "How long does a typical shoot take?",
          answer: "Most residential properties take 45-90 minutes depending on size. We work efficiently to minimize disruption.",
        },
        {
          question: "When will I receive my photos?",
          answer: "Standard turnaround is 24 hours. Same-day rush delivery is available for an additional fee.",
        },
        {
          question: "Do you offer twilight photography?",
          answer: "Yes! Twilight shoots are included in Premium and Luxury packages. They're perfect for showcasing exterior lighting.",
        },
        {
          question: "Can you shoot occupied homes?",
          answer: "Absolutely. We work around tenants' schedules and can digitally stage to minimize clutter if needed.",
        },
        {
          question: "What happens if weather affects the drone shoot?",
          answer: "We'll reschedule the aerial portion at no extra charge. Safety and quality always come first.",
        },
      ],
    },
  } as FAQComponent);

  // CTA Banner
  components.push({
    id: id(),
    type: "ctaBanner",
    data: {
      heading: "Ready to Elevate Your Listings?",
      subheading: "Book a shoot and see the difference professional photography makes",
      primaryButtonText: "Schedule Now",
      primaryButtonLink: "/book-a-session",
      secondaryButtonText: "View Pricing",
      secondaryButtonLink: "#pricing",
      backgroundColor: "#0f172a",
      textColor: "text-white",
      fullBleed: true,
    },
  } as CTABannerComponent);

  return components;
}

// Build Restaurant Template
function buildRestaurantTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Restaurant Photography That Makes Mouths Water",
      subtitle: "Professional food and ambiance photography for menus, websites, and social media",
      backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop",
      buttonText: "See Our Work",
      buttonLink: "#gallery",
      alignment: "center",
      overlay: 50,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      fullBleed: true,
    },
  } as HeroComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Features Grid
  components.push({
    id: id(),
    type: "featuresGrid",
    data: {
      heading: "Complete Restaurant Photography Services",
      subheading: "Everything you need to showcase your culinary experience",
      items: [
        {
          icon: "🍽️",
          title: "Menu Photography",
          description: "Mouthwatering shots of your signature dishes with perfect lighting and styling",
        },
        {
          icon: "🏛️",
          title: "Interior Ambiance",
          description: "Capture your restaurant's atmosphere and unique dining experience",
        },
        {
          icon: "👨‍🍳",
          title: "Chef & Team",
          description: "Authentic behind-the-scenes and professional portraits of your culinary team",
        },
        {
          icon: "📱",
          title: "Social Media Content",
          description: "Instagram-ready images optimized for maximum engagement",
        },
        {
          icon: "🎥",
          title: "Video Production",
          description: "Short recipe videos, cooking demos, and promotional clips",
        },
        {
          icon: "📖",
          title: "Menu Design Support",
          description: "Professional images ready for print menus and digital displays",
        },
      ],
      columns: 3,
      animation: "fade-in",
    },
  } as FeaturesGridComponent);

  // Gallery
  components.push({
    id: id(),
    type: "gallery",
    data: {
      heading: "Recent Restaurant Projects",
      layout: "masonry",
      columns: 3,
      showFilters: true,
      images: [
        { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop", alt: "Gourmet burger", category: "Food" },
        { url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop", alt: "Pancake stack", category: "Food" },
        { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop", alt: "Restaurant interior", category: "Interior" },
        { url: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&h=600&fit=crop", alt: "Chef plating", category: "Behind the Scenes" },
        { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop", alt: "Asian cuisine", category: "Food" },
        { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop", alt: "Bar atmosphere", category: "Interior" },
      ],
    },
  } as GalleryComponent);

  // Stats/Counters
  components.push({
    id: id(),
    type: "stats",
    data: {
      heading: "Proven Results for Restaurants",
      items: [
        { value: 150, label: "Restaurants Served", suffix: "+" },
        { value: 5000, label: "Dishes Photographed", suffix: "+" },
        { value: 89, label: "Social Media Engagement Increase", suffix: "%" },
        { value: 24, label: "Average Turnaround", suffix: " hrs" },
      ],
      columns: 4,
      animation: "count-up",
    },
  } as StatsComponent);

  // Comparison Table
  components.push({
    id: id(),
    type: "comparisonTable",
    data: {
      heading: "DIY Photos vs. Professional Photography",
      subheading: "See the difference quality makes",
      columns: [
        {
          title: "DIY/Phone Photos",
          features: [
            { label: "Professional Lighting", value: false },
            { label: "Food Styling", value: false },
            { label: "Consistent Quality", value: false },
            { label: "High-Resolution Files", value: false },
            { label: "Social Media Ready", value: false },
            { label: "Menu Print Quality", value: false },
          ],
          highlight: false,
        },
        {
          title: "Professional Photography",
          features: [
            { label: "Professional Lighting", value: true },
            { label: "Food Styling", value: true },
            { label: "Consistent Quality", value: true },
            { label: "High-Resolution Files", value: true },
            { label: "Social Media Ready", value: true },
            { label: "Menu Print Quality", value: true },
          ],
          highlight: true,
        },
      ],
    },
  } as ComparisonTableComponent);

  // Pricing
  components.push({
    id: id(),
    type: "pricingTable",
    data: {
      heading: "Restaurant Photography Packages",
      subheading: "Flexible options for every budget",
      plans: [
        {
          name: "Starter",
          price: 350,
          period: "half-day session",
          features: [
            "Up to 10 menu items",
            "2 hours on-site",
            "Basic food styling",
            "20 edited photos",
            "Social media sized versions",
            "48-hour delivery",
          ],
          buttonText: "Get Started",
          buttonLink: "/contact",
          highlight: false,
        },
        {
          name: "Complete",
          price: 650,
          period: "full-day session",
          features: [
            "Up to 25 menu items",
            "4 hours on-site",
            "Professional food styling",
            "50 edited photos",
            "Interior shots included",
            "Chef/team portraits (5 people)",
            "Video clips (15 sec each)",
            "24-hour rush delivery",
          ],
          buttonText: "Most Popular",
          buttonLink: "/contact",
          highlight: true,
        },
        {
          name: "Premium",
          price: 1200,
          period: "multi-day project",
          features: [
            "Full menu coverage",
            "2-day shoot (8 hours total)",
            "Advanced food styling",
            "100+ edited photos",
            "Complete interior coverage",
            "Team & chef portraits (unlimited)",
            "Behind-the-scenes content",
            "Short promotional video (60 sec)",
            "Menu design consultation",
            "Ongoing social content (monthly)",
          ],
          buttonText: "Contact Us",
          buttonLink: "/contact",
          highlight: false,
        },
      ],
      columns: 3,
      animation: "fade-in",
    },
  } as PricingTableComponent);

  // Testimonials
  components.push({
    id: id(),
    type: "testimonials",
    data: {
      heading: "What Restaurant Owners Say",
      style: "cards",
      autoplay: true,
      interval: 5000,
      items: [
        {
          text: "Our online orders increased 60% after updating our menu photos. The investment paid for itself in the first month!",
          author: "Maria Garcia",
          role: "Owner, La Cocina",
          avatar: "https://i.pravatar.cc/150?img=27",
          rating: 5,
        },
        {
          text: "These photos capture exactly what we're about. Our Instagram engagement has never been higher.",
          author: "James Park",
          role: "Chef/Owner, Fusion Kitchen",
          avatar: "https://i.pravatar.cc/150?img=33",
          rating: 5,
        },
        {
          text: "Professional, fast, and the photos are absolutely stunning. Customers constantly compliment our new menu.",
          author: "Lisa Thompson",
          role: "Manager, The Steakhouse",
          avatar: "https://i.pravatar.cc/150?img=24",
          rating: 5,
        },
      ],
    },
  } as TestimonialsComponent);

  // FAQ
  components.push({
    id: id(),
    type: "faq",
    data: {
      heading: "Common Questions",
      layout: "accordion",
      columns: 1,
      items: [
        {
          question: "Do I need to prepare the food?",
          answer: "We work with your kitchen team to prepare dishes. We can also bring a food stylist for more complex shots if needed.",
        },
        {
          question: "Can you shoot during business hours?",
          answer: "We prefer to shoot before opening or during slower periods to minimize disruption, but we're flexible to your needs.",
        },
        {
          question: "How many dishes can you photograph in one session?",
          answer: "Typically 8-12 dishes in a half-day session, or 20-30 in a full day. Complex presentations may require more time.",
        },
        {
          question: "Do you provide the props and backgrounds?",
          answer: "Yes! We bring a variety of plates, utensils, and backgrounds. We can also incorporate your branded items.",
        },
        {
          question: "Can you help with our social media strategy?",
          answer: "Absolutely. We can advise on content calendars and provide images optimized for each platform.",
        },
      ],
    },
  } as FAQComponent);

  // CTA Banner
  components.push({
    id: id(),
    type: "ctaBanner",
    data: {
      heading: "Ready to Make Your Menu Irresistible?",
      subheading: "Let's create mouthwatering photos that drive orders and reservations",
      primaryButtonText: "Book a Consultation",
      primaryButtonLink: "/contact",
      secondaryButtonText: "View Packages",
      secondaryButtonLink: "#pricing",
      backgroundColor: "#0f172a",
      textColor: "text-white",
      fullBleed: true,
    },
  } as CTABannerComponent);

  return components;
}

// Build SaaS Template
function buildSaaSTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Product & Brand Photography for SaaS Companies",
      subtitle: "Professional visuals that elevate your brand and convert visitors into customers",
      backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
      buttonText: "See Our Portfolio",
      buttonLink: "#gallery",
      secondaryButtonText: "Free Consultation",
      secondaryButtonLink: "/contact",
      alignment: "center",
      overlay: 60,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      fullBleed: true,
    },
  } as HeroComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Features Grid
  components.push({
    id: id(),
    type: "featuresGrid",
    data: {
      heading: "Complete Visual Content for SaaS Brands",
      subheading: "Everything you need to stand out in a crowded market",
      items: [
        {
          icon: "💼",
          title: "Team Portraits",
          description: "Professional headshots and team photos that build trust and credibility",
        },
        {
          icon: "🏢",
          title: "Office & Culture",
          description: "Showcase your workspace and company culture to attract top talent",
        },
        {
          icon: "🎯",
          title: "Product Screenshots",
          description: "High-quality UI/UX captures with professional editing and mockups",
        },
        {
          icon: "🎥",
          title: "Demo Videos",
          description: "Engaging product demos and explainer videos that drive conversions",
        },
        {
          icon: "📊",
          title: "Marketing Assets",
          description: "Custom graphics, hero images, and visual content for campaigns",
        },
        {
          icon: "🎤",
          title: "Event Coverage",
          description: "Professional photos and videos from conferences, launches, and webinars",
        },
      ],
      columns: 3,
      animation: "fade-in",
    },
  } as FeaturesGridComponent);

  // Gallery
  components.push({
    id: id(),
    type: "gallery",
    data: {
      heading: "Recent SaaS Projects",
      layout: "grid",
      columns: 3,
      showFilters: true,
      images: [
        { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop", alt: "Team collaboration", category: "Team" },
        { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop", alt: "Product demo", category: "Product" },
        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop", alt: "Modern office", category: "Office" },
        { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop", alt: "Conference speaker", category: "Events" },
        { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop", alt: "Professional headshot", category: "Team" },
        { url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop", alt: "Product interface", category: "Product" },
      ],
    },
  } as GalleryComponent);

  // Stats
  components.push({
    id: id(),
    type: "stats",
    data: {
      heading: "Results That Matter",
      items: [
        { value: 85, label: "Average Conversion Rate Increase", suffix: "%" },
        { value: 200, label: "SaaS Clients Served", suffix: "+" },
        { value: 4.9, label: "Client Satisfaction Rating", prefix: "", suffix: "/5" },
        { value: 10000, label: "Professional Images Delivered", suffix: "+" },
      ],
      columns: 4,
      animation: "count-up",
    },
  } as StatsComponent);

  // Trust Badges
  components.push({
    id: id(),
    type: "trustBadges",
    data: {
      heading: "Trusted by Leading SaaS Companies",
      layout: "grid",
      columns: 6,
      animation: "fade-in",
      badges: [
        { image: "https://via.placeholder.com/120x60/0ea5e9/ffffff?text=Slack", alt: "Slack", link: "" },
        { image: "https://via.placeholder.com/120x60/7c3aed/ffffff?text=Notion", alt: "Notion", link: "" },
        { image: "https://via.placeholder.com/120x60/10b981/ffffff?text=Zoom", alt: "Zoom", link: "" },
        { image: "https://via.placeholder.com/120x60/f59e0b/ffffff?text=Asana", alt: "Asana", link: "" },
        { image: "https://via.placeholder.com/120x60/ef4444/ffffff?text=Monday", alt: "Monday", link: "" },
        { image: "https://via.placeholder.com/120x60/6366f1/ffffff?text=Figma", alt: "Figma", link: "" },
      ],
    },
  } as TrustBadgesComponent);

  // Pricing
  components.push({
    id: id(),
    type: "pricingTable",
    data: {
      heading: "SaaS Photography Packages",
      subheading: "Scalable solutions for startups to enterprise",
      plans: [
        {
          name: "Startup",
          price: 500,
          period: "half-day session",
          features: [
            "Team headshots (up to 10)",
            "Office tour photos (15 images)",
            "Product screenshots (5 mockups)",
            "48-hour delivery",
            "Social media formats included",
            "Usage rights for marketing",
          ],
          buttonText: "Get Started",
          buttonLink: "/contact",
          highlight: false,
        },
        {
          name: "Growth",
          price: 1200,
          period: "full-day session",
          features: [
            "Team photos (up to 30 people)",
            "Complete office coverage (40 images)",
            "Product UI/UX captures (15 mockups)",
            "Culture & lifestyle shots",
            "Branded marketing assets",
            "Short demo video (30 sec)",
            "24-hour rush delivery",
            "Dedicated photo editor",
          ],
          buttonText: "Most Popular",
          buttonLink: "/contact",
          highlight: true,
        },
        {
          name: "Enterprise",
          price: 2500,
          period: "per month (retainer)",
          features: [
            "Unlimited team headshots",
            "Monthly office/event coverage",
            "Product photography & video",
            "Conference & trade show support",
            "Priority scheduling",
            "Ongoing content calendar",
            "Dedicated account manager",
            "Brand asset library access",
            "Custom video productions",
            "Multi-location coverage",
          ],
          buttonText: "Contact Sales",
          buttonLink: "/contact",
          highlight: false,
        },
      ],
      columns: 3,
      animation: "fade-in",
    },
  } as PricingTableComponent);

  // Testimonials
  components.push({
    id: id(),
    type: "testimonials",
    data: {
      heading: "What SaaS Leaders Say",
      style: "cards",
      autoplay: true,
      interval: 5000,
      items: [
        {
          text: "The team photos and product shots elevated our entire brand. Our demo-to-trial conversion rate increased by 45%!",
          author: "Alex Turner",
          role: "CMO, CloudSync",
          avatar: "https://i.pravatar.cc/150?img=60",
          rating: 5,
        },
        {
          text: "Professional, creative, and they really understand the SaaS space. Our website looks incredible now.",
          author: "Rachel Kim",
          role: "VP Marketing, DataFlow",
          avatar: "https://i.pravatar.cc/150?img=45",
          rating: 5,
        },
        {
          text: "We've worked with them for 2 years on a retainer. Consistent quality and they're always available when we need coverage.",
          author: "David Chen",
          role: "Head of Brand, TechStart",
          avatar: "https://i.pravatar.cc/150?img=51",
          rating: 5,
        },
      ],
    },
  } as TestimonialsComponent);

  // FAQ
  components.push({
    id: id(),
    type: "faq",
    data: {
      heading: "Frequently Asked Questions",
      layout: "accordion",
      columns: 1,
      items: [
        {
          question: "Do you sign NDAs?",
          answer: "Absolutely. We regularly work under NDA and understand the need for confidentiality with unreleased products.",
        },
        {
          question: "Can you shoot at multiple office locations?",
          answer: "Yes! We offer multi-location packages and can coordinate shoots across different offices or countries.",
        },
        {
          question: "What if our team is remote?",
          answer: "We can work with individual team members remotely, or schedule shoots when the team gathers for events or offsites.",
        },
        {
          question: "Do you help with product screenshots and UI design?",
          answer: "Yes. We work with your design team to capture and enhance product interfaces with professional lighting and editing.",
        },
        {
          question: "Can you attend our conferences and trade shows?",
          answer: "Definitely. Event coverage is included in our Growth and Enterprise packages, and available as an add-on for others.",
        },
      ],
    },
  } as FAQComponent);

  // CTA Banner
  components.push({
    id: id(),
    type: "ctaBanner",
    data: {
      heading: "Ready to Elevate Your SaaS Brand?",
      subheading: "Let's create professional visual content that drives growth and builds trust",
      primaryButtonText: "Schedule Consultation",
      primaryButtonLink: "/contact",
      secondaryButtonText: "View Case Studies",
      secondaryButtonLink: "#gallery",
      backgroundColor: "#0f172a",
      textColor: "text-white",
      fullBleed: true,
    },
  } as CTABannerComponent);

  return components;
}

// Build Interactive Quiz/Calculator Page
function buildQuizTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Find Your Perfect Photography Package",
      subtitle: "Answer a few questions to get a personalized recommendation",
      backgroundImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
      alignment: "center",
      overlay: 60,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      fullBleed: true,
    },
  } as HeroComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "md" },
  } as SpacerComponent);

  // Quiz
  components.push({
    id: id(),
    type: "quiz",
    data: {
      heading: "Photography Package Quiz",
      description: "Answer these quick questions to find your ideal package",
      questions: [
        {
          id: "q1",
          question: "What type of session are you interested in?",
          options: [
            { id: "wedding", label: "Wedding Photography" },
            { id: "portrait", label: "Portrait/Family Session" },
            { id: "event", label: "Event Coverage" },
            { id: "commercial", label: "Commercial/Brand Photos" },
          ],
        },
        {
          id: "q2",
          question: "How long do you need the photographer?",
          options: [
            { id: "30min", label: "30 minutes or less" },
            { id: "1hr", label: "1 hour" },
            { id: "2hr", label: "2-3 hours" },
            { id: "full", label: "Full day (4+ hours)" },
          ],
        },
        {
          id: "q3",
          question: "What's your budget range?",
          options: [
            { id: "budget", label: "Under $200" },
            { id: "mid", label: "$200-$500" },
            { id: "premium", label: "$500-$1000" },
            { id: "luxury", label: "$1000+" },
          ],
        },
      ],
    },
  } as QuizComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Calculator
  components.push({
    id: id(),
    type: "calculator",
    data: {
      heading: "Estimate Your Project Cost",
      description: "Customize your package to get an instant quote",
      basePrice: 199,
      fields: [
        { id: "hours", label: "Session Length (hours)", type: "number", value: 1, pricePerUnit: 150 },
        { id: "locations", label: "Number of Locations", type: "number", value: 1, pricePerUnit: 75 },
        { id: "photos", label: "Edited Photos", type: "number", value: 10, pricePerUnit: 5 },
        { id: "prints", label: "Include Prints", type: "checkbox", value: false, price: 99 },
        { id: "rush", label: "Rush Delivery (24hr)", type: "checkbox", value: false, price: 150 },
      ],
      showBreakdown: true,
    },
  } as CalculatorComponent);

  // CTA
  components.push({
    id: id(),
    type: "ctaBanner",
    data: {
      heading: "Ready to Book?",
      subheading: "Let's discuss your project and finalize the details",
      primaryButtonText: "Get Started",
      primaryButtonLink: "/book-a-session",
      secondaryButtonText: "Contact Us",
      secondaryButtonLink: "/contact",
      backgroundColor: "#0f172a",
      textColor: "text-white",
      fullBleed: true,
    },
  } as CTABannerComponent);

  return components;
}

// Build Event/Wedding Info Page
function buildEventInfoTemplate(): PageComponent[] {
  const id = () =>
    `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const components: PageComponent[] = [];

  // Hero
  components.push({
    id: id(),
    type: "hero",
    data: {
      title: "Wedding & Event Photography",
      subtitle: "Timeless memories captured with artistic excellence",
      backgroundImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop",
      buttonText: "Check Availability",
      buttonLink: "/book-a-session",
      alignment: "center",
      overlay: 50,
      titleColor: "text-white",
      subtitleColor: "text-amber-50",
      buttonStyle: "primary",
      fullBleed: true,
    },
  } as HeroComponent);

  // Timeline
  components.push({
    id: id(),
    type: "timeline",
    data: {
      heading: "Our Wedding Day Process",
      orientation: "vertical",
      style: "default",
      animation: "fade-in",
      events: [
        { id: id(), date: "6-12 Months Before", icon: "💍", title: "Initial Consultation", description: "We meet to discuss your vision, timeline, and package options." },
        { id: id(), date: "2-3 Months Before", icon: "📋", title: "Planning Session", description: "Finalize shot list, timeline, and location details." },
        { id: id(), date: "1 Month Before", icon: "📸", title: "Engagement Shoot", description: "Optional engagement session included in most packages." },
        { id: id(), date: "Wedding Day", icon: "🎉", title: "Full Coverage", description: "We capture every moment from prep to reception." },
        { id: id(), date: "48 Hours After", icon: "🖼️", title: "Sneak Peek", description: "Receive a preview of 10-15 favorite shots." },
        { id: id(), date: "4-6 Weeks After", icon: "📱", title: "Full Gallery", description: "Your complete gallery delivered via online platform." },
      ],
    },
  } as TimelineComponent);

  components.push({
    id: id(),
    type: "spacer",
    data: { height: "lg" },
  } as SpacerComponent);

  // Comparison Table
  components.push({
    id: id(),
    type: "comparisonTable",
    data: {
      heading: "Wedding Package Comparison",
      style: "default",
      plans: [
        { id: id(), name: "Essential", featured: false },
        { id: id(), name: "Premium", featured: true },
        { id: id(), name: "Luxury", featured: false },
      ],
      features: [
        { id: id(), name: "Coverage Hours", values: ["4 hours", "8 hours", "Full Day"] },
        { id: id(), name: "Photographers", values: ["1", "2", "2"] },
        { id: id(), name: "Edited Photos", values: ["200+", "400+", "600+"] },
        { id: id(), name: "Engagement Session", values: ["❌", "✅", "✅"] },
        { id: id(), name: "Second Shooter", values: ["❌", "✅", "✅"] },
        { id: id(), name: "Online Gallery", values: ["✅", "✅", "✅"] },
        { id: id(), name: "Print Rights", values: ["✅", "✅", "✅"] },
        { id: id(), name: "Wedding Album", values: ["❌", "❌", "✅"] },
        { id: id(), name: "Price", values: ["$1,499", "$2,999", "$4,999"] },
      ],
    },
  } as ComparisonTableComponent);

  // Reviews
  components.push({
    id: id(),
    type: "reviews",
    data: {
      heading: "What Our Couples Say",
      source: "google",
      displayCount: 6,
      style: "card",
      showRating: true,
      reviews: [
        { id: "1", author: "Sarah & Mike", rating: 5, text: "Studio37 captured our wedding day perfectly! Every moment was beautifully documented.", avatar: "", date: "2025-10-15" },
        { id: "2", author: "Jennifer & Tom", rating: 5, text: "Professional, creative, and so easy to work with. Our photos are absolutely stunning!", avatar: "", date: "2025-09-22" },
        { id: "3", author: "Maria & James", rating: 5, text: "We couldn't be happier with our wedding photos. Worth every penny!", avatar: "", date: "2025-08-30" },
      ],
    },
  } as ReviewsComponent);

  // Bookings Ticker
  components.push({
    id: id(),
    type: "bookingsTicker",
    data: {
      position: "bottom-right",
      displayDuration: 5000,
      interval: 15000,
      bookings: [
        { name: "Sarah M.", service: "Wedding Photography", location: "Houston, TX", time: "2 hours ago" },
        { name: "Michael K.", service: "Engagement Session", location: "The Woodlands, TX", time: "5 hours ago" },
        { name: "Amanda R.", service: "Wedding Photography", location: "Tomball, TX", time: "1 day ago" },
      ],
    },
  } as BookingsTickerComponent);

  // Calendar Widget
  components.push({
    id: id(),
    type: "calendarWidget",
    data: {
      heading: "Check Our Availability",
      provider: "calendly",
      embedUrl: "https://calendly.com/studio37/wedding-consultation",
      style: "inline",
    },
  } as CalendarWidgetComponent);

  return components;
}

// Apply template to the current editor state and notify parent
function applyHomepageTemplate(this: void) {
  // This will be rebound in the component scope below
}

// Individual Component Renderers
function HeroRenderer({ data }: { data: HeroComponent["data"] }) {
  const buttonStyleClasses = {
    primary: "btn-primary",
    secondary:
      "btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30",
    outline: "border-2 border-white text-white hover:bg-white/10",
  };
  const anim = data.animation || "none";
  const animClass =
    anim === "fade-in"
      ? "animate-fadeIn"
      : anim === "slide-up"
      ? "animate-slideUp"
      : anim === "zoom"
      ? "animate-zoom"
      : "";
  const buttonHoverZoom =
    (data.buttonAnimation || "none") === "hover-zoom"
      ? "transition-transform duration-300 hover:scale-105"
      : "";
  const heightClasses = "min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh]";
  const overlap = data.overlapHeader ?? true;
  const overlapClasses = overlap ? "-mt-16 md:-mt-20 pt-16 md:pt-20" : "";

  return (
    <div className={`${overlapClasses}`}>
      <div
        className={`relative ${heightClasses} flex items-center justify-center text-white overflow-hidden ${animClass}`}
      >
        {data.backgroundImage && (
          <Image
            src={data.backgroundImage}
            alt=""
            fill
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0 bg-black/60"
          style={{
            backgroundColor: `rgba(0,0,0,${
              Math.min(Math.max(Number(data.overlay ?? 50), 0), 100) / 100
            })`,
          }}
        />
        <div className={`relative z-10 text-${data.alignment} max-w-4xl px-8`}>
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
              data.titleColor || "text-white"
            }`}
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
          <p
            className={`text-lg md:text-xl mb-6 ${
              data.subtitleColor || "text-amber-50"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subtitle }}
          />
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {data.buttonText && (
              <a
                href={data.buttonLink}
                className={`inline-block px-6 py-3 rounded-lg transition no-underline ${
                  buttonStyleClasses[data.buttonStyle || "primary"]
                } ${buttonHoverZoom}`}
              >
                {data.buttonText}
              </a>
            )}
            {data.secondaryButtonText && (
              <a
                href={data.secondaryButtonLink || "#"}
                className={`inline-block px-6 py-3 rounded-lg transition no-underline ${buttonStyleClasses.outline} ${buttonHoverZoom}`}
              >
                {data.secondaryButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextRenderer({ data }: { data: TextComponent["data"] }) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  };
  const anim = data.animation || "none";
  const animClass =
    anim === "fade-in"
      ? "animate-fadeIn"
      : anim === "slide-up"
      ? "animate-slideUp"
      : anim === "zoom"
      ? "animate-zoom"
      : "";

  return (
    <div
      className={`p-8 text-${data.alignment} ${
        sizeClasses[data.size]
      } ${animClass}`}
    >
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  );
}

function ImageRenderer({ data }: { data: ImageComponent["data"] }) {
  const widthClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "w-full",
  };

  const animationClasses = {
    none: "",
    "fade-in": "animate-fadeIn",
    "slide-up": "animate-slideUp",
    zoom: "animate-zoom",
    "hover-zoom": "transition-transform duration-300 hover:scale-105",
  };

  const imageElement = (
    <div className={`mx-auto ${widthClasses[data.width]}`}>
      {data.url && (
        <div
          className={`relative aspect-video ${
            animationClasses[data.animation || "none"]
          } overflow-hidden`}
        >
          <Image
            src={data.url}
            alt={data.alt}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      {data.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">{data.caption}</p>
      )}
    </div>
  );

  return (
    <div className="p-8">
      {data.link ? (
        <a href={data.link} className="block cursor-pointer">
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
    </div>
  );
}

function ButtonRenderer({ data }: { data: ButtonComponent["data"] }) {
  const styleClasses = {
    primary: "btn-primary",
    secondary:
      "btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
  };
  const anim = data.animation || "none";
  const animClass =
    anim === "fade-in"
      ? "animate-fadeIn"
      : anim === "slide-up"
      ? "animate-slideUp"
      : anim === "zoom"
      ? "animate-zoom"
      : "";
  const hoverZoom =
    anim === "hover-zoom"
      ? "transition-transform duration-300 hover:scale-105"
      : "";
  return (
    <div className={`p-8 text-${data.alignment} ${animClass}`}>
      <a
        href={data.link}
        className={`inline-block px-6 py-3 rounded-lg transition no-underline ${
          styleClasses[data.style]
        } ${hoverZoom}`}
      >
        {data.text}
      </a>
    </div>
  );
}

function ColumnsRenderer({ data }: { data: ColumnsComponent["data"] }) {
  const count = Math.min(Math.max(data.columns.length || 2, 1), 4);
  const gridClass =
    count === 1
      ? "grid-cols-1"
      : count === 2
      ? "grid-cols-2"
      : count === 3
      ? "grid-cols-3"
      : "grid-cols-4";
  const anim = data.animation || "none";
  const animClass =
    anim === "fade-in"
      ? "animate-fadeIn"
      : anim === "slide-up"
      ? "animate-slideUp"
      : anim === "zoom"
      ? "animate-zoom"
      : "";
  return (
    <div className={`p-8 ${animClass}`}>
      <div className={`grid ${gridClass} gap-6`}>
        {data.columns.map((col, i) => (
          <div key={i} className="space-y-4">
            {col.image && (
              <div className="relative aspect-video">
                <Image
                  src={col.image}
                  alt=""
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: col.content }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SpacerRenderer({ data }: { data: SpacerComponent["data"] }) {
  const heights = {
    sm: "h-8",
    md: "h-16",
    lg: "h-24",
    xl: "h-32",
  };

  return <div className={heights[data.height]} />;
}

function SEOFooterRenderer({ data }: { data: SEOFooterComponent["data"] }) {
  return (
    <footer className="p-8 bg-gray-50 border-t">
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
      <p className="text-xs text-gray-500 mt-3">SEO footer preview</p>
    </footer>
  );
}

// Badges Renderer (Editor Preview)
function BadgesRenderer({ data }: { data: BadgesComponent["data"] }) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };
  const containerAlign = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const Icon = ({
    name,
    className,
  }: {
    name: BadgesComponent["data"]["badges"][number]["icon"];
    className?: string;
  }) => {
    const cls = className || "h-4 w-4";
    switch (name) {
      case "star":
      case "yelp":
      case "google":
        return (
          <svg
            className={cls}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        );
      case "thumbtack":
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14 2l8 8-5.5 1.5L10.5 17 7 13.5l5.5-6.5L14 2z" />
          </svg>
        );
      case "shield":
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2l7 3v6c0 5.55-3.84 10.74-7 12-3.16-1.26-7-6.45-7-12V5l7-3z" />
            <path
              d="M10 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      case "camera":
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9 3l2 2h2l2-2h3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4z" />
            <circle cx="12" cy="13" r="4" fill="currentColor" />
          </svg>
        );
      case "check":
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const badgeBase =
    data.style === "solid"
      ? "bg-primary-600 text-white"
      : data.style === "outline"
      ? "border border-gray-300 text-gray-800 bg-white"
      : "bg-white/90 border border-gray-200 text-gray-800 rounded-full";

  return (
    <div
      className={`p-6 ${
        data.animation === "fade-in"
          ? "animate-fadeIn"
          : data.animation === "slide-up"
          ? "animate-slideUp"
          : data.animation === "zoom"
          ? "animate-zoom"
          : ""
      }`}
    >
      <div
        className={`flex flex-wrap gap-2 ${
          containerAlign[data.alignment || "center"]
        }`}
      >
        {(data.badges || []).map((b, i) => {
          const styleColor =
            b.color && b.color.startsWith("#")
              ? ({ color: b.color } as React.CSSProperties)
              : undefined;
          const colorClass =
            b.color && b.color.startsWith("text-") ? b.color : "";
          const content = (
            <span
              className={`inline-flex items-center gap-2 ${
                sizeClasses[data.size || "md"]
              } ${badgeBase}`}
            >
              <span
                className={`inline-flex items-center ${colorClass}`}
                style={styleColor}
              >
                <Icon name={b.icon} />
              </span>
              <span className="font-medium">{b.label}</span>
              {b.sublabel && (
                <span className="text-xs opacity-80">{b.sublabel}</span>
              )}
            </span>
          );
          return b.href ? (
            <a
              key={i}
              href={b.href}
              className="no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          ) : (
            <span key={i}>{content}</span>
          );
        })}
      </div>
    </div>
  );
}

// Services Grid Renderer (Editor Preview)
function ServicesGridRenderer({
  data,
}: {
  data: ServicesGridComponent["data"];
}) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`p-8 ${
        data.animation === "fade-in"
          ? "animate-fadeIn"
          : data.animation === "slide-up"
          ? "animate-slideUp"
          : data.animation === "zoom"
          ? "animate-zoom"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {data.heading}
            </h2>
            {data.subheading && (
              <p className="text-lg text-gray-600">{data.subheading}</p>
            )}
          </div>
        )}
        <div
          className={`grid grid-cols-1 ${gridCols[data.columns || 3]} gap-6`}
        >
          {(data.services || []).map((service, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {service.image && (
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-gray-600 mb-4">{service.description}</p>
                )}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2">
                    {service.features.map((feature, fi) => (
                      <li
                        key={fi}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <svg
                          className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stats Renderer (Editor Preview)
function StatsRenderer({ data }: { data: StatsComponent["data"] }) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  const styleClasses = {
    default: "",
    cards: "bg-white rounded-lg shadow-md p-6",
    minimal: "border-b border-gray-200 pb-4",
    "inline-badges": "",
  };

  // Inline badges layout
  if (data.style === "inline-badges") {
    return (
      <div
        className={`p-8 ${
          data.animation === "fade-in"
            ? "animate-fadeIn"
            : data.animation === "slide-up"
            ? "animate-slideUp"
            : data.animation === "zoom"
            ? "animate-zoom"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {data.heading && (
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
              {data.heading}
            </h2>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {(data.stats || []).map((stat, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full"
              >
                {stat.icon && <span className="text-xl">{stat.icon}</span>}
                <span className="font-semibold text-gray-900">
                  {stat.number}
                  {stat.suffix || ""}
                </span>
                <span className="text-gray-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-8 ${
        data.animation === "fade-in"
          ? "animate-fadeIn"
          : data.animation === "slide-up"
          ? "animate-slideUp"
          : data.animation === "zoom"
          ? "animate-zoom"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {data.heading}
          </h2>
        )}
        <div
          className={`grid grid-cols-1 ${gridCols[data.columns || 3]} gap-6`}
        >
          {(data.stats || []).map((stat, i) => (
            <div
              key={i}
              className={`text-center ${styleClasses[data.style || "default"]}`}
            >
              {stat.icon && <div className="text-4xl mb-3">{stat.icon}</div>}
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
                {stat.suffix || ""}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// CTA Banner Renderer (Editor Preview)
function CTABannerRenderer({ data }: { data: CTABannerComponent["data"] }) {
  const overlayAlpha =
    Math.min(Math.max(Number(data.overlay ?? 60), 0), 100) / 100;
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";

  return (
    <div
      className={`relative min-h-[300px] flex items-center justify-center overflow-hidden ${
        data.fullBleed ? "" : "rounded-lg"
      } ${animClass}`}
    >
      {data.backgroundImage && (
        <Image
          src={data.backgroundImage}
          alt="CTA Background"
          fill
          className="object-cover"
        />
      )}
      {!data.backgroundImage && data.backgroundColor && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: data.backgroundColor }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
      />
      <div className={`relative z-10 max-w-4xl w-full px-6 text-center py-12`}>
        {data.heading && (
          <h2
            className={`text-3xl md:text-4xl font-bold mb-3 ${
              data.textColor || "text-white"
            }`}
          >
            {data.heading}
          </h2>
        )}
        {data.subheading && (
          <p
            className={`text-lg md:text-xl mb-6 opacity-90 ${
              data.textColor || "text-white"
            }`}
          >
            {data.subheading}
          </p>
        )}
        {(data.primaryButtonText || data.secondaryButtonText) && (
          <div className="flex flex-wrap gap-3 justify-center">
            {data.primaryButtonText && (
              <a
                href={data.primaryButtonLink || "#"}
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition no-underline"
              >
                {data.primaryButtonText}
              </a>
            )}
            {data.secondaryButtonText && (
              <a
                href={data.secondaryButtonLink || "#"}
                className="inline-block px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition no-underline"
              >
                {data.secondaryButtonText}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Icon Features Renderer (Editor Preview)
function IconFeaturesRenderer({
  data,
}: {
  data: IconFeaturesComponent["data"];
}) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";

  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {data.heading}
            </h2>
            {data.subheading && (
              <p className="text-lg text-gray-600">{data.subheading}</p>
            )}
          </div>
        )}
        <div
          className={`grid grid-cols-1 ${gridCols[data.columns || 3]} gap-6`}
        >
          {(data.features || []).map((feature, i) => (
            <div key={i} className="text-center p-6">
              {feature.icon && (
                <div className="text-5xl mb-4">{feature.icon}</div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Logo Renderer (Editor Preview)
function LogoRenderer({ data }: { data: LogoComponent["data"] }) {
  const sizeMap: Record<string, string> = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
    "2xl": "text-6xl md:text-7xl",
  };
  const alignMap: Record<string, string> = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right",
  };
  const anim =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";

  const content = (
    <div className={`flex items-center gap-3 ${sizeMap[data.size || "md"]}`}>
      {data.mode === "image" && data.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.imageUrl}
          alt={data.text || "Logo"}
          className="w-auto object-contain"
          style={{ height: data.imageHeightPx ? `${data.imageHeightPx}px` : undefined }}
        />
      ) : (
        <div className="flex items-center gap-2">
          {data.showCamera && (
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill={data.accentColor || "#b46e14"}
              aria-hidden="true"
            >
              <path d="M9 3l2 2h2l2-2h3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4z" />
              <circle cx="12" cy="13" r="4" fill="currentColor" />
            </svg>
          )}
          <div>
            <div
              className="font-serif font-bold leading-none"
              style={{ color: data.color || "#111827", fontSize: data.fontSizePx ? `${data.fontSizePx}px` : undefined }}
            >
              {data.text || "Studio 37"}
            </div>
            {data.subtext && (
              <div
                className="text-sm tracking-wide"
                style={{ color: data.accentColor || "#b46e14" }}
              >
                {data.subtext}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const wrapped = data.link ? (
    <a href={data.link} className="no-underline">
      {content}
    </a>
  ) : (
    content
  );

  return (
    <div className={`p-4 ${anim}`}>
      <div className={`flex ${alignMap[data.alignment || "left"]}`}>
        {wrapped}
      </div>
    </div>
  );
}

// Contact Form Renderer (Editor Preview)
function ContactFormRenderer({ data }: { data: ContactFormComponent["data"] }) {
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";
  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-3xl mx-auto">
        {(data.heading || data.subheading) && (
          <div className="text-center mb-6">
            {data.heading && (
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p className="text-gray-600">{data.subheading}</p>
            )}
          </div>
        )}
        <div className="bg-gray-50 border rounded-lg p-6 text-gray-600">
          <div className="text-sm mb-3">Contact form preview</div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border rounded px-3 py-2"
              placeholder="Full Name"
              disabled
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Email"
              disabled
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Phone"
              disabled
            />
            <select className="border rounded px-3 py-2" disabled>
              <option>Service Interest</option>
            </select>
            <select className="border rounded px-3 py-2" disabled>
              <option>Budget Range</option>
            </select>
            <input
              className="border rounded px-3 py-2"
              placeholder="Event Date"
              disabled
            />
          </div>
          <textarea
            className="border rounded px-3 py-2 mt-4 w-full"
            placeholder="Message"
            rows={3}
            disabled
          />
          <button
            className="btn-primary mt-4 opacity-60 cursor-not-allowed"
            disabled
          >
            Get Your Quote
          </button>
        </div>
      </div>
    </div>
  );
}

// Newsletter Renderer (Editor Preview)
function NewsletterRenderer({ data }: { data: NewsletterComponent["data"] }) {
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";
  const wrapperClass =
    data.style === "banner"
      ? "bg-primary-50 border-primary-200"
      : "bg-white border-gray-200";
  return (
    <div className={`p-8 ${animClass}`}>
      <div
        className={`max-w-3xl mx-auto border rounded-xl p-6 ${wrapperClass}`}
      >
        {(data.heading || data.subheading) && (
          <div className="text-center mb-6">
            {data.heading && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p className="text-gray-600">{data.subheading}</p>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Full Name"
            disabled
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            disabled
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            disabled
          />
        </div>
        <button
          className="btn-primary mt-4 opacity-60 cursor-not-allowed"
          disabled
        >
          Subscribe
        </button>
        {data.disclaimer && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {data.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}

// FAQ Renderer (Editor Preview)
function FAQRenderer({ data }: { data: FAQComponent["data"] }) {
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";
  const gridCols =
    (data.columns || 1) === 2 ? "md:grid-cols-2" : "md:grid-cols-1";
  const items = data.items || [];
  const mid = Math.ceil(items.length / (data.columns || 1));
  const col1 = items.slice(0, (data.columns || 1) === 2 ? mid : items.length);
  const col2 = (data.columns || 1) === 2 ? items.slice(mid) : [];
  const renderCol = (arr: typeof items) => (
    <div className="space-y-3">
      {arr.map((qa, i) => (
        <details key={i} className="group bg-white border rounded-lg p-4">
          <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
            <span>{qa.question}</span>
            <span className="ml-4 text-gray-400 group-open:rotate-180 transition">
              ⌄
            </span>
          </summary>
          <div className="mt-2 text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: qa.answer }} />
          </div>
        </details>
      ))}
    </div>
  );
  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-5xl mx-auto">
        {data.heading && (
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {data.heading}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {renderCol(col1)}
          {col2.length > 0 && renderCol(col2)}
        </div>
      </div>
    </div>
  );
}

// Pricing Table Renderer (Editor Preview)
function PricingTableRenderer({
  data,
}: {
  data: PricingTableComponent["data"];
}) {
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[data.columns || 3];
  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {(data.heading || data.subheading) && (
          <div className="text-center mb-8">
            {data.heading && (
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p className="text-lg text-gray-600">{data.subheading}</p>
            )}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {(data.plans || []).map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl border ${
                plan.highlight
                  ? "border-primary-300 ring-1 ring-primary-200 bg-primary-50/30"
                  : "border-gray-200 bg-white"
              } p-6 flex flex-col`}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {plan.title}
                </h3>
                <div className="mt-2 text-3xl font-extrabold text-gray-900">
                  {plan.price}{" "}
                  {plan.period && (
                    <span className="text-sm text-gray-500 font-medium">
                      / {plan.period}
                    </span>
                  )}
                </div>
              </div>
              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {plan.features.map((f, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      {(data.showFeatureChecks ?? true) && (
                        <svg
                          className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {plan.ctaText && (
                <a
                  href={plan.ctaLink || "#"}
                  className={`mt-auto inline-block px-5 py-2 rounded-lg text-center no-underline ${
                    plan.highlight
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "border border-primary-600 text-primary-700 hover:bg-primary-50"
                  }`}
                >
                  {plan.ctaText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Team Members Renderer
function TeamMembersRenderer({ data }: { data: TeamMembersComponent["data"] }) {
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[data.columns || 2];
  return (
    <div className={`p-8 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {(data.heading || data.subheading) && (
          <div className="text-center mb-8">
            {data.heading && (
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p className="text-lg text-gray-600">{data.subheading}</p>
            )}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {(data.members || []).map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square w-full overflow-hidden bg-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-primary-600 font-medium mb-3">
                  {member.title}
                </p>
                <p className="text-gray-700 mb-4">{member.bio}</p>
                {member.expertise && member.expertise.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {member.expertise.map((item, ei) => (
                      <li
                        key={ei}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-primary-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {member.social && (
                  <div className="flex gap-3">
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Social Feed Renderer
function SocialFeedRenderer({ data }: { data: SocialFeedComponent["data"] }) {
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[data.columns || 3];
  return (
    <div className={`p-8 bg-gray-50 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{data.heading}</h2>
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {(data.posts || []).slice(0, data.limit || 6).map((post, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square w-full overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={`Post ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {post.avatar && (
                    <img
                      src={post.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div className="text-sm">
                    <div className="font-semibold">
                      {data.username || "@studio37photography"}
                    </div>
                    {post.timestamp && (
                      <div className="text-gray-500 text-xs">
                        {post.timestamp}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {post.caption}
                </p>
                {data.showEngagement && (post.likes || post.comments) && (
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {post.likes && (
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span>{post.likes}</span>
                      </div>
                    )}
                    {post.comments && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                    )}
                  </div>
                )}
                {post.location && (
                  <div className="text-xs text-gray-500 mt-2">
                    📍 {post.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dual CTA Renderer
function DualCTARenderer({ data }: { data: DualCTAComponent["data"] }) {
  const animClass =
    data.animation === "fade-in"
      ? "animate-fadeIn"
      : data.animation === "slide-up"
      ? "animate-slideUp"
      : data.animation === "zoom"
      ? "animate-zoom"
      : "";
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[data.alignment || "center"];
  const bgStyle = data.backgroundColor
    ? { backgroundColor: data.backgroundColor }
    : {};
  return (
    <div className={`p-12 ${animClass}`} style={bgStyle}>
      <div className={`max-w-4xl mx-auto ${alignClass}`}>
        {data.heading && (
          <h2
            className={`text-3xl font-bold mb-3 ${
              data.textColor || "text-gray-900"
            }`}
          >
            {data.heading}
          </h2>
        )}
        {data.subheading && (
          <p className={`text-lg mb-6 ${data.textColor || "text-gray-700"}`}>
            {data.subheading}
          </p>
        )}
        <div
          className={`flex gap-4 ${
            data.alignment === "center"
              ? "justify-center"
              : data.alignment === "right"
              ? "justify-end"
              : ""
          }`}
        >
          <a
            href={data.primaryButtonLink || "#"}
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition no-underline font-medium"
          >
            {data.primaryButtonText}
          </a>
          <a
            href={data.secondaryButtonLink || "#"}
            className="inline-block px-6 py-3 border-2 border-primary-600 text-primary-700 rounded-lg hover:bg-primary-50 transition no-underline font-medium"
          >
            {data.secondaryButtonText}
          </a>
        </div>
      </div>
    </div>
  );
}

// Slideshow Hero Renderer (Editor Preview)
function SlideshowHeroRenderer({
  data,
}: {
  data: SlideshowHeroComponent["data"];
}) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!data.slides || data.slides.length < 2) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % data.slides.length),
      Math.max(1500, data.intervalMs || 5000)
    );
    return () => clearInterval(id);
  }, [data.slides?.length, data.intervalMs]);
  const slide = data.slides?.[idx];
  const overlayAlpha =
    Math.min(Math.max(Number(data.overlay ?? 60), 0), 100) / 100;
  const buttonStyleClasses: Record<string, string> = {
    primary: "btn-primary",
    secondary:
      "btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30",
    outline: "border-2 border-white text-white hover:bg-white/10",
  };
  const hoverZoom =
    (data.buttonAnimation || "none") === "hover-zoom"
      ? "transition-transform duration-300 hover:scale-105"
      : "";
  return (
    <div
      className={`relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden ${
        data.fullBleed ? "" : "rounded-lg"
      }`}
    >
      {slide && (
        <Image
          src={slide.image}
          alt={slide.title || "Slide"}
          fill
          className="object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
      />
      <div
        className={`relative z-10 max-w-4xl w-full px-6 text-${
          data.alignment || "center"
        }`}
      >
        {data.title && (
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${
              data.titleColor || "text-white"
            }`}
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
        )}
        {data.subtitle && (
          <p
            className={`text-lg md:text-xl mb-6 opacity-90 ${
              data.subtitleColor || "text-amber-50"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subtitle }}
          />
        )}
        {data.buttonText && (
          <a
            href={data.buttonLink || "#"}
            className={`inline-block px-6 py-3 rounded-lg transition no-underline ${
              buttonStyleClasses[data.buttonStyle || "primary"]
            } ${hoverZoom}`}
          >
            {data.buttonText}
          </a>
        )}
        {slide?.category && (
          <div className="mt-3 text-sm opacity-80">{slide.category}</div>
        )}
      </div>
    </div>
  );
}

// Testimonials Renderer (Editor Preview)
function TestimonialsRenderer({
  data,
}: {
  data: TestimonialsComponent["data"];
}) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!data.testimonials || data.testimonials.length < 2) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % data.testimonials.length),
      5000
    );
    return () => clearInterval(id);
  }, [data.testimonials?.length]);
  const t = data.testimonials?.[idx];
  return (
    <div
      className={`p-8 ${
        data.animation === "fade-in"
          ? "animate-fadeIn"
          : data.animation === "slide-up"
          ? "animate-slideUp"
          : data.animation === "zoom"
          ? "animate-zoom"
          : ""
      }`}
    >
      <div className="max-w-3xl mx-auto text-center">
        {t?.avatar && (
          <img
            src={t.avatar}
            alt={t.author || "Client"}
            className="mx-auto h-16 w-16 rounded-full object-cover mb-4"
          />
        )}
        {t?.quote && (
          <blockquote className="text-xl italic text-gray-800">
            "{t.quote}"
          </blockquote>
        )}
        {(t?.author || t?.subtext) && (
          <div className="mt-3 text-gray-600">
            {t?.author && <div className="font-medium">{t.author}</div>}
            {t?.subtext && (
              <div className="text-sm opacity-80">{t.subtext}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Gallery Highlights Renderer (Editor Preview)
function GalleryHighlightsRenderer({
  data,
}: {
  data: GalleryHighlightsComponent["data"];
}) {
  return (
    <div
      className={`p-8 ${
        data.animation === "fade-in"
          ? "animate-fadeIn"
          : data.animation === "slide-up"
          ? "animate-slideUp"
          : data.animation === "zoom"
          ? "animate-zoom"
          : ""
      }`}
    >
      <div className="border rounded-lg p-6 bg-gray-50">
        <h4 className="font-semibold mb-2">Gallery Highlights (Preview)</h4>
        <p className="text-sm text-gray-600">
          This will show featured images from the database when published.
        </p>
        <div className="mt-3 text-sm">
          <div>
            <span className="font-medium">Categories:</span>{" "}
            {data.categories?.length ? data.categories.join(", ") : "All"}
          </div>
          <div>
            <span className="font-medium">Featured only:</span>{" "}
            {String(data.featuredOnly ?? true)}
          </div>
          <div>
            <span className="font-medium">Limit:</span> {data.limit || 6}
          </div>
          {data.collections && (
            <div>
              <span className="font-medium">Collections:</span>{" "}
              {data.collections.length ? data.collections.join(", ") : "Any"}
            </div>
          )}
          {data.tags && (
            <div>
              <span className="font-medium">Tags:</span>{" "}
              {data.tags.length ? data.tags.join(", ") : "Any"}
            </div>
          )}
          {typeof data.limitPerCategory === "number" &&
            data.limitPerCategory > 0 && (
              <div>
                <span className="font-medium">Limit per category:</span>{" "}
                {data.limitPerCategory}
              </div>
            )}
          <div>
            <span className="font-medium">Group:</span> {data.group || "—"}
          </div>
          <div>
            <span className="font-medium">Sort:</span>{" "}
            {data.sortBy || "display_order"} · {data.sortDir || "asc"}
          </div>
        </div>
      </div>
    </div>
  );
}

// Widget Embed Renderer (Editor Preview)
function WidgetEmbedRenderer({ data }: { data: WidgetEmbedComponent["data"] }) {
  return (
    <div className="p-6">
      <div className="border rounded-lg p-6 bg-gray-50">
        <h4 className="font-semibold mb-2">
          {data.provider
            ? `${data.provider[0].toUpperCase()}${data.provider.slice(1)}`
            : "Custom"}{" "}
          Widget
        </h4>
        <p className="text-sm text-gray-600">
          Preview only. Third-party scripts run on the published page.
        </p>
        <div className="mt-3 text-xs text-gray-500">
          <div>Scripts: {data.scriptSrcs?.length || 0}</div>
          <div>Style reset: {String(data.styleReset ?? true)}</div>
        </div>
        <div className="mt-3 text-xs text-gray-500 line-clamp-3">
          {(data.html || "").slice(0, 200) || "<no html>"}
        </div>
      </div>
    </div>
  );
}

// Logo Properties
function LogoProperties({
  data,
  onUpdate,
}: {
  data: LogoComponent["data"];
  onUpdate: (d: any) => void;
}) {
  const [logoPreviewBg, setLogoPreviewBg] = React.useState<string>("#0f172a");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Mode</label>
          <select
            value={data.mode}
            onChange={(e) => onUpdate({ mode: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="svg">SVG Wordmark</option>
            <option value="image">Image URL</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <select
            value={data.size || "md"}
            onChange={(e) => onUpdate({ size: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">XL</option>
            <option value="2xl">2XL</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment || "left"}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {data.mode === "image" ? (
        <div>
          <label className="block text-sm font-medium mb-1">
            Logo Image URL
          </label>
          <input
            type="url"
            value={data.imageUrl || ""}
            onChange={(e) => onUpdate({ imageUrl: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="https://res.cloudinary.com/.../logo.png"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload to Cloudinary and paste the URL here.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium mb-1">Image Height (px)</label>
              <input
                type="number"
                min={16}
                max={256}
                value={Number(data.imageHeightPx ?? 64)}
                onChange={(e) => onUpdate({ imageHeightPx: Number(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Text</label>
              <input
                type="text"
                value={data.text || ""}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtext</label>
              <input
                type="text"
                value={data.subtext || ""}
                onChange={(e) => onUpdate({ subtext: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Photography"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Text Color
              </label>
              <input
                type="text"
                value={data.color || ""}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="#111827"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Accent Color
              </label>
              <input
                type="text"
                value={data.accentColor || ""}
                onChange={(e) => onUpdate({ accentColor: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="#b46e14"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Font Size (px)</label>
            <input
              type="number"
              min={16}
              max={128}
              value={Number(data.fontSizePx ?? 0)}
              onChange={(e) => onUpdate({ fontSizePx: Number(e.target.value) || undefined })}
              className="w-full border rounded px-3 py-2"
              placeholder="Leave empty to use size preset"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="showCamera"
              type="checkbox"
              checked={!!data.showCamera}
              onChange={(e) => onUpdate({ showCamera: e.target.checked })}
            />
            <label htmlFor="showCamera" className="text-sm">
              Show camera icon
            </label>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Link (optional)
        </label>
        <input
          type="url"
          value={data.link || ""}
          onChange={(e) => onUpdate({ link: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="/ or https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "none"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      {/* Live Preview (not saved) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Preview (not saved)</h4>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
              onClick={() => setLogoPreviewBg("#0f172a")}
              title="Dark preset"
            >
              Dark
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
              onClick={() => setLogoPreviewBg("#ffffff")}
              title="Light preset"
            >
              Light
            </button>
            <label className="inline-flex items-center gap-2 text-xs">
              <span>Bg</span>
              <input
                type="color"
                value={logoPreviewBg}
                onChange={(e) => setLogoPreviewBg(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-6" style={{ background: logoPreviewBg }}>
            {/* Reuse the editor renderer to guarantee parity */}
            <LogoRenderer data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Container Properties
function ContainerProperties({
  data,
  onUpdate,
}: {
  data: ContainerComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={data.backgroundColor || "#ffffff"}
          onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          className="w-full border rounded px-3 py-2 h-10"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <select
          value={data.padding || "md"}
          onChange={(e) => onUpdate({ padding: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Max Width</label>
        <select
          value={data.maxWidth || "container"}
          onChange={(e) => onUpdate({ maxWidth: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="full">Full Width</option>
          <option value="container">Container (1280px)</option>
          <option value="narrow">Narrow (896px)</option>
        </select>
      </div>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
        <strong>Note:</strong> This container can hold nested components. Drag components into the container drop zone.
      </div>
    </div>
  );
}

// Accordion Properties
function AccordionProperties({
  data,
  onUpdate,
}: {
  data: AccordionComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addItem = () => {
    const newItem = {
      id: `acc-item-${Date.now()}`,
      title: "New Item",
      isOpen: false,
    };
    onUpdate({ items: [...(data.items || []), newItem] });
  };

  const removeItem = (id: string) => {
    onUpdate({ items: (data.items || []).filter(i => i.id !== id) });
  };

  const updateItem = (id: string, updates: any) => {
    onUpdate({
      items: (data.items || []).map(i => i.id === id ? { ...i, ...updates } : i),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="allow-multiple"
          checked={data.allowMultiple || false}
          onChange={(e) => onUpdate({ allowMultiple: e.target.checked })}
          className="h-4 w-4"
        />
        <label htmlFor="allow-multiple" className="text-sm">
          Allow multiple items open
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Items</label>
          <button
            onClick={addItem}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
        <div className="space-y-2">
          {(data.items || []).map(item => (
            <div key={item.id} className="border rounded p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(item.id, { title: e.target.value })}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  placeholder="Item title"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Drag components into this item's drop zone to add content
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tabs Properties
function TabsProperties({
  data,
  onUpdate,
}: {
  data: TabsComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addTab = () => {
    const newTab = {
      id: `tab-${Date.now()}`,
      label: "New Tab",
    };
    onUpdate({ tabs: [...(data.tabs || []), newTab] });
  };

  const removeTab = (id: string) => {
    onUpdate({ tabs: (data.tabs || []).filter(t => t.id !== id) });
  };

  const updateTab = (id: string, updates: any) => {
    onUpdate({
      tabs: (data.tabs || []).map(t => t.id === id ? { ...t, ...updates } : t),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tab Style</label>
        <select
          value={data.style || "underline"}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="underline">Underline</option>
          <option value="pills">Pills</option>
          <option value="boxed">Boxed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Tabs</label>
          <button
            onClick={addTab}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Tab
          </button>
        </div>
        <div className="space-y-2">
          {(data.tabs || []).map(tab => (
            <div key={tab.id} className="border rounded p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={tab.label}
                  onChange={(e) => updateTab(tab.id, { label: e.target.value })}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  placeholder="Tab label"
                />
                <button
                  onClick={() => removeTab(tab.id)}
                  className="ml-2 text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Drag components into this tab's drop zone to add content
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Generic Properties Editor for new components
function GenericProperties({
  component,
  onUpdate,
  fields,
}: {
  component: PageComponent;
  onUpdate: (data: any) => void;
  fields: string[];
}) {
  const handleFieldUpdate = (field: string, value: any) => {
    onUpdate({
      ...component.data,
      [field]: value,
    });
  };

  const renderField = (field: string) => {
    const value = (component.data as any)[field];
    const fieldType = typeof value;

    // Render field based on type
    if (fieldType === 'boolean') {
      return (
        <div key={field} className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldUpdate(field, e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </label>
        </div>
      );
    }

    if (fieldType === 'number') {
      return (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldUpdate(field, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      );
    }

    // String fields - check if it's likely a URL/image/color
    if (field.toLowerCase().includes('url') || field.toLowerCase().includes('image') || field.toLowerCase().includes('link')) {
      return (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => handleFieldUpdate(field, e.target.value)}
            placeholder={`Enter ${field.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      );
    }

    if (field.toLowerCase().includes('color')) {
      return (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleFieldUpdate(field, e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleFieldUpdate(field, e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      );
    }

    // Default to text input
    return (
      <div key={field} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {field.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleFieldUpdate(field, e.target.value)}
          placeholder={`Enter ${field.toLowerCase()}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-2">
        {component.type.replace(/([A-Z])/g, ' $1').trim()} Settings
      </div>
      {fields.map(renderField)}
    </div>
  );
}

// Component Properties Editor
function getQuickFieldsForType(type: PageComponent["type"]): string[] | null {
  switch (type) {
    case "hero":
      return ["title", "subtitle", "backgroundImage", "overlay", "buttonText", "buttonLink", "alignment"];
    case "text":
      return ["content", "alignment", "size"];
    case "image":
      return ["url", "alt", "caption", "link", "width", "animation"];
    case "button":
      return ["text", "link", "style", "alignment", "animation"];
    case "ctaBanner":
      return ["heading", "subheading", "primaryButtonText", "primaryButtonLink", "backgroundColor", "textColor", "overlay"];
    case "servicesGrid":
      return ["heading", "subheading", "columns", "animation"];
    case "pricingTable":
      return ["heading", "subheading", "columns", "style", "variant", "showFeatureChecks"];
    case "newsletterSignup":
      return ["heading", "subheading", "style"];
    case "countdown":
      return ["targetDate", "heading", "subheading", "showLabels", "size"];
    case "mapEmbed":
      return ["address", "zoom", "height", "mapType", "showMarker"];
    default:
      return null;
  }
}

// Simple wrapper to prevent updates from propagating immediately
const ComponentPropertiesWrapper = React.memo(function ComponentPropertiesWrapper({
  component,
  onUpdate,
  quickMode,
}: {
  component: PageComponent;
  onUpdate: (data: any) => void;
  quickMode?: boolean;
}) {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  
  // Wrap the onUpdate to prevent immediate propagation
  const debouncedUpdate = React.useCallback((data: any) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onUpdate(data), 0);
  }, [onUpdate]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ComponentPropertiesInner
      component={component}
      onUpdate={debouncedUpdate}
      quickMode={quickMode}
    />
  );
}, (prevProps, nextProps) => {
  // Only re-render if component ID changes
  return prevProps.component.id === nextProps.component.id &&
         prevProps.quickMode === nextProps.quickMode;
});

// Memoize to prevent re-renders when props haven't changed deeply
const ComponentPropertiesInner = React.memo(function ComponentPropertiesInner({
  component,
  onUpdate,
  quickMode,
}: {
  component: PageComponent;
  onUpdate: (data: any) => void;
  quickMode?: boolean;
}) {
  if (quickMode) {
    const quickFields = getQuickFieldsForType(component.type);
    if (quickFields) {
      return <GenericProperties component={component} onUpdate={onUpdate} fields={quickFields} />;
    }
  }
  switch (component.type) {
    case "faq":
      return (
        <FAQProperties
          data={component.data as FAQComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "pricingTable":
      return (
        <PricingTableProperties
          data={component.data as PricingTableComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "teamMembers":
      return (
        <TeamMembersProperties
          data={component.data as TeamMembersComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "socialFeed":
      return (
        <SocialFeedProperties
          data={component.data as SocialFeedComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "dualCTA":
      return (
        <DualCTAProperties
          data={component.data as DualCTAComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "contactForm":
      return (
        <ContactFormProperties
          data={component.data as ContactFormComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "newsletterSignup":
      return (
        <NewsletterProperties
          data={component.data as NewsletterComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "logo":
      return (
        <LogoProperties
          data={component.data as LogoComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "hero":
      return (
        <HeroProperties
          data={component.data as HeroComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "text":
      return (
        <TextProperties
          data={component.data as TextComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "image":
      return (
        <ImageProperties
          data={component.data as ImageComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "button":
      return (
        <ButtonProperties
          data={component.data as ButtonComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "columns":
      return (
        <ColumnsProperties
          data={component.data as ColumnsComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "spacer":
      return (
        <SpacerProperties
          data={component.data as SpacerComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "seoFooter":
      return (
        <SEOFooterProperties
          data={component.data as SEOFooterComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "slideshowHero":
      return (
        <SlideshowHeroProperties
          data={component.data as SlideshowHeroComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "testimonials":
      return (
        <TestimonialsProperties
          data={component.data as TestimonialsComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "galleryHighlights":
      return (
        <GalleryHighlightsProperties
          data={component.data as GalleryHighlightsComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "widgetEmbed":
      return (
        <WidgetEmbedProperties
          data={component.data as WidgetEmbedComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "badges":
      return (
        <BadgesProperties
          data={component.data as BadgesComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "servicesGrid":
      return (
        <ServicesGridProperties
          data={component.data as ServicesGridComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "stats":
      return (
        <StatsProperties
          data={component.data as StatsComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "ctaBanner":
      return (
        <CTABannerProperties
          data={component.data as CTABannerComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "iconFeatures":
      return (
        <IconFeaturesProperties
          data={component.data as IconFeaturesComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "container":
      return (
        <ContainerProperties
          data={component.data as ContainerComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "accordion":
      return (
        <AccordionProperties
          data={component.data as AccordionComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "tabs":
      return (
        <TabsProperties
          data={component.data as TabsComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    
    // NEW COMPONENTS PROPERTIES
    case "videoHero":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['videoUrl', 'posterImage', 'title', 'subtitle', 'buttonText', 'buttonLink', 'overlay', 'autoplay', 'loop', 'muted']} />;
    case "beforeAfter":
      return (
        <BeforeAfterProperties
          data={component.data as BeforeAfterComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "photoGrid":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['heading', 'layout', 'columns', 'gap', 'showFilters', 'limit']} />;
    case "audioPlayer":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['audioUrl', 'title', 'artist', 'coverImage', 'autoplay', 'loop']} />;
    case "viewer360":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['imageUrl', 'autoRotate', 'height', 'controls']} />;
    case "pdfEmbed":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['pdfUrl', 'downloadable', 'height', 'title']} />;
    case "reviews":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['heading', 'source', 'displayCount', 'style', 'showRating']} />;
    case "instagramFeed":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['heading', 'username', 'displayCount', 'columns', 'showCaptions', 'style']} />;
    case "clientPortal":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['heading', 'description', 'loginUrl', 'buttonText', 'style']} />;
    case "stickyCTA":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['text', 'buttonText', 'buttonLink', 'position', 'backgroundColor', 'textColor']} />;
    case "countdown":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['targetDate', 'heading', 'subheading', 'expiredMessage', 'showLabels', 'style', 'size']} />;
    case "progressSteps":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['currentStep', 'style', 'showNumbers']} />;
    case "calendarWidget":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['heading', 'provider', 'embedUrl', 'style']} />;
    case "trustBadges":
      return (
        <TrustBadgesProperties
          data={component.data as TrustBadgesComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "exitPopup":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['heading', 'message', 'buttonText', 'buttonLink', 'dismissible', 'showOnce']} />;
    case "timeline":
      return (
        <TimelineProperties
          data={component.data as TimelineComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "comparisonTable":
      return (
        <ComparisonTableProperties
          data={component.data as ComparisonTableComponent["data"]}
          onUpdate={onUpdate}
        />
      );
    case "blogCards":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['heading', 'displayCount', 'layout', 'columns', 'showExcerpt', 'showDate', 'showAuthor']} />;
    case "categoryNav":
      return (
        <CategoryNavProperties
          data={component.data as CategoryNavComponent['data']}
          onUpdate={onUpdate}
        />
      );
    case "breadcrumbs":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['separator', 'showHome']} />;
    case "tableOfContents":
      return (
        <TableOfContentsProperties
          data={component.data as TableOfContentsComponent['data']}
          onUpdate={onUpdate}
        />
      );
    case "relatedContent":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['heading', 'contentType', 'displayCount', 'layout', 'algorithm']} />;
    case "mapEmbed":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['address', 'zoom', 'height', 'showMarker', 'mapType']} />;
    case "quiz":
      return (
        <QuizProperties
          data={component.data as QuizComponent['data']}
          onUpdate={onUpdate}
        />
      );
    case "calculator":
      return (
        <CalculatorProperties
          data={component.data as CalculatorComponent['data']}
          onUpdate={onUpdate}
        />
      );
    case "lightbox":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['triggerText', 'triggerStyle', 'content', 'width']} />;
    case "enhancedTabs":
      return (
        <EnhancedTabsProperties
          data={component.data as EnhancedTabsComponent['data']}
          onUpdate={onUpdate}
        />
      );
    case "alertBanner":
      return <GenericProperties component={component} onUpdate={onUpdate} fields={['message', 'type', 'dismissible', 'link', 'linkText', 'position']} />;
    case "logoCarousel":
      return (
        <LogoCarouselProperties
          data={component.data as LogoCarouselComponent['data']}
          onUpdate={onUpdate}
        />
      );
    case "liveCounter":
      return (
        <LiveCounterProperties
          data={component.data as LiveCounterComponent['data']}
          onUpdate={onUpdate}
        />
      );
    case "bookingsTicker":
      return (
        <BookingsTickerProperties
          data={component.data as BookingsTickerComponent['data']}
          onUpdate={onUpdate}
        />
      );
    
    default:
      return null;
  }
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if component ID or type changes
  // Don't re-render on data changes (they're handled by local input state)
  return prevProps.component.id === nextProps.component.id &&
         prevProps.component.type === nextProps.component.type &&
         prevProps.quickMode === nextProps.quickMode;
});

// Add missing HeroProperties component
function HeroProperties({
  data,
  onUpdate,
}: {
  data: HeroComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const titleRef = React.useRef<HTMLTextAreaElement>(null);
  const subtitleRef = React.useRef<HTMLTextAreaElement>(null);

  const insertTitleFormatting = (before: string, after: string) => {
    const textarea = titleRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data.title;
    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);
    onUpdate({ title: newText });
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const insertSubtitleFormatting = (before: string, after: string) => {
    const textarea = subtitleRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data.subtitle;
    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);
    onUpdate({ subtitle: newText });
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        {/* Title Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertTitleFormatting("<strong>", "</strong>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting("<em>", "</em>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting("<br/>", "")}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Line break"
          >
            ↵
          </button>
          <button
            type="button"
            onClick={() =>
              insertTitleFormatting('<span class="text-amber-300">', "</span>")
            }
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Highlight (amber)"
          >
            ✨
          </button>
        </div>
        <textarea
          ref={titleRef}
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={2}
          title="Hero title"
          placeholder="Enter hero title (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Use &lt;br/&gt; for line breaks, &lt;strong&gt; for bold
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Layout</label>
        <div className="flex items-center gap-2">
          <input
            id="hero-fullbleed"
            type="checkbox"
            checked={!!data.fullBleed}
            onChange={(e) => onUpdate({ fullBleed: e.target.checked })}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="hero-fullbleed" className="text-sm text-gray-700">
            Full width (edge-to-edge)
          </label>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            id="hero-overlap"
            type="checkbox"
            checked={data.overlapHeader ?? true}
            onChange={(e) => onUpdate({ overlapHeader: e.target.checked })}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="hero-overlap" className="text-sm text-gray-700">
            Overlap header (pull under navbar)
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Hero animation"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Button Animation
        </label>
        <select
          value={data.buttonAnimation || "none"}
          onChange={(e) => onUpdate({ buttonAnimation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Hero button animation"
        >
          <option value="none">None</option>
          <option value="hover-zoom">Zoom on Hover</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        {/* Subtitle Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertSubtitleFormatting("<strong>", "</strong>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertSubtitleFormatting("<em>", "</em>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertSubtitleFormatting("<br/>", "")}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Line break"
          >
            ↵
          </button>
        </div>
        <textarea
          ref={subtitleRef}
          value={data.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={2}
          title="Hero subtitle"
          placeholder="Enter hero subtitle (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Use HTML tags for formatting
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Background Image URL
        </label>
        <input
          type="text"
          value={data.backgroundImage}
          onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
          className="w-full border rounded px-3 py-2 mb-2"
          title="Background image URL"
          placeholder="Paste image URL here"
        />
        <div className="mt-2 mb-2 text-xs text-gray-500">or upload:</div>
        <ImageUploader
          onImageUrl={(url) => onUpdate({ backgroundImage: url })}
        />
        {data.backgroundImage && (
          <div className="mt-2 relative aspect-video">
            <Image
              src={data.backgroundImage}
              alt=""
              fill
              className="object-cover rounded"
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={data.buttonText}
          onChange={(e) => onUpdate({ buttonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button text"
          placeholder="Enter button text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Link</label>
        <input
          type="text"
          value={data.buttonLink}
          onChange={(e) => onUpdate({ buttonLink: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button link"
          placeholder="Enter button link"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Secondary Button Text (optional)
        </label>
        <input
          type="text"
          value={data.secondaryButtonText || ""}
          onChange={(e) => onUpdate({ secondaryButtonText: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Secondary button text"
          placeholder="e.g., View Portfolio"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Secondary Button Link
        </label>
        <input
          type="text"
          value={data.secondaryButtonLink || ""}
          onChange={(e) => onUpdate({ secondaryButtonLink: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Secondary button link"
          placeholder="e.g., /gallery"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Style</label>
        <select
          value={data.buttonStyle || "primary"}
          onChange={(e) => onUpdate({ buttonStyle: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button style"
        >
          <option value="primary">Primary (Gold)</option>
          <option value="secondary">Secondary (Transparent)</option>
          <option value="outline">Outline (White Border)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title Color</label>
        <select
          value={data.titleColor || "text-white"}
          onChange={(e) => onUpdate({ titleColor: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Title color"
        >
          <option value="text-white">White</option>
          <option value="text-amber-200">Amber Light</option>
          <option value="text-amber-50">Amber Pale</option>
          <option value="text-gray-900">Dark Gray</option>
          <option value="text-primary-600">Primary (Gold)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtitle Color</label>
        <select
          value={data.subtitleColor || "text-amber-50"}
          onChange={(e) => onUpdate({ subtitleColor: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Subtitle color"
        >
          <option value="text-amber-50">Amber Pale</option>
          <option value="text-white">White</option>
          <option value="text-amber-200">Amber Light</option>
          <option value="text-gray-100">Light Gray</option>
          <option value="text-gray-800">Dark Gray</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Hero alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Overlay Darkness (%)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.overlay}
          onChange={(e) => onUpdate({ overlay: parseInt(e.target.value) })}
          className="w-full"
          title="Overlay darkness percentage"
          aria-label="Overlay darkness percentage"
        />
      </div>
    </div>
  );
}

// Before/After Properties
function BeforeAfterProperties({
  data,
  onUpdate,
}: {
  data: BeforeAfterComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Before Image</label>
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={data.beforeImage || ""}
            onChange={(e) => onUpdate({ beforeImage: e.target.value })}
            placeholder="https://..."
            className="flex-1 border rounded px-3 py-2"
          />
          <ImageUploader
            onImageUrl={(url) => onUpdate({ beforeImage: url })}
            buttonLabel="Upload"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">After Image</label>
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={data.afterImage || ""}
            onChange={(e) => onUpdate({ afterImage: e.target.value })}
            placeholder="https://..."
            className="flex-1 border rounded px-3 py-2"
          />
          <ImageUploader
            onImageUrl={(url) => onUpdate({ afterImage: url })}
            buttonLabel="Upload"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Before Label</label>
          <input
            type="text"
            value={data.beforeLabel || ""}
            onChange={(e) => onUpdate({ beforeLabel: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Before"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">After Label</label>
          <input
            type="text"
            value={data.afterLabel || ""}
            onChange={(e) => onUpdate({ afterLabel: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="After"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Initial Position</label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={data.initialPosition ?? 50}
          onChange={(e) => onUpdate({ initialPosition: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-500 mt-1">{data.initialPosition ?? 50}%</div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Orientation</label>
        <select
          value={data.orientation || "horizontal"}
          onChange={(e) => onUpdate({ orientation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
        {/* Mini orientation preview */}
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">Preview</div>
          <div
            className={`rounded border bg-gray-100 relative overflow-hidden ${
              (data.orientation || 'horizontal') === 'horizontal'
                ? 'h-12'
                : 'h-24 w-20'
            }`}
            style={{ width: (data.orientation || 'horizontal') === 'horizontal' ? '100%' : 'auto' }}
          >
            {(data.orientation || 'horizontal') === 'horizontal' ? (
              <div className="absolute inset-0 flex">
                <div className="w-1/2 bg-gradient-to-r from-gray-300 to-gray-200 flex items-center justify-center text-[10px] font-medium">
                  Before
                </div>
                <div className="w-1/2 bg-gradient-to-l from-gray-300 to-gray-200 flex items-center justify-center text-[10px] font-medium">
                  After
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col">
                <div className="h-1/2 bg-gradient-to-b from-gray-300 to-gray-200 flex items-center justify-center text-[10px] font-medium">
                  Before
                </div>
                <div className="h-1/2 bg-gradient-to-t from-gray-300 to-gray-200 flex items-center justify-center text-[10px] font-medium">
                  After
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Trust Badges Properties
function TrustBadgesProperties({
  data,
  onUpdate,
}: {
  data: TrustBadgesComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const badges = data.badges || [];
  const normalized = badges.map((b: any) => ({
    id: b.id || `badge-${Math.random().toString(36).slice(2, 8)}`,
    label: b.label || b.title || 'Badge',
    description: b.description || '',
    icon: b.icon || '',
    image: b.image || '',
    link: b.link || ''
  }));
  const commit = (arr: any[]) => onUpdate({ badges: arr });
  const updateBadge = (idx: number, patch: any) => {
    const next = normalized.map((b, i) => (i === idx ? { ...b, ...patch } : b));
    commit(next);
  };
  const addBadge = () => commit([...normalized, { id: `b-${Date.now()}`, label: 'New Badge', description: '', icon: '⭐', image: '', link: '' }]);
  const removeBadge = (idx: number) => commit(normalized.filter((_, i) => i !== idx));
  const moveBadge = (idx: number, dir: -1 | 1) => {
    const next = [...normalized];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    commit(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Why Choose Us?"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Layout</label>
          <select
            value={data.layout || "horizontal"}
            onChange={(e) => onUpdate({ layout: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="horizontal">Horizontal</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <select
            value={data.size || "md"}
            onChange={(e) => onUpdate({ size: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
      </div>

      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-sm">Badges</div>
          <button onClick={addBadge} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">
            + Add Badge
          </button>
        </div>
        <div className="space-y-3">
          {normalized.map((b, idx) => (
            <div key={b.id} className="border rounded p-2 bg-gray-50">
              <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Icon</label>
                  <input
                    type="text"
                    value={b.icon}
                    onChange={(e) => updateBadge(idx, { icon: e.target.value, image: '' })}
                    className="w-full border rounded px-2 py-1 text-xs"
                    placeholder="⭐"
                  />
                  <div className="text-[10px] text-gray-400 mt-1">Emoji / text</div>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium mb-1">Image (optional)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="url"
                      value={b.image}
                      onChange={(e) => updateBadge(idx, { image: e.target.value })}
                      className="flex-1 border rounded px-2 py-1 text-xs"
                      placeholder="https://..."
                    />
                    <ImageUploader
                      onImageUrl={(url) => updateBadge(idx, { image: url })}
                      buttonLabel="📁"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium mb-1">Label</label>
                  <input
                    type="text"
                    value={b.label}
                    onChange={(e) => updateBadge(idx, { label: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={b.description}
                    onChange={(e) => updateBadge(idx, { description: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-xs"
                  />
                </div>
                <div className="col-span-2 flex flex-col items-stretch gap-1">
                  <div className="flex gap-1">
                    <button onClick={() => moveBadge(idx, -1)} disabled={idx === 0} className="flex-1 text-[10px] border rounded px-1 py-1 disabled:opacity-30">↑</button>
                    <button onClick={() => moveBadge(idx, 1)} disabled={idx === normalized.length - 1} className="flex-1 text-[10px] border rounded px-1 py-1 disabled:opacity-30">↓</button>
                  </div>
                  <button
                    onClick={() => removeBadge(idx)}
                    className="text-red-600 text-[10px] border rounded px-1 py-1 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {normalized.length === 0 && (
            <div className="text-xs text-gray-500">No badges yet. Click “Add Badge”.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Timeline Properties (DnD + icon support)
function TimelineProperties({
  data,
  onUpdate,
}: {
  data: TimelineComponent["data"];
  onUpdate: (data: any) => void;
}) {
  // Normalize legacy data (items -> events)
  const events = React.useMemo(() => {
    const evts = (data as any).events as any[] | undefined;
    if (evts && evts.length) return evts;
    const items = (data as any).items as any[] | undefined;
    if (items && items.length) {
      return items.map((it) => ({
        id: it.id || `ev-${Math.random().toString(36).slice(2, 8)}`,
        date: it.date || '',
        title: it.title || it.heading || '',
        description: it.description || it.text || '',
        icon: (it as any).icon || '',
      }));
    }
    return [] as any[];
  }, [data]);

  const commit = (next: any[]) => onUpdate({ events: next });

  const updateEvent = (idx: number, patch: any) => {
    const next = events.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    commit(next);
  };
  const addEvent = () => {
    commit([
      ...events,
      { id: `ev-${Date.now()}`, date: "", title: "", description: "", icon: '' },
    ]);
  };
  const removeEvent = (idx: number) => commit(events.filter((_, i) => i !== idx));

  // Simple HTML5 Drag and Drop reorder
  const dragIndexRef = React.useRef<number | null>(null);
  const handleDragStart = (idx: number) => (e: React.DragEvent<HTMLDivElement>) => {
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (idx: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (idx: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from == null || from === idx) return;
    const next = [...events];
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    commit(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Orientation</label>
          <select
            value={data.orientation || "vertical"}
            onChange={(e) => onUpdate({ orientation: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select
            value={data.style || "default"}
            onChange={(e) => onUpdate({ style: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="cards">Cards</option>
          </select>
        </div>
      </div>

      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-sm">Events</div>
          <button onClick={addEvent} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">
            + Add Event
          </button>
        </div>
        <div className="space-y-3">
          {events.map((ev, idx) => (
            <div
              key={ev.id || idx}
              className="bg-gray-50 p-2 rounded border"
              draggable
              onDragStart={handleDragStart(idx)}
              onDragOver={handleDragOver(idx)}
              onDrop={handleDrop(idx)}
            >
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1 flex items-center justify-center cursor-grab" title="Drag to reorder">≡</div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Date</label>
                  <input
                    type="text"
                    value={ev.date || ""}
                    onChange={(e) => updateEvent(idx, { date: e.target.value })}
                    className="w-full border rounded px-2 py-2 text-xs"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={ev.title || ""}
                    onChange={(e) => updateEvent(idx, { title: e.target.value })}
                    className="w-full border rounded px-2 py-2 text-xs"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={ev.description || ""}
                    onChange={(e) => updateEvent(idx, { description: e.target.value })}
                    className="w-full border rounded px-2 py-2 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Icon (optional)</label>
                  <input
                    type="text"
                    value={ev.icon || ''}
                    onChange={(e) => updateEvent(idx, { icon: e.target.value })}
                    className="w-full border rounded px-2 py-2 text-xs"
                    placeholder="e.g., ⭐ or 🚀"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-[10px] text-gray-500">Tip: Drag the ≡ handle to reorder</div>
                <div className="flex gap-1">
                  <button onClick={() => removeEvent(idx)} className="text-[10px] text-red-600 border rounded px-2 py-1">Remove</button>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-xs text-gray-500">No events yet. Click “Add Event”.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Comparison Table Properties (simple editor)
function ComparisonTableProperties({
  data,
  onUpdate,
}: {
  data: ComparisonTableComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const plans = data.plans || [];
  const features = (data.features || []).map((f) => ({
    id: f.id || `feat-${Math.random().toString(36).slice(2, 8)}`,
    name: f.name || '',
    values: f.values || plans.map(() => ''),
    description: (f as any).description || ''
  }));

  const commit = (nextPlans: any, nextFeatures: any) => {
    onUpdate({
      ...data,
      plans: nextPlans,
      features: nextFeatures.map((f: any) => ({ ...f, values: f.values }))
    });
  };

  const updatePlan = (idx: number, patch: any) => {
    const nextPlans = plans.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    // Adjust feature values length
    const nextFeatures = features.map((f) => {
      const diff = nextPlans.length - f.values.length;
      if (diff > 0) return { ...f, values: [...f.values, ...Array(diff).fill('')] };
      if (diff < 0) return { ...f, values: f.values.slice(0, nextPlans.length) };
      return f;
    });
    commit(nextPlans, nextFeatures);
  };
  const addPlan = () => updatePlan(plans.length, { id: `plan-${Date.now()}`, name: 'New Plan', featured: false });
  const removePlan = (idx: number) => {
    const nextPlans = plans.filter((_, i) => i !== idx);
    const nextFeatures = features.map((f) => ({ ...f, values: f.values.filter((_, i) => i !== idx) }));
    commit(nextPlans, nextFeatures);
  };
  const movePlan = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= plans.length) return;
    const nextPlans = [...plans];
    [nextPlans[idx], nextPlans[target]] = [nextPlans[target], nextPlans[idx]];
    const nextFeatures = features.map((f) => {
      const nextValues = [...f.values];
      [nextValues[idx], nextValues[target]] = [nextValues[target], nextValues[idx]];
      return { ...f, values: nextValues };
    });
    commit(nextPlans, nextFeatures);
  };

  const updateFeature = (idx: number, patch: any) => {
    const nextFeatures = features.map((f, i) => (i === idx ? { ...f, ...patch } : f));
    commit(plans, nextFeatures);
  };
  const addFeature = () => {
    commit(plans, [...features, { id: `feat-${Date.now()}`, name: 'Feature', values: plans.map(() => '') }]);
  };
  const removeFeature = (idx: number) => commit(plans, features.filter((_, i) => i !== idx));
  const moveFeature = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= features.length) return;
    const next = [...features];
    [next[idx], next[target]] = [next[target], next[idx]];
    commit(plans, next);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Style</label>
        <select
          value={data.style || 'default'}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="default">Default</option>
          <option value="compact">Compact</option>
          <option value="cards">Cards</option>
        </select>
      </div>

      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-sm">Plans</div>
          <button onClick={addPlan} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">+ Add Plan</button>
        </div>
        <div className="space-y-2">
          {plans.map((p, idx) => (
            <div key={p.id || idx} className="grid grid-cols-12 gap-2 items-center">
              <input
                className="col-span-6 border rounded px-2 py-2"
                value={p.name || ""}
                onChange={(e) => updatePlan(idx, { name: e.target.value })}
                placeholder="Plan name"
              />
              <label className="col-span-4 inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!p.featured}
                  onChange={(e) => updatePlan(idx, { featured: e.target.checked })}
                />
                Featured
              </label>
              <div className="col-span-2 flex gap-1">
                <button onClick={() => movePlan(idx, -1)} disabled={idx===0} className="text-xs border rounded px-2 py-1 disabled:opacity-30">↑</button>
                <button onClick={() => movePlan(idx, 1)} disabled={idx===plans.length-1} className="text-xs border rounded px-2 py-1 disabled:opacity-30">↓</button>
                <button onClick={() => removePlan(idx)} className="text-xs text-red-600 border rounded px-2 py-1">✕</button>
              </div>
            </div>
          ))}
          {plans.length === 0 && <div className="text-xs text-gray-500">Add at least one plan.</div>}
        </div>
      </div>

      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-sm">Features</div>
          <button onClick={addFeature} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">+ Add Feature</button>
        </div>
        <div className="space-y-2">
          {features.map((f, idx) => (
            <div key={f.id} className="grid grid-cols-12 gap-2 items-center">
              <input
                className="col-span-4 border rounded px-2 py-2"
                value={f.name || ""}
                onChange={(e) => updateFeature(idx, { name: e.target.value })}
                placeholder="Feature name"
              />
              <div className="col-span-8 grid grid-cols-3 gap-2">
                {(f.values || plans.map(() => "")).map((val: any, i: number) => (
                  <input
                    key={i}
                    className="border rounded px-2 py-2"
                    value={val}
                    onChange={(e) => {
                      const next = [...(f.values || plans.map(() => ""))];
                      next[i] = e.target.value;
                      updateFeature(idx, { values: next });
                    }}
                    placeholder={plans[i]?.name || `Plan ${i + 1}`}
                  />
                ))}
              </div>
              <div className="col-span-12 flex gap-1 justify-end mt-1">
                <button onClick={() => moveFeature(idx, -1)} disabled={idx===0} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↑</button>
                <button onClick={() => moveFeature(idx, 1)} disabled={idx===features.length-1} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↓</button>
                <button onClick={() => removeFeature(idx)} className="text-[10px] text-red-600 border rounded px-2 py-1">Remove</button>
              </div>
            </div>
          ))}
          {features.length === 0 && <div className="text-xs text-gray-500">Add features to compare plans.</div>}
        </div>
      </div>
    </div>
  );
}

// Category Nav Properties
function CategoryNavProperties({ data, onUpdate }: { data: CategoryNavComponent['data']; onUpdate: (patch: any) => void }) {
  const categories = data.categories || [];
  const updateCat = (id: string, patch: any) => {
    onUpdate({ categories: categories.map(c => c.id === id ? { ...c, ...patch } : c) });
  };
  const addCat = () => {
    onUpdate({ categories: [...categories, { id: `cat-${Date.now()}`, name: 'New Category', link: '#', image: '', count: 0 }] });
  };
  const removeCat = (id: string) => onUpdate({ categories: categories.filter(c => c.id !== id) });
  const moveCat = (idx: number, dir: -1 | 1) => {
    const target = idx + dir; if (target < 0 || target >= categories.length) return;
    const next = [...categories]; [next[idx], next[target]] = [next[target], next[idx]]; onUpdate({ categories: next });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Layout</label>
          <select value={data.layout || 'grid'} onChange={(e)=>onUpdate({ layout: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="grid">Grid</option>
            <option value="carousel">Carousel</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select value={data.columns || 3} onChange={(e)=>onUpdate({ columns: Number(e.target.value) })} className="w-full border rounded px-3 py-2">
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!data.showCounts} onChange={(e)=>onUpdate({ showCounts: e.target.checked })} /> Show Counts
      </label>
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Categories</span>
          <button onClick={addCat} className="text-xs border rounded px-2 py-1">+ Add</button>
        </div>
        <div className="space-y-3">
          {categories.map((c, idx) => (
            <div key={c.id} className="bg-gray-50 p-2 rounded border space-y-2">
              <div className="flex gap-2 items-center">
                <input value={c.name} onChange={(e)=>updateCat(c.id,{ name: e.target.value })} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Name" />
                <input value={c.link} onChange={(e)=>updateCat(c.id,{ link: e.target.value })} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Link / slug" />
              </div>
              <div className="flex gap-2 items-center">
                <input type="url" value={c.image || ''} onChange={(e)=>updateCat(c.id,{ image: e.target.value })} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Image URL" />
                <ImageUploader onImageUrl={(url)=>updateCat(c.id,{ image: url })} buttonLabel="Upload" />
              </div>
              <div className="flex gap-2 items-center justify-between">
                <input type="number" value={c.count ?? 0} onChange={(e)=>updateCat(c.id,{ count: Number(e.target.value) })} className="w-24 border rounded px-2 py-1 text-xs" placeholder="Count" />
                <div className="flex gap-1">
                  <button onClick={()=>moveCat(idx,-1)} disabled={idx===0} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↑</button>
                  <button onClick={()=>moveCat(idx,1)} disabled={idx===categories.length-1} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↓</button>
                  <button onClick={()=>removeCat(c.id)} className="text-[10px] text-red-600 border rounded px-2 py-1">Remove</button>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && <div className="text-xs text-gray-500">No categories yet.</div>}
        </div>
      </div>
    </div>
  );
}

// Table of Contents Properties
function TableOfContentsProperties({ data, onUpdate }: { data: TableOfContentsComponent['data']; onUpdate: (patch: any) => void }) {
  const items = data.items || [];
  const updateItem = (id: string, patch: any) => onUpdate({ items: items.map(it => it.id === id ? { ...it, ...patch } : it) });
  const addItem = () => onUpdate({ items: [...items, { id: `toc-${Date.now()}`, label: 'Section', anchor: 'section', level: 0 }] });
  const removeItem = (id: string) => onUpdate({ items: items.filter(it => it.id !== id) });
  const moveItem = (idx: number, dir: -1 | 1) => { const target = idx + dir; if (target < 0 || target >= items.length) return; const next = [...items]; [next[idx], next[target]] = [next[target], next[idx]]; onUpdate({ items: next }); };
  const changeLevel = (id: string, delta: 1 | -1) => {
    updateItem(id, { level: Math.min(3, Math.max(0, (items.find(i=>i.id===id)?.level ||0)+ delta)) });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!data.sticky} onChange={(e)=>onUpdate({ sticky: e.target.checked })} /> Sticky
      </label>
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Items</span>
          <button onClick={addItem} className="text-xs border rounded px-2 py-1">+ Add</button>
        </div>
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={it.id} className="bg-gray-50 p-2 rounded border">
              <div className="grid grid-cols-12 gap-2 mb-1 items-center">
                <input value={it.label} onChange={(e)=>updateItem(it.id,{ label: e.target.value })} className="col-span-4 border rounded px-2 py-1 text-xs" placeholder="Label" />
                <input value={it.anchor} onChange={(e)=>updateItem(it.id,{ anchor: e.target.value })} className="col-span-4 border rounded px-2 py-1 text-xs" placeholder="Anchor" />
                <div className="col-span-2 flex items-center gap-1">
                  <button onClick={()=>changeLevel(it.id,-1)} className="text-[10px] border rounded px-2 py-1">−</button>
                  <div className="text-[10px] w-6 text-center">L{it.level}</div>
                  <button onClick={()=>changeLevel(it.id,1)} className="text-[10px] border rounded px-2 py-1">+</button>
                </div>
                <div className="col-span-2 flex gap-1">
                  <button onClick={()=>moveItem(idx,-1)} disabled={idx===0} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↑</button>
                  <button onClick={()=>moveItem(idx,1)} disabled={idx===items.length-1} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↓</button>
                  <button onClick={()=>removeItem(it.id)} className="text-[10px] text-red-600 border rounded px-2 py-1">✕</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-xs text-gray-500">No items yet.</div>}
        </div>
      </div>
    </div>
  );
}

// Quiz Properties
function QuizProperties({ data, onUpdate }: { data: QuizComponent['data']; onUpdate: (patch: any) => void }) {
  const questions = data.questions || [];
  const updateQuestion = (id: string, patch: any) => onUpdate({ questions: questions.map(q => q.id === id ? { ...q, ...patch } : q) });
  const addQuestion = () => onUpdate({ questions: [...questions, { id: `q-${Date.now()}`, question: 'New question', options: [] }] });
  const removeQuestion = (id: string) => onUpdate({ questions: questions.filter(q => q.id !== id) });
  const addOption = (qid: string) => updateQuestion(qid, { options: [...(questions.find(q=>q.id===qid)?.options || []), { id: `opt-${Date.now()}`, text: 'Option', value: '' }] });
  const updateOption = (qid: string, oid: string, patch: any) => updateQuestion(qid, { options: (questions.find(q=>q.id===qid)?.options || []).map(o => o.id === oid ? { ...o, ...patch } : o) });
  const removeOption = (qid: string, oid: string) => updateQuestion(qid, { options: (questions.find(q=>q.id===qid)?.options || []).filter(o => o.id !== oid) });
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input type="text" value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={data.description || ''} onChange={(e)=>onUpdate({ description: e.target.value })} rows={2} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Questions</span>
          <button onClick={addQuestion} className="text-xs border rounded px-2 py-1">+ Add</button>
        </div>
        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.id} className="bg-gray-50 p-2 rounded border">
              <div className="flex gap-2 mb-2">
                <input value={q.question} onChange={(e)=>updateQuestion(q.id,{ question: e.target.value })} className="flex-1 border rounded px-2 py-1 text-xs" />
                <button onClick={()=>removeQuestion(q.id)} className="text-[10px] text-red-600 border rounded px-2 py-1">Remove</button>
              </div>
              <div className="space-y-2">
                {q.options.map(o => (
                  <div key={o.id} className="flex gap-2 items-center">
                    <input value={o.text} onChange={(e)=>updateOption(q.id,o.id,{ text: e.target.value })} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Option" />
                    <input value={o.value} onChange={(e)=>updateOption(q.id,o.id,{ value: e.target.value })} className="w-32 border rounded px-2 py-1 text-xs" placeholder="Value" />
                    <button onClick={()=>removeOption(q.id,o.id)} className="text-[10px] text-red-600 border rounded px-2 py-1">✕</button>
                  </div>
                ))}
                <button onClick={()=>addOption(q.id)} className="text-[10px] border rounded px-2 py-1">+ Option</button>
              </div>
            </div>
          ))}
          {questions.length === 0 && <div className="text-xs text-gray-500">No questions yet.</div>}
        </div>
      </div>
    </div>
  );
}

// Calculator Properties
function CalculatorProperties({ data, onUpdate }: { data: CalculatorComponent['data']; onUpdate: (patch: any) => void }) {
  const fields = data.fields || [];
  const updateField = (id: string, patch: any) => onUpdate({ fields: fields.map(f => f.id === id ? { ...f, ...patch } : f) });
  const addField = () => onUpdate({ fields: [...fields, { id: `field-${Date.now()}`, label: 'Field', type: 'number', multiplier: 1 }] });
  const removeField = (id: string) => onUpdate({ fields: fields.filter(f => f.id !== id) });
  const addOption = (fid: string) => {
    const field = fields.find(f => f.id === fid);
    if (!field) return;
    const opts = field.options || [];
    updateField(fid,{ options: [...opts, { label: 'Option', value: 1 }] });
  };
  const updateOption = (fid: string, idx: number, patch: any) => {
    const field = fields.find(f => f.id === fid); if(!field) return;
    const opts = (field.options || []).map((o,i)=> i===idx ? { ...o, ...patch } : o);
    updateField(fid,{ options: opts });
  };
  const removeOption = (fid: string, idx: number) => {
    const field = fields.find(f => f.id === fid); if(!field) return;
    updateField(fid,{ options: (field.options || []).filter((_,i)=>i!==idx) });
  };
  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <div className="border rounded p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Quick Presets</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="text-xs px-2 py-1 border rounded hover:bg-white"
            onClick={() => {
              if (fields.length > 0 && !confirm('Replace existing fields with the Portrait Session preset?')) return;
              onUpdate({
                heading: data.heading || 'Session Estimator',
                basePrice: 199,
                description: data.description || 'Estimate your session cost.',
                showBreakdown: true,
                fields: [
                  { id: `field-${Date.now()}-dur`, label: 'Session Duration', type: 'select', options: [
                    { label: '30 minutes', value: 0 },
                    { label: '60 minutes', value: 150 },
                    { label: '90 minutes', value: 300 },
                  ] },
                  { id: `field-${Date.now()}-extra`, label: 'Extra Edited Photos', type: 'number', multiplier: 10 },
                  { id: `field-${Date.now()}-travel`, label: 'Travel (miles)', type: 'select', options: [
                    { label: '0-10', value: 0 },
                    { label: '10-25', value: 25 },
                    { label: '25-50', value: 50 },
                  ] },
                ],
              });
            }}
          >Portrait Session</button>
          <button
            className="text-xs px-2 py-1 border rounded hover:bg-white"
            onClick={() => {
              if (fields.length > 0 && !confirm('Replace existing fields with the Wedding Quote preset?')) return;
              onUpdate({
                heading: data.heading || 'Wedding Quote',
                basePrice: 999,
                description: data.description || 'Estimate your wedding photography package.',
                showBreakdown: true,
                fields: [
                  { id: `field-${Date.now()}-cov`, label: 'Coverage Hours', type: 'select', options: [
                    { label: '4 hours', value: 0 },
                    { label: '6 hours', value: 400 },
                    { label: '8 hours', value: 800 },
                  ] },
                  { id: `field-${Date.now()}-second`, label: 'Second Shooter', type: 'select', options: [
                    { label: 'No', value: 0 },
                    { label: 'Yes', value: 300 },
                  ] },
                  { id: `field-${Date.now()}-rush`, label: 'Rush Delivery', type: 'select', options: [
                    { label: 'No', value: 0 },
                    { label: 'Yes', value: 200 },
                  ] },
                ],
              });
            }}
          >Wedding Quote</button>
          <button
            className="text-xs px-2 py-1 border rounded hover:bg-white"
            onClick={() => {
              if (fields.length > 0 && !confirm('Replace existing fields with the Commercial preset?')) return;
              onUpdate({
                heading: data.heading || 'Commercial Estimate',
                basePrice: 299,
                description: data.description || 'Estimate commercial photography.',
                showBreakdown: true,
                fields: [
                  { id: `field-${Date.now()}-products`, label: 'Number of Products', type: 'number', multiplier: 25 },
                  { id: `field-${Date.now()}-retouch`, label: 'Retouching Level', type: 'select', options: [
                    { label: 'Basic', value: 0 },
                    { label: 'Advanced', value: 150 },
                    { label: 'Premium', value: 300 },
                  ] },
                ],
              });
            }}
          >Commercial</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Heading</label>
          <input value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Base Price</label>
          <input type="number" value={data.basePrice ?? 0} onChange={(e)=>onUpdate({ basePrice: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={data.description || ''} onChange={(e)=>onUpdate({ description: e.target.value })} rows={2} className="w-full border rounded px-3 py-2" />
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!data.showBreakdown} onChange={(e)=>onUpdate({ showBreakdown: e.target.checked })} /> Show Breakdown</label>
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Fields</span><button onClick={addField} className="text-xs border rounded px-2 py-1">+ Add</button></div>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.id} className="bg-gray-50 p-2 rounded border space-y-2">
              <div className="grid grid-cols-12 gap-2 items-center">
                <input value={f.label} onChange={(e)=>updateField(f.id,{ label: e.target.value })} className="col-span-4 border rounded px-2 py-1 text-xs" placeholder="Label" />
                <select value={f.type} onChange={(e)=>updateField(f.id,{ type: e.target.value })} className="col-span-3 border rounded px-2 py-1 text-xs">
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                </select>
                {f.type === 'number' && (
                  <input type="number" value={f.multiplier ?? 1} onChange={(e)=>updateField(f.id,{ multiplier: Number(e.target.value) })} className="col-span-3 border rounded px-2 py-1 text-xs" placeholder="Multiplier" />
                )}
                <button onClick={()=>removeField(f.id)} className="col-span-2 text-[10px] text-red-600 border rounded px-2 py-1">Remove</button>
              </div>
              {f.type === 'select' && (
                <div className="space-y-2">
                  {(f.options || []).map((o, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input value={o.label} onChange={(e)=>updateOption(f.id,idx,{ label: e.target.value })} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Label" />
                      <input type="number" value={o.value} onChange={(e)=>updateOption(f.id,idx,{ value: Number(e.target.value) })} className="w-24 border rounded px-2 py-1 text-xs" placeholder="Value" />
                      <button onClick={()=>removeOption(f.id,idx)} className="text-[10px] text-red-600 border rounded px-2 py-1">✕</button>
                    </div>
                  ))}
                  <button onClick={()=>addOption(f.id)} className="text-[10px] border rounded px-2 py-1">+ Option</button>
                </div>
              )}
            </div>
          ))}
          {fields.length === 0 && <div className="text-xs text-gray-500">No fields yet.</div>}
        </div>
      </div>
    </div>
  );
}

// Enhanced Tabs Properties
function EnhancedTabsProperties({ data, onUpdate }: { data: EnhancedTabsComponent['data']; onUpdate: (patch: any) => void }) {
  const tabs = data.tabs || [];
  const updateTab = (id: string, patch: any) => onUpdate({ tabs: tabs.map(t => t.id === id ? { ...t, ...patch } : t) });
  const addTab = () => onUpdate({ tabs: [...tabs, { id: `tab-${Date.now()}`, label: 'Tab', icon: '', image: '' }] });
  const removeTab = (id: string) => onUpdate({ tabs: tabs.filter(t => t.id !== id) });
  const moveTab = (idx: number, dir: -1 | 1) => { const target = idx + dir; if (target < 0 || target >= tabs.length) return; const next=[...tabs]; [next[idx],next[target]]=[next[target],next[idx]]; onUpdate({ tabs: next }); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select value={data.style || 'underline'} onChange={(e)=>onUpdate({ style: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="underline">Underline</option>
            <option value="pills">Pills</option>
            <option value="boxed">Boxed</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!data.showIcons} onChange={(e)=>onUpdate({ showIcons: e.target.checked })} /> Show Icons</label>
        </div>
      </div>
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Tabs</span>
          <button onClick={addTab} className="text-xs border rounded px-2 py-1">+ Add</button>
        </div>
        <div className="space-y-3">
          {tabs.map((t, idx) => (
            <div key={t.id} className="bg-gray-50 p-2 rounded border">
              <div className="grid grid-cols-12 gap-2 items-center">
                <input value={t.label} onChange={(e)=>updateTab(t.id,{ label: e.target.value })} className="col-span-4 border rounded px-2 py-1 text-xs" placeholder="Label" />
                <input value={t.icon || ''} onChange={(e)=>updateTab(t.id,{ icon: e.target.value })} className="col-span-2 border rounded px-2 py-1 text-xs" placeholder="Icon" />
                <div className="col-span-4 flex items-center gap-1">
                  <input type="url" value={t.image || ''} onChange={(e)=>updateTab(t.id,{ image: e.target.value })} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Image URL" />
                  <ImageUploader onImageUrl={(url)=>updateTab(t.id,{ image: url })} buttonLabel="Upload" />
                </div>
                <div className="col-span-2 flex gap-1">
                  <button onClick={()=>moveTab(idx,-1)} disabled={idx===0} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↑</button>
                  <button onClick={()=>moveTab(idx,1)} disabled={idx===tabs.length-1} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↓</button>
                  <button onClick={()=>removeTab(t.id)} className="text-[10px] text-red-600 border rounded px-2 py-1">✕</button>
                </div>
              </div>
              <label className="flex items-center gap-2 mt-2 text-[10px]">
                <input type="radio" name="activeTab" checked={data.activeTab === t.id || (!data.activeTab && idx===0)} onChange={()=>onUpdate({ activeTab: t.id })} /> Active
              </label>
            </div>
          ))}
          {tabs.length === 0 && <div className="text-xs text-gray-500">No tabs yet.</div>}
        </div>
      </div>
    </div>
  );
}

// Logo Carousel Properties
function LogoCarouselProperties({ data, onUpdate }: { data: LogoCarouselComponent['data']; onUpdate: (patch: any) => void }) {
  const logos = data.logos || [];
  const updateLogo = (id: string, patch: any) => onUpdate({ logos: logos.map(l => l.id === id ? { ...l, ...patch } : l) });
  const addLogo = () => onUpdate({ logos: [...logos, { id: `logo-${Date.now()}`, image: '', alt: 'Logo', link: '' }] });
  const removeLogo = (id: string) => onUpdate({ logos: logos.filter(l => l.id !== id) });
  const moveLogo = (idx: number, dir: -1 | 1) => { const target = idx + dir; if(target<0||target>=logos.length) return; const next=[...logos]; [next[idx],next[target]]=[next[target],next[idx]]; onUpdate({ logos: next }); };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input value={data.heading || ''} onChange={(e)=>onUpdate({ heading: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!data.autoplay} onChange={(e)=>onUpdate({ autoplay: e.target.checked })} /> Autoplay
        </label>
        <div>
          <label className="block text-sm font-medium mb-1">Speed (ms)</label>
          <input type="number" value={data.speed ?? 3000} onChange={(e)=>onUpdate({ speed: Number(e.target.value) })} className="w-full border rounded px-2 py-1" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!data.grayscale} onChange={(e)=>onUpdate({ grayscale: e.target.checked })} /> Grayscale
        </label>
      </div>
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Logos</span><button onClick={addLogo} className="text-xs border rounded px-2 py-1">+ Add</button></div>
        <div className="space-y-3">
          {logos.map((l, idx) => (
            <div key={l.id} className="bg-gray-50 p-2 rounded border">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 flex items-center gap-1">
                  <input type="url" value={l.image} onChange={(e)=>updateLogo(l.id,{ image: e.target.value })} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Image URL" />
                  <ImageUploader onImageUrl={(url)=>updateLogo(l.id,{ image: url })} buttonLabel="Upload" />
                </div>
                <input value={l.alt} onChange={(e)=>updateLogo(l.id,{ alt: e.target.value })} className="col-span-3 border rounded px-2 py-1 text-xs" placeholder="Alt" />
                <input value={l.link || ''} onChange={(e)=>updateLogo(l.id,{ link: e.target.value })} className="col-span-3 border rounded px-2 py-1 text-xs" placeholder="Link" />
                <div className="col-span-3 flex gap-1">
                  <button onClick={()=>moveLogo(idx,-1)} disabled={idx===0} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↑</button>
                  <button onClick={()=>moveLogo(idx,1)} disabled={idx===logos.length-1} className="text-[10px] border rounded px-2 py-1 disabled:opacity-30">↓</button>
                  <button onClick={()=>removeLogo(l.id)} className="text-[10px] text-red-600 border rounded px-2 py-1">✕</button>
                </div>
              </div>
            </div>
          ))}
          {logos.length === 0 && <div className="text-xs text-gray-500">No logos yet.</div>}
        </div>
      </div>
    </div>
  );
}

// Live Counter Properties
function LiveCounterProperties({ data, onUpdate }: { data: LiveCounterComponent['data']; onUpdate: (patch: any) => void }) {
  const counters = data.counters || [];
  const updateCounter = (id: string, patch: any) => onUpdate({ counters: counters.map(c => c.id === id ? { ...c, ...patch } : c) });
  const addCounter = () => onUpdate({ counters: [...counters, { id: `ctr-${Date.now()}`, label: 'Metric', targetValue: 100, prefix: '', suffix: '' }] });
  const removeCounter = (id: string) => onUpdate({ counters: counters.filter(c => c.id !== id) });
  const moveCounter = (idx: number, dir: -1 | 1) => { const target=idx+dir; if(target<0||target>=counters.length) return; const next=[...counters]; [next[idx],next[target]]=[next[target],next[idx]]; onUpdate({ counters: next }); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Duration (ms)</label>
          <input type="number" value={data.duration ?? 2000} onChange={(e)=>onUpdate({ duration: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select value={data.style || 'default'} onChange={(e)=>onUpdate({ style: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="badges">Badges</option>
          </select>
        </div>
      </div>
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Counters</span><button onClick={addCounter} className="text-xs border rounded px-2 py-1">+ Add</button></div>
        <div className="space-y-2">
          {counters.map((c, idx) => (
            <div key={c.id} className="bg-gray-50 p-2 rounded border">
              <div className="grid grid-cols-12 gap-2 items-center">
                <input value={c.label} onChange={(e)=>updateCounter(c.id,{ label: e.target.value })} className="col-span-3 border rounded px-2 py-1 text-xs" placeholder="Label" />
                <input type="number" value={c.targetValue} onChange={(e)=>updateCounter(c.id,{ targetValue: Number(e.target.value) })} className="col-span-2 border rounded px-2 py-1 text-xs" placeholder="Target" />
                <input value={c.prefix || ''} onChange={(e)=>updateCounter(c.id,{ prefix: e.target.value })} className="col-span-2 border rounded px-2 py-1 text-xs" placeholder="Prefix" />
                <input value={c.suffix || ''} onChange={(e)=>updateCounter(c.id,{ suffix: e.target.value })} className="col-span-2 border rounded px-2 py-1 text-xs" placeholder="Suffix" />
                <input value={c.icon || ''} onChange={(e)=>updateCounter(c.id,{ icon: e.target.value })} className="col-span-2 border rounded px-2 py-1 text-xs" placeholder="Icon" />
                <div className="col-span-1 flex flex-col gap-1">
                  <button onClick={()=>moveCounter(idx,-1)} disabled={idx===0} className="text-[10px] border rounded px-1 py-1 disabled:opacity-30">↑</button>
                  <button onClick={()=>moveCounter(idx,1)} disabled={idx===counters.length-1} className="text-[10px] border rounded px-1 py-1 disabled:opacity-30">↓</button>
                  <button onClick={()=>removeCounter(c.id)} className="text-[10px] text-red-600 border rounded px-1 py-1">✕</button>
                </div>
              </div>
            </div>
          ))}
          {counters.length === 0 && <div className="text-xs text-gray-500">No counters yet.</div>}
        </div>
      </div>
    </div>
  );
}

// Bookings Ticker Properties
function BookingsTickerProperties({ data, onUpdate }: { data: BookingsTickerComponent['data']; onUpdate: (patch: any) => void }) {
  const items = data.items || [];
  const updateItem = (id: string, patch: any) => onUpdate({ items: items.map(i => i.id === id ? { ...i, ...patch } : i) });
  const addItem = () => onUpdate({ items: [...items, { id: `bk-${Date.now()}`, name: 'Client', location: 'City', service: 'Service', timeAgo: '2m ago' }] });
  const removeItem = (id: string) => onUpdate({ items: items.filter(i => i.id !== id) });
  const moveItem = (idx: number, dir: -1 | 1) => { const target=idx+dir; if(target<0||target>=items.length) return; const next=[...items]; [next[idx],next[target]]=[next[target],next[idx]]; onUpdate({ items: next }); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <select value={data.position || 'bottom'} onChange={(e)=>onUpdate({ position: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="corner">Corner</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Display Duration (ms)</label>
          <input type="number" value={data.displayDuration ?? 4000} onChange={(e)=>onUpdate({ displayDuration: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Interval (ms)</label>
          <input type="number" value={data.interval ?? 6000} onChange={(e)=>onUpdate({ interval: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="border rounded p-3">
        <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Bookings</span><button onClick={addItem} className="text-xs border rounded px-2 py-1">+ Add</button></div>
        <div className="space-y-2">
          {items.map((i, idx) => (
            <div key={i.id} className="bg-gray-50 p-2 rounded border">
              <div className="grid grid-cols-12 gap-2 items-center">
                <input value={i.name} onChange={(e)=>updateItem(i.id,{ name: e.target.value })} className="col-span-3 border rounded px-2 py-1 text-xs" placeholder="Name" />
                <input value={i.service || ''} onChange={(e)=>updateItem(i.id,{ service: e.target.value })} className="col-span-3 border rounded px-2 py-1 text-xs" placeholder="Service" />
                <input value={i.location || ''} onChange={(e)=>updateItem(i.id,{ location: e.target.value })} className="col-span-3 border rounded px-2 py-1 text-xs" placeholder="Location" />
                <input value={i.timeAgo} onChange={(e)=>updateItem(i.id,{ timeAgo: e.target.value })} className="col-span-2 border rounded px-2 py-1 text-xs" placeholder="Time Ago" />
                <div className="col-span-1 flex flex-col gap-1">
                  <button onClick={()=>moveItem(idx,-1)} disabled={idx===0} className="text-[10px] border rounded px-1 py-1 disabled:opacity-30">↑</button>
                  <button onClick={()=>moveItem(idx,1)} disabled={idx===items.length-1} className="text-[10px] border rounded px-1 py-1 disabled:opacity-30">↓</button>
                  <button onClick={()=>removeItem(i.id)} className="text-[10px] text-red-600 border rounded px-1 py-1">✕</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-xs text-gray-500">No bookings yet.</div>}
        </div>
      </div>
    </div>
  );
}

// Contact Form Properties
function ContactFormProperties({
  data,
  onUpdate,
}: {
  data: ContactFormComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Get in Touch"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <textarea
          value={data.subheading || ""}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={2}
          placeholder="Tell us about your photography needs and we’ll reply within 24 hours."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}

// Newsletter Signup Properties
function NewsletterProperties({
  data,
  onUpdate,
}: {
  data: NewsletterComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Get 10% Off Your First Session"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <textarea
          value={data.subheading || ""}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={2}
          placeholder="Subscribe for tips, behind-the-scenes, and special offers."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Disclaimer</label>
        <input
          type="text"
          value={data.disclaimer || ""}
          onChange={(e) => onUpdate({ disclaimer: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="By subscribing, you agree to receive marketing emails. Unsubscribe anytime."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select
            value={data.style || "card"}
            onChange={(e) => onUpdate({ style: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="card">Card</option>
            <option value="banner">Banner</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select
            value={data.animation || "fade-in"}
            onChange={(e) => onUpdate({ animation: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// FAQ Properties
function FAQProperties({
  data,
  onUpdate,
}: {
  data: FAQComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addItem = () => {
    onUpdate({
      items: [
        ...(data.items || []),
        { question: "New question", answer: "Answer..." },
      ],
    });
  };
  const removeItem = (idx: number) => {
    onUpdate({ items: (data.items || []).filter((_, i) => i !== idx) });
  };
  const updateItem = (
    idx: number,
    field: "question" | "answer",
    value: string
  ) => {
    const arr = [...(data.items || [])];
    arr[idx] = { ...arr[idx], [field]: value };
    onUpdate({ items: arr });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Frequently Asked Questions"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select
            value={data.columns || 1}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select
            value={data.animation || "fade-in"}
            onChange={(e) => onUpdate({ animation: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Questions</label>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="space-y-3">
          {(data.items || []).map((qa, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Item #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={qa.question || ""}
                  onChange={(e) => updateItem(idx, "question", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="What is included?"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Answer (HTML allowed)
                </label>
                <textarea
                  value={qa.answer || ""}
                  onChange={(e) => updateItem(idx, "answer", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm font-mono"
                  rows={3}
                  placeholder="Answer details..."
                />
              </div>
            </div>
          ))}
          {!data.items?.length && (
            <p className="text-sm text-gray-500">
              No questions yet. Add your first FAQ item.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Pricing Table Properties
function PricingTableProperties({
  data,
  onUpdate,
}: {
  data: PricingTableComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addPlan = () => {
    onUpdate({
      plans: [
        ...(data.plans || []),
        {
          title: "New Plan",
          price: "$0",
          period: "",
          features: [],
          ctaText: "Choose",
          ctaLink: "#",
          highlight: false,
        },
      ],
    });
  };
  const removePlan = (idx: number) => {
    onUpdate({ plans: (data.plans || []).filter((_, i) => i !== idx) });
  };
  const updatePlan = (
    idx: number,
    field: keyof PricingTableComponent["data"]["plans"][number],
    value: any
  ) => {
    const arr = [...(data.plans || [])];
    // @ts-ignore
    arr[idx] = { ...arr[idx], [field]: value };
    onUpdate({ plans: arr });
  };
  const addFeature = (idx: number) => {
    const arr = [...(data.plans || [])];
    arr[idx].features = [...(arr[idx].features || []), "New feature"];
    onUpdate({ plans: arr });
  };
  const updateFeature = (planIdx: number, featIdx: number, value: string) => {
    const arr = [...(data.plans || [])];
    arr[planIdx].features[featIdx] = value;
    onUpdate({ plans: arr });
  };
  const removeFeature = (planIdx: number, featIdx: number) => {
    const arr = [...(data.plans || [])];
    arr[planIdx].features = arr[planIdx].features.filter(
      (_, i) => i !== featIdx
    );
    onUpdate({ plans: arr });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Packages & Pricing"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <input
          type="text"
          value={data.subheading || ""}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Simple packages for every need"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select
            value={data.columns || 3}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select
            value={data.animation || "fade-in"}
            onChange={(e) => onUpdate({ animation: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select
            value={data.style || "light"}
            onChange={(e) => onUpdate({ style: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Variant</label>
          <select
            value={data.variant || "card"}
            onChange={(e) => onUpdate({ variant: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="card">Cards</option>
            <option value="flat">Flat</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="pricing-checkmarks"
            type="checkbox"
            checked={data.showFeatureChecks ?? true}
            onChange={(e) => onUpdate({ showFeatureChecks: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="pricing-checkmarks" className="text-sm">
            Show checkmarks
          </label>
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Plans</label>
          <button
            type="button"
            onClick={addPlan}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Plan
          </button>
        </div>
        <div className="space-y-3">
          {(data.plans || []).map((p, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Plan #{idx + 1}</span>
                <label className="text-xs flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!p.highlight}
                    onChange={(e) =>
                      updatePlan(idx, "highlight", e.target.checked)
                    }
                  />{" "}
                  Highlight
                </label>
                <button
                  type="button"
                  onClick={() => removePlan(idx)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={p.title || ""}
                    onChange={(e) => updatePlan(idx, "title", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={p.price || ""}
                    onChange={(e) => updatePlan(idx, "price", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={p.period || ""}
                    onChange={(e) => updatePlan(idx, "period", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="per session"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    CTA Text
                  </label>
                  <input
                    type="text"
                    value={p.ctaText || ""}
                    onChange={(e) => updatePlan(idx, "ctaText", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Book Now"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  CTA Link
                </label>
                <input
                  type="text"
                  value={p.ctaLink || ""}
                  onChange={(e) => updatePlan(idx, "ctaLink", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="/book-a-session"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium">Features</label>
                  <button
                    type="button"
                    onClick={() => addFeature(idx)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                {(p.features || []).map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => updateFeature(idx, fi, e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-xs"
                      placeholder="Feature"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(idx, fi)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!data.plans?.length && (
            <p className="text-sm text-gray-500">
              No plans yet. Add your first plan above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Gallery Highlights Properties
function GalleryHighlightsProperties({
  data,
  onUpdate,
}: {
  data: GalleryHighlightsComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const parseList = (s: string) =>
    s
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Categories (comma-separated)
        </label>
        <input
          type="text"
          value={(data.categories || []).join(", ")}
          onChange={(e) => onUpdate({ categories: parseList(e.target.value) })}
          className="w-full border rounded px-3 py-2"
          placeholder="wedding, portrait, event"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <input
            id="gh-featured"
            type="checkbox"
            checked={data.featuredOnly ?? true}
            onChange={(e) => onUpdate({ featuredOnly: e.target.checked })}
          />
          <label htmlFor="gh-featured" className="text-sm">
            Featured only
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Limit</label>
          <input
            type="number"
            min={1}
            value={Number(data.limit || 6)}
            onChange={(e) => onUpdate({ limit: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Limit per Category (optional)
          </label>
          <input
            type="number"
            min={0}
            value={Number(data.limitPerCategory || 0)}
            onChange={(e) =>
              onUpdate({ limitPerCategory: Number(e.target.value) })
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Group</label>
          <input
            type="text"
            value={data.group || ""}
            onChange={(e) => onUpdate({ group: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., homepage, fall-campaign"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Collections (comma-separated)
        </label>
        <input
          type="text"
          value={(data.collections || []).join(", ")}
          onChange={(e) => onUpdate({ collections: parseList(e.target.value) })}
          className="w-full border rounded px-3 py-2"
          placeholder="studio, on-location, products"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={(data.tags || []).join(", ")}
          onChange={(e) => onUpdate({ tags: parseList(e.target.value) })}
          className="w-full border rounded px-3 py-2"
          placeholder="best, hero, cover, bts"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select
            value={data.sortBy || "display_order"}
            onChange={(e) => onUpdate({ sortBy: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="display_order">Display Order</option>
            <option value="created_at">Created At</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Sort Direction
          </label>
          <select
            value={data.sortDir || "asc"}
            onChange={(e) => onUpdate({ sortDir: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}

// Add missing TextProperties component
function TextProperties({
  data,
  onUpdate,
}: {
  data: TextComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const [cursorPos, setCursorPos] = React.useState<number>(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data.content;
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);
    onUpdate({ content: newText });

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>

        {/* Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertFormatting("<strong>", "</strong>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("<em>", "</em>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("<u>", "</u>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white underline"
            title="Underline"
          >
            U
          </button>
          <span className="border-l mx-1"></span>
          <button
            type="button"
            onClick={() =>
              insertFormatting('<h2 class="text-2xl font-bold mb-2">', "</h2>")
            }
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              insertFormatting('<h3 class="text-xl font-bold mb-2">', "</h3>")
            }
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Heading 3"
          >
            H3
          </button>
          <span className="border-l mx-1"></span>
          <button
            type="button"
            onClick={() => insertFormatting('<p class="text-lg">', "</p>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Large text"
          >
            Large
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<p class="text-sm">', "</p>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Small text"
          >
            Small
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={data.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={8}
          title="Text content"
          placeholder="Enter text content (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Select text and click formatting buttons, or use HTML tags
          directly
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Text alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <select
          value={data.size}
          onChange={(e) => onUpdate({ size: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Text size"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "none"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Text animation"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}

// Add missing ImageProperties component
function ImageProperties({
  data,
  onUpdate,
}: {
  data: ImageComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="text"
          value={data.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image URL"
          placeholder="Enter image URL"
          aria-label="Image URL"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alt Text</label>
        <input
          type="text"
          value={data.alt}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Alt text"
          placeholder="Enter alt text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Caption</label>
        <input
          type="text"
          value={data.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image caption"
          placeholder="Enter caption"
        />
        <div className="mt-2 mb-2 text-xs text-gray-500">or upload:</div>
        <ImageUploader onImageUrl={(url) => onUpdate({ url })} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Link To (optional)
        </label>
        <input
          type="text"
          value={data.link || ""}
          onChange={(e) => onUpdate({ link: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image link"
          placeholder="/gallery or https://example.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Make image clickable - links to another page
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "none"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image animation"
        >
          <option value="none">None</option>
          <option value="hover-zoom">Zoom on Hover</option>
          <option value="fade-in">Fade In (scroll)</option>
          <option value="slide-up">Slide Up (scroll)</option>
          <option value="zoom">Zoom In (scroll)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Width</label>
        <select
          value={data.width}
          onChange={(e) => onUpdate({ width: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Image width"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="full">Full Width</option>
        </select>
      </div>
    </div>
  );
}

function ButtonProperties({
  data,
  onUpdate,
}: {
  data: ButtonComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={data.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button text"
          placeholder="Enter button text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Link</label>
        <input
          type="text"
          value={data.link}
          onChange={(e) => onUpdate({ link: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button link"
          placeholder="Enter button link"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Style</label>
        <select
          value={data.style}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button style"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "none"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Button animation"
        >
          <option value="none">None</option>
          <option value="hover-zoom">Zoom on Hover</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}

function ColumnsProperties({
  data,
  onUpdate,
}: {
  data: ColumnsComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const columnRefs = React.useRef<(HTMLTextAreaElement | null)[]>([]);

  const insertColumnFormatting = (
    colIndex: number,
    before: string,
    after: string
  ) => {
    const textarea = columnRefs.current[colIndex];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data.columns[colIndex].content;
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);
    const newColumns = [...data.columns];
    newColumns[colIndex].content = newText;
    onUpdate({ columns: newColumns });

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "none"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
          title="Columns animation"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
      {data.columns.map((col, i) => (
        <div key={i} className="border rounded p-3 space-y-2">
          <h4 className="font-medium">Column {i + 1}</h4>

          {/* Formatting Toolbar for each column */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border rounded">
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, "<strong>", "</strong>")}
              className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, "<em>", "</em>")}
              className="px-2 py-1 text-xs border rounded hover:bg-white italic"
              title="Italic"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => insertColumnFormatting(i, "<u>", "</u>")}
              className="px-2 py-1 text-xs border rounded hover:bg-white underline"
              title="Underline"
            >
              U
            </button>
            <span className="border-l mx-1"></span>
            <button
              type="button"
              onClick={() =>
                insertColumnFormatting(
                  i,
                  '<h3 class="text-xl font-bold mb-2">',
                  "</h3>"
                )
              }
              className="px-2 py-1 text-xs border rounded hover:bg-white"
              title="Heading"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() =>
                insertColumnFormatting(i, '<p class="text-lg">', "</p>")
              }
              className="px-2 py-1 text-xs border rounded hover:bg-white"
              title="Large text"
            >
              Large
            </button>
            <button
              type="button"
              onClick={() =>
                insertColumnFormatting(i, '<p class="text-sm">', "</p>")
              }
              className="px-2 py-1 text-xs border rounded hover:bg-white"
              title="Small text"
            >
              Small
            </button>
          </div>

          <textarea
            ref={(el) => {
              columnRefs.current[i] = el;
            }}
            value={col.content}
            onChange={(e) => {
              const newColumns = [...data.columns];
              newColumns[i].content = e.target.value;
              onUpdate({ columns: newColumns });
            }}
            className="w-full border rounded px-2 py-1 text-sm font-mono"
            rows={4}
            title={`Column ${i + 1} content`}
            placeholder={`Enter content for column ${i + 1} (HTML allowed)`}
          />
        </div>
      ))}
      <p className="text-xs text-gray-500">
        Tip: Select text and click formatting buttons to add title/body styles
      </p>
    </div>
  );
}

function SpacerProperties({
  data,
  onUpdate,
}: {
  data: SpacerComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="spacer-height"
          className="block text-sm font-medium mb-1"
        >
          Height
        </label>
        <select
          id="spacer-height"
          value={data.height}
          onChange={(e) => onUpdate({ height: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="sm">Small (2rem)</option>
          <option value="md">Medium (4rem)</option>
          <option value="lg">Large (6rem)</option>
          <option value="xl">Extra Large (8rem)</option>
        </select>
      </div>
    </div>
  );
}

function SEOFooterProperties({
  data,
  onUpdate,
}: {
  data: SEOFooterComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const insertFormatting = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data.content;
    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);
    onUpdate({ content: newText });
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Footer HTML</label>
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertFormatting("<strong>", "</strong>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("<em>", "</em>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("<u>", "</u>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white underline"
          >
            U
          </button>
          <span className="border-l mx-1"></span>
          <button
            type="button"
            onClick={() =>
              insertFormatting('<h3 class="text-lg font-bold mb-2">', "</h3>")
            }
            className="px-2 py-1 text-xs border rounded hover:bg-white"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<p class="text-sm">', "</p>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
          >
            P
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={data.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={8}
          placeholder="Enter footer HTML (e.g., NAP, service areas, internal links)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Include business name, address, phone, key services and service
          areas.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="seo-footer-schema"
          type="checkbox"
          checked={!!data.includeSchema}
          onChange={(e) => onUpdate({ includeSchema: e.target.checked })}
          className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
        />
        <label htmlFor="seo-footer-schema" className="text-sm">
          Embed LocalBusiness JSON-LD
        </label>
      </div>
    </div>
  );
}

function SlideshowHeroProperties({
  data,
  onUpdate,
}: {
  data: SlideshowHeroComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const titleRef = React.useRef<HTMLTextAreaElement>(null);
  const subtitleRef = React.useRef<HTMLTextAreaElement>(null);

  const insertTitleFormatting = (before: string, after: string) => {
    const textarea = titleRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data.title || "";
    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);
    onUpdate({ title: newText });
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const insertSubtitleFormatting = (before: string, after: string) => {
    const textarea = subtitleRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data.subtitle || "";
    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);
    onUpdate({ subtitle: newText });
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const addSlide = () => {
    onUpdate({
      slides: [...(data.slides || []), { image: "", category: "", title: "" }],
    });
  };
  const removeSlide = (idx: number) => {
    onUpdate({ slides: data.slides?.filter((_, i) => i !== idx) || [] });
  };
  const updateSlide = (
    idx: number,
    field: keyof (typeof data.slides)[0],
    value: string
  ) => {
    const newSlides = [...(data.slides || [])];
    newSlides[idx] = { ...newSlides[idx], [field]: value };
    onUpdate({ slides: newSlides });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Main Title</label>
        {/* Title Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertTitleFormatting("<strong>", "</strong>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting("<em>", "</em>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertTitleFormatting("<br/>", "")}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Line break"
          >
            ↵
          </button>
          <button
            type="button"
            onClick={() =>
              insertTitleFormatting('<span class="text-amber-300">', "</span>")
            }
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Highlight (amber)"
          >
            ✨
          </button>
        </div>
        <textarea
          ref={titleRef}
          value={data.title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={2}
          placeholder="Studio 37 (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">Use HTML for formatting</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        {/* Subtitle Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border rounded">
          <button
            type="button"
            onClick={() => insertSubtitleFormatting("<strong>", "</strong>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white font-bold"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertSubtitleFormatting("<em>", "</em>")}
            className="px-2 py-1 text-xs border rounded hover:bg-white italic"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertSubtitleFormatting("<br/>", "")}
            className="px-2 py-1 text-xs border rounded hover:bg-white"
            title="Line break"
          >
            ↵
          </button>
        </div>
        <textarea
          ref={subtitleRef}
          value={data.subtitle || ""}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={2}
          placeholder="Professional Photography (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">Use HTML for formatting</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Button Text</label>
          <input
            type="text"
            value={data.buttonText || ""}
            onChange={(e) => onUpdate({ buttonText: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Book Now"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Button Link</label>
          <input
            type="text"
            value={data.buttonLink || ""}
            onChange={(e) => onUpdate({ buttonLink: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="/book-a-session"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Interval (ms)
          </label>
          <input
            type="number"
            value={data.intervalMs || 5000}
            onChange={(e) => onUpdate({ intervalMs: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
            min="1500"
            step="500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Overlay Opacity (%)
          </label>
          <input
            type="number"
            value={data.overlay ?? 60}
            onChange={(e) => onUpdate({ overlay: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
            min="0"
            max="100"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Alignment</label>
          <select
            value={data.alignment || "center"}
            onChange={(e) => onUpdate({ alignment: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Button Style</label>
          <select
            value={data.buttonStyle || "primary"}
            onChange={(e) => onUpdate({ buttonStyle: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Title Color</label>
          <select
            value={data.titleColor || "text-white"}
            onChange={(e) => onUpdate({ titleColor: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="text-white">White</option>
            <option value="text-amber-50">Light Amber</option>
            <option value="text-amber-200">Amber</option>
            <option value="text-gray-100">Light Gray</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Subtitle Color
          </label>
          <select
            value={data.subtitleColor || "text-amber-50"}
            onChange={(e) => onUpdate({ subtitleColor: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="text-white">White</option>
            <option value="text-amber-50">Light Amber</option>
            <option value="text-amber-200">Amber</option>
            <option value="text-gray-100">Light Gray</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Button Animation
          </label>
          <select
            value={data.buttonAnimation || "none"}
            onChange={(e) => onUpdate({ buttonAnimation: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="none">None</option>
            <option value="hover-zoom">Hover Zoom</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="slideshow-fullbleed"
            type="checkbox"
            checked={!!data.fullBleed}
            onChange={(e) => onUpdate({ fullBleed: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="slideshow-fullbleed" className="text-sm">
            Full Bleed
          </label>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Slides</label>
          <button
            type="button"
            onClick={addSlide}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Slide
          </button>
        </div>
        {data.slides?.map((slide, idx) => (
          <div key={idx} className="border rounded p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Slide {idx + 1}</h4>
              <button
                type="button"
                onClick={() => removeSlide(idx)}
                className="text-red-600 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={slide.image || ""}
                onChange={(e) => updateSlide(idx, "image", e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Category</label>
              <input
                type="text"
                value={slide.category || ""}
                onChange={(e) => updateSlide(idx, "category", e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Creative Portraits"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Title (optional)
              </label>
              <input
                type="text"
                value={slide.title || ""}
                onChange={(e) => updateSlide(idx, "title", e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Slide Title"
              />
            </div>
          </div>
        ))}
        {!data.slides?.length && (
          <p className="text-sm text-gray-500">
            No slides yet. Add your first slide above.
          </p>
        )}
      </div>
    </div>
  );
}

function TestimonialsProperties({
  data,
  onUpdate,
}: {
  data: TestimonialsComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addTestimonial = () => {
    onUpdate({
      testimonials: [
        ...(data.testimonials || []),
        { quote: "", author: "", subtext: "", avatar: "" },
      ],
    });
  };
  const removeTestimonial = (idx: number) => {
    onUpdate({
      testimonials: data.testimonials?.filter((_, i) => i !== idx) || [],
    });
  };
  const updateTestimonial = (
    idx: number,
    field: keyof (typeof data.testimonials)[0],
    value: string
  ) => {
    const newTestimonials = [...(data.testimonials || [])];
    newTestimonials[idx] = { ...newTestimonials[idx], [field]: value };
    onUpdate({ testimonials: newTestimonials });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Testimonials</label>
          <button
            type="button"
            onClick={addTestimonial}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Testimonial
          </button>
        </div>
        {data.testimonials?.map((t, idx) => (
          <div key={idx} className="border rounded p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Testimonial {idx + 1}</h4>
              <button
                type="button"
                onClick={() => removeTestimonial(idx)}
                className="text-red-600 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Quote</label>
              <textarea
                value={t.quote || ""}
                onChange={(e) =>
                  updateTestimonial(idx, "quote", e.target.value)
                }
                className="w-full border rounded px-2 py-1 text-sm"
                rows={3}
                placeholder="Their testimonial..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Author</label>
              <input
                type="text"
                value={t.author || ""}
                onChange={(e) =>
                  updateTestimonial(idx, "author", e.target.value)
                }
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Client Name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Subtext (Role/Location)
              </label>
              <input
                type="text"
                value={t.subtext || ""}
                onChange={(e) =>
                  updateTestimonial(idx, "subtext", e.target.value)
                }
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Client from Houston, TX"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Avatar URL (optional)
              </label>
              <input
                type="text"
                value={t.avatar || ""}
                onChange={(e) =>
                  updateTestimonial(idx, "avatar", e.target.value)
                }
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
        {!data.testimonials?.length && (
          <p className="text-sm text-gray-500">
            No testimonials yet. Add your first testimonial above.
          </p>
        )}
      </div>
    </div>
  );
}

function WidgetEmbedProperties({
  data,
  onUpdate,
}: {
  data: WidgetEmbedComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const [scriptUrl, setScriptUrl] = React.useState("");
  const addScript = () => {
    const url = scriptUrl.trim();
    if (!url) return;
    onUpdate({ scriptSrcs: [...(data.scriptSrcs || []), url] });
    setScriptUrl("");
  };
  const removeScript = (idx: number) => {
    onUpdate({
      scriptSrcs: (data.scriptSrcs || []).filter((_, i) => i !== idx),
    });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Provider</label>
        <select
          value={data.provider || "thumbtack"}
          onChange={(e) => onUpdate({ provider: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="thumbtack">Thumbtack</option>
          <option value="google">Google</option>
          <option value="yelp">Yelp</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">HTML Snippet</label>
        <textarea
          value={data.html || ""}
          onChange={(e) => onUpdate({ html: e.target.value })}
          className="w-full border rounded px-3 py-2 font-mono text-xs"
          rows={6}
          placeholder="Paste the widget HTML (without <script> tags is okay)"
        />
        <p className="text-xs text-gray-500 mt-1">
          If your snippet includes a &lt;script src=...&gt;, we\'ll try to
          detect it too.
        </p>
      </div>
      <div className="border-t pt-3">
        <label className="block text-sm font-medium mb-2">Script URLs</label>
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={scriptUrl}
            onChange={(e) => setScriptUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addScript();
              }
            }}
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="https://..."
          />
          <button
            type="button"
            onClick={addScript}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="space-y-1">
          {(data.scriptSrcs || []).map((src, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border rounded px-3 py-2 text-xs bg-gray-50"
            >
              <span className="truncate mr-2">{src}</span>
              <button
                type="button"
                onClick={() => removeScript(idx)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          {!data.scriptSrcs?.length && (
            <p className="text-xs text-gray-500">
              No scripts yet. Add at least one script URL (e.g., the Thumbtack
              widget script).
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="widget-style-reset"
          type="checkbox"
          checked={data.styleReset ?? true}
          onChange={(e) => onUpdate({ styleReset: e.target.checked })}
          className="h-4 w-4"
        />
        <label htmlFor="widget-style-reset" className="text-sm">
          Reset styles inside widget (recommended)
        </label>
      </div>
      {data.provider === "thumbtack" && (
        <div className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded p-2">
          Tip: Paste the Thumbtack script URL like{" "}
          <code>
            https://www.thumbtack.com/profile/widgets/scripts/?service_pk=YOUR_SERVICE_PK&widget_id=review&type=one
          </code>
          . Use minimal HTML like{" "}
          <code>&lt;div id=\"tt-dynamic\"&gt;&lt;/div&gt;</code>. The style
          reset here fixes the oversized fonts/colors in your screenshot.
        </div>
      )}
    </div>
  );
}

function BadgesProperties({
  data,
  onUpdate,
}: {
  data: BadgesComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addBadge = () => {
    const next = {
      icon: "star" as const,
      label: "New Badge",
      sublabel: "",
      color: "",
      href: "",
    };
    onUpdate({ badges: [...(data.badges || []), next] });
  };
  const removeBadge = (idx: number) => {
    onUpdate({ badges: (data.badges || []).filter((_, i) => i !== idx) });
  };
  const updateBadge = (
    idx: number,
    field: keyof BadgesComponent["data"]["badges"][number],
    value: string
  ) => {
    const arr = [...(data.badges || [])];
    //@ts-ignore
    arr[idx] = { ...arr[idx], [field]: value };
    onUpdate({ badges: arr });
  };

  const applyPreset = (name: "yelp" | "thumbtack" | "google" | "certified") => {
    let preset: BadgesComponent["data"]["badges"] = [];
    if (name === "yelp") {
      preset = [
        {
          icon: "yelp",
          label: "5.0 • Yelp Reviews",
          sublabel: "★★★★★",
          color: "#d32323",
          href: "https://www.yelp.com",
        },
      ];
    } else if (name === "thumbtack") {
      preset = [
        {
          icon: "thumbtack",
          label: "Thumbtack Top Pro",
          sublabel: "Highly Rated",
          color: "#15a6ff",
          href: "https://www.thumbtack.com",
        },
      ];
    } else if (name === "google") {
      preset = [
        {
          icon: "google",
          label: "5.0 • Google Reviews",
          sublabel: "★★★★★",
          color: "#34a853",
          href: "https://www.google.com/search",
        },
      ];
    } else if (name === "certified") {
      preset = [
        {
          icon: "shield",
          label: "Certified Professional Photographer",
          sublabel: "Studio 37",
          color: "#0ea5e9",
        },
      ];
    }
    onUpdate({ badges: [...(data.badges || []), ...preset] });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={data.alignment || "center"}
          onChange={(e) => onUpdate({ alignment: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <select
            value={data.size || "md"}
            onChange={(e) => onUpdate({ size: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select
            value={data.style || "pill"}
            onChange={(e) => onUpdate({ style: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="pill">Pill</option>
            <option value="solid">Solid</option>
            <option value="outline">Outline</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "fade-in"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Badges</label>
          <button
            type="button"
            onClick={addBadge}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Badge
          </button>
        </div>
        <div className="space-y-3">
          {(data.badges || []).map((b, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 inline-flex items-center gap-2">
                  {/* Tiny visual thumbnail preview */}
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-white text-[12px]"
                    title="Preview"
                    style={
                      // Apply inline color when hex is used, otherwise rely on Tailwind text-* class on child span
                      b.color && b.color.startsWith('#') ? { color: b.color } : undefined
                    }
                  >
                    <span className={b.color && b.color.startsWith('text-') ? b.color : ''}>
                      {b.icon === 'thumbtack' ? '📌' : b.icon === 'shield' ? '🛡️' : b.icon === 'camera' ? '📷' : b.icon === 'check' ? '✔️' : '★'}
                    </span>
                  </span>
                  <span>Badge #{idx + 1}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeBadge(idx)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Icon</label>
                  <select
                    value={b.icon}
                    onChange={(e) => updateBadge(idx, "icon", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="star">Star</option>
                    <option value="yelp">Yelp (star)</option>
                    <option value="google">Google (star)</option>
                    <option value="thumbtack">Thumbtack</option>
                    <option value="shield">Shield</option>
                    <option value="camera">Camera</option>
                    <option value="check">Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Color (hex or CSS)
                  </label>
                  <input
                    type="text"
                    value={b.color || ""}
                    onChange={(e) => updateBadge(idx, "color", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="#d32323 or text-red-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={b.label || ""}
                  onChange={(e) => updateBadge(idx, "label", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Badge label"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Sublabel (optional)
                </label>
                <input
                  type="text"
                  value={b.sublabel || ""}
                  onChange={(e) => updateBadge(idx, "sublabel", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="e.g., ★★★★★ or Highly Rated"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Link (optional)
                </label>
                <input
                  type="url"
                  value={b.href || ""}
                  onChange={(e) => updateBadge(idx, "href", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}
          {!data.badges?.length && (
            <p className="text-sm text-gray-500">
              No badges yet. Use presets below or add your first badge.
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <label className="block text-sm font-medium mb-2">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset("yelp")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
          >
            Add Yelp 5-Star
          </button>
          <button
            type="button"
            onClick={() => applyPreset("google")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
          >
            Add Google 5-Star
          </button>
          <button
            type="button"
            onClick={() => applyPreset("thumbtack")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
          >
            Add Thumbtack Top Pro
          </button>
          <button
            type="button"
            onClick={() => applyPreset("certified")}
            className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
          >
            Add Certified Photographer
          </button>
        </div>
      </div>
    </div>
  );
}

// Services Grid Properties
function ServicesGridProperties({
  data,
  onUpdate,
}: {
  data: ServicesGridComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addService = () => {
    const next = {
      image: "",
      title: "New Service",
      description: "",
      features: [],
    };
    onUpdate({ services: [...(data.services || []), next] });
  };
  const removeService = (idx: number) => {
    onUpdate({ services: (data.services || []).filter((_, i) => i !== idx) });
  };
  const updateService = (
    idx: number,
    field: keyof ServicesGridComponent["data"]["services"][number],
    value: any
  ) => {
    const arr = [...(data.services || [])];
    arr[idx] = { ...arr[idx], [field]: value };
    onUpdate({ services: arr });
  };
  const addFeature = (serviceIdx: number) => {
    const arr = [...(data.services || [])];
    arr[serviceIdx].features = [
      ...(arr[serviceIdx].features || []),
      "New feature",
    ];
    onUpdate({ services: arr });
  };
  const removeFeature = (serviceIdx: number, featureIdx: number) => {
    const arr = [...(data.services || [])];
    arr[serviceIdx].features = arr[serviceIdx].features.filter(
      (_, i) => i !== featureIdx
    );
    onUpdate({ services: arr });
  };
  const updateFeature = (
    serviceIdx: number,
    featureIdx: number,
    value: string
  ) => {
    const arr = [...(data.services || [])];
    arr[serviceIdx].features[featureIdx] = value;
    onUpdate({ services: arr });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Our Services"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <input
          type="text"
          value={data.subheading || ""}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="What we offer"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select
            value={data.columns || 3}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select
            value={data.animation || "none"}
            onChange={(e) => onUpdate({ animation: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Services</label>
          <button
            type="button"
            onClick={addService}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Service
          </button>
        </div>
        <div className="space-y-3">
          {(data.services || []).map((s, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Service #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeService(idx)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={s.image || ""}
                  onChange={(e) => updateService(idx, "image", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={s.title || ""}
                  onChange={(e) => updateService(idx, "title", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Service name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={s.description || ""}
                  onChange={(e) =>
                    updateService(idx, "description", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                  rows={2}
                  placeholder="Service description"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Link (optional)
                </label>
                <input
                  type="text"
                  value={s.link || ""}
                  onChange={(e) => updateService(idx, "link", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="/services/wedding-photography"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium">Features</label>
                  <button
                    type="button"
                    onClick={() => addFeature(idx)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                {(s.features || []).map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => updateFeature(idx, fi, e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-xs"
                      placeholder="Feature"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(idx, fi)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!data.services?.length && (
            <p className="text-sm text-gray-500">
              No services yet. Add your first service above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Properties
function StatsProperties({
  data,
  onUpdate,
}: {
  data: StatsComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addStat = () => {
    const next = { icon: "📊", number: "0", label: "New Stat", suffix: "" };
    onUpdate({ stats: [...(data.stats || []), next] });
  };
  const removeStat = (idx: number) => {
    onUpdate({ stats: (data.stats || []).filter((_, i) => i !== idx) });
  };
  const updateStat = (
    idx: number,
    field: keyof StatsComponent["data"]["stats"][number],
    value: string
  ) => {
    const arr = [...(data.stats || [])];
    arr[idx] = { ...arr[idx], [field]: value };
    onUpdate({ stats: arr });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Our Impact"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select
            value={data.columns || 3}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select
            value={data.style || "default"}
            onChange={(e) => onUpdate({ style: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="default">Default</option>
            <option value="cards">Cards</option>
            <option value="minimal">Minimal</option>
            <option value="inline-badges">Inline Badges</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Animation</label>
        <select
          value={data.animation || "none"}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Statistics</label>
          <button
            type="button"
            onClick={addStat}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {(data.stats || []).map((s, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Stat #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeStat(idx)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Icon (emoji or text)
                  </label>
                  <input
                    type="text"
                    value={s.icon || ""}
                    onChange={(e) => updateStat(idx, "icon", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="📊 or icon"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    value={s.number || ""}
                    onChange={(e) => updateStat(idx, "number", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="150"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Suffix (optional)
                  </label>
                  <input
                    type="text"
                    value={s.suffix || ""}
                    onChange={(e) => updateStat(idx, "suffix", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="+ or %"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={s.label || ""}
                    onChange={(e) => updateStat(idx, "label", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Happy Clients"
                  />
                </div>
              </div>
            </div>
          ))}
          {!data.stats?.length && (
            <p className="text-sm text-gray-500">
              No stats yet. Add your first statistic above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// CTA Banner Properties
function CTABannerProperties({
  data,
  onUpdate,
}: {
  data: CTABannerComponent["data"];
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Ready to get started?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <textarea
          value={data.subheading || ""}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={2}
          placeholder="Let's make something amazing together"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Primary Button Text
          </label>
          <input
            type="text"
            value={data.primaryButtonText || ""}
            onChange={(e) => onUpdate({ primaryButtonText: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Book Now"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Primary Button Link
          </label>
          <input
            type="url"
            value={data.primaryButtonLink || ""}
            onChange={(e) => onUpdate({ primaryButtonLink: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="/book-a-session"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Secondary Button Text
          </label>
          <input
            type="text"
            value={data.secondaryButtonText || ""}
            onChange={(e) => onUpdate({ secondaryButtonText: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Learn More"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Secondary Button Link
          </label>
          <input
            type="url"
            value={data.secondaryButtonLink || ""}
            onChange={(e) => onUpdate({ secondaryButtonLink: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="/about"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Background Image URL (optional)
        </label>
        <input
          type="url"
          value={data.backgroundImage || ""}
          onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="https://..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={data.backgroundColor || "#0f172a"}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="w-full border rounded px-3 py-2 h-10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Overlay Opacity (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.overlay || 60}
            onChange={(e) => onUpdate({ overlay: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <select
            value={data.textColor || "text-white"}
            onChange={(e) => onUpdate({ textColor: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="text-white">White</option>
            <option value="text-gray-900">Dark</option>
            <option value="text-primary-600">Primary</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select
            value={data.animation || "fade-in"}
            onChange={(e) => onUpdate({ animation: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.fullBleed ?? true}
            onChange={(e) => onUpdate({ fullBleed: e.target.checked })}
          />
          <span className="text-sm font-medium">Full Bleed (edge-to-edge)</span>
        </label>
      </div>
    </div>
  );
}

// Icon Features Properties
function IconFeaturesProperties({
  data,
  onUpdate,
}: {
  data: IconFeaturesComponent["data"];
  onUpdate: (data: any) => void;
}) {
  const addFeature = () => {
    const next = {
      icon: "✨",
      title: "New Feature",
      description: "Feature description",
    };
    onUpdate({ features: [...(data.features || []), next] });
  };
  const removeFeature = (idx: number) => {
    onUpdate({ features: (data.features || []).filter((_, i) => i !== idx) });
  };
  const updateFeature = (
    idx: number,
    field: keyof IconFeaturesComponent["data"]["features"][number],
    value: string
  ) => {
    const arr = [...(data.features || [])];
    arr[idx] = { ...arr[idx], [field]: value };
    onUpdate({ features: arr });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Heading</label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="Why Choose Us"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheading</label>
        <input
          type="text"
          value={data.subheading || ""}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="What makes us different"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <select
            value={data.columns || 4}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select
            value={data.animation || "fade-in"}
            onChange={(e) => onUpdate({ animation: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Features</label>
          <button
            type="button"
            onClick={addFeature}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Feature
          </button>
        </div>
        <div className="space-y-3">
          {(data.features || []).map((f, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Feature #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Icon (emoji or text)
                </label>
                <input
                  type="text"
                  value={f.icon || ""}
                  onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="📸 or icon"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={f.title || ""}
                  onChange={(e) => updateFeature(idx, "title", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Feature name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={f.description || ""}
                  onChange={(e) =>
                    updateFeature(idx, "description", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                  rows={2}
                  placeholder="Feature description"
                />
              </div>
            </div>
          ))}
          {!data.features?.length && (
            <p className="text-sm text-gray-500">
              No features yet. Add your first feature above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
