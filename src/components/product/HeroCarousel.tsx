'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/lib/products'

type HeroCarouselProps = {
  products: Product[]
  currentIndex: number
  onSlideChange: (index: number, direction: number) => void
  selectedSize: string
  onSizeChange: (size: string) => void
  onViewDetails: () => void
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 45 : -45,
  }),
  center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
  exit: (direction: number) => ({
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? -45 : 45,
  }),
}

export function HeroCarousel({
  products,
  currentIndex,
  onSlideChange,
  selectedSize,
  onSizeChange,
  onViewDetails,
}: HeroCarouselProps) {
  const [direction, setDirection] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [isImageHovered, setIsImageHovered] = useState(false)

  const current = products[currentIndex]

  useEffect(() => {
    if (!isAutoplay) return
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % products.length
      setDirection(1)
      setIsAutoplay(false)
      onSlideChange(next, 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, isAutoplay, products.length, onSlideChange])

  const prevSlide = () => {
    const prev = (currentIndex - 1 + products.length) % products.length
    setDirection(-1)
    setIsAutoplay(false)
    onSlideChange(prev, -1)
  }

  const nextSlide = () => {
    const next = (currentIndex + 1) % products.length
    setDirection(1)
    setIsAutoplay(false)
    onSlideChange(next, 1)
  }

  const goToSlide = (index: number) => {
    const dir = index > currentIndex ? 1 : -1
    setDirection(dir)
    setIsAutoplay(false)
    onSlideChange(index, dir)
  }

  const handleViewDetails = () => {
    setIsAutoplay(false)
    onViewDetails()
  }

  const handleSizeChange = (size: string) => {
    setIsAutoplay(false)
    onSizeChange(size)
  }

  return (
    <>
      {/* Main slide */}
      <div className="h-full flex items-center justify-center px-4 md:px-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              rotateY: { duration: 0.6 },
            }}
            className="absolute grid md:grid-cols-2 gap-8 md:gap-16 items-center px-4 md:px-12 lg:px-20 max-w-[1400px] w-full"
            style={{ perspective: '1000px' }}
          >
            {/* Product Image */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                {isImageHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 blur-3xl bg-[#00d9ff]"
                  />
                )}

                <div className="relative w-full h-[600px] border-2 border-[#00d9ff] overflow-hidden bg-black">
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-contain transition-all duration-500 ${
                      isImageHovered ? '' : 'grayscale'
                    }`}
                  />
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-[#00d9ff]"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-[#00d9ff]"
                />
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div
                  className="inline-block border-2 border-[#00d9ff] px-6 py-2 mb-6"
                  whileHover={{ scale: 1.05, backgroundColor: '#00d9ff', color: '#000' }}
                >
                  <span className="text-xs tracking-widest">{current.series}</span>
                </motion.div>

                <motion.h2
                  className="text-7xl md:text-8xl tracking-tighter leading-none mb-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {current.name.split(' ').map((word, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    >
                      {i === 1 ? <span className="text-[#00d9ff]">{word}</span> : word}
                    </motion.div>
                  ))}
                </motion.h2>

                <motion.p
                  className="text-xl text-[#737373] mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {current.description}
                </motion.p>

                <motion.div
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-5xl tracking-tighter text-[#00d9ff]">{current.price}</div>

                  <motion.button
                    onClick={handleViewDetails}
                    className="bg-[#00d9ff] text-black px-10 py-4 tracking-widest text-sm hover:bg-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    VIEW DETAILS
                  </motion.button>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-xs text-[#737373] tracking-widest">SIZES:</span>
                  {['XS', 'S', 'M', 'L', 'XL'].map((size, i) => (
                    <motion.div
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`w-10 h-10 border flex items-center justify-center text-xs cursor-pointer transition-all ${
                        selectedSize === size
                          ? 'border-[#00d9ff] bg-[#00d9ff] text-black'
                          : 'border-[#262626] hover:border-[#00d9ff] hover:text-[#00d9ff]'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.05 }}
                    >
                      {size}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        onClick={prevSlide}
        className="hidden lg:flex fixed left-2 xl:left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 xl:w-14 xl:h-14 border-2 border-[#262626] hover:border-[#00d9ff] items-center justify-center group transition-all bg-black/90 backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-5 h-5 xl:w-6 xl:h-6 group-hover:text-[#00d9ff] transition-colors" />
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        onClick={nextSlide}
        className="hidden lg:flex fixed right-2 xl:right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 xl:w-14 xl:h-14 border-2 border-[#262626] hover:border-[#00d9ff] items-center justify-center group transition-all bg-black/90 backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-5 h-5 xl:w-6 xl:h-6 group-hover:text-[#00d9ff] transition-colors" />
      </motion.button>

      {/* Product navigator sidebar */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed right-8 bottom-8 z-50 space-y-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            onClick={() => goToSlide(index)}
            className={`cursor-pointer border-l-4 pl-4 transition-all ${
              index === currentIndex
                ? 'border-[#00d9ff] opacity-100'
                : 'border-[#262626] opacity-40 hover:opacity-70 hover:border-[#404040]'
            }`}
            whileHover={{ x: -5 }}
          >
            <div className="text-2xl tracking-tighter">0{index + 1}</div>
            <div className="text-xs text-[#737373] tracking-wide">{product.series}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating decorative dots */}
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed top-1/4 right-1/4 w-3 h-3 bg-[#00d9ff] blur-sm"
      />
      <motion.div
        animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="fixed bottom-1/3 left-1/4 w-3 h-3 bg-[#00d9ff] blur-sm"
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="fixed top-1/2 left-1/3 w-2 h-2 bg-[#00d9ff] blur-sm"
      />
      <motion.div
        animate={{ x: [0, -10, 0], y: [0, 25, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="fixed bottom-1/4 right-1/3 w-2 h-2 bg-[#00d9ff] blur-sm"
      />
    </>
  )
}
