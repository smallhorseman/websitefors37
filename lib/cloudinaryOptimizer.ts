/**
 * Cloudinary URL Optimization Utility
 * 
 * Appends automatic optimization parameters to Cloudinary URLs:
 * - w_auto/specific: Width based on device/viewport or fixed
 * - q_auto: Automatic quality based on content
 * - f_auto: Automatic format selection (WebP/AVIF)
 * - c_limit: Ensures image never upscales beyond original
 * 
 * Note: This is a simpler version of lib/cloudinary.ts for quick URL optimization.
 * For more advanced transformations, use lib/cloudinary.ts with CloudinaryOptions.
 */

export function optimizeCloudinaryUrl(url: string, maxWidth?: number, quality: 'auto:low' | 'auto:good' | 'auto:best' = 'auto:good'): string {
  // Only optimize Cloudinary URLs
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  try {
    // Split on /upload/ to insert transformations
    const parts = url.split('/upload/')
    if (parts.length !== 2) {
      return url // Not a standard upload URL
    }

    // Build optimized transformations
    const transformations = [
      'f_auto',        // Auto format (WebP/AVIF)
      `q_${quality}`,  // Auto quality (configurable)
      'c_limit',       // Don't upscale
    ]

    if (maxWidth) {
      transformations.push(`w_${maxWidth}`)
    } else {
      transformations.push('w_auto')
    }

    const transformString = transformations.join(',')

    // Rebuild URL with transformations
    return `${parts[0]}/upload/${transformString}/${parts[1]}`
  } catch (error) {
    console.error('Failed to optimize Cloudinary URL:', error)
    return url
  }
}

/**
 * Optimize multiple Cloudinary URLs
 */
export function optimizeCloudinaryUrls(urls: string[], maxWidth?: number, quality: 'auto:low' | 'auto:good' | 'auto:best' = 'auto:good'): string[] {
  return urls.map(url => optimizeCloudinaryUrl(url, maxWidth, quality))
}
