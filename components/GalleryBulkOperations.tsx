"use client";

import React, { useState, useRef } from "react";
import {
  CheckSquare,
  Square,
  Trash2,
  Tag,
  Star,
  Copy,
  Download,
  Wand2,
  Loader2,
  Move,
  Eye,
  EyeOff,
  Edit3,
} from "lucide-react";
import type { GalleryImage } from "@/lib/supabase";

interface BulkOperationsProps {
  images: GalleryImage[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onBulkUpdate: (updates: Partial<GalleryImage>[]) => Promise<void>;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkExport?: (images: GalleryImage[]) => void;
}

export default function BulkOperations({
  images,
  selectedIds,
  onSelectionChange,
  onBulkUpdate,
  onBulkDelete,
  onBulkExport,
}: BulkOperationsProps) {
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkTags, setBulkTags] = useState("");
  const [bulkFeatured, setBulkFeatured] = useState<
    "no-change" | "featured" | "unfeatured"
  >("no-change");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragSelecting, setDragSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedImages = images.filter((img) => selectedIds.has(img.id));
  const isAllSelected = images.length > 0 && selectedIds.size === images.length;
  const isPartiallySelected =
    selectedIds.size > 0 && selectedIds.size < images.length;

  // Toggle select all/none
  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(images.map((img) => img.id)));
    }
  };

  // Select by category
  const selectByCategory = (category: string) => {
    const categoryImages = images.filter((img) => img.category === category);
    const newSelected = new Set(selectedIds);
    categoryImages.forEach((img) => newSelected.add(img.id));
    onSelectionChange(newSelected);
  };

  // Select featured/unfeatured
  const selectByFeatured = (featured: boolean) => {
    const filteredImages = images.filter((img) => img.featured === featured);
    const newSelected = new Set(selectedIds);
    filteredImages.forEach((img) => newSelected.add(img.id));
    onSelectionChange(newSelected);
  };

  // Invert selection
  const invertSelection = () => {
    const newSelected = new Set<string>();
    images.forEach((img) => {
      if (!selectedIds.has(img.id)) {
        newSelected.add(img.id);
      }
    });
    onSelectionChange(newSelected);
  };

  // Apply bulk updates
  const applyBulkUpdates = async () => {
    if (selectedIds.size === 0) return;

    setIsProcessing(true);
    try {
      const updates: Partial<GalleryImage>[] = [];

      selectedIds.forEach((id) => {
        const update: Partial<GalleryImage> = { id };

        if (bulkCategory) {
          update.category = bulkCategory;
        }

        if (bulkTags.trim()) {
          const newTags = bulkTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
          const currentImage = images.find((img) => img.id === id);
          // Merge with existing tags (no duplicates)
          const existingTags = currentImage?.tags || [];
          update.tags = [...new Set([...existingTags, ...newTags])];
        }

        if (bulkFeatured !== "no-change") {
          update.featured = bulkFeatured === "featured";
        }

        updates.push(update);
      });

      await onBulkUpdate(updates);

      // Reset form
      setBulkCategory("");
      setBulkTags("");
      setBulkFeatured("no-change");
      setShowBulkPanel(false);
    } catch (error) {
      console.error("Bulk update failed:", error);
      alert("Failed to update images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk delete with confirmation
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.size} selected image${
        selectedIds.size > 1 ? "s" : ""
      }? This action cannot be undone.`
    );

    if (confirmed) {
      setIsProcessing(true);
      try {
        await onBulkDelete(Array.from(selectedIds));
        onSelectionChange(new Set()); // Clear selection
      } catch (error) {
        console.error("Bulk delete failed:", error);
        alert("Failed to delete images. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Bulk AI alt text generation
  const generateBulkAltText = async () => {
    if (selectedIds.size === 0) return;

    const imagesToProcess = selectedImages.filter(
      (img) => !img.alt_text || img.alt_text.trim() === ""
    );

    if (imagesToProcess.length === 0) {
      alert("All selected images already have alt text!");
      return;
    }

    const confirmed = confirm(
      `Generate AI alt text for ${imagesToProcess.length} images? This may take a minute.`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const updates: Partial<GalleryImage>[] = [];

      for (const image of imagesToProcess) {
        try {
          const response = await fetch("/api/gallery/generate-alt-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl: image.image_url,
              title: image.title,
              description: image.description,
              category: image.category,
              tags: image.tags,
            }),
          });

          if (response.ok) {
            const { altText } = await response.json();
            updates.push({
              id: image.id,
              alt_text: altText,
            });
          }

          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(
            `Failed to generate alt text for ${image.title}:`,
            error
          );
        }
      }

      if (updates.length > 0) {
        await onBulkUpdate(updates);
        alert(`Generated alt text for ${updates.length} images!`);
      }
    } catch (error) {
      console.error("Bulk alt text generation failed:", error);
      alert("Failed to generate alt text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag selection handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setDragSelecting(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      dragSelecting &&
      dragStart &&
      selectionBoxRef.current &&
      containerRef.current
    ) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.min(e.clientX - rect.left, dragStart.x - rect.left);
      const y = Math.min(e.clientY - rect.top, dragStart.y - rect.top);
      const width = Math.abs(e.clientX - dragStart.x);
      const height = Math.abs(e.clientY - dragStart.y);

      selectionBoxRef.current.style.left = `${x}px`;
      selectionBoxRef.current.style.top = `${y}px`;
      selectionBoxRef.current.style.width = `${width}px`;
      selectionBoxRef.current.style.height = `${height}px`;
      selectionBoxRef.current.style.display = "block";
    }
  };

  const handleMouseUp = () => {
    if (dragSelecting) {
      setDragSelecting(false);
      setDragStart(null);
      if (selectionBoxRef.current) {
        selectionBoxRef.current.style.display = "none";
      }
    }
  };

  if (selectedIds.size === 0) {
    return (
      <div className="flex items-center gap-4 p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded transition-colors"
          >
            <Square className="h-4 w-4" />
            Select All ({images.length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Quick Select:</span>
          <button
            onClick={() => selectByFeatured(true)}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
          >
            <Star className="h-3 w-3" />
            Featured
          </button>
          <button
            onClick={() => selectByCategory("wedding")}
            className="px-2 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
          >
            Weddings
          </button>
          <button
            onClick={() => selectByCategory("portrait")}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
          >
            Portraits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Drag selection box */}
      <div
        ref={selectionBoxRef}
        className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-25 pointer-events-none z-50 hidden"
        style={{ position: "absolute" }}
      />

      <div className="flex items-center justify-between p-3 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-900 hover:text-blue-700 rounded transition-colors"
            >
              {isAllSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square
                  className={
                    isPartiallySelected ? "h-4 w-4 fill-blue-600" : "h-4 w-4"
                  }
                />
              )}
              {selectedIds.size} selected
            </button>
            <button
              onClick={invertSelection}
              className="px-2 py-1 text-xs text-blue-700 hover:text-blue-900 underline"
            >
              Invert
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <button
              onClick={() => setShowBulkPanel(!showBulkPanel)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              disabled={isProcessing}
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </button>

            <button
              onClick={generateBulkAltText}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Wand2 className="h-3 w-3" />
              )}
              AI Alt Text
            </button>

            {onBulkExport && (
              <button
                onClick={() => onBulkExport(selectedImages)}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            )}

            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              disabled={isProcessing}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </div>

        <button
          onClick={() => onSelectionChange(new Set())}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Clear Selection
        </button>
      </div>

      {/* Bulk Edit Panel */}
      {showBulkPanel && (
        <div className="bg-white border-b border-gray-200 p-4 space-y-4">
          <h3 className="font-medium text-gray-900">
            Bulk Edit {selectedIds.size} Images
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Change Category
              </label>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Keep Current</option>
                <option value="wedding">Wedding</option>
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
                <option value="commercial">Commercial</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Add Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Tags (comma-separated)
              </label>
              <input
                type="text"
                value={bulkTags}
                onChange={(e) => setBulkTags(e.target.value)}
                placeholder="outdoor, professional, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Featured Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Status
              </label>
              <select
                value={bulkFeatured}
                onChange={(e) =>
                  setBulkFeatured(e.target.value as typeof bulkFeatured)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="no-change">Keep Current</option>
                <option value="featured">Mark as Featured</option>
                <option value="unfeatured">Remove from Featured</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Changes will be applied to {selectedIds.size} selected images
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkPanel(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyBulkUpdates}
                disabled={
                  isProcessing ||
                  (!bulkCategory &&
                    !bulkTags.trim() &&
                    bulkFeatured === "no-change")
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Applying...
                  </>
                ) : (
                  "Apply Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
