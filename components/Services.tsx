'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Camera, Users, Building, Heart } from 'lucide-react'

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
	},
]

export default function Services() {
	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold mb-4">
						Our Photography Services
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						From intimate portraits to grand celebrations, we offer
						comprehensive photography services tailored to your unique
						needs.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{services.map((service, index) => {
						const Icon = service.icon
						return (
							<motion.div
								key={service.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300"
							>
								<div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6 mx-auto">
									<Icon className="h-8 w-8 text-primary-600" />
								</div>

								<h3 className="text-xl font-semibold mb-4 text-center">
									{service.title}
								</h3>
								<p className="text-gray-600 mb-6 text-center">
									{service.description}
								</p>

								<ul className="space-y-2">
									{service.features.map((feature) => (
										<li
											key={feature}
											className="flex items-center text-sm text-gray-600"
										>
											<div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
											{feature}
										</li>
									))}
								</ul>
							</motion.div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
