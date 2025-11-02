"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle,
  FileText,
  Hash,
  Eye,
  Link as LinkIcon,
  Image as ImageIcon,
  Target,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  SEOAnalyzer,
  type SEOAnalysisResult,
  type KeywordSuggestion,
  generateMetaDescription,
  generateTitle,
} from "@/lib/seo-analyzer";

interface SEOAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title?: string;
  metaDescription?: string;
  url?: string;
  onSave?: (updates: { title?: string; metaDescription?: string }) => void;
}

export default function SEOAnalyzerModal({
  isOpen,
  onClose,
  content,
  title = "",
  metaDescription = "",
  url = "",
  onSave,
}: SEOAnalyzerModalProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "keywords" | "content" | "technical"
  >("overview");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedMeta, setGeneratedMeta] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState<
    "enabled" | "disabled" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && content) {
      runAnalysis();
    }
  }, [isOpen, content, title, metaDescription]);

  const runAnalysis = () => {
    const analyzer = new SEOAnalyzer({ content, title, metaDescription, url });
    const result = analyzer.analyze();
    const extractedKeywords = analyzer.extractKeywords(20);

    setAnalysis(result);
    setKeywords(extractedKeywords);

    if (extractedKeywords.length > 0 && !targetKeyword) {
      setTargetKeyword(extractedKeywords[0].keyword);
    }
  };

  const handleGenerateTitle = async () => {
    setIsGenerating(true);
    setAiStatus(null);
    setErrorMessage(null);
    try {
      const generated = await generateTitle(content, targetKeyword);
      setGeneratedTitle(generated);
      setAiStatus("enabled");
    } catch (error: any) {
      console.error("Error generating title:", error);
      // Check if it's a 403 (AI disabled) - the generator will have already fallen back to local
      if (
        error?.message?.includes("403") ||
        error?.message?.includes("disabled")
      ) {
        setAiStatus("disabled");
        // Still use the result from local fallback
        setGeneratedTitle(error?.result || "");
      } else {
        setAiStatus("error");
        setErrorMessage(error?.message || "Failed to generate title");
        // Use local fallback result if available
        setGeneratedTitle(error?.result || "");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMeta = async () => {
    setIsGenerating(true);
    setAiStatus(null);
    setErrorMessage(null);
    try {
      const generated = await generateMetaDescription(content, targetKeyword);
      setGeneratedMeta(generated);
      setAiStatus("enabled");
    } catch (error: any) {
      console.error("Error generating meta description:", error);
      // Check if it's a 403 (AI disabled) - the generator will have already fallen back to local
      if (
        error?.message?.includes("403") ||
        error?.message?.includes("disabled")
      ) {
        setAiStatus("disabled");
        // Still use the result from local fallback
        setGeneratedMeta(error?.result || "");
      } else {
        setAiStatus("error");
        setErrorMessage(error?.message || "Failed to generate description");
        // Use local fallback result if available
        setGeneratedMeta(error?.result || "");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        title: generatedTitle || title,
        metaDescription: generatedMeta || metaDescription,
      });
    }
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">SEO Analyzer</h2>
              <p className="text-sm text-primary-100">
                AI-powered content optimization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runAnalysis}
              className="p-2 hover:bg-primary-500 rounded-lg transition-colors"
              title="Refresh analysis"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-500 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Score Banner */}
        {analysis && (
          <div
            className={`px-6 py-4 border-b ${getScoreColor(analysis.score)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{analysis.score}/100</div>
                <div className="text-sm font-medium mt-1">SEO Score</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {
                    analysis.issues.filter((i) => i.severity === "critical")
                      .length
                  }{" "}
                  Critical Issues
                </div>
                <div className="text-xs opacity-75">
                  {
                    analysis.issues.filter((i) => i.severity === "warning")
                      .length
                  }{" "}
                  Warnings
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-1 px-6">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "keywords", label: "Keywords", icon: Hash },
              { id: "content", label: "Content", icon: FileText },
              { id: "technical", label: "Technical", icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* AI Status Messages */}
          {aiStatus === "disabled" && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <strong>AI is off</strong> — using local suggestions. Enable AI
                in{" "}
                <a href="/admin/settings" className="underline font-medium">
                  Admin Settings
                </a>{" "}
                for smarter generation.
              </div>
            </div>
          )}
          {aiStatus === "error" && errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <strong>Error:</strong> {errorMessage}. Falling back to local
                generation.
              </div>
            </div>
          )}

          {activeTab === "overview" && analysis && (
            <div className="space-y-6">
              {/* Issues */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Issues & Recommendations
                </h3>
                <div className="space-y-2">
                  {analysis.issues.length === 0 ? (
                    <div className="flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-lg">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        No issues found! Your content is well-optimized.
                      </span>
                    </div>
                  ) : (
                    analysis.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {issue.message}
                            </p>
                            {issue.fix && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Fix:</span>{" "}
                                {issue.fix}
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
                            {issue.category}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg"
                      >
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-900">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Content Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {analysis.metrics.wordCount}
                    </div>
                    <div className="text-sm text-gray-600">Words</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {analysis.metrics.readingTime}m
                    </div>
                    <div className="text-sm text-gray-600">Reading Time</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(analysis.metrics.readabilityScore)}
                    </div>
                    <div className="text-sm text-gray-600">Readability</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {analysis.metrics.linkAnalysis.totalLinks}
                    </div>
                    <div className="text-sm text-gray-600">Links</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "keywords" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Target Keyword</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="Enter your target keyword..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleGenerateTitle}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Top Keywords</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {keywords.slice(0, 15).map((kw, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-lg hover:border-primary-400 cursor-pointer transition-colors"
                      onClick={() => setTargetKeyword(kw.keyword)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {kw.keyword}
                        </span>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                          {kw.frequency.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Relevance: {kw.relevance}%
                      </div>
                      {kw.variations.length > 0 && (
                        <div className="text-xs text-gray-400 mt-1 truncate">
                          {kw.variations.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6">
              {/* Title Generator */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  SEO Title Generator
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Current Title
                    </label>
                    <div className="p-3 bg-gray-50 rounded border text-sm">
                      {title || "(No title set)"}
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateTitle}
                    disabled={isGenerating}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Optimized Title
                      </>
                    )}
                  </button>
                  {generatedTitle && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Generated Title
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded text-sm">
                          {generatedTitle}
                        </div>
                        <button
                          onClick={() => copyToClipboard(generatedTitle)}
                          className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Length: {generatedTitle.length} characters
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meta Description Generator */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Meta Description Generator
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Current Description
                    </label>
                    <div className="p-3 bg-gray-50 rounded border text-sm">
                      {metaDescription || "(No meta description set)"}
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateMeta}
                    disabled={isGenerating}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Meta Description
                      </>
                    )}
                  </button>
                  {generatedMeta && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Generated Description
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded text-sm">
                          {generatedMeta}
                        </div>
                        <button
                          onClick={() => copyToClipboard(generatedMeta)}
                          className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Length: {generatedMeta.length} characters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "technical" && analysis && (
            <div className="space-y-6">
              {/* Heading Structure */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Heading Structure
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-3xl font-bold">
                      {analysis.metrics.headingStructure.h1Count}
                    </div>
                    <div className="text-sm text-gray-600">H1 Tags</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-3xl font-bold">
                      {analysis.metrics.headingStructure.h2Count}
                    </div>
                    <div className="text-sm text-gray-600">H2 Tags</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-3xl font-bold">
                      {analysis.metrics.headingStructure.h3Count}
                    </div>
                    <div className="text-sm text-gray-600">H3 Tags</div>
                  </div>
                </div>
              </div>

              {/* Link Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Link Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {analysis.metrics.linkAnalysis.internalLinks}
                    </div>
                    <div className="text-sm text-gray-600">Internal Links</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {analysis.metrics.linkAnalysis.externalLinks}
                    </div>
                    <div className="text-sm text-gray-600">External Links</div>
                  </div>
                </div>
              </div>

              {/* Image Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {analysis.metrics.imageAnalysis.totalImages}
                    </div>
                    <div className="text-sm text-gray-600">Total Images</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {analysis.metrics.imageAnalysis.missingAlt}
                    </div>
                    <div className="text-sm text-gray-600">
                      Missing Alt Text
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-between bg-gray-50 rounded-b-xl">
          <div className="text-sm text-gray-600">
            Smart SEO analysis • No external APIs used
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
            {onSave && (generatedTitle || generatedMeta) && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Apply Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
