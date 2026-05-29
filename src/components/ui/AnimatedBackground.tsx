'use client'

import { motion } from 'motion/react'

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 opacity-5">
      <motion.div
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="h-full w-full"
        style={{
          backgroundImage:
            'linear-gradient(#00d9ff 1px, transparent 1px), linear-gradient(90deg, #00d9ff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  )
}
