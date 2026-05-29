'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import type { Product } from '@/lib/products'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'

export function ProductPageClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState('M')
  const [isImageHovered, setIsImageHovered] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#737373] hover:text-[#00d9ff] transition-colors mb-12 text-sm tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            НАЗАД
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative group"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {isImageHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 blur-3xl bg-[#00d9ff] z-0"
              />
            )}
            <div className="relative w-full h-[600px] border-2 border-[#00d9ff] overflow-hidden bg-black">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className={`object-contain transition-all duration-500 ${
                  isImageHovered ? '' : 'grayscale'
                }`}
              />
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-[#00d9ff]" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-[#00d9ff]" />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                className="inline-block border border-[#00d9ff] px-4 py-1 mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-xs tracking-widest text-[#00d9ff]">{product.series}</span>
              </motion.div>

              <h1 className="text-6xl md:text-7xl tracking-tighter leading-none mb-4">
                {product.name.split(' ')[0]}
                <br />
                <span className="text-[#00d9ff]">{product.name.split(' ')[1]}</span>
              </h1>

              <p className="text-[#737373] text-lg mb-6">{product.description}</p>

              <div className="text-5xl tracking-tighter text-[#00d9ff]">{product.price}</div>
            </div>

            {/* Size selection */}
            <div>
              <p className="text-xs tracking-widest text-[#737373] mb-4">ВЫБЕРИТЕ РАЗМЕР</p>
              <div className="flex gap-3">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border-2 transition-all ${
                      selectedSize === size
                        ? 'border-[#00d9ff] bg-[#00d9ff] text-black'
                        : 'border-[#262626] hover:border-[#00d9ff]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-xs tracking-widest text-[#737373] mb-4">КОЛИЧЕСТВО</p>
              <div className="flex items-center gap-4">
                <motion.button
                  className="w-12 h-12 border border-[#262626] hover:border-[#00d9ff] flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">−</span>
                </motion.button>
                <span className="text-2xl w-12 text-center">1</span>
                <motion.button
                  className="w-12 h-12 border border-[#262626] hover:border-[#00d9ff] flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">+</span>
                </motion.button>
              </div>
            </div>

            <motion.button
              className="w-full bg-[#00d9ff] text-black py-5 tracking-widest text-sm hover:bg-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ДОБАВИТЬ В КОРЗИНУ
            </motion.button>

            <div className="border-t border-[#262626] pt-6 space-y-2">
              {['Бесплатная доставка', 'Возврат в течение 30 дней', 'Премиум упаковка'].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-sm">
                  <div className="w-1 h-1 bg-[#00d9ff]" />
                  <span className="text-[#737373]">{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
