'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import type { Product } from '@/lib/products'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { ProductGallery } from '@/components/product/ProductGallery'
import { useCartStore } from '@/store/cart'

export function ProductPageClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState('M')
  const [qty, setQty] = useState(1)
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, size: selectedSize, price: product.price, image: product.image, quantity: qty })
  }

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
          {/* Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProductGallery images={product.images} name={product.name} />
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
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 border border-[#262626] hover:border-[#00d9ff] flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">−</span>
                </motion.button>
                <span className="text-2xl w-12 text-center">{qty}</span>
                <motion.button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-12 border border-[#262626] hover:border-[#00d9ff] flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">+</span>
                </motion.button>
              </div>
            </div>

            <motion.button
              onClick={handleAddToCart}
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
