'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
	{
		id: 1,
		name: 'Sarah & Michael Johnson',
		service: 'Wedding Photography',
		rating: 5,
		text: 'Studio 37 captured our wedding day perfectly! The photos are absolutely stunning and we couldn\'t be happier with the results. Professional, creative, and a joy to work with.',
		image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
	},
	{
		id: 2,
		name: 'David Chen',
		service: 'Corporate Headshots',
		rating: 5,
		text: 'Outstanding professional headshots for our entire team. The photographer made everyone feel comfortable and the results exceeded our expectations. Highly recommend!',
		image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
	},
	{
		id: 3,
		name: 'Emily Rodriguez',
		service: 'Family Portraits',
		rating: 5,
		text: 'Amazing experience! They captured our family\'s personality beautifully. The session was fun and relaxed, and we now have gorgeous photos we\'ll treasure forever.',
		image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
	}
]

export default function Testimonials() {
	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Don&apos;t just take our word for it. Here&apos;s what our satisfied clients have to say about their experience with Studio 37.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="bg-gray-50 p-8 rounded-lg relative"
						>
							<Quote className="h-8 w-8 text-primary-500 mb-4" />
							
							<div className="flex mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
								))}
							</div>
							
							<p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
							
							<div className="flex items-center">
								<img
									src={testimonial.image}
									alt={testimonial.name}
									className="w-12 h-12 rounded-full mr-4 object-cover"
								/>
								<div>
									<h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
									<p className="text-sm text-gray-600">{testimonial.service}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
