'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share, Camera, Sparkles, Clock, Users, Star } from 'lucide-react'

interface BTSPost {
  id: string
  avatar: string
  author: string
  time: string
  content: string
  image?: string
  images?: string[]
  likes: number
  comments: number
  shares: number
  type: 'post' | 'story' | 'reel'
  hashtags: string[]
}

const BTS_POSTS: BTSPost[] = [
  {
    id: '1',
    avatar: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1758315615/_MG_9234_aerdni_e_gen_restore_e_improve_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.36_o_80_fl_layer_apply_g_west_x_0.03_y_0.04_bmly4s.jpg',
    author: '@studio37photography',
    time: '2 hours ago',
    content: '🎬 Behind the scenes of today\'s portrait session! The magic happens when natural light meets genuine emotion. Every shot tells a story.',
    image: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1760503070/F836BA20-9A10-4D23-81E3-9CB8999E1368_1_105_c_ji0ngc_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.36_o_80_fl_layer_apply_g_west_x_0.03_y_0.04_gxtw8e.jpg',
    likes: 47,
    comments: 12,
    shares: 8,
    type: 'post',
    hashtags: ['BehindTheScenes', 'PortraitPhotography', 'PinehurstTX']
  },
  {
    id: '2',
    avatar: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1758315656/IMG_6580_axayxe_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.36_o_80_fl_layer_apply_g_west_x_0.03_y_0.04_nkjfev.jpg',
    author: '@studio37photography',
    time: '1 day ago',
    content: '✨ Editing session in progress! There\'s something deeply satisfying about bringing out the perfect tones and emotions in each image. This is where the real magic happens in post-production.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1551845128-58b5e2bf4b23?w=300&h=200&fit=crop'
    ],
    likes: 62,
    comments: 18,
    shares: 15,
    type: 'reel',
    hashtags: ['PhotoEditing', 'StudioLife', 'CreativeProcess']
  },
  {
    id: '3',
    avatar: '',
    author: '@studio37photography',
    time: '3 days ago',
    content: '📸 New equipment day! Just upgraded our lighting setup for even better portrait sessions. Can\'t wait to create some stunning images with this new gear! Montgomery County clients, you\'re in for a treat!',
    likes: 89,
    comments: 25,
    shares: 22,
    type: 'story',
    hashtags: ['NewGear', 'PhotographyEquipment', 'UpgradeComplete', 'Studio37']
  },
  {
    id: '4',
    avatar: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1758315615/_MG_9234_aerdni_e_gen_restore_e_improve_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.36_o_80_fl_layer_apply_g_west_x_0.03_y_0.04_bmly4s.jpg',
    author: '@studio37photography',
    time: '5 days ago',
    content: '🌅 Golden hour sessions never disappoint! Working with this beautiful natural light in Montgomery County parks creates the most stunning portraits. There\'s nothing quite like that warm, dreamy glow.',
    image: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=600&h=400&fit=crop',
    likes: 134,
    comments: 31,
    shares: 28,
    type: 'post',
    hashtags: ['GoldenHour', 'NaturalLight', 'MontgomeryCounty', 'PortraitSession']
  },
  {
    id: '5',
    avatar: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1758315656/IMG_6580_axayxe_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.36_o_80_fl_layer_apply_g_west_x_0.03_y_0.04_nkjfev.jpg',
    author: '@studio37photography', 
    time: '1 week ago',
    content: '💍 Wedding season is here! Spent the weekend capturing love stories at The Woodlands venues. Every couple has such a unique story to tell through our lens.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    likes: 203,
    comments: 45,
    shares: 67,
    type: 'post',
    hashtags: ['WeddingSeason', 'LoveStories', 'TheWoodlands', 'CouplesPhotography']
  }
]

export default function BTSFeed() {
  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})
  const [animatingLikes, setAnimatingLikes] = useState<Record<string, boolean>>({})

  // Auto-rotate posts every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPostIndex((prev) => (prev + 1) % BTS_POSTS.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [])

  const handleLike = (postId: string) => {
    setIsLiked(prev => ({ ...prev, [postId]: !prev[postId] }))
    setAnimatingLikes(prev => ({ ...prev, [postId]: true }))
    
    setTimeout(() => {
      setAnimatingLikes(prev => ({ ...prev, [postId]: false }))
    }, 600)
  }

  const currentPost = BTS_POSTS[currentPostIndex]

  return (
    <div className="space-y-6 relative">
      {/* Post Navigation Dots */}
      <div className="flex justify-center gap-2 mb-4">
        {BTS_POSTS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPostIndex(index)}
            title={`View post ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentPostIndex 
                ? 'bg-blue-600 scale-110' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Main Post Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
        >
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              {currentPost.avatar ? (
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-200">
                  <img
                    src={currentPost.avatar}
                    alt="Author avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  S37
                </div>
              )}
              
              {/* Type indicator */}
              <div className="absolute -bottom-1 -right-1">
                {currentPost.type === 'reel' && (
                  <div className="bg-pink-500 text-white rounded-full p-1">
                    <Camera className="h-3 w-3" />
                  </div>
                )}
                {currentPost.type === 'story' && (
                  <div className="bg-orange-500 text-white rounded-full p-1">
                    <Sparkles className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                {currentPost.author}
                <span className="text-blue-500">
                  <Star className="h-4 w-4 fill-current" />
                </span>
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {currentPost.time}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-800 leading-relaxed">
              {currentPost.content}
            </p>
            
            {/* Hashtags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {currentPost.hashtags.map((tag) => (
                <span 
                  key={tag}
                  className="text-blue-600 text-sm hover:text-blue-700 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Post Media */}
          {currentPost.image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 relative overflow-hidden rounded-lg group"
            >
              <img
                src={currentPost.image}
                alt="Behind the scenes"
                className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
            </motion.div>
          )}

          {currentPost.images && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-2 mb-4"
            >
              {currentPost.images.map((img, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg group">
                  <img
                    src={img}
                    alt={`Behind the scenes ${index + 1}`}
                    className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLike(currentPost.id)}
              className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                isLiked[currentPost.id] ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <motion.div
                animate={animatingLikes[currentPost.id] ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Heart 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isLiked[currentPost.id] ? 'fill-current' : ''
                  }`} 
                />
              </motion.div>
              <span className="font-medium">
                {currentPost.likes + (isLiked[currentPost.id] ? 1 : 0)}
              </span>
            </motion.button>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MessageCircle className="h-5 w-5" />
              <span>{currentPost.comments}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Share className="h-5 w-5" />
              <span>{currentPost.shares}</span>
            </div>

            <div className="ml-auto flex items-center gap-1 text-gray-400 text-xs">
              <Users className="h-4 w-4" />
              <span>Pinehurst, TX</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mini Preview of Next Posts */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {BTS_POSTS.slice(currentPostIndex + 1, currentPostIndex + 3).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setCurrentPostIndex(BTS_POSTS.indexOf(post))}
            className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                {post.avatar ? (
                  <img src={post.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    S37
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500">{post.time}</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2 group-hover:text-gray-900 transition-colors duration-200">
              {post.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Live Activity Indicator */}
      <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
        <span>Live from Studio37 • Pinehurst, TX</span>
      </div>
    </div>
  )
}