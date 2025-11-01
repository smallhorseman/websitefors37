"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Eye, RefreshCw, Settings, Save } from "lucide-react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/supabase";

interface GalleryHighlightsEditorProps {
  allImages: GalleryImage[];
  onSave?: (config: GalleryHighlightsConfig) => Promise<void>;
}

interface GalleryHighlightsConfig {
  categories: string[];
  featuredOnly: boolean;
  limit: number;
  collections: string[];
  tags: string[];
  group: string;
  sortBy: "display_order" | "created_at";
  sortDir: "asc" | "desc";
  limitPerCategory: number;
  animation: "none" | "fade-in" | "slide-up" | "zoom";
}

export default function GalleryHighlightsEditor({
  allImages,
  onSave,
}: GalleryHighlightsEditorProps) {
  const [config, setConfig] = useState<GalleryHighlightsConfig>({
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
  });

  const [previewImages, setPreviewImages] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);

  // Update preview when config changes
  useEffect(() => {
    updatePreview();
  }, [config, allImages]);

  const updatePreview = () => {
    let filtered = [...allImages];

    // Apply filters
    if (config.featuredOnly) {
      filtered = filtered.filter((img) => img.featured);
    }

    if (config.categories.length > 0) {
      filtered = filtered.filter((img) =>
        config.categories.includes(img.category)
      );
    }

    if (config.tags.length > 0) {
      filtered = filtered.filter((img) =>
        img.tags?.some((tag) => config.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal =
        config.sortBy === "display_order"
          ? a.display_order || 0
          : new Date(a.created_at).getTime();
      const bVal =
        config.sortBy === "display_order"
          ? b.display_order || 0
          : new Date(b.created_at).getTime();
      return config.sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    // Apply limit per category if set
    if (config.limitPerCategory > 0 && config.categories.length > 0) {
      const limited: GalleryImage[] = [];
      config.categories.forEach((cat) => {
        const catImages = filtered
          .filter((img) => img.category === cat)
          .slice(0, config.limitPerCategory);
        limited.push(...catImages);
      });
      filtered = limited;
    }

    // Apply total limit
    filtered = filtered.slice(0, config.limit);

    setPreviewImages(filtered);
  };

  const updateConfig = (updates: Partial<GalleryHighlightsConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const parseList = (s: string) =>
    s
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(config);
    } catch (error) {
      console.error("Failed to save config:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Gallery Highlights Editor</h2>
              <p className="text-sm text-primary-100">
                Configure featured images for your website
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary-700 rounded-lg hover:bg-primary-50 font-medium disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Config"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 p-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </h3>

            <div className="space-y-4">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Categories
                  <span className="text-gray-400 ml-2 text-xs">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={config.categories.join(", ")}
                  onChange={(e) =>
                    updateConfig({ categories: parseList(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="wedding, portrait, event"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to show all categories
                </p>
              </div>

              {/* Featured Only */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="featured-only"
                  checked={config.featuredOnly}
                  onChange={(e) =>
                    updateConfig({ featuredOnly: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <label htmlFor="featured-only" className="text-sm font-medium">
                  Show only featured images
                </label>
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={config.limit}
                    onChange={(e) =>
                      updateConfig({ limit: parseInt(e.target.value) || 6 })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Per Category
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={config.limitPerCategory}
                    onChange={(e) =>
                      updateConfig({
                        limitPerCategory: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">0 = no limit</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags
                  <span className="text-gray-400 ml-2 text-xs">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={config.tags.join(", ")}
                  onChange={(e) =>
                    updateConfig({ tags: parseList(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="best, hero, cover"
                />
              </div>

              {/* Collections */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Collections
                  <span className="text-gray-400 ml-2 text-xs">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={config.collections.join(", ")}
                  onChange={(e) =>
                    updateConfig({ collections: parseList(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="studio, on-location"
                />
              </div>

              {/* Group */}
              <div>
                <label className="block text-sm font-medium mb-2">Group</label>
                <input
                  type="text"
                  value={config.group}
                  onChange={(e) => updateConfig({ group: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="homepage, fall-campaign"
                />
              </div>

              {/* Sorting */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sort By
                  </label>
                  <select
                    value={config.sortBy}
                    onChange={(e) =>
                      updateConfig({
                        sortBy: e.target.value as
                          | "display_order"
                          | "created_at",
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="display_order">Display Order</option>
                    <option value="created_at">Created Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Direction
                  </label>
                  <select
                    value={config.sortDir}
                    onChange={(e) =>
                      updateConfig({
                        sortDir: e.target.value as "asc" | "desc",
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              {/* Animation */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Animation
                </label>
                <select
                  value={config.animation}
                  onChange={(e) =>
                    updateConfig({ animation: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="none">None</option>
                  <option value="fade-in">Fade In</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <div className="sticky top-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
              <button
                onClick={updatePreview}
                className="ml-auto p-2 hover:bg-gray-100 rounded-lg"
                title="Refresh preview"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </h3>

            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium">
                  Showing {previewImages.length} of {allImages.length} images
                </span>
                {previewImages.length === 0 && (
                  <span className="text-xs text-red-600">
                    No images match filters
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                {previewImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-[4/3] bg-white rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-400 transition-all"
                  >
                    <Image
                      src={image.image_url}
                      alt={image.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                        <p className="text-xs font-semibold truncate">
                          {image.title}
                        </p>
                        <p className="text-xs text-gray-200">
                          {image.category}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-white/90 rounded px-2 py-1 text-xs font-bold">
                      {index + 1}
                    </div>
                    {image.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {previewImages.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">
                    No images match your current filters
                  </p>
                  <p className="text-xs mt-1">
                    Try adjusting your configuration
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="bg-blue-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {previewImages.length}
                </div>
                <div className="text-xs text-blue-700">Selected</div>
              </div>
              <div className="bg-green-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {previewImages.filter((img) => img.featured).length}
                </div>
                <div className="text-xs text-green-700">Featured</div>
              </div>
              <div className="bg-purple-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(previewImages.map((img) => img.category)).size}
                </div>
                <div className="text-xs text-purple-700">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
