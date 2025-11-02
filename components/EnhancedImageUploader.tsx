"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wand2,
  Eye,
  Zap,
} from "lucide-react";
import type { GalleryImage } from "@/lib/supabase";

interface EnhancedImageUploaderProps {
  onUploadComplete: (images: GalleryImage[]) => void;
  onClose: () => void;
  existingImages?: GalleryImage[];
}

interface UploadFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  progress: number;
  error?: string;
  metadata?: {
    title: string;
    category: string;
    tags: string[];
    alt_text: string;
    featured: boolean;
  };
}

export default function EnhancedImageUploader({
  onUploadComplete,
  onClose,
  existingImages = [],
}: EnhancedImageUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoGenerateAlt, setAutoGenerateAlt] = useState(true);
  const [autoDetectDuplicates, setAutoDetectDuplicates] = useState(true);
  const [compressionQuality, setCompressionQuality] = useState(85);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFiles = useCallback(
    (selectedFiles: FileList) => {
      const newFiles: UploadFile[] = [];

      Array.from(selectedFiles).forEach((file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert(`${file.name} is not an image file`);
          return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 10MB.`);
          return;
        }

        // Create preview
        const preview = URL.createObjectURL(file);

        // Extract metadata from filename
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        const title = nameWithoutExt
          .replace(/[_-]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        // Detect category from filename/path
        let category = "general";
        const lowerName = file.name.toLowerCase();
        if (lowerName.includes("wedding")) category = "wedding";
        else if (lowerName.includes("portrait")) category = "portrait";
        else if (lowerName.includes("event")) category = "event";
        else if (lowerName.includes("commercial")) category = "commercial";

        newFiles.push({
          file,
          preview,
          status: "pending",
          progress: 0,
          metadata: {
            title,
            category,
            tags: [],
            alt_text: "",
            featured: false,
          },
        });
      });

      setFiles((prev) => [...prev, ...newFiles]);

      // Auto-detect duplicates
      if (autoDetectDuplicates && existingImages.length > 0) {
        setTimeout(() => checkForDuplicates(newFiles), 100);
      }
    },
    [autoDetectDuplicates, existingImages]
  );

  // Check for potential duplicates
  const checkForDuplicates = async (newFiles: UploadFile[]) => {
    const duplicateChecks = newFiles.map(async (fileItem) => {
      try {
        // Simple duplicate detection based on file size and name similarity
        const potentialDuplicates = existingImages.filter((existing) => {
          const sizeDiff = Math.abs(
            fileItem.file.size - (existing as any).file_size || 0
          );
          const nameMatch =
            existing.title
              .toLowerCase()
              .includes(fileItem.metadata!.title.toLowerCase()) ||
            fileItem
              .metadata!.title.toLowerCase()
              .includes(existing.title.toLowerCase());

          return sizeDiff < 1000 || nameMatch; // Similar size or name match
        });

        if (potentialDuplicates.length > 0) {
          const confirmed = confirm(
            `"${
              fileItem.metadata!.title
            }" might be a duplicate of existing images. Upload anyway?`
          );
          if (!confirmed) {
            setFiles((prev) => prev.filter((f) => f.file !== fileItem.file));
            URL.revokeObjectURL(fileItem.preview);
          }
        }
      } catch (error) {
        console.error("Duplicate check failed:", error);
      }
    });

    await Promise.all(duplicateChecks);
  };

  // Compress image before upload
  const compressImage = (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 2048px)
        const maxSize = 2048;
        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, "image/jpeg", quality / 100);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Generate AI metadata for an image
  const generateAIMetadata = async (
    file: File,
    currentMetadata: UploadFile["metadata"]
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", currentMetadata?.title || "");
      formData.append("category", currentMetadata?.category || "");

      const response = await fetch("/api/gallery/analyze-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const analysis = await response.json();
        return {
          alt_text: analysis.altText || "",
          tags: analysis.tags || [],
          category: analysis.suggestedCategory || currentMetadata?.category,
          title: analysis.suggestedTitle || currentMetadata?.title,
        };
      }
    } catch (error) {
      console.error("AI metadata generation failed:", error);
    }

    return null;
  };

  // Upload a single file
  const uploadFile = async (
    fileItem: UploadFile
  ): Promise<GalleryImage | null> => {
    try {
      // Update status
      setFiles((prev) =>
        prev.map((f) =>
          f.file === fileItem.file
            ? { ...f, status: "uploading", progress: 10 }
            : f
        )
      );

      // Compress image if needed
      const compressedFile =
        fileItem.file.size > 1024 * 1024
          ? await compressImage(fileItem.file, compressionQuality)
          : fileItem.file;

      setFiles((prev) =>
        prev.map((f) => (f.file === fileItem.file ? { ...f, progress: 30 } : f))
      );

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "studio37_gallery"
      );
      formData.append("folder", "gallery");

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Upload to Cloudinary failed");
      }

      const uploadResult = await uploadResponse.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.file === fileItem.file
            ? { ...f, status: "processing", progress: 70 }
            : f
        )
      );

      // Generate AI metadata if enabled
      let finalMetadata = fileItem.metadata!;
      if (autoGenerateAlt) {
        const aiMetadata = await generateAIMetadata(
          fileItem.file,
          fileItem.metadata!
        );
        if (aiMetadata) {
          finalMetadata = { ...finalMetadata, ...aiMetadata };
        }
      }

      setFiles((prev) =>
        prev.map((f) => (f.file === fileItem.file ? { ...f, progress: 90 } : f))
      );

      // Save to database
      const { supabase } = await import("@/lib/supabase");

      const { data, error } = await supabase
        .from("gallery_images")
        .insert([
          {
            title: finalMetadata.title,
            description: "",
            image_url: uploadResult.secure_url,
            category: finalMetadata.category,
            featured: finalMetadata.featured,
            alt_text: finalMetadata.alt_text,
            tags: finalMetadata.tags,
            display_order: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update status to complete
      setFiles((prev) =>
        prev.map((f) =>
          f.file === fileItem.file
            ? { ...f, status: "complete", progress: 100 }
            : f
        )
      );

      return data;
    } catch (error: any) {
      console.error("Upload failed:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.file === fileItem.file
            ? { ...f, status: "error", error: error.message }
            : f
        )
      );
      return null;
    }
  };

  // Upload all files
  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = pendingFiles.map(uploadFile);
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as GalleryImage[];

      if (successfulUploads.length > 0) {
        onUploadComplete(successfulUploads);
      }

      // Clear successful uploads, keep failed ones
      setFiles((prev) => prev.filter((f) => f.status === "error"));
    } catch (error) {
      console.error("Batch upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // Remove a file from the queue
  const removeFile = (file: File) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.file === file);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.file !== file);
    });
  };

  // Update file metadata
  const updateFileMetadata = (
    file: File,
    updates: Partial<UploadFile["metadata"]>
  ) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.file === file ? { ...f, metadata: { ...f.metadata!, ...updates } } : f
      )
    );
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const completedCount = files.filter((f) => f.status === "complete").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upload Images
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {files.length > 0
                ? `${files.length} files selected • ${pendingCount} pending • ${completedCount} completed`
                : "Select or drag images to upload"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Upload Settings */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoGenerateAlt}
                onChange={(e) => setAutoGenerateAlt(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm">Auto-generate alt text with AI</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoDetectDuplicates}
                onChange={(e) => setAutoDetectDuplicates(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm">Detect duplicates</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-sm">Compression:</span>
              <select
                value={compressionQuality}
                onChange={(e) => setCompressionQuality(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={95}>Highest Quality (95%)</option>
                <option value={85}>High Quality (85%)</option>
                <option value={75}>Medium Quality (75%)</option>
                <option value={60}>Smaller Size (60%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        {files.length === 0 && (
          <div className="p-6 flex-1">
            <div
              ref={dropZoneRef}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drop images here or click to browse
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Supports JPG, PNG, WebP up to 10MB each
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((fileItem) => (
                <div
                  key={fileItem.file.name}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={fileItem.preview}
                        alt={fileItem.metadata?.title || "Preview"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={fileItem.metadata?.title || ""}
                        onChange={(e) =>
                          updateFileMetadata(fileItem.file, {
                            title: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded"
                        placeholder="Image title"
                      />

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <select
                          value={fileItem.metadata?.category || ""}
                          onChange={(e) =>
                            updateFileMetadata(fileItem.file, {
                              category: e.target.value,
                            })
                          }
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="general">General</option>
                          <option value="wedding">Wedding</option>
                          <option value="portrait">Portrait</option>
                          <option value="event">Event</option>
                          <option value="commercial">Commercial</option>
                        </select>

                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={fileItem.metadata?.featured || false}
                            onChange={(e) =>
                              updateFileMetadata(fileItem.file, {
                                featured: e.target.checked,
                              })
                            }
                            className="h-3 w-3"
                          />
                          Featured
                        </label>
                      </div>

                      <input
                        type="text"
                        value={fileItem.metadata?.tags.join(", ") || ""}
                        onChange={(e) =>
                          updateFileMetadata(fileItem.file, {
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded mt-2"
                        placeholder="Tags (comma-separated)"
                      />
                    </div>

                    <button
                      onClick={() => removeFile(fileItem.file)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      disabled={fileItem.status === "uploading"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  {fileItem.status !== "pending" && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          {fileItem.status === "uploading" && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          {fileItem.status === "complete" && (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          )}
                          {fileItem.status === "error" && (
                            <AlertCircle className="h-3 w-3 text-red-600" />
                          )}
                          {fileItem.status === "processing" && (
                            <Zap className="h-3 w-3 text-blue-600" />
                          )}
                          {fileItem.status.charAt(0).toUpperCase() +
                            fileItem.status.slice(1)}
                        </span>
                        <span>{fileItem.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            fileItem.status === "complete"
                              ? "bg-green-500"
                              : fileItem.status === "error"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                      {fileItem.error && (
                        <p className="text-xs text-red-600">{fileItem.error}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {files.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              {errorCount > 0 && (
                <span className="text-red-600">{errorCount} failed • </span>
              )}
              <span>
                Total size:{" "}
                {(
                  files.reduce((sum, f) => sum + f.file.size, 0) /
                  (1024 * 1024)
                ).toFixed(1)}
                MB
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setFiles([])}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={uploading}
              >
                Clear All
              </button>

              <button
                onClick={handleUploadAll}
                disabled={uploading || pendingCount === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload {pendingCount} Images
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Cleanup function to revoke object URLs
export const cleanupPreviews = (files: UploadFile[]) => {
  files.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  });
};
