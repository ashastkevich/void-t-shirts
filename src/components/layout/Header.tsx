'use client'

import { motion } from 'motion/react'
import { ShoppingCart, User, UserPlus, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cart'

type HeaderProps = {
  currentIndex: number
  total: number
  onGoToSlide: (index: number) => void
  onCartOpen: () => void
  onLoginOpen: () => void
  onRegisterOpen: () => void
  user: string | null
  onLogout: () => void
}

export function Header({
  currentIndex,
  total,
  onGoToSlide,
  onCartOpen,
  onLoginOpen,
  onRegisterOpen,
  user,
  onLogout,
}: HeaderProps) {
  const cartCount = useCartStore((state) => state.items.length)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-8 flex items-center justify-between"
    >
      <motion.h1
        className="text-4xl tracking-tighter font-bold cursor-pointer"
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-white">VOID</span>
        <span className="text-[#00d9ff]">.</span>
      </motion.h1>

      <div className="flex items-center gap-2">
        {[...Array(total)].map((_, index) => (
          <motion.div
            key={index}
            onClick={() => onGoToSlide(index)}
            className={`cursor-pointer transition-all ${
              index === currentIndex ? 'w-12 bg-[#00d9ff]' : 'w-2 bg-[#262626] hover:bg-[#404040]'
            } h-2`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      <div className="flex items-center gap-6">
        <motion.button
          onClick={onCartOpen}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-6 h-6 group-hover:text-[#00d9ff] transition-colors" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-[#00d9ff] text-black text-xs w-5 h-5 flex items-center justify-center font-bold"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 border border-[#262626] px-4 py-2">
              <User className="w-4 h-4 text-[#00d9ff]" />
              <span className="text-xs tracking-widest text-[#737373] max-w-[120px] truncate">
                {user}
              </span>
            </div>
            <motion.button
              onClick={onLogout}
              className="flex items-center gap-2 border border-[#262626] px-4 py-2 hover:border-red-500 hover:text-red-400 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs tracking-widest hidden md:inline">ВЫЙТИ</span>
            </motion.button>
          </div>
        ) : (
          <>
            <motion.button
              onClick={onLoginOpen}
              className="flex items-center gap-2 border border-[#262626] px-4 py-2 hover:border-[#00d9ff] hover:text-[#00d9ff] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-4 h-4" />
              <span className="text-xs tracking-widest hidden md:inline">LOGIN</span>
            </motion.button>

            <motion.button
              onClick={onRegisterOpen}
              className="flex items-center gap-2 bg-[#00d9ff] text-black px-4 py-2 hover:bg-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-xs tracking-widest hidden md:inline">REGISTER</span>
            </motion.button>
          </>
        )}

        <motion.div
          className="text-sm tracking-widest hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-[#737373]">0{currentIndex + 1}</span>
          <span className="text-[#262626] mx-2">/</span>
          <span className="text-[#737373]">0{total}</span>
        </motion.div>
      </div>
    </motion.header>
  )
}
