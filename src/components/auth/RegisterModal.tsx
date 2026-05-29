'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

type RegisterModalProps = {
  show: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ show, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Пароли не совпадают')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      if (authError) {
        setError(authError.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Не удалось подключиться. Проверьте соединение.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setPassword('')
    setConfirm('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black border-2 border-[#00d9ff] max-w-md w-full p-8 relative"
          >
            <motion.button
              onClick={handleClose}
              className="absolute -top-4 -right-4 w-12 h-12 bg-[#00d9ff] text-black flex items-center justify-center hover:bg-white transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">×</span>
            </motion.button>

            <h2 className="text-4xl tracking-tighter mb-2">
              REGIS<span className="text-[#00d9ff]">TER</span>
            </h2>
            <p className="text-sm text-[#737373] mb-8">Создайте новый аккаунт</p>

            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 border-2 border-[#00d9ff] flex items-center justify-center mx-auto text-3xl text-[#00d9ff]">
                  ✓
                </div>
                <p className="text-lg tracking-tight">Проверьте почту</p>
                <p className="text-sm text-[#737373]">
                  Мы отправили письмо на <span className="text-[#00d9ff]">{email}</span>. Перейдите по
                  ссылке в письме для подтверждения аккаунта.
                </p>
                <motion.button
                  onClick={handleClose}
                  className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ЗАКРЫТЬ
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">ИМЯ</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">PASSWORD</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="••••••••"
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

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" required className="w-4 h-4" />
                  <span className="text-[#737373]">Я согласен с условиями использования</span>
                </label>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? '...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
                </motion.button>

                <p className="text-center text-sm text-[#737373]">
                  Уже есть аккаунт?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-[#00d9ff] hover:text-white transition-colors"
                  >
                    Войти
                  </button>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
