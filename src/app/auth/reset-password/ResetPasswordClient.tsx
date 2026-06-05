'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { createClient } from '@/lib/supabase/client'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'

export function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const successRef = useRef(false)

  // Sign out the recovery session if the user leaves without completing the update.
  useEffect(() => {
    return () => {
      if (!successRef.current) {
        createClient().auth.signOut()
      }
    }
  }, [])

  useEffect(() => {
    if (searchParams.get('error')) {
      setError('Ссылка устарела или уже использована. Запросите новую.')
      return
    }
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true)
      } else {
        setError('Сессия не найдена. Попробуйте запросить письмо повторно.')
      }
    })
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Пароли не совпадают.')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(
          updateError.message.toLowerCase().includes('different')
            ? 'Новый пароль должен отличаться от предыдущего.'
            : updateError.message,
        )
      } else {
        successRef.current = true
        setDone(true)
        setTimeout(() => router.push('/'), 2500)
      }
    } catch {
      setError('Не удалось обновить пароль. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  function renderContent() {
    if (done) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#00d9ff]/40 px-6 py-8 text-center space-y-4"
        >
          <p className="text-[#00d9ff] tracking-widest text-sm">ПАРОЛЬ ОБНОВЛЁН</p>
          <p className="text-[#737373] text-sm">Перенаправляем на главную страницу…</p>
        </motion.div>
      )
    }

    if (!ready) {
      if (error) {
        return (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-red-400/30 px-6 py-8 text-center space-y-4"
          >
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="text-xs text-[#737373] hover:text-[#00d9ff] transition-colors tracking-widest"
            >
              НА ГЛАВНУЮ
            </button>
          </motion.div>
        )
      }
      return (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#00d9ff] border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs tracking-widest text-[#737373] mb-2">НОВЫЙ ПАРОЛЬ</label>
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
          <label className="block text-xs tracking-widest text-[#737373] mb-2">ПОДТВЕРДИТЕ ПАРОЛЬ</label>
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

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? '...' : 'СОХРАНИТЬ ПАРОЛЬ'}
        </motion.button>
      </form>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 relative overflow-hidden">
      <AnimatedBackground />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-black border-2 border-[#00d9ff] max-w-md w-full p-8 relative z-10"
      >
        <h2 className="text-4xl tracking-tighter mb-2">
          НОВЫЙ<span className="text-[#00d9ff]"> ПАРОЛЬ</span>
        </h2>
        <p className="text-sm text-[#737373] mb-8">Введите новый пароль для вашего аккаунта</p>

        {renderContent()}
      </motion.div>
    </div>
  )
}
