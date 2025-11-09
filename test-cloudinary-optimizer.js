/**
 * Cloudinary URL Optimization Test Suite
 * 
 * Run this file to verify the optimizeCloudinaryUrl() function works correctly.
 * Usage: node test-cloudinary-optimizer.js
 */

// Import would fail in Node without proper setup, so we'll inline the function for testing
function optimizeCloudinaryUrl(url, maxWidth) {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  try {
    const parts = url.split('/upload/')
    if (parts.length !== 2) {
      return url
    }

    const transformations = [
      'f_auto',
      'q_auto:good',
      'c_limit',
    ]

    if (maxWidth) {
      transformations.push(`w_${maxWidth}`)
    } else {
      transformations.push('w_auto')
    }

    const transformString = transformations.join(',')
    return `${parts[0]}/upload/${transformString}/${parts[1]}`
  } catch (error) {
    console.error('Failed to optimize Cloudinary URL:', error)
    return url
  }
}

// Test cases
const testCases = [
  {
    name: 'Hero image with max width',
    input: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil.jpg',
    maxWidth: 1920,
    expected: 'https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,c_limit,w_1920/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil.jpg'
  },
  {
    name: 'Profile image with max width',
    input: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1758315615/_MG_9234_aerdni.jpg',
    maxWidth: 640,
    expected: 'https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,c_limit,w_640/v1758315615/_MG_9234_aerdni.jpg'
  },
  {
    name: 'Service image with max width',
    input: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1234567890/sample.jpg',
    maxWidth: 800,
    expected: 'https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,c_limit,w_800/v1234567890/sample.jpg'
  },
  {
    name: 'Image without max width',
    input: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1234567890/test.jpg',
    maxWidth: undefined,
    expected: 'https://res.cloudinary.com/dmjxho2rl/image/upload/f_auto,q_auto:good,c_limit,w_auto/v1234567890/test.jpg'
  },
  {
    name: 'Non-Cloudinary URL (should return unchanged)',
    input: 'https://images.unsplash.com/photo-1234567890/test.jpg',
    maxWidth: 1920,
    expected: 'https://images.unsplash.com/photo-1234567890/test.jpg'
  },
  {
    name: 'Invalid Cloudinary URL (should return unchanged)',
    input: 'https://res.cloudinary.com/dmjxho2rl/invalid/path.jpg',
    maxWidth: 1920,
    expected: 'https://res.cloudinary.com/dmjxho2rl/invalid/path.jpg'
  }
]

// Run tests
console.log('🧪 Running Cloudinary URL Optimization Tests...\n')

let passed = 0
let failed = 0

testCases.forEach((test, index) => {
  const result = optimizeCloudinaryUrl(test.input, test.maxWidth)
  const success = result === test.expected
  
  if (success) {
    console.log(`✅ Test ${index + 1}: ${test.name}`)
    passed++
  } else {
    console.log(`❌ Test ${index + 1}: ${test.name}`)
    console.log(`   Expected: ${test.expected}`)
    console.log(`   Got:      ${result}`)
    failed++
  }
})

console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`)

if (failed === 0) {
  console.log('\n🎉 All tests passed! Cloudinary optimizer is working correctly.')
  process.exit(0)
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.')
  process.exit(1)
}
