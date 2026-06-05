'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { placeOrder } from '@/lib/actions/orders'
import type { CartItem } from '@/lib/products'

type CheckoutModalProps = {
  show: boolean
  onClose: () => void
  onSuccess: () => void
  items: CartItem[]
}

const emptyFields = { recipientName: '', phone: '', city: '', address: '' }

export function CheckoutModal({ show, onClose, onSuccess, items }: CheckoutModalProps) {
  const [view, setView] = useState<'form' | 'success'>('form')
  const [fields, setFields] = useState(emptyFields)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (show) {
      setView('form')
      setFields(emptyFields)
      setError(null)
      setLoading(false)
      setOrderId(null)
    }
  }, [show])

  const total = items
    .reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, ''), 10) * item.quantity, 0)
    .toLocaleString('ru-RU')

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const set = (field: keyof typeof emptyFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await placeOrder(items, fields)
    setLoading(false)
    if (result.success) {
      setOrderId(result.orderId)
      setView('success')
    } else {
      setError(result.error)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black border-2 border-[#00d9ff] max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
          >
            <motion.button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-12 h-12 bg-[#00d9ff] text-black flex items-center justify-center hover:bg-white transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">×</span>
            </motion.button>

            {view === 'form' ? (
              <>
                <h2 className="text-4xl tracking-tighter mb-2">
                  ОФОР<span className="text-[#00d9ff]">МЛЕНИЕ</span>
                </h2>
                <p className="text-sm text-[#737373] mb-6">Укажите данные для доставки</p>

                <div className="border border-[#262626] px-4 py-3 mb-6 flex items-center justify-between text-sm">
                  <span className="text-[#737373]">{totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}</span>
                  <span className="text-[#00d9ff] tracking-widest">{total} ₽</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs tracking-widest text-[#737373] mb-2">ИМЯ И ФАМИЛИЯ</label>
                    <input
                      type="text"
                      value={fields.recipientName}
                      onChange={set('recipientName')}
                      required
                      className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest text-[#737373] mb-2">ТЕЛЕФОН</label>
                    <input
                      type="tel"
                      value={fields.phone}
                      onChange={set('phone')}
                      required
                      className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                      placeholder="+7 (999) 000-00-00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest text-[#737373] mb-2">ГОРОД</label>
                    <input
                      type="text"
                      value={fields.city}
                      onChange={set('city')}
                      required
                      className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                      placeholder="Москва"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest text-[#737373] mb-2">УЛИЦА И ДОМ</label>
                    <input
                      type="text"
                      value={fields.address}
                      onChange={set('address')}
                      required
                      className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                      placeholder="ул. Ленина, д. 1, кв. 10"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 border border-red-400/30 px-4 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? '...' : 'ПОДТВЕРДИТЬ ЗАКАЗ'}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 py-4"
              >
                <div className="text-6xl text-[#00d9ff]">✓</div>
                <h2 className="text-4xl tracking-tighter">
                  ЗАКАЗ<span className="text-[#00d9ff]"> ПРИНЯТ</span>
                </h2>
                {orderId && (
                  <p className="text-xs tracking-widest text-[#737373]">
                    #{orderId.slice(-8).toUpperCase()}
                  </p>
                )}
                <p className="text-sm text-[#737373] max-w-xs mx-auto">
                  Спасибо за покупку! Мы свяжемся с вами по указанному номеру телефона.
                </p>
                <motion.button
                  onClick={onSuccess}
                  className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ЗАКРЫТЬ
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
