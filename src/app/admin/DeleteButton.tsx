'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteProduct } from '@/lib/actions/products'

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteProduct(id)
      setConfirming(false)
    })
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
        title="Удалить"
      >
        <Trash2 size={15} />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-white/50 text-xs">Удалить «{name}»?</span>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-400 hover:text-red-300 font-medium disabled:opacity-50 inline-flex items-center gap-1"
      >
        {isPending ? <Loader2 size={12} className="animate-spin" /> : null}
        Да
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="text-white/40 hover:text-white/70"
      >
        Нет
      </button>
    </div>
  )
}
