'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useGalleryImages } from '@/hooks/useGalleryImages'
import { Camera, Users, Building, Heart, ArrowRight } from 'lucide-react'
import { optimizeCloudinaryUrl } from '@/lib/cloudinaryOptimizer'

const services = [
		{
			icon: Heart,
			title: 'Wedding Photography',
			description:
				'Capture your special day with romantic and timeless images that tell your love story.',
			features: [
				'Full day coverage',
				'Engagement session',
				'Digital gallery',
				'Print options',
			],
			category: 'wedding',
			slug: 'wedding-photography',
		},
		{
			icon: Users,
			title: 'Portrait Sessions',
			description:
				'Professional headshots, family portraits, and individual sessions in studio or on location.',
			features: [
				'Studio or outdoor',
				'Multiple outfits',
				'Retouched images',
				'Same day preview',
			],
			category: 'professional portraits',
			slug: 'portrait-photography',
		},
		{
			icon: Camera,
			title: 'Event Photography',
			description:
				'Document your corporate events, parties, and celebrations with candid and posed shots.',
			features: [
				'Event coverage',
				'Candid moments',
				'Group photos',
				'Quick turnaround',
			],
			category: 'event',
			slug: 'event-photography',
		},
		{
			icon: Building,
			title: 'Commercial Photography',
			description:
				'Product photography, business headshots, and marketing materials for your brand.',
			features: [
				'Product shots',
				'Brand imagery',
				'Marketing content',
				'Commercial rights',
			],
			category: 'product photography',
			slug: 'commercial-photography',
		},
]

export default function Services() {
	const [imagesByCategory, setImagesByCategory] = useState<Record<string, any[]>>({})
	const [slideshowIndexes, setSlideshowIndexes] = useState<Record<string, number>>({})
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const categories = services.map(s => s.category)
	const { data: images } = useGalleryImages({
		categories,
		featured: true,
		orderBy: 'display_order',
		ascending: true,
	})

	useEffect(() => {
		if (!images) return
		const grouped: Record<string, any[]> = {}
		categories.forEach(cat => {
			grouped[cat] = images.filter(img => img.category === cat)
		})
		setImagesByCategory(grouped)
	}, [images])

	// Slideshow rotation for each category
	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setSlideshowIndexes(prev => {
				const next: Record<string, number> = { ...prev }
				Object.keys(imagesByCategory).forEach(cat => {
					const arr = imagesByCategory[cat] || []
					if (arr.length > 1) {
						next[cat] = ((prev[cat] || 0) + 1) % arr.length
					}
				})
				return next
			})
		}, 5000)
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [imagesByCategory])

	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold mb-4">
						Our Photography Services
					</h2>
					<p className="text-xl text-gray-700 max-w-2xl mx-auto">
						From intimate portraits to grand celebrations, we offer
						comprehensive photography services tailored to your unique
						needs.
					</p>
				</div>

				<div
					className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
					style={{ contain: 'layout style paint', contentVisibility: 'auto', containIntrinsicSize: '1000px' as any }}
				>
					{services.map((service, index) => {
						const Icon = service.icon
						return (
							<Link
								key={service.title}
								href={`/services/${service.slug}`}
								className="group block"
							>
								<div
									className="bg-gray-50 p-8 rounded-lg hover:shadow-xl hover:bg-white transition-all duration-300 h-full flex flex-col cursor-pointer border-2 border-transparent group-hover:border-primary-500"
								>
									<div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6 mx-auto group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
										<Icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
									</div>

					{/* Static service image - optimized for performance */}
					<div className="mb-6 aspect-[4/3] relative rounded-lg overflow-hidden">
						<Image
							src={service.image}
							alt={service.title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
							loading={index < 2 ? "eager" : "lazy"}
							quality={65}
							className="object-cover group-hover:scale-105 transition-transform duration-500"
						/>
					</div>
					<h3 className="text-xl font-semibold mb-4 text-center group-hover:text-primary-600 transition-colors duration-300">
						{service.title}
					</h3>
									<p className="text-gray-700 mb-6 text-center flex-grow">
										{service.description}
									</p>

									<ul className="space-y-2 mb-6">
										{service.features.map((feature) => (
											<li
												key={feature}
												className="flex items-center text-sm text-gray-700"
											>
												<div className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
												{feature}
											</li>
										))}
									</ul>

									{/* Learn More CTA */}
									<div className="flex items-center justify-center text-primary-600 font-semibold text-sm group-hover:text-primary-700 mt-auto">
										Learn More
										<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
									</div>
								</div>
							</Link>
						)
					})}
				</div>
			</div>
			<style jsx>{`
				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in-up {
					animation: fade-in-up 0.5s ease-out forwards;
					opacity: 0;
				}
			`}</style>
		</section>
	)
}
