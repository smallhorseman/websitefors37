"use client";

import React, { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  Star,
  Eye,
  EyeOff,
  Tag,
  Image as ImageIcon,
  Palette,
  Maximize2,
  Copy,
  Check,
  Trash2,
  Settings2,
  Sparkles,
  Loader2,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/supabase";

interface EnhancedGalleryEditorProps {
  images: GalleryImage[];
  onUpdate: (images: GalleryImage[]) => void;
  onSave: (image: GalleryImage) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function EnhancedGalleryEditor({
  images,
  onUpdate,
  onSave,
  onDelete,
}: EnhancedGalleryEditorProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingAltText, setGeneratingAltText] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  // Generate AI alt text for a single image
  const generateAltText = async (image: GalleryImage) => {
    setGeneratingAltText(true);
    try {
      const res = await fetch("/api/gallery/generate-alt-text", {
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

      if (!res.ok) {
        throw new Error("Failed to generate alt text");
      }

      const { altText } = await res.json();
      updateField(image.id, "alt_text", altText);
    } catch (error) {
      console.error("Error generating alt text:", error);
      alert("Failed to generate alt text. Please try again.");
    } finally {
      setGeneratingAltText(false);
    }
  };

  // Batch generate alt text for all images missing it
  const batchGenerateAltText = async () => {
    const imagesToProcess = images.filter(
      (img) => !img.alt_text || img.alt_text.trim() === ""
    );

    if (imagesToProcess.length === 0) {
      alert("All images already have alt text!");
      return;
    }

    if (
      !confirm(
        `Generate alt text for ${imagesToProcess.length} images? This may take a minute.`
      )
    ) {
      return;
    }

    setBatchGenerating(true);
    setBatchProgress({ current: 0, total: imagesToProcess.length });

    for (let i = 0; i < imagesToProcess.length; i++) {
      const image = imagesToProcess[i];
      setBatchProgress({ current: i + 1, total: imagesToProcess.length });

      try {
        const res = await fetch("/api/gallery/generate-alt-text", {
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

        if (res.ok) {
          const { altText } = await res.json();
          updateField(image.id, "alt_text", altText);
          // Save immediately
          await onSave({ ...image, alt_text: altText });
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error generating alt text for ${image.title}:`, error);
      }
    }

    setBatchGenerating(false);
    alert(`Generated alt text for ${imagesToProcess.length} images!`);
  };

  // Drag and drop handler
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const items = Array.from(images);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // Update display_order for all items
      const updatedItems = items.map((item, index) => ({
        ...item,
        display_order: index,
      }));

      onUpdate(updatedItems);
    },
    [images, onUpdate]
  );

  // Inline field update
  const updateField = (id: string, field: keyof GalleryImage, value: any) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, [field]: value } : img
    );
    onUpdate(updated);
  };

  // Toggle featured status
  const toggleFeatured = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      updateField(id, "featured", !image.featured);
    }
  };

  // Duplicate image
  const duplicateImage = async (image: GalleryImage) => {
    const newImage = {
      ...image,
      id: `temp-${Date.now()}`,
      title: `${image.title} (Copy)`,
      display_order: images.length,
    };
    onUpdate([...images, newImage]);
    setCopiedId(image.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Main Gallery Grid/List */}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded ${
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded ${
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              List
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={batchGenerateAltText}
              disabled={batchGenerating}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium shadow-lg"
            >
              {batchGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {batchProgress.current}/{batchProgress.total}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  AI Alt Text
                </>
              )}
            </button>
            <span className="text-sm text-gray-600">
              {images.length} images
            </span>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery-images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "space-y-2"
                }
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white border rounded-lg overflow-hidden ${
                          snapshot.isDragging
                            ? "shadow-2xl ring-2 ring-primary-500"
                            : "shadow-sm"
                        } ${
                          selectedImage?.id === image.id
                            ? "ring-2 ring-primary-400"
                            : ""
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        {viewMode === "grid" ? (
                          <div className="relative">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-2 left-2 z-10 bg-white/90 rounded p-1 cursor-grab active:cursor-grabbing hover:bg-white"
                            >
                              <GripVertical className="h-4 w-4 text-gray-600" />
                            </div>

                            {/* Featured Badge */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFeatured(image.id);
                              }}
                              className="absolute top-2 right-2 z-10 bg-white/90 rounded p-1 hover:bg-white"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  image.featured
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>

                            {/* Image */}
                            <div className="relative aspect-[4/3] bg-gray-100">
                              <Image
                                src={image.image_url}
                                alt={image.alt_text || image.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              />
                            </div>

                            {/* Info */}
                            <div className="p-3">
                              {editingId === image.id ? (
                                <input
                                  type="text"
                                  value={image.title}
                                  onChange={(e) =>
                                    updateField(
                                      image.id,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  onBlur={() => setEditingId(null)}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <h3
                                  className="font-semibold truncate text-sm cursor-text"
                                  onDoubleClick={() => setEditingId(image.id)}
                                >
                                  {image.title}
                                </h3>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {image.category}
                                {image.tags &&
                                  image.tags.length > 0 &&
                                  ` • ${image.tags.length} tags`}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Order: {image.display_order}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                              <Image
                                src={image.image_url}
                                alt={image.alt_text || image.title}
                                fill
                                className="object-cover rounded"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">
                                {image.title}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">
                                {image.description || "No description"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {image.category} • Order: {image.display_order}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFeatured(image.id);
                              }}
                              className="p-2 hover:bg-gray-100 rounded"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  image.featured
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Properties Sidebar */}
      {selectedImage && (
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Image Properties</h3>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Preview */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || selectedImage.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => duplicateImage(selectedImage)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                {copiedId === selectedImage.id ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Duplicate
              </button>
              <button
                onClick={() => onDelete(selectedImage.id)}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={selectedImage.title}
                onChange={(e) =>
                  updateField(selectedImage.id, "title", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={selectedImage.description || ""}
                onChange={(e) =>
                  updateField(selectedImage.id, "description", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Alt Text (SEO)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedImage.alt_text || ""}
                  onChange={(e) =>
                    updateField(selectedImage.id, "alt_text", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="Descriptive text for screen readers"
                />
                <button
                  onClick={() => generateAltText(selectedImage)}
                  disabled={generatingAltText}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                  title="Generate with AI"
                >
                  {generatingAltText ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedImage.alt_text?.length || 0}/125 characters
              </p>
            </div>

            {/* Categorization */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={selectedImage.category}
                onChange={(e) =>
                  updateField(selectedImage.id, "category", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="wedding">Wedding</option>
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
                <option value="commercial">Commercial</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tags{" "}
                <span className="text-gray-400 text-xs">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={(selectedImage.tags || []).join(", ")}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  updateField(selectedImage.id, "tags", tags);
                }}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="outdoor, sunset, couple"
              />
            </div>

            {/* Display Options */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={selectedImage.display_order || 0}
                onChange={(e) =>
                  updateField(
                    selectedImage.id,
                    "display_order",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <input
                type="checkbox"
                id="featured-checkbox"
                checked={selectedImage.featured}
                onChange={(e) =>
                  updateField(selectedImage.id, "featured", e.target.checked)
                }
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label
                htmlFor="featured-checkbox"
                className="text-sm font-medium"
              >
                Featured Image
              </label>
            </div>

            {/* Image URL (read-only display) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={selectedImage.image_url}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm text-gray-600"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={() => onSave(selectedImage)}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
