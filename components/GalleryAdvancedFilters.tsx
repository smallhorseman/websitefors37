"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  Search,
  Filter,
  X,
  Save,
  Star,
  Calendar,
  Tag,
  Image,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Download,
} from "lucide-react";
import { debounce } from "lodash";
import type { GalleryImage } from "@/lib/supabase";

interface GalleryFiltersProps {
  images: GalleryImage[];
  onFilteredChange: (filtered: GalleryImage[]) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onBulkExport?: (images: GalleryImage[]) => void;
}

interface FilterState {
  search: string;
  category: string;
  featured: "all" | "featured" | "unfeatured";
  tags: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: "display_order" | "created_at" | "title" | "category";
  sortOrder: "asc" | "desc";
}

const defaultFilters: FilterState = {
  search: "",
  category: "all",
  featured: "all",
  tags: [],
  dateRange: { start: "", end: "" },
  sortBy: "display_order",
  sortOrder: "asc",
};

// Pre-saved filter presets
const FILTER_PRESETS = [
  {
    name: "Featured Only",
    filters: { ...defaultFilters, featured: "featured" as const },
  },
  {
    name: "Wedding Photos",
    filters: { ...defaultFilters, category: "wedding" },
  },
  {
    name: "Recent Uploads",
    filters: {
      ...defaultFilters,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    },
  },
  {
    name: "Needs Alt Text",
    filters: { ...defaultFilters, search: "missing:alt" },
  },
  { name: "Untagged", filters: { ...defaultFilters, search: "missing:tags" } },
];

export default function GalleryFilters({
  images,
  onFilteredChange,
  viewMode,
  onViewModeChange,
  onBulkExport,
}: GalleryFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedPresets, setSavedPresets] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gallery-filter-presets");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get all unique tags from images
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    images.forEach((img) => {
      if (img.tags) {
        img.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [images]);

  // Apply filters and search
  const filteredImages = useMemo(() => {
    let filtered = [...images];

    // Text search with smart keywords
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();

      // Special search keywords
      if (searchTerm === "missing:alt") {
        filtered = filtered.filter(
          (img) => !img.alt_text || img.alt_text.trim() === ""
        );
      } else if (searchTerm === "missing:tags") {
        filtered = filtered.filter((img) => !img.tags || img.tags.length === 0);
      } else if (searchTerm === "missing:description") {
        filtered = filtered.filter(
          (img) => !img.description || img.description.trim() === ""
        );
      } else {
        // Regular text search
        filtered = filtered.filter(
          (img) =>
            img.title.toLowerCase().includes(searchTerm) ||
            img.description?.toLowerCase().includes(searchTerm) ||
            img.category.toLowerCase().includes(searchTerm) ||
            img.alt_text?.toLowerCase().includes(searchTerm) ||
            img.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((img) => img.category === filters.category);
    }

    // Featured filter
    if (filters.featured === "featured") {
      filtered = filtered.filter((img) => img.featured);
    } else if (filters.featured === "unfeatured") {
      filtered = filtered.filter((img) => !img.featured);
    }

    // Tags filter (AND logic - image must have ALL selected tags)
    if (filters.tags.length > 0) {
      filtered = filtered.filter(
        (img) =>
          img.tags && filters.tags.every((tag) => img.tags!.includes(tag))
      );
    }

    // Date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered.filter(
        (img) => new Date(img.created_at) >= startDate
      );
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end + "T23:59:59");
      filtered = filtered.filter((img) => new Date(img.created_at) <= endDate);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (filters.sortBy) {
        case "display_order":
          aVal = a.display_order || 0;
          bVal = b.display_order || 0;
          break;
        case "created_at":
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "category":
          aVal = a.category;
          bVal = b.category;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return filters.sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [images, filters]);

  // Debounced search to avoid too many re-renders
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 300),
    []
  );

  // Update filtered results when filters change
  React.useEffect(() => {
    onFilteredChange(filteredImages);
  }, [filteredImages, onFilteredChange]);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  const saveCurrentPreset = () => {
    const name = prompt("Save filter preset as:");
    if (name) {
      const newPresets = [...savedPresets, { name, filters }];
      setSavedPresets(newPresets);
      localStorage.setItem(
        "gallery-filter-presets",
        JSON.stringify(newPresets)
      );
    }
  };

  const loadPreset = (preset: { name: string; filters: FilterState }) => {
    setFilters(preset.filters);
    if (searchInputRef.current) {
      searchInputRef.current.value = preset.filters.search;
    }
  };

  const activeFiltersCount = Object.values(filters).filter(
    (val) =>
      val !== "" &&
      val !== "all" &&
      (Array.isArray(val) ? val.length > 0 : val !== defaultFilters.search)
  ).length;

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* Main Search and Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search images... (try 'missing:alt', 'missing:tags')"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateFilter("featured", "featured")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filters.featured === "featured"
                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <Star className="h-3 w-3" />
            Featured
          </button>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              showAdvanced || activeFiltersCount > 0
                ? "bg-blue-100 text-blue-800 border border-blue-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <Filter className="h-3 w-3" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 border-l pl-3">
          <div className="flex rounded-lg overflow-hidden border">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {onBulkExport && (
            <button
              onClick={() => onBulkExport(filteredImages)}
              className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Export ({filteredImages.length})
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 border-l pl-3">
          {filteredImages.length} of {images.length} images
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Advanced Filters</h3>
            <div className="flex gap-2">
              <button
                onClick={saveCurrentPreset}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Save className="h-3 w-3" />
                Save Preset
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="wedding">Wedding</option>
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
                <option value="commercial">Commercial</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Status
              </label>
              <select
                value={filters.featured}
                onChange={(e) =>
                  updateFilter(
                    "featured",
                    e.target.value as "all" | "featured" | "unfeatured"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Images</option>
                <option value="featured">Featured Only</option>
                <option value="unfeatured">Not Featured</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="flex gap-1">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    updateFilter(
                      "sortBy",
                      e.target.value as FilterState["sortBy"]
                    )
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="display_order">Display Order</option>
                  <option value="created_at">Date Created</option>
                  <option value="title">Title</option>
                  <option value="category">Category</option>
                </select>
                <button
                  onClick={() =>
                    updateFilter(
                      "sortOrder",
                      filters.sortOrder === "asc" ? "desc" : "asc"
                    )
                  }
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50"
                >
                  {filters.sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    updateFilter("dateRange", {
                      ...filters.dateRange,
                      start: e.target.value,
                    })
                  }
                  className="px-2 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    updateFilter("dateRange", {
                      ...filters.dateRange,
                      end: e.target.value,
                    })
                  }
                  className="px-2 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Tags (select multiple)
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const newTags = filters.tags.includes(tag)
                        ? filters.tags.filter((t) => t !== tag)
                        : [...filters.tags, tag];
                      updateFilter("tags", newTags);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.tags.includes(tag)
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Presets */}
          {(FILTER_PRESETS.length > 0 || savedPresets.length > 0) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {[...FILTER_PRESETS, ...savedPresets].map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => loadPreset(preset)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs hover:bg-gray-50 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
