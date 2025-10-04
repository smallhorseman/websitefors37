'use client'

import React, { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  onImageUrl: (url: string) => void
}

export default function ImageUploader({ onImageUrl }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit')
      return
    }
    
    setUploading(true)
    setError(null)
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `gallery/${fileName}`
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      // Get the public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)
      
      // Pass the URL back to the parent component
      onImageUrl(data.publicUrl)
      
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setError(error.message || 'Error uploading image')
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div className="space-y-2">
      <label className="block">
        <span className="sr-only">Choose image</span>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              disabled={uploading}
              onChange={uploadImage}
            />
          </label>
        </div>
      </label>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
