import React from 'react'

export const dynamic = 'force-dynamic'

function useSEOAnalyzer() {
  const [url, setUrl] = React.useState('/services')
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<any | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const analyze = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const q = new URLSearchParams({ url }).toString()
      const res = await fetch(`/api/seo/analyze?${q}`, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to analyze')
      setData(json)
    } catch (e: any) {
      setError(e?.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    analyze()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { url, setUrl, loading, error, data, analyze }
}

export default function AdminSEOPage() {
  const { url, setUrl, loading, error, data, analyze } = useSEOAnalyzer()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">SEO & AI Assistant</h1>
            <p className="text-gray-600">Analyze any on-site URL for AI visibility and SEO signals, with keyword suggestions.</p>
          </header>

          <div className="bg-white border rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                placeholder="/ , /services , /gallery , /blog/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button onClick={analyze} disabled={loading} className="btn-primary px-4 py-2">
                {loading ? 'Analyzing…' : 'Analyze'}
              </button>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          {data && (
            <div className="grid md:grid-cols-3 gap-6">
              <section className="md:col-span-2 bg-white border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Results</h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Title</div>
                    <div className="font-medium break-words">{data.title || '—'}</div>
                    <div className="text-xs text-gray-500">{data.titleLength} chars</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Meta Description</div>
                    <div className="break-words">{data.metaDescription || '—'}</div>
                    <div className="text-xs text-gray-500">{data.descriptionLength} chars</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Canonical</div>
                    <div className="break-words">{data.canonical || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">H1 Count</div>
                    <div className="font-medium">{data.h1Count}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Word Count</div>
                    <div className="font-medium">{data.wordCount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Images with Alt</div>
                    <div className="font-medium">{data.imageAltWithText}/{data.imageCount}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold">Structured Data</h3>
                  <p className="text-sm text-gray-600">Detected JSON‑LD types: {data.jsonLdTypes?.length ? data.jsonLdTypes.join(', ') : 'none'}</p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold">Open Graph</h3>
                  <pre className="text-xs bg-gray-50 border rounded p-3 overflow-auto">{JSON.stringify(data.openGraph, null, 2)}</pre>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold">Recommendations</h3>
                  {data.recommendations?.length ? (
                    <ul className="list-disc ml-5 text-sm">
                      {data.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-green-700">Looking good! No urgent issues detected.</p>
                  )}
                </div>
              </section>

              <aside className="bg-white border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Keyword Suggestions</h2>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Top Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {data.keywords?.map((k: string) => (
                      <span key={k} className="px-2 py-1 text-xs bg-amber-50 border border-amber-200 rounded">{k}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Key Phrases</div>
                  <div className="flex flex-wrap gap-2">
                    {data.keyPhrases?.map((k: string) => (
                      <span key={k} className="px-2 py-1 text-xs bg-gray-50 border rounded">{k}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-sm">
                  <h3 className="font-semibold mb-2">AI Visibility Checklist</h3>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>LocalBusiness / Service JSON‑LD present</li>
                    <li>FAQPage JSON‑LD for common questions</li>
                    <li>Unique H1 and clear intro paragraph</li>
                    <li>Alt text on images (aim ≥70%)</li>
                    <li>Internal links to related services/locations</li>
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
