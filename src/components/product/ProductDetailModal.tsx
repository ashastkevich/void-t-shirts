'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import type { Product } from '@/lib/products'

type ProductDetailModalProps = {
  show: boolean
  onClose: () => void
  product: Product
  selectedSize: string
  onSizeChange: (size: string) => void
  onAddToCart: (qty: number) => void
}

export function ProductDetailModal({
  show,
  onClose,
  product,
  selectedSize,
  onSizeChange,
  onAddToCart,
}: ProductDetailModalProps) {
  const [qty, setQty] = useState(1)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-start md:items-center justify-center p-4 sm:p-8 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black border-2 border-[#00d9ff] max-w-6xl w-full relative my-4 sm:my-0"
            style={{ perspective: '1000px' }}
          >
            <motion.button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-12 h-12 bg-[#00d9ff] text-black flex items-center justify-center hover:bg-white transition-colors z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">×</span>
            </motion.button>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-4 sm:p-8 md:p-12">
              {/* Image */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <motion.div className="absolute inset-0 blur-3xl bg-[#00d9ff] opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-0" />
                <div className="relative w-full h-[220px] sm:h-[350px] md:h-[500px] border-2 border-[#262626] overflow-hidden bg-black">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-[#00d9ff]" />
                <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-[#00d9ff]" />
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 md:space-y-6"
              >
                <div>
                  <motion.div
                    className="inline-block border border-[#00d9ff] px-4 py-1 mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-xs tracking-widest text-[#00d9ff]">{product.series}</span>
                  </motion.div>

                  <h3 className="text-3xl sm:text-4xl md:text-5xl tracking-tighter mb-3 md:mb-4">
                    {product.name.split(' ')[0]}
                    <br />
                    <span className="text-[#00d9ff]">{product.name.split(' ')[1]}</span>
                  </h3>

                  <p className="text-[#737373] text-lg mb-6">{product.description}</p>

                  <div className="text-2xl sm:text-3xl md:text-4xl tracking-tighter text-[#00d9ff] mb-4 md:mb-8">{product.price}</div>
                </div>

                {/* Size selection */}
                <div>
                  <p className="text-xs tracking-widest text-[#737373] mb-4">ВЫБЕРИТЕ РАЗМЕР</p>
                  <div className="flex gap-3">
                    {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => onSizeChange(size)}
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
                  onClick={() => onAddToCart(qty)}
                  className="w-full bg-[#00d9ff] text-black py-5 tracking-widest text-sm hover:bg-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ДОБАВИТЬ В КОРЗИНУ
                </motion.button>

                {/* Features */}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
