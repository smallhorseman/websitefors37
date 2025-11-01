'use client'

import { useState } from 'react'
import { X, Search, TrendingUp, FileText, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

interface SEOAnalysis {
  score: number
  title: string
  description: string
  h1Count: number
  wordCount: number
  keywords: { word: string; count: number }[]
  recommendations: string[]
  structuredDataTypes: string[]
}

interface SEOAnalyzerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SEOAnalyzerModal({ isOpen, onClose }: SEOAnalyzerModalProps) {
  const [url, setUrl] = useState('')
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyzeURL = async () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      // Fetch the page content
      const response = await fetch(url)
      const html = await response.text()

      // Parse HTML and analyze
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Extract meta information
      const title = doc.querySelector('title')?.textContent || ''
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      
      // Count H1 tags
      const h1Count = doc.querySelectorAll('h1').length
      
      // Extract text content
      const bodyText = doc.body?.textContent || ''
      const words = bodyText.trim().split(/\s+/).filter(w => w.length > 0)
      const wordCount = words.length
      
      // Extract keywords (simple frequency analysis)
      const stopwords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from'])
      const wordFreq: { [key: string]: number } = {}
      
      words.forEach(word => {
        const cleaned = word.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (cleaned.length > 3 && !stopwords.has(cleaned)) {
          wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1
        }
      })
      
      const keywords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))
      
      // Detect structured data
      const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))
      const structuredDataTypes = jsonLdScripts.map(script => {
        try {
          const data = JSON.parse(script.textContent || '')
          return data['@type'] || 'Unknown'
        } catch {
          return 'Invalid'
        }
      }).filter(type => type !== 'Invalid')
      
      // Generate recommendations
      const recommendations: string[] = []
      let score = 100
      
      if (!title) {
        recommendations.push('⚠️ Missing page title - add a descriptive <title> tag')
        score -= 20
      } else if (title.length < 30) {
        recommendations.push('⚠️ Page title is too short - aim for 50-60 characters')
        score -= 10
      } else if (title.length > 60) {
        recommendations.push('⚠️ Page title is too long - keep it under 60 characters')
        score -= 5
      }
      
      if (!description) {
        recommendations.push('⚠️ Missing meta description - add one to improve click-through rates')
        score -= 20
      } else if (description.length < 120) {
        recommendations.push('⚠️ Meta description is too short - aim for 150-160 characters')
        score -= 10
      } else if (description.length > 160) {
        recommendations.push('⚠️ Meta description is too long - keep it under 160 characters')
        score -= 5
      }
      
      if (h1Count === 0) {
        recommendations.push('⚠️ Missing H1 tag - add exactly one H1 per page')
        score -= 15
      } else if (h1Count > 1) {
        recommendations.push('⚠️ Multiple H1 tags found - use only one H1 per page')
        score -= 10
      }
      
      if (wordCount < 300) {
        recommendations.push('⚠️ Low word count - aim for at least 300 words for better SEO')
        score -= 15
      }
      
      if (structuredDataTypes.length === 0) {
        recommendations.push('💡 Consider adding structured data (JSON-LD) for rich results')
        score -= 10
      }
      
      if (recommendations.length === 0) {
        recommendations.push('✅ Great job! Your page follows SEO best practices')
      }
      
      setAnalysis({
        score: Math.max(0, score),
        title,
        description,
        h1Count,
        wordCount,
        keywords,
        recommendations,
        structuredDataTypes
      })
    } catch (err) {
      setError('Failed to analyze URL. Make sure it\'s a valid URL and accessible.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">SEO & AI Analyzer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter URL to analyze
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && analyzeURL()}
              />
              <button
                onClick={analyzeURL}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Analyze
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* SEO Score */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Score</h3>
                    <p className="text-sm text-gray-600">Overall page optimization rating</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${
                      analysis.score >= 80 ? 'text-green-600' :
                      analysis.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {analysis.score}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">/ 100</p>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 mb-1">Page Title</p>
                      <p className="text-sm text-gray-900 break-words">
                        {analysis.title || 'No title found'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analysis.title.length} characters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 mb-1">Meta Description</p>
                      <p className="text-sm text-gray-900 break-words">
                        {analysis.description || 'No description found'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {analysis.description.length} characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{analysis.h1Count}</p>
                  <p className="text-sm text-gray-600 mt-1">H1 Tags</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{analysis.wordCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Words</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{analysis.structuredDataTypes.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Schema Types</p>
                </div>
              </div>

              {/* Top Keywords */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Top Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((kw, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {kw.word} ({kw.count})
                    </div>
                  ))}
                </div>
              </div>

              {/* Structured Data */}
              {analysis.structuredDataTypes.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Structured Data Detected</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.structuredDataTypes.map((type, idx) => (
                      <div
                        key={idx}
                        className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="mt-0.5">{rec.startsWith('✅') ? '✅' : rec.startsWith('💡') ? '💡' : '⚠️'}</span>
                      <span className="flex-1">{rec.replace(/^[⚠️💡✅]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Test Rich Results
                  </a>
                  <a
                    href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    PageSpeed Insights
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!analysis && !loading && !error && (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyze Your Pages</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter any URL from your website to get instant SEO insights, keyword analysis, and optimization recommendations.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 font-semibold mb-1">✓ Meta Tags</div>
                  <p className="text-sm text-gray-600">Title & description analysis</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-purple-600 font-semibold mb-1">✓ Keywords</div>
                  <p className="text-sm text-gray-600">Top keyword extraction</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 font-semibold mb-1">✓ Structure</div>
                  <p className="text-sm text-gray-600">H1 tags & content length</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-orange-600 font-semibold mb-1">✓ Schema</div>
                  <p className="text-sm text-gray-600">Structured data detection</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
