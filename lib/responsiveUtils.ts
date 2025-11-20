/**
 * Responsive Utilities
 * Phase 4: Mobile-First Controls
 * 
 * Helper functions for building responsive class names
 */

export interface ResponsiveProps {
  mobileHidden?: boolean | string
  tabletHidden?: boolean | string
  desktopHidden?: boolean | string
  mobileTextSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | string
  mobileAlignment?: 'left' | 'center' | 'right' | string
  tabletColumns?: '1' | '2' | '3' | '4' | string
  mobileColumns?: '1' | '2' | string
}

/**
 * Generate responsive visibility classes
 */
export function getResponsiveVisibility(props: ResponsiveProps): string {
  const classes: string[] = []

  if (String(props.mobileHidden) === 'true') {
    classes.push('hidden md:block')
  }
  if (String(props.tabletHidden) === 'true') {
    classes.push('md:hidden lg:block')
  }
  if (String(props.desktopHidden) === 'true') {
    classes.push('lg:hidden')
  }

  return classes.join(' ')
}

/**
 * Generate responsive text size classes
 */
export function getResponsiveTextSize(
  baseSize: string = 'base',
  mobileSize?: string
): string {
  if (!mobileSize || mobileSize === baseSize) {
    return `text-${baseSize}`
  }

  return `text-${mobileSize} md:text-${baseSize}`
}

/**
 * Generate responsive alignment classes
 */
export function getResponsiveAlignment(
  baseAlignment: string = 'center',
  mobileAlignment?: string
): string {
  if (!mobileAlignment || mobileAlignment === baseAlignment) {
    return `text-${baseAlignment}`
  }

  return `text-${mobileAlignment} md:text-${baseAlignment}`
}

/**
 * Generate responsive column classes
 */
export function getResponsiveColumns(
  baseColumns: string = '3',
  tabletColumns?: string,
  mobileColumns?: string
): string {
  const mobile = mobileColumns || '1'
  const tablet = tabletColumns || (Number(baseColumns) > 2 ? '2' : baseColumns)
  
  const gridMap: Record<string, string> = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-2',
    '3': 'grid-cols-3',
    '4': 'grid-cols-4'
  }

  const classes = [gridMap[mobile] || 'grid-cols-1']
  
  if (tablet !== mobile) {
    classes.push(`md:${gridMap[tablet] || 'md:grid-cols-2'}`)
  }
  
  if (baseColumns !== tablet) {
    classes.push(`lg:${gridMap[baseColumns] || 'lg:grid-cols-3'}`)
  }

  return classes.join(' ')
}

/**
 * Generate responsive padding classes
 */
export function getResponsivePadding(
  basePadding: string = 'md',
  mobilePadding?: string
): string {
  if (!mobilePadding || mobilePadding === basePadding) {
    return `p-${basePadding}`
  }

  return `p-${mobilePadding} md:p-${basePadding}`
}

/**
 * Generate responsive image height classes
 */
export function getResponsiveImageHeight(
  baseHeight: string = 'auto',
  mobileHeight?: string
): string {
  if (!mobileHeight || mobileHeight === baseHeight) {
    return baseHeight === 'auto' ? 'h-auto' : `h-${baseHeight}`
  }

  return `h-${mobileHeight} md:h-${baseHeight}`
}
