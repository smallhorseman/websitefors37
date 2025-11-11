'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Play, Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function DatabaseMigrationsPage() {
  const [migrations, setMigrations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [runningMigration, setRunningMigration] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchMigrations()
  }, [])

  const fetchMigrations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/run-migration')
      const data = await response.json()
      setMigrations(data.migrations || [])
    } catch (error) {
      console.error('Failed to fetch migrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async (migrationFile: string) => {
    if (!confirm(`Run migration: ${migrationFile}?\n\nThis will modify the database schema. Make sure you have a backup!`)) {
      return
    }

    setRunningMigration(migrationFile)
    
    try {
      const response = await fetch('/api/admin/run-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ migrationFile })
      })

      const data = await response.json()
      
      setResults({
        ...results,
        [migrationFile]: {
          success: response.ok,
          data
        }
      })

      if (response.ok) {
        alert('Migration completed successfully!')
      } else {
        alert(`Migration failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error: any) {
      alert(`Migration error: ${error.message}`)
      setResults({
        ...results,
        [migrationFile]: {
          success: false,
          data: { error: error.message }
        }
      })
    } finally {
      setRunningMigration(null)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8 text-blue-600" />
            Database Migrations
          </h1>
          <p className="text-gray-600 mt-2">
            Run database migrations to update your schema. Always backup your database before running migrations.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Important Notes</h3>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                <li>Migrations modify your database schema permanently</li>
                <li>Always backup your database before running migrations</li>
                <li>Run migrations in order from oldest to newest</li>
                <li>Some migrations may take time on large databases</li>
                <li>Do not interrupt a migration in progress</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Migrations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : migrations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No migration files found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {migrations.map((migration) => {
              const result = results[migration]
              const isRunning = runningMigration === migration
              
              return (
                <div 
                  key={migration}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-mono text-sm font-semibold">{migration}</h3>
                      {result && (
                        <div className="mt-2">
                          {result.success ? (
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <CheckCircle className="h-4 w-4" />
                              <span>Migration completed successfully</span>
                              {result.data.results && (
                                <span className="text-gray-500">
                                  ({result.data.results.length} statements executed)
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-red-700">
                                <XCircle className="h-4 w-4" />
                                <span>Migration failed</span>
                              </div>
                              {result.data.errors && (
                                <div className="text-xs bg-red-50 p-2 rounded border border-red-200 overflow-auto max-h-40">
                                  <pre className="text-red-800">
                                    {JSON.stringify(result.data.errors, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => runMigration(migration)}
                      disabled={isRunning || !!result?.success}
                      className={`ml-4 px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                        result?.success
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : isRunning
                          ? 'bg-gray-100 text-gray-400 cursor-wait'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : result?.success ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Run Migration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Quick Reference */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Reference</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Recent Migration:</strong> 2025-11-10_enhanced_content_system.sql</p>
            <p><strong>What it does:</strong> Adds enhanced CMS features including categories, tags, revisions, scheduling, SEO scoring, and more.</p>
            <p><strong>Tables added:</strong> content_revisions, page_comments, page_analytics, content_categories, content_activity_log</p>
            <p><strong>Columns added to content_pages:</strong> category, tags, featured_image, open_graph_image, scheduled_publish_at, status, seo_score, readability_score, view_count, parent_id, is_template, etc.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
