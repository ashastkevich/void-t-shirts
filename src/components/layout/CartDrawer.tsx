'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart'

type CartDrawerProps = {
  show: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartDrawer({ show, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem } = useCartStore()

  const total = items
    .reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, ''), 10), 0)
    .toLocaleString('ru-RU')

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-end p-8"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black border-l-2 border-[#00d9ff] w-full max-w-lg h-full p-8 relative overflow-y-auto"
          >
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 w-12 h-12 border-2 border-[#262626] hover:border-[#00d9ff] flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">×</span>
            </motion.button>

            <h2 className="text-4xl tracking-tighter mb-2">
              КОРЗ<span className="text-[#00d9ff]">ИНА</span>
            </h2>
            <p className="text-sm text-[#737373] mb-8">
              {items.length} {items.length === 1 ? 'товар' : 'товара'}
            </p>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <ShoppingCart className="w-20 h-20 text-[#262626] mb-4" />
                <p className="text-xl text-[#737373] mb-2">Корзина пуста</p>
                <p className="text-sm text-[#737373]">Добавьте товары для оформления заказа</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 border-2 border-[#262626] p-4 hover:border-[#00d9ff] transition-colors group"
                    >
                      <div className="relative w-20 h-20 bg-black border border-[#262626] overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="tracking-tight mb-1">{item.name}</h4>
                        <p className="text-xs text-[#737373] mb-2">Размер: {item.size}</p>
                        <p className="text-[#00d9ff]">{item.price}</p>
                      </div>

                      <button
                        onClick={() => removeItem(index)}
                        className="text-[#737373] hover:text-[#ff0033] transition-colors"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t-2 border-[#262626] pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#737373]">Подытог:</span>
                    <span className="text-xl tracking-tighter">{total} ₽</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#737373]">Доставка:</span>
                    <span className="text-[#00d9ff]">Бесплатно</span>
                  </div>

                  <div className="flex justify-between items-center text-xl border-t-2 border-[#262626] pt-4">
                    <span>Итого:</span>
                    <span className="text-[#00d9ff] tracking-tighter">{total} ₽</span>
                  </div>

                  <motion.button
                    onClick={onCheckout}
                    className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ОФОРМИТЬ ЗАКАЗ
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
