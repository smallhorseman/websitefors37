/**
 * Browser-based SEO Analysis Library
 * No external APIs required - all analysis done client-side
 */

export interface SEOAnalysisResult {
  score: number;
  issues: SEOIssue[];
  recommendations: string[];
  metrics: SEOMetrics;
  competitorComparison?: CompetitorComparison;
  trendingKeywords?: string[];
}

export interface CompetitorComparison {
  yourScore: number;
  competitorScore?: number;
  gaps: string[];
  opportunities: string[];
}

export interface SEOIssue {
  severity: "critical" | "warning" | "info";
  category: "content" | "meta" | "structure" | "performance" | "keywords";
  message: string;
  fix?: string;
}

export interface SEOMetrics {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  readingTime: number;
  sentenceCount: number;
  paragraphCount: number;
  headingStructure: HeadingAnalysis;
  linkAnalysis: LinkAnalysis;
  imageAnalysis: ImageAnalysis;
}

export interface HeadingAnalysis {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  hasProperHierarchy: boolean;
  missingLevels: string[];
}

export interface LinkAnalysis {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: string[];
  noFollowLinks: number;
}

export interface ImageAnalysis {
  totalImages: number;
  missingAlt: number;
  oversizedImages: string[];
  properFormat: boolean;
}

export interface KeywordSuggestion {
  keyword: string;
  frequency: number;
  relevance: number;
  variations: string[];
}

/**
 * Main SEO Analyzer Class
 */
export class SEOAnalyzer {
  private content: string;
  private title: string;
  private metaDescription: string;
  private url: string;

  constructor(params: {
    content: string;
    title?: string;
    metaDescription?: string;
    url?: string;
  }) {
    this.content = params.content;
    this.title = params.title || "";
    this.metaDescription = params.metaDescription || "";
    this.url = params.url || "";
  }

  /**
   * Run complete SEO analysis
   */
  analyze(): SEOAnalysisResult {
    const issues: SEOIssue[] = [];
    const recommendations: string[] = [];

    // Calculate metrics
    const metrics = this.calculateMetrics();

    // Analyze title
    const titleIssues = this.analyzeTitleTag();
    issues.push(...titleIssues);

    // Analyze meta description
    const metaIssues = this.analyzeMetaDescription();
    issues.push(...metaIssues);

    // Analyze content length
    if (metrics.wordCount < 300) {
      issues.push({
        severity: "critical",
        category: "content",
        message: `Content is too short (${metrics.wordCount} words). Aim for at least 300 words.`,
        fix: "Add more comprehensive, valuable content to improve SEO and user engagement.",
      });
    } else if (metrics.wordCount < 600) {
      issues.push({
        severity: "warning",
        category: "content",
        message: `Content length is minimal (${metrics.wordCount} words). Consider expanding.`,
        fix: "Aim for 600-1000 words for better SEO performance.",
      });
    }

    // Analyze readability
    if (metrics.readabilityScore < 60) {
      issues.push({
        severity: "warning",
        category: "content",
        message:
          "Content may be difficult to read. Simplify language and sentence structure.",
        fix: "Use shorter sentences, simpler words, and break up long paragraphs.",
      });
    }

    // Analyze heading structure
    if (metrics.headingStructure.h1Count === 0) {
      issues.push({
        severity: "critical",
        category: "structure",
        message: "No H1 heading found. Every page should have exactly one H1.",
        fix: "Add a descriptive H1 heading that includes your primary keyword.",
      });
    } else if (metrics.headingStructure.h1Count > 1) {
      issues.push({
        severity: "warning",
        category: "structure",
        message: `Multiple H1 headings found (${metrics.headingStructure.h1Count}). Use only one H1 per page.`,
        fix: "Convert extra H1s to H2 or H3 tags.",
      });
    }

    if (!metrics.headingStructure.hasProperHierarchy) {
      issues.push({
        severity: "info",
        category: "structure",
        message: "Heading hierarchy is not optimal.",
        fix: "Use headings in order (H1 → H2 → H3) without skipping levels.",
      });
    }

    // Analyze images
    if (metrics.imageAnalysis.missingAlt > 0) {
      issues.push({
        severity: "warning",
        category: "content",
        message: `${metrics.imageAnalysis.missingAlt} images missing alt text.`,
        fix: "Add descriptive alt text to all images for better SEO and accessibility.",
      });
    }

    // Generate recommendations
    recommendations.push(...this.generateRecommendations(metrics, issues));

    // Calculate overall score
    const score = this.calculateScore(issues, metrics);

    return {
      score,
      issues,
      recommendations,
      metrics,
    };
  }

  /**
   * Calculate SEO metrics
   */
  private calculateMetrics(): SEOMetrics {
    const plainText = this.stripHTML(this.content);
    const words = this.extractWords(plainText);
    const sentences = this.extractSentences(plainText);
    const paragraphs = this.content.split(/\n\n+/).filter((p) => p.trim());

    return {
      wordCount: words.length,
      readabilityScore: this.calculateReadability(plainText),
      keywordDensity: this.calculateKeywordDensity(words),
      readingTime: Math.ceil(words.length / 200), // Assume 200 words per minute
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      headingStructure: this.analyzeHeadings(),
      linkAnalysis: this.analyzeLinks(),
      imageAnalysis: this.analyzeImages(),
    };
  }

  /**
   * Analyze title tag
   */
  private analyzeTitleTag(): SEOIssue[] {
    const issues: SEOIssue[] = [];

    if (!this.title) {
      issues.push({
        severity: "critical",
        category: "meta",
        message: "Missing title tag.",
        fix: "Add a descriptive title tag (50-60 characters) that includes your primary keyword.",
      });
    } else if (this.title.length < 30) {
      issues.push({
        severity: "warning",
        category: "meta",
        message: `Title is too short (${this.title.length} characters).`,
        fix: "Expand your title to 50-60 characters for optimal SEO.",
      });
    } else if (this.title.length > 60) {
      issues.push({
        severity: "warning",
        category: "meta",
        message: `Title is too long (${this.title.length} characters). It may be truncated in search results.`,
        fix: "Shorten your title to 50-60 characters.",
      });
    }

    return issues;
  }

  /**
   * Analyze meta description
   */
  private analyzeMetaDescription(): SEOIssue[] {
    const issues: SEOIssue[] = [];

    if (!this.metaDescription) {
      issues.push({
        severity: "critical",
        category: "meta",
        message: "Missing meta description.",
        fix: "Add a compelling meta description (150-160 characters) that summarizes your page content.",
      });
    } else if (this.metaDescription.length < 120) {
      issues.push({
        severity: "warning",
        category: "meta",
        message: `Meta description is too short (${this.metaDescription.length} characters).`,
        fix: "Expand your meta description to 150-160 characters.",
      });
    } else if (this.metaDescription.length > 160) {
      issues.push({
        severity: "info",
        category: "meta",
        message: `Meta description is long (${this.metaDescription.length} characters). It may be truncated.`,
        fix: "Consider shortening to 150-160 characters.",
      });
    }

    return issues;
  }

  /**
   * Analyze heading structure
   */
  private analyzeHeadings(): HeadingAnalysis {
    const h1Matches = this.content.match(/<h1[^>]*>/gi) || [];
    const h2Matches = this.content.match(/<h2[^>]*>/gi) || [];
    const h3Matches = this.content.match(/<h3[^>]*>/gi) || [];

    const h1Count = h1Matches.length;
    const h2Count = h2Matches.length;
    const h3Count = h3Matches.length;

    // Check proper hierarchy
    let hasProperHierarchy = true;
    const missingLevels: string[] = [];

    if (h1Count > 0 && h3Count > 0 && h2Count === 0) {
      hasProperHierarchy = false;
      missingLevels.push("H2");
    }

    return {
      h1Count,
      h2Count,
      h3Count,
      hasProperHierarchy,
      missingLevels,
    };
  }

  /**
   * Analyze links
   */
  private analyzeLinks(): LinkAnalysis {
    const linkMatches =
      this.content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || [];

    let internalLinks = 0;
    let externalLinks = 0;
    let noFollowLinks = 0;

    linkMatches.forEach((link) => {
      const hrefMatch = link.match(/href=["']([^"']+)["']/);
      if (hrefMatch) {
        const href = hrefMatch[1];
        if (href.startsWith("http") && !href.includes(this.url)) {
          externalLinks++;
        } else {
          internalLinks++;
        }
      }

      if (link.includes('rel=["\'"]nofollow["\'"]')) {
        noFollowLinks++;
      }
    });

    return {
      totalLinks: linkMatches.length,
      internalLinks,
      externalLinks,
      brokenLinks: [], // Would need server-side check
      noFollowLinks,
    };
  }

  /**
   * Analyze images
   */
  private analyzeImages(): ImageAnalysis {
    const imgMatches = this.content.match(/<img[^>]+>/gi) || [];

    let missingAlt = 0;
    imgMatches.forEach((img) => {
      if (!img.includes("alt=")) {
        missingAlt++;
      }
    });

    return {
      totalImages: imgMatches.length,
      missingAlt,
      oversizedImages: [], // Would need actual image analysis
      properFormat: true, // Assume proper format for now
    };
  }

  /**
   * Calculate Flesch Reading Ease score
   */
  private calculateReadability(text: string): number {
    const words = this.extractWords(text);
    const sentences = this.extractSentences(text);
    const syllables = this.countSyllables(text);

    if (words.length === 0 || sentences.length === 0) return 0;

    const score =
      206.835 -
      1.015 * (words.length / sentences.length) -
      84.6 * (syllables / words.length);
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate keyword density
   */
  private calculateKeywordDensity(words: string[]): Record<string, number> {
    const density: Record<string, number> = {};
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "should",
      "could",
      "may",
      "might",
      "can",
      "this",
      "that",
      "these",
      "those",
    ]);

    words.forEach((word) => {
      const lower = word.toLowerCase();
      if (lower.length > 3 && !stopWords.has(lower)) {
        density[lower] = (density[lower] || 0) + 1;
      }
    });

    // Convert to percentages
    const total = words.length;
    Object.keys(density).forEach((word) => {
      density[word] = (density[word] / total) * 100;
    });

    return density;
  }

  /**
   * Extract keywords and suggestions
   */
  extractKeywords(limit: number = 10): KeywordSuggestion[] {
    const words = this.extractWords(this.stripHTML(this.content));
    const density = this.calculateKeywordDensity(words);

    const keywords: KeywordSuggestion[] = [];

    Object.entries(density)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .forEach(([word, freq]) => {
        keywords.push({
          keyword: word,
          frequency: Math.round(freq * 100) / 100,
          relevance: this.calculateRelevance(word),
          variations: this.findVariations(word, words),
        });
      });

    return keywords;
  }

  /**
   * Generate AI-like recommendations
   */
  private generateRecommendations(
    metrics: SEOMetrics,
    issues: SEOIssue[]
  ): string[] {
    const recommendations: string[] = [];

    // Content recommendations
    if (metrics.wordCount < 1000) {
      recommendations.push(
        "Consider expanding your content with more detailed information, examples, and supporting data."
      );
    }

    if (metrics.paragraphCount < 5) {
      recommendations.push(
        "Break up your content into more paragraphs for better readability."
      );
    }

    // Heading recommendations
    if (metrics.headingStructure.h2Count < 3) {
      recommendations.push(
        "Add more H2 subheadings to organize your content and improve scannability."
      );
    }

    // Link recommendations
    if (metrics.linkAnalysis.internalLinks < 2) {
      recommendations.push(
        "Add internal links to other relevant pages on your site to improve navigation and SEO."
      );
    }

    if (metrics.linkAnalysis.externalLinks === 0) {
      recommendations.push(
        "Consider adding links to authoritative external sources to support your content."
      );
    }

    // Keyword recommendations
    const topKeywords = this.extractKeywords(5);
    if (topKeywords.length > 0) {
      const topKeyword = topKeywords[0].keyword;
      recommendations.push(
        `Your top keyword is "${topKeyword}". Consider using variations of this keyword throughout your content naturally.`
      );
    }

    // Image recommendations
    if (metrics.imageAnalysis.totalImages === 0 && metrics.wordCount > 500) {
      recommendations.push(
        "Add relevant images to break up text and improve engagement."
      );
    }

    return recommendations;
  }

  /**
   * Calculate overall SEO score (0-100)
   */
  private calculateScore(issues: SEOIssue[], metrics: SEOMetrics): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach((issue) => {
      if (issue.severity === "critical") score -= 15;
      else if (issue.severity === "warning") score -= 8;
      else score -= 3;
    });

    // Deduct for poor content metrics
    if (metrics.wordCount < 300) score -= 20;
    if (metrics.readabilityScore < 50) score -= 10;
    if (metrics.headingStructure.h1Count !== 1) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  // Helper methods
  private stripHTML(html: string): string {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private extractWords(text: string): string[] {
    return text.match(/\b[a-z]+\b/gi) || [];
  }

  private extractSentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+/g) || [];
  }

  private countSyllables(text: string): number {
    const words = this.extractWords(text);
    let count = 0;

    words.forEach((word) => {
      word = word.toLowerCase();
      if (word.length <= 3) {
        count++;
        return;
      }

      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
      word = word.replace(/^y/, "");
      const matches = word.match(/[aeiouy]{1,2}/g);
      count += matches ? matches.length : 1;
    });

    return count;
  }

  private calculateRelevance(word: string): number {
    // Simple relevance based on position in title/meta
    const titleWords = this.extractWords(this.title.toLowerCase());
    const metaWords = this.extractWords(this.metaDescription.toLowerCase());

    let relevance = 50;
    if (titleWords.includes(word)) relevance += 30;
    if (metaWords.includes(word)) relevance += 20;

    return Math.min(100, relevance);
  }

  private findVariations(word: string, allWords: string[]): string[] {
    const variations = new Set<string>();
    const lowerWord = word.toLowerCase();

    allWords.forEach((w) => {
      const lowerW = w.toLowerCase();
      if (
        lowerW.includes(lowerWord) &&
        lowerW !== lowerWord &&
        lowerW.length <= lowerWord.length + 3
      ) {
        variations.add(w);
      }
    });

    return Array.from(variations).slice(0, 3);
  }
}

/**
 * Generate SEO-optimized meta description
 */
export async function generateMetaDescription(
  content: string,
  targetKeyword?: string
): Promise<string> {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];

  // Extract key information
  const words = plainText.toLowerCase().split(/\s+/);
  const hasPhotography = words.some((w) => w.includes("photo"));
  const hasWedding = words.some((w) => w.includes("wedding"));
  const hasPortrait = words.some((w) => w.includes("portrait"));
  const hasCommercial = words.some((w) => w.includes("commercial"));
  const hasEvent = words.some((w) => w.includes("event"));

  let description = "";

  // Smart description generation based on content analysis
  if (targetKeyword) {
    // Find the most relevant sentence with the keyword
    const keywordSentences = sentences.filter((s) =>
      s.toLowerCase().includes(targetKeyword.toLowerCase())
    );

    if (keywordSentences.length > 0) {
      // Pick the most descriptive sentence (prefer longer ones that aren't too long)
      const bestSentence = keywordSentences.reduce((best, current) => {
        const len = current.trim().length;
        const bestLen = best.trim().length;
        if (len > 80 && len < 160 && (bestLen < 80 || bestLen > 160)) {
          return current;
        }
        return best;
      }, keywordSentences[0]);

      description = bestSentence.trim();
    }
  }

  // If no keyword match, create a smart description from content
  if (!description && sentences.length > 0) {
    // Build a description from the first 2-3 sentences
    let combined = "";
    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      const sentence = sentences[i].trim();
      if (combined.length + sentence.length < 155) {
        combined += (combined ? " " : "") + sentence;
      } else {
        break;
      }
    }
    description = combined;
  }

  // Clean up and optimize
  description = description
    .replace(/\s+/g, " ")
    .replace(/^(the|a|an)\s+/i, "") // Remove leading articles
    .trim();

  // Ensure it's within ideal length (150-160 chars)
  if (description.length > 160) {
    description = description.substring(0, 157) + "...";
  } else if (description.length < 120 && targetKeyword) {
    // Pad with keyword if too short
    const addition = ` Professional ${targetKeyword} services.`;
    if (description.length + addition.length <= 160) {
      description += addition;
    }
  }

  // Final fallback
  if (!description || description.length < 50) {
    description =
      "Professional photography services in Pinehurst, TX. Specializing in weddings, portraits, events, and commercial photography. Book your session today!";
  }

  return description;
}

/**
 * Generate SEO-friendly title
 */
export async function generateTitle(
  content: string,
  targetKeyword?: string,
  maxLength: number = 60
): Promise<string> {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Extract H1 as base
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  let title = h1Match ? h1Match[1].trim() : "";

  // If no H1, look for the first strong statement
  if (!title) {
    const sentences = plainText.match(/[^.!?]+/g) || [];
    // Find a sentence that looks like a title (shorter, punchy)
    const potentialTitle = sentences.find((s) => {
      const len = s.trim().length;
      return len > 20 && len < 100 && !s.toLowerCase().startsWith("the ");
    });
    title =
      potentialTitle?.trim() ||
      sentences[0]?.trim() ||
      "Professional Photography";
  }

  // Clean up title
  title = title
    .replace(/\s+/g, " ")
    .replace(/[:|—–-]\s*$/, "") // Remove trailing punctuation
    .trim();

  // Add keyword if not present and if specified
  if (
    targetKeyword &&
    !title.toLowerCase().includes(targetKeyword.toLowerCase())
  ) {
    // Smart keyword integration
    const keywordCapitalized = targetKeyword
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    // If title is short enough, prepend keyword
    if (title.length + keywordCapitalized.length + 3 <= maxLength) {
      title = `${keywordCapitalized} | ${title}`;
    } else {
      // Replace or shorten
      title = `${keywordCapitalized} - ${title}`;
    }
  }

  // Add brand if there's room and it's not already there
  const hasBrand =
    title.toLowerCase().includes("studio") ||
    title.toLowerCase().includes("studio37");

  if (!hasBrand && title.length + 18 <= maxLength) {
    title = `${title} | Studio37`;
  }

  // Truncate to max length if needed
  if (title.length > maxLength) {
    // Try to cut at a word boundary
    const truncated = title.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > maxLength * 0.7) {
      title = truncated.substring(0, lastSpace) + "...";
    } else {
      title = truncated + "...";
    }
  }

  return title;
}

/**
 * Compare your content with a competitor's page
 */
export async function analyzeCompetitor(
  competitorUrl: string
): Promise<CompetitorComparison | null> {
  try {
    // Fetch competitor page (requires CORS or server-side proxy)
    const response = await fetch(`/api/seo/analyze-live`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: competitorUrl }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Analyze their content
    const analyzer = new SEOAnalyzer({
      content: data.content.plainText,
      title: data.title,
      metaDescription: data.metaDescription,
      url: competitorUrl,
    });

    const result = analyzer.analyze();

    return {
      yourScore: 0, // Will be filled by caller
      competitorScore: result.score,
      gaps: [
        data.headings.h1.length > 0
          ? `Competitor has ${data.headings.h1.length} H1 headings`
          : "",
        data.images.withAlt > data.images.withoutAlt
          ? "Competitor has better image alt text coverage"
          : "",
        data.content.wordCount > 1000
          ? `Competitor has ${data.content.wordCount} words`
          : "",
      ].filter(Boolean),
      opportunities: [
        data.links.external === 0 ? "Add external authoritative links" : "",
        data.structuredData.length === 0 ? "Add structured data (JSON-LD)" : "",
        !data.canonical ? "Add canonical tag" : "",
      ].filter(Boolean),
    };
  } catch (error) {
    console.error("Competitor analysis failed:", error);
    return null;
  }
}

/**
 * Get trending photography/studio keywords
 */
export function getTrendingKeywords(
  category: string = "photography"
): string[] {
  const keywordDatabase: Record<string, string[]> = {
    photography: [
      "professional photography",
      "studio photography",
      "portrait photography",
      "wedding photography",
      "commercial photography",
      "family portraits",
      "headshot photography",
      "event photography",
      "photography packages",
      "photo session booking",
    ],
    wedding: [
      "wedding photographer",
      "engagement photos",
      "bridal photography",
      "wedding album",
      "destination wedding",
      "wedding package",
    ],
    portrait: [
      "family portrait",
      "senior portraits",
      "professional headshots",
      "maternity photos",
      "newborn photography",
      "children photography",
    ],
    commercial: [
      "product photography",
      "business headshots",
      "commercial photography services",
      "real estate photography",
      "architectural photography",
    ],
  };

  return keywordDatabase[category] || keywordDatabase.photography;
}

/**
 * Calculate content freshness score
 */
export function calculateFreshnessScore(
  publishDate: Date,
  lastModified?: Date
): number {
  const now = new Date();
  const contentDate = lastModified || publishDate;
  const daysSince = Math.floor(
    (now.getTime() - contentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSince < 30) return 100;
  if (daysSince < 90) return 90;
  if (daysSince < 180) return 75;
  if (daysSince < 365) return 60;
  return 40;
}

/**
 * Generate content improvement suggestions based on gaps
 */
export function generateImprovementPlan(
  analysis: SEOAnalysisResult,
  targetScore: number = 90
): string[] {
  const plan: string[] = [];
  const currentScore = analysis.score;
  const gap = targetScore - currentScore;

  if (gap <= 0) {
    return ["Your content is already well-optimized!"];
  }

  // Prioritize critical issues first
  const critical = analysis.issues.filter((i) => i.severity === "critical");
  const warnings = analysis.issues.filter((i) => i.severity === "warning");

  if (critical.length > 0) {
    plan.push(
      `🚨 Fix ${critical.length} critical issue(s) first (potential +${
        critical.length * 5
      } points)`
    );
    critical.forEach((issue) => {
      if (issue.fix) plan.push(`  → ${issue.fix}`);
    });
  }

  if (warnings.length > 0 && gap > 10) {
    plan.push(
      `⚠️ Address ${warnings.length} warning(s) (potential +${
        warnings.length * 3
      } points)`
    );
    warnings.slice(0, 3).forEach((issue) => {
      if (issue.fix) plan.push(`  → ${issue.fix}`);
    });
  }

  // Content-specific recommendations
  if (analysis.metrics.wordCount < 800) {
    plan.push(
      `📝 Expand content to 800-1200 words (currently ${analysis.metrics.wordCount})`
    );
  }

  if (
    analysis.metrics.keywordDensity &&
    Object.keys(analysis.metrics.keywordDensity).length < 5
  ) {
    plan.push(
      `🔑 Use more varied keywords (currently using ${
        Object.keys(analysis.metrics.keywordDensity).length
      })`
    );
  }

  if (analysis.metrics.linkAnalysis.internalLinks < 3) {
    plan.push(
      `🔗 Add ${
        3 - analysis.metrics.linkAnalysis.internalLinks
      } more internal links`
    );
  }

  if (analysis.metrics.imageAnalysis.missingAlt > 0) {
    plan.push(
      `🖼️ Add alt text to ${analysis.metrics.imageAnalysis.missingAlt} image(s)`
    );
  }

  return plan;
}
