'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Loader2, X, Upload } from 'lucide-react'
import { createProduct, updateProduct } from '@/lib/actions/products'

const SERIES = ['SIGNATURE', 'CORE', 'CLASSIC', 'LIMITED', 'PREMIUM', 'EXCLUSIVE']

type ProductFormProps = {
  mode: 'create' | 'edit'
  defaultValues?: {
    id: string
    name: string
    slug: string
    series: string
    priceRubles: number
    description: string
    weight?: number | null
    images: string[]
  }
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ProductForm({ mode, defaultValues }: ProductFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')
  const [series, setSeries] = useState(defaultValues?.series ?? SERIES[0])
  const [price, setPrice] = useState(defaultValues?.priceRubles?.toString() ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [weight, setWeight] = useState(defaultValues?.weight?.toString() ?? '')
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleNameChange(value: string) {
    setName(value)
    if (mode === 'create') setSlug(toSlug(value))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      files.forEach((f) => fd.append('files', f))
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      setImages((prev) => [...prev, ...json.urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!images.length) {
      setError('Добавьте хотя бы одно изображение')
      return
    }

    const fd = new FormData()
    fd.set('name', name)
    fd.set('slug', slug)
    fd.set('series', series)
    fd.set('price', price)
    fd.set('description', description)
    fd.set('weight', weight)
    fd.set('images', images.join(','))

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createProduct(fd)
        } else {
          await updateProduct(defaultValues!.id, fd)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка сохранения')
      }
    })
  }

  const busy = uploading || isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Название *
          </label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="ULTRA BLACK"
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Slug *
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="ultra-black"
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Серия *
          </label>
          <select value={series} onChange={(e) => setSeries(e.target.value)} className={inputCls}>
            {SERIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Цена (₽) *
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="12900"
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Вес (г/м²)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="220"
            className={inputCls}
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Описание *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="100% органический хлопок • 220 г/м²"
            className={inputCls + ' resize-none'}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-white/60 uppercase tracking-wider block">
          Изображения *
        </label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={i} className="relative group w-24 h-24 rounded-md overflow-hidden border border-white/10">
                <Image src={url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} className="text-white" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-[#00d9ff]/80 text-black py-0.5">
                    главное
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={busy}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/20 text-sm text-white/70 cursor-pointer transition-colors hover:border-[#00d9ff]/50 hover:text-[#00d9ff] ${busy ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload size={14} />
                Загрузить изображения
              </>
            )}
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00d9ff] text-black font-semibold text-sm rounded-md hover:bg-[#00d9ff]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Сохранение...
            </>
          ) : mode === 'create' ? (
            'Создать товар'
          ) : (
            'Сохранить изменения'
          )}
        </button>
        <a
          href="/admin"
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          Отмена
        </a>
      </div>
    </form>
  )
}

const inputCls =
  'w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00d9ff]/50 focus:ring-1 focus:ring-[#00d9ff]/20 transition-colors'
