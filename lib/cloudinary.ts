export interface CloudinaryOptions {
  width?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  height?: number;
  crop?: 'fill' | 'crop' | 'scale';
  aspectRatio?: string;
  blur?: string | number;
  effect?: string;
}

export function optimizeCloudinaryUrl(url: string, options: CloudinaryOptions = {}) {
  if (!url.includes('res.cloudinary.com')) return url
  
  try {
    const parts = url.split('/upload/')
    if (parts.length !== 2) return url
    
    const transforms = [
      options.width ? `w_${options.width}` : null,
      options.height ? `h_${options.height}` : null,
      options.crop ? `c_${options.crop}` : null,
      options.aspectRatio ? `ar_${options.aspectRatio}` : null,
      `f_${options.format || 'auto'}`,
      `q_${options.quality || 'auto'}`,
      options.blur ? `e_blur:${options.blur}` : null,
      options.effect ? `e_${options.effect}` : null
    ].filter(Boolean).join(',')
    
    return `${parts[0]}/upload/${transforms}/${parts[1]}`
  } catch (e) {
    console.error('Error optimizing Cloudinary URL:', e)
    return url
  }
}