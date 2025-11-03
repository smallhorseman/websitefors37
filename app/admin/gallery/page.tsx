"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase, type GalleryImage } from "@/lib/supabase";
import {
  ArrowLeft,
  Upload,
  Loader2,
  ImageIcon,
  Layout,
  Sparkles,
  Keyboard,
  X,
} from "lucide-react";
import EnhancedGalleryEditor from "@/components/EnhancedGalleryEditor";
import GalleryHighlightsEditor from "@/components/GalleryHighlightsEditor";
import GalleryAdvancedFilters from "@/components/GalleryAdvancedFilters";
import GalleryBulkOperations from "@/components/GalleryBulkOperations";
import EnhancedImageUploader from "@/components/EnhancedImageUploader";

export default function AdminGalleryPage() {
  // Main state
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View mode state
  const [viewMode, setViewMode] = useState<"enhanced" | "highlights">(
    "enhanced"
  );
  const [galleryViewMode, setGalleryViewMode] = useState<"grid" | "list">(
    "grid"
  );

  // Modal state
  const [showUploader, setShowUploader] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Fetch all images from the database
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAllImages(data || []);
      setFilteredImages(data || []);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save/update an image
  const saveImage = async (image: GalleryImage) => {
    try {
      const { error } = await supabase.from("gallery_images").upsert({
        id: image.id,
        title: image.title,
        description: image.description,
        alt_text: image.alt_text,
        category: image.category,
        tags: image.tags,
        featured: image.featured,
        order_index: image.order_index,
        display_order: image.display_order,
        image_url: image.image_url,
        thumbnail_url: image.thumbnail_url,
      });

      if (error) throw error;

      // Update local state
      setAllImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...image } : img))
      );
      setFilteredImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...image } : img))
      );
    } catch (err) {
      console.error("Error saving image:", err);
      throw err;
    }
  };

  // Delete an image
  const deleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      // Update local state
      setAllImages((prev) => prev.filter((img) => img.id !== imageId));
      setFilteredImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Error deleting image:", err);
      throw err;
    }
  };

  // Handle bulk operations
  const handleBulkUpdate = async (updates: Partial<GalleryImage>) => {
    const idsArray = Array.from(selectedIds);
    if (idsArray.length === 0) return;

    try {
      // Update each selected image
      const promises = idsArray.map(async (id) => {
        const image = allImages.find((img) => img.id === id);
        if (!image) return;

        const updatedImage = { ...image, ...updates };
        await saveImage(updatedImage);
      });

      await Promise.all(promises);
      setSelectedIds(new Set()); // Clear selection
    } catch (err) {
      console.error("Error in bulk update:", err);
      throw err;
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const idsArray = Array.from(selectedIds);
    if (idsArray.length === 0) return;

    try {
      const promises = idsArray.map((id) => deleteImage(id));
      await Promise.all(promises);
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Error in bulk delete:", err);
      throw err;
    }
  };

  // Handle bulk export
  const handleBulkExport = async (imageIds?: string[]) => {
    const idsToExport = imageIds || Array.from(selectedIds);
    if (idsToExport.length === 0) return;

    try {
      const imagesToExport = allImages.filter((img) =>
        idsToExport.includes(img.id)
      );
      const exportData = {
        images: imagesToExport,
        exported_at: new Date().toISOString(),
        total_count: imagesToExport.length,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gallery-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting images:", err);
    }
  };

  // Handle upload completion
  const handleUploadComplete = () => {
    fetchImages(); // Refresh the gallery
    setShowUploader(false);
  };

  // Fetch images on mount
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "a":
        case "A":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const allIds = new Set(filteredImages.map((img) => img.id));
            setSelectedIds(allIds);
          }
          break;
        case "Delete":
          if (selectedIds.size > 0) {
            e.preventDefault();
            handleBulkDelete();
          }
          break;
        case "Escape":
          if (selectedIds.size > 0) {
            setSelectedIds(new Set());
          } else if (showUploader) {
            setShowUploader(false);
          } else if (showKeyboardHelp) {
            setShowKeyboardHelp(false);
          } else if (showImagePreview) {
            setShowImagePreview(false);
            setPreviewImage(null);
          }
          break;
        case "?":
          if (e.shiftKey) {
            e.preventDefault();
            setShowKeyboardHelp(true);
          }
          break;
        case "u":
        case "U":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowUploader(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    filteredImages,
    selectedIds,
    showUploader,
    showKeyboardHelp,
    showImagePreview,
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Admin
          </Link>
          <h1 className="text-xl font-semibold">Gallery Management</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("enhanced")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === "enhanced"
                  ? "bg-white shadow-sm"
                  : "hover:bg-gray-200"
              }`}
            >
              <Layout className="h-4 w-4 inline mr-1" />
              Enhanced
            </button>
            <button
              onClick={() => setViewMode("highlights")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === "highlights"
                  ? "bg-white shadow-sm"
                  : "hover:bg-gray-200"
              }`}
            >
              <Sparkles className="h-4 w-4 inline mr-1" />
              Highlights
            </button>
          </div>

          {/* Quick Actions */}
          <button
            onClick={() => setShowKeyboardHelp(true)}
            className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Keyboard shortcuts (Shift + ?)"
          >
            <Keyboard className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowUploader(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            title="Upload images (Ctrl + U)"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mx-6 mt-6 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button
              onClick={fetchImages}
              className="text-red-600 underline mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2">Loading gallery images...</span>
          </div>
        ) : allImages.length === 0 ? (
          <div className="text-center py-12 mx-6 bg-gray-50 rounded-lg">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No images yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start building your gallery by uploading some images.
            </p>
            <button
              onClick={() => setShowUploader(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Your First Images
            </button>
          </div>
        ) : (
          <>
            {/* Advanced Filters */}
            <GalleryAdvancedFilters
              images={allImages}
              onFilteredChange={setFilteredImages}
              viewMode={galleryViewMode}
              onViewModeChange={setGalleryViewMode}
              onBulkExport={handleBulkExport}
            />

            {/* Bulk Operations Bar */}
            <GalleryBulkOperations
              images={filteredImages}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onBulkUpdate={handleBulkUpdate}
              onBulkDelete={handleBulkDelete}
              onBulkExport={handleBulkExport}
            />

            {/* Gallery Content */}
            <div className="flex-1 overflow-hidden">
              {viewMode === "enhanced" && (
                <EnhancedGalleryEditor
                  images={filteredImages}
                  onUpdate={(updatedImages) => {
                    setFilteredImages(updatedImages);
                    // Also update allImages to keep them in sync
                    setAllImages((prev) => {
                      const updated = [...prev];
                      updatedImages.forEach((updatedImg) => {
                        const index = updated.findIndex(
                          (img) => img.id === updatedImg.id
                        );
                        if (index !== -1) updated[index] = updatedImg;
                      });
                      return updated;
                    });
                  }}
                  onSave={saveImage}
                  onDelete={deleteImage}
                />
              )}

              {viewMode === "highlights" && (
                <div className="p-6">
                  <GalleryHighlightsEditor
                    allImages={allImages}
                    onSave={async (config) => {
                      const name = window.prompt('Name this highlight set (e.g., "Homepage Highlights")')
                      if (!name) return
                      const payload = {
                        name,
                        description: 'Created from GalleryHighlightsEditor',
                        config,
                        is_active: true,
                        transition: config.animation === 'fade-in' ? 'fade' : config.animation,
                        slide_duration_ms: 4000,
                        layout: 'grid'
                      }
                      const res = await fetch('/api/gallery/highlights/sets', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      })
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}))
                        throw new Error(data.error || 'Failed to save highlight set')
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showUploader && (
        <EnhancedImageUploader
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploader(false)}
          existingImages={allImages}
        />
      )}

      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Select all images</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Ctrl + A
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Delete selected</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Delete
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Clear selection</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Upload images</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Ctrl + U
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Show this help</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Shift + ?
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImagePreview && previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={previewImage.optimized_url || previewImage.url}
              alt={previewImage.alt_text || "Image preview"}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => {
                setShowImagePreview(false);
                setPreviewImage(null);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
