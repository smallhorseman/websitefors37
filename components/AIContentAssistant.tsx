/**
 * Real-Time AI Content Assistant
 * 
 * Provides intelligent writing suggestions as you type:
 * - SEO optimization tips
 * - Keyword density analysis
 * - Readability improvements
 * - Title and meta suggestions
 * - Grammar and style recommendations
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

interface ContentSuggestions {
  seoScore: number;
  suggestions: string[];
  keywords: {
    target: string;
    count: number;
    density: number;
    ideal: number;
  }[];
  readability: {
    grade: number;
    score: number;
    difficulty: "easy" | "medium" | "hard";
  };
  titleSuggestions: string[];
  metaSuggestions: string[];
}

interface AIContentAssistantProps {
  content: string;
  targetKeywords?: string[];
  onSuggestionsChange?: (suggestions: ContentSuggestions | null) => void;
  compact?: boolean;
}

export default function AIContentAssistant({
  content,
  targetKeywords = [],
  onSuggestionsChange,
  compact = false,
}: AIContentAssistantProps) {
  const [suggestions, setSuggestions] = useState<ContentSuggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"seo" | "readability" | "suggestions">("seo");

  // Debounced analysis function
  const analyzeContent = useCallback(
    debounce(async (text: string, keywords: string[]) => {
      if (!text || text.length < 50) {
        setSuggestions(null);
        onSuggestionsChange?.(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/content-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text,
            targetKeywords: keywords,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        setSuggestions(data);
        onSuggestionsChange?.(data);
      } catch (err: any) {
        setError(err.message || "Failed to generate suggestions");
        setSuggestions(null);
        onSuggestionsChange?.(null);
      } finally {
        setLoading(false);
      }
    }, 2000),
    [onSuggestionsChange]
  );

  useEffect(() => {
    analyzeContent(content, targetKeywords);
  }, [content, targetKeywords, analyzeContent]);

  if (!content || content.length < 50) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          ✍️ Start writing (at least 50 characters) to get AI-powered suggestions...
        </p>
      </div>
    );
  }

  if (loading && !suggestions) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          <p className="text-sm text-gray-600">Analyzing content with AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">⚠️ {error}</p>
      </div>
    );
  }

  if (!suggestions) return null;

  const scoreColor = 
    suggestions.seoScore >= 80 ? "text-green-600" :
    suggestions.seoScore >= 60 ? "text-yellow-600" :
    "text-red-600";

  const scoreIcon = 
    suggestions.seoScore >= 80 ? "✅" :
    suggestions.seoScore >= 60 ? "⚠️" :
    "❌";

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">AI SEO Score</span>
          <span className={`text-lg font-bold ${scoreColor}`}>
            {scoreIcon} {suggestions.seoScore}/100
          </span>
        </div>
        {suggestions.suggestions.length > 0 && (
          <div className="text-xs text-gray-600">
            {suggestions.suggestions.length} suggestions available
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header with Score */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">AI Content Assistant</h3>
            <p className="text-sm text-purple-100">Powered by Gemini 3 Pro Preview</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${scoreColor === "text-green-600" ? "text-green-300" : scoreColor === "text-yellow-600" ? "text-yellow-300" : "text-red-300"}`}>
              {suggestions.seoScore}
            </div>
            <div className="text-xs text-purple-100">SEO Score</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("seo")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "seo"
              ? "bg-white text-purple-600 border-b-2 border-purple-600"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          📊 SEO Analysis
        </button>
        <button
          onClick={() => setActiveTab("readability")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "readability"
              ? "bg-white text-purple-600 border-b-2 border-purple-600"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          📖 Readability
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "suggestions"
              ? "bg-white text-purple-600 border-b-2 border-purple-600"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          💡 Suggestions ({suggestions.suggestions.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === "seo" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Keyword Analysis</h4>
              {suggestions.keywords.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.keywords.map((kw, i) => (
                    <div key={i} className="bg-gray-50 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{kw.target}</span>
                        <span className={`text-sm ${kw.density >= kw.ideal ? "text-green-600" : "text-yellow-600"}`}>
                          {kw.count} uses ({(kw.density * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${kw.density >= kw.ideal ? "bg-green-500" : "bg-yellow-500"}`}
                          style={{ width: `${Math.min((kw.density / kw.ideal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Ideal: {(kw.ideal * 100).toFixed(1)}% ({Math.round(content.split(/\s+/).length * kw.ideal)} uses)
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Add target keywords to analyze</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Title Suggestions</h4>
              <div className="space-y-2">
                {suggestions.titleSuggestions.map((title, i) => (
                  <div
                    key={i}
                    className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-gray-800 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => navigator.clipboard.writeText(title)}
                  >
                    {title}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Meta Description Suggestions</h4>
              <div className="space-y-2">
                {suggestions.metaSuggestions.map((meta, i) => (
                  <div
                    key={i}
                    className="bg-green-50 border border-green-200 rounded p-2 text-sm text-gray-800 cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => navigator.clipboard.writeText(meta)}
                  >
                    {meta} <span className="text-xs text-gray-500">({meta.length} chars)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "readability" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Reading Grade Level</span>
                <span className="text-2xl font-bold text-blue-600">{suggestions.readability.grade}th</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Readability Score</span>
                <span className="text-2xl font-bold text-purple-600">{suggestions.readability.score}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Difficulty</span>
                <span className={`text-sm font-semibold ${
                  suggestions.readability.difficulty === "easy" ? "text-green-600" :
                  suggestions.readability.difficulty === "medium" ? "text-yellow-600" :
                  "text-red-600"
                }`}>
                  {suggestions.readability.difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Readability Tips</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-700">• Aim for 60-70 readability score (conversational)</li>
                <li className="text-sm text-gray-700">• Use shorter sentences and paragraphs</li>
                <li className="text-sm text-gray-700">• Avoid jargon and complex vocabulary</li>
                <li className="text-sm text-gray-700">• Include transition words (however, therefore, etc.)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="space-y-3">
            {suggestions.suggestions.map((suggestion, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 rounded p-3"
              >
                <p className="text-sm text-gray-800">{suggestion}</p>
              </div>
            ))}
            {suggestions.suggestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎉</div>
                <p>Great job! No major improvements needed.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Word count: {content.split(/\s+/).length}</span>
          {loading && <span className="text-purple-600">Updating...</span>}
          <button
            onClick={() => analyzeContent(content, targetKeywords)}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            🔄 Refresh Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
