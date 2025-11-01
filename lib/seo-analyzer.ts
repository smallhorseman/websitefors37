// Lightweight on-site SEO and AI visibility analyzer
// No external dependencies; uses regex/strings to extract signals from HTML

export interface SEOAnalysis {
  url: string
  title?: string
  titleLength: number
  metaDescription?: string
  descriptionLength: number
  canonical?: string
  hasRobotsMeta: boolean
  robots?: string
  openGraph: Record<string, string>
  twitter: Record<string, string>
  jsonLdTypes: string[]
  h1Count: number
  wordCount: number
  imageCount: number
  imageAltWithText: number
  keywords: string[]
  keyPhrases: string[]
  recommendations: string[]
  score: number
}

const STOPWORDS = new Set([
  'the','and','a','an','or','but','if','then','else','when','at','by','for','in','of','on','to','up','with','as','is','it','its','be','are','was','were','from','that','this','these','those','you','your','our','we','they','their','i','me','my','mine','ours','about','into','over','after','before','than','also','not','no','yes','can','could','just','so','than','do','does','did','done','will','would','should','have','has','had','he','she','him','her','them','us','use','using','used'
])

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function getMeta(html: string, name: string): string | undefined {
  const re = new RegExp(`<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')
  const m = html.match(re)
  return m?.[1]
}

function getMetaProperty(html: string, prop: string): string | undefined {
  const re = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')
  const m = html.match(re)
  return m?.[1]
}

function getLinkRel(html: string, rel: string): string | undefined {
  const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*href=["']([^"']*)["'][^>]*>`, 'i')
  const m = html.match(re)
  return m?.[1]
}

function extractJSONLDTypes(html: string): string[] {
  const types = new Set<string>()
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(html))) {
    const raw = match[1]
    try {
      const json = JSON.parse(raw)
      const collect = (node: any) => {
        if (!node) return
        const t = Array.isArray(node['@type']) ? node['@type'] : node['@type'] ? [node['@type']] : []
        t.forEach((v: string) => types.add(v))
        if (Array.isArray(node)) node.forEach(collect)
        if (typeof node === 'object') {
          Object.values(node).forEach(collect)
        }
      }
      collect(json)
    } catch {
      // ignore invalid JSON-LD blocks
    }
  }
  return Array.from(types)
}

function countTag(html: string, tag: string): number {
  const re = new RegExp(`<${tag}(\s|>)`, 'gi')
  const matches = html.match(re)
  return matches ? matches.length : 0
}

function countImgWithAlt(html: string): { total: number; withAlt: number } {
  const imgs = html.match(/<img[^>]*>/gi) || []
  let withAlt = 0
  for (const img of imgs) {
    if (/alt=\s*["'][^"']+["']/i.test(img)) withAlt++
  }
  return { total: imgs.length, withAlt }
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t && !STOPWORDS.has(t) && !/^\d+$/.test(t))
}

function topN<T>(map: Map<T, number>, n: number): T[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k)
}

export function extractKeywords(text: string, max = 15) {
  const tokens = tokenize(text)
  const unigram = new Map<string, number>()
  const bigram = new Map<string, number>()
  const trigram = new Map<string, number>()

  for (let i = 0; i < tokens.length; i++) {
    const a = tokens[i]
    if (!a) continue
    unigram.set(a, (unigram.get(a) || 0) + 1)
    if (i + 1 < tokens.length) {
      const b = tokens[i + 1]
      if (b) bigram.set(`${a} ${b}`, (bigram.get(`${a} ${b}`) || 0) + 1)
    }
    if (i + 2 < tokens.length) {
      const b = tokens[i + 1]
      const c = tokens[i + 2]
      if (b && c) trigram.set(`${a} ${b} ${c}`, (trigram.get(`${a} ${b} ${c}`) || 0) + 1)
    }
  }

  const keywords = topN(unigram, Math.floor(max * 0.6))
  const phrases = [...topN(bigram, Math.floor(max * 0.3)), ...topN(trigram, Math.floor(max * 0.1))]
  return { keywords, phrases }
}

export function analyzeHTML(url: string, html: string): SEOAnalysis {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i)
  const title = titleMatch?.[1]?.trim()
  const metaDescription = getMeta(html, 'description')
  const canonical = getLinkRel(html, 'canonical')
  const robots = getMeta(html, 'robots')
  const hasRobotsMeta = !!robots

  const openGraph: Record<string, string> = {}
  const ogKeys = ['og:title','og:description','og:image','og:type','og:url','og:site_name']
  ogKeys.forEach(k => { const v = getMetaProperty(html, k); if (v) openGraph[k] = v })

  const twitter: Record<string, string> = {}
  const twKeys = ['twitter:card','twitter:title','twitter:description','twitter:image']
  twKeys.forEach(k => { const v = getMetaProperty(html, k) || getMeta(html, k); if (v) twitter[k] = v })

  const jsonLdTypes = extractJSONLDTypes(html)
  const h1Count = countTag(html, 'h1')
  const text = stripTags(html)
  const wordCount = text ? text.split(/\s+/).length : 0
  const { total: imageCount, withAlt: imageAltWithText } = countImgWithAlt(html)

  const { keywords, phrases } = extractKeywords(text, 20)

  const recommendations: string[] = []
  if (!title || title.length < 30 || title.length > 65) recommendations.push('Adjust title tag to 30–65 characters.')
  if (!metaDescription || metaDescription.length < 120 || metaDescription.length > 170) recommendations.push('Write meta description (120–170 chars) summarizing page with primary keyword.')
  if (!canonical) recommendations.push('Add a canonical link tag to prevent duplicates.')
  if (!openGraph['og:image']) recommendations.push('Add an Open Graph image for rich sharing (1200×630).')
  if (!jsonLdTypes.length) recommendations.push('Add relevant JSON-LD (LocalBusiness, Service, FAQPage).')
  if (h1Count !== 1) recommendations.push('Use exactly one H1 for clear topical focus.')
  if (imageCount && imageAltWithText / imageCount < 0.7) recommendations.push('Add descriptive alt text to images (>70% coverage).')
  if (wordCount < 300) recommendations.push('Increase on-page copy to at least 300–600 words for context.')

  // simple score 0–100
  let score = 100
  score -= recommendations.length * 7
  score = Math.max(10, Math.min(100, score))

  return {
    url,
    title,
    titleLength: title?.length || 0,
    metaDescription,
    descriptionLength: metaDescription?.length || 0,
    canonical,
    hasRobotsMeta,
    robots,
    openGraph,
    twitter,
    jsonLdTypes,
    h1Count,
    wordCount,
    imageCount,
    imageAltWithText,
    keywords,
    keyPhrases: phrases,
    recommendations,
    score
  }
}
