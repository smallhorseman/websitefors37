"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  Settings,
  X,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  Layout,
  Keyboard,
  Maximize2,
} from "lucide-react";
import { getPaginatedData } from "@/lib/supabase";
import Link from "next/link";
import EnhancedGalleryEditor from "@/components/EnhancedGalleryEditor";
import GalleryHighlightsEditor from "@/components/GalleryHighlightsEditor";
import GalleryAdvancedFilters from "@/components/GalleryAdvancedFilters";
import GalleryBulkOperations from "@/components/GalleryBulkOperations";
import EnhancedImageUploader from "@/components/EnhancedImageUploader";
import type { GalleryImage } from "@/lib/supabase";

export default function GalleryAdmin() {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // View modes
  const [viewMode, setViewMode] = useState<"enhanced" | "highlights">(
    "enhanced"
  );
  const [galleryViewMode, setGalleryViewMode] = useState<"grid" | "list">(
    "grid"
  );

  // Modals
  const [showUploader, setShowUploader] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<GalleryImage | null>(
    null
  );

  // Legacy pagination (still used for initial load)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 100; // Increased for better performance

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "general",
    featured: false,
    display_order: 0,
  });

  // Fetch all images from Supabase (no pagination for better filtering)
  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { supabase } = await import("@/lib/supabase");

      const { data, error, count } = await supabase
        .from("gallery_images")
        .select("*", { count: "exact" })
        .order("display_order", { ascending: true });

      if (error) throw error;

      setAllImages(data || []);
      setFilteredImages(data || []); // Initially show all images
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error("Error fetching images:", error);
      setError(error.message || "Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Enhanced save function for single images
  const saveImage = async (imageToSave: GalleryImage) => {
    setSaving(true);
    try {
      const { supabase } = await import("@/lib/supabase");

      const { error } = await supabase
        .from("gallery_images")
        .update({
          title: imageToSave.title,
          description: imageToSave.description,
          category: imageToSave.category,
          featured: imageToSave.featured,
          display_order: imageToSave.display_order,
          alt_text: imageToSave.alt_text,
          tags: imageToSave.tags,
        })
        .eq("id", imageToSave.id);

      if (error) throw error;

      // Update state
      setAllImages((prev) =>
        prev.map((img) => (img.id === imageToSave.id ? imageToSave : img))
      );
      setFilteredImages((prev) =>
        prev.map((img) => (img.id === imageToSave.id ? imageToSave : img))
      );
    } catch (error: any) {
      console.error("Error saving image:", error);
      alert("Failed to save image: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Enhanced delete function
  const deleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const { supabase } = await import("@/lib/supabase");

      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update state
      setAllImages((prev) => prev.filter((img) => img.id !== id));
      setFilteredImages((prev) => prev.filter((img) => img.id !== id));
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error: any) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image: " + error.message);
    }
  };

  // Open modal to add a new image
  const addNewImage = () => {
    setSelectedImage(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "general",
      featured: false,
      display_order: 0,
    });
    setIsNew(true);
    setShowModal(true);
  };

  // Open modal to edit an existing image
  const editImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
      category: image.category,
      featured: image.featured,
      display_order: image.display_order || 0,
    });
    setIsNew(false);
    setShowModal(true);
  };

  // Enhanced bulk operations
  const handleBulkUpdate = async (updates: Partial<GalleryImage>[]) => {
    try {
      const { supabase } = await import("@/lib/supabase");

      const promises = updates.map(async (update) => {
        const { id, ...updateData } = update;
        return supabase.from("gallery_images").update(updateData).eq("id", id);
      });

      await Promise.all(promises);

      // Update local state
      setAllImages((prev) =>
        prev.map((img) => {
          const update = updates.find((u) => u.id === img.id);
          return update ? { ...img, ...update } : img;
        })
      );

      setFilteredImages((prev) =>
        prev.map((img) => {
          const update = updates.find((u) => u.id === img.id);
          return update ? { ...img, ...update } : img;
        })
      );
    } catch (error: any) {
      console.error("Error updating images:", error);
      throw error;
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const { supabase } = await import("@/lib/supabase");

      const promises = ids.map((id) =>
        supabase.from("gallery_images").delete().eq("id", id)
      );

      await Promise.all(promises);

      // Update local state
      setAllImages((prev) => prev.filter((img) => !ids.includes(img.id)));
      setFilteredImages((prev) => prev.filter((img) => !ids.includes(img.id)));
      setSelectedIds(new Set());
    } catch (error: any) {
      console.error("Error deleting images:", error);
      throw error;
    }
  };

  // Handle upload completion
  const handleUploadComplete = (newImages: GalleryImage[]) => {
    setAllImages((prev) => [...newImages, ...prev]);
    setFilteredImages((prev) => [...newImages, ...prev]);
    setShowUploader(false);
    fetchImages(); // Refresh to ensure consistency
  };

  // Handle export functionality
  const handleBulkExport = (imagesToExport: GalleryImage[]) => {
    const dataStr = JSON.stringify(imagesToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gallery-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in input field
      if (
        e.target &&
        (e.target as HTMLElement).tagName.match(/INPUT|TEXTAREA|SELECT/)
      ) {
        return;
      }

      switch (e.key) {
        case "a":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setSelectedIds(new Set(filteredImages.map((img) => img.id)));
          }
          break;
        case "Delete":
        case "Backspace":
          if (selectedIds.size > 0) {
            e.preventDefault();
            handleBulkDelete(Array.from(selectedIds));
          }
          break;
        case "Escape":
          setSelectedIds(new Set());
          setShowImagePreview(null);
          setShowKeyboardHelp(false);
          break;
        case "?":
          if (e.shiftKey) {
            e.preventDefault();
            setShowKeyboardHelp(true);
          }
          break;
        case "u":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowUploader(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredImages, selectedIds]);

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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
            <p className="text-gray-500 mb-6">Start building your gallery by uploading some images.</p>
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
                    setAllImages(prev => {
                      const updated = [...prev];
                      updatedImages.forEach(updatedImg => {
                        const index = updated.findIndex(img => img.id === updatedImg.id);
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
                      console.log("Gallery Highlights Config:", config);
                      // TODO: Save to site settings or page builder config
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
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + A</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Delete selected</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Delete</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Clear selection</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Upload images</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + U</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Show this help</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Shift + ?</kbd>
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
              alt={previewImage.alt_text || 'Image preview'}
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
              <div className="flex justify-between">
                <span className="text-sm">Show this help</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Shift + ?</kbd>
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
              alt={previewImage.alt_text || 'Image preview'}
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
                          <button
                            onClick={() => editImage(image)}
                            className="text-primary-600 hover:text-primary-800"
                            title="Edit image"
                            aria-label="Edit image"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
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
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + A</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Delete selected</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Delete</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Clear selection</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Upload images</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + U</kbd>
              </div>
              <div className="flex justify-between">
                <span>Show This Help</span>
                <kbd className="bg-gray-100 px-2 py-1 rounded">Shift + ?</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={() => setShowImagePreview(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={showImagePreview.image_url}
            alt={showImagePreview.title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
            {showImagePreview.title}
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
