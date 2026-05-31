'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

type Props = {
  images: string[]
  name: string
  /** Compact mode for the modal (shorter height) vs full mode for product page */
  compact?: boolean
}

export function Lightbox({ images, name, startIndex, onClose }: { images: string[]; name: string; startIndex: number; onClose: () => void }) {
  const [active, setActive] = useState(startIndex)
  const [direction, setDirection] = useState(0)

  const go = useCallback((next: number) => {
    setDirection(next > active ? 1 : -1)
    setActive(next)
  }, [active])

  const prev = useCallback(() => go((active - 1 + images.length) % images.length), [go, active, images.length])
  const next = useCallback(() => go((active + 1) % images.length), [go, active, images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); onClose() }
      else if (e.key === 'ArrowLeft') { e.stopImmediatePropagation(); prev() }
      else if (e.key === 'ArrowRight') { e.stopImmediatePropagation(); next() }
    }
    // Capture phase: fires before any bubble-phase listener (e.g. App.tsx's document handler),
    // so Esc closes only the lightbox and doesn't propagate to close the parent modal too.
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onClose, prev, next])

  const hasMany = images.length > 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/97 backdrop-blur-xl flex flex-col items-center justify-center p-4"
    >
      {/* Close */}
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-[#00d9ff] text-black flex items-center justify-center hover:bg-white transition-colors"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Закрыть"
      >
        <X className="w-5 h-5" />
      </motion.button>

      {/* Counter */}
      {hasMany && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs tracking-widest text-[#737373]">
          {active + 1} / {images.length}
        </div>
      )}

      {/* Main image */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl"
        style={{ height: 'min(70vh, 720px)' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d * 80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -80, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${name} — фото ${active + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {hasMany && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Предыдущее фото"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/70 border border-[#262626] hover:border-[#00d9ff] hover:text-[#00d9ff] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Следующее фото"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/70 border border-[#262626] hover:border-[#00d9ff] hover:text-[#00d9ff] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </motion.div>

      {/* Thumbnails */}
      {hasMany && (
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="flex gap-2 mt-4"
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Фото ${i + 1}`}
              className={`relative w-16 h-16 shrink-0 border-2 overflow-hidden transition-colors ${
                i === active ? 'border-[#00d9ff]' : 'border-[#262626] hover:border-[#737373]'
              }`}
            >
              <Image src={src} alt={`${name} миниатюра ${i + 1}`} fill sizes="64px" className="object-contain" />
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export function ProductGallery({ images, name, compact = false }: Props) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const go = (next: number) => {
    setDirection(next > active ? 1 : -1)
    setActive(next)
  }

  const prev = () => go((active - 1 + images.length) % images.length)
  const next = () => go((active + 1) % images.length)

  const hasMany = images.length > 1
  const imgHeight = compact ? 'h-[220px] sm:h-[350px] md:h-[500px]' : 'h-[600px]'

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative group">
          <motion.div className="absolute inset-0 blur-3xl bg-[#00d9ff] opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-0" />
          <div className={`relative w-full ${imgHeight} border-2 border-[#262626] overflow-hidden bg-black`}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={active}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d * 60, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -60, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="absolute inset-0 cursor-zoom-in"
                onClick={() => setLightboxIndex(active)}
              >
                <Image
                  src={images[active]}
                  alt={`${name} — фото ${active + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority={active === 0}
                />
                {/* Zoom hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/50 border border-[#00d9ff]/60 p-2">
                    <ZoomIn className="w-6 h-6 text-[#00d9ff]" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {hasMany && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  aria-label="Предыдущее фото"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/60 border border-[#262626] hover:border-[#00d9ff] hover:text-[#00d9ff] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next() }}
                  aria-label="Следующее фото"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/60 border border-[#262626] hover:border-[#00d9ff] hover:text-[#00d9ff] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Corner accents */}
          <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-[#00d9ff]" />
          <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-[#00d9ff]" />
        </div>

        {/* Thumbnails */}
        {hasMany && (
          <div className="flex gap-2 pt-1 pl-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Фото ${i + 1}`}
                className={`relative w-14 h-14 shrink-0 border-2 overflow-hidden transition-colors ${
                  i === active ? 'border-[#00d9ff]' : 'border-[#262626] hover:border-[#737373]'
                }`}
              >
                <Image
                  src={src}
                  alt={`${name} миниатюра ${i + 1}`}
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            name={name}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
