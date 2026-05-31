'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/admin'

function requireAdmin() {
  return isAdmin().then((ok) => {
    if (!ok) throw new Error('Unauthorized')
  })
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const name = String(formData.get('name') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim() || toSlug(name)
  const series = String(formData.get('series') ?? '').trim()
  const priceRubles = Number(formData.get('price'))
  const description = String(formData.get('description') ?? '').trim()
  const weightRaw = formData.get('weight')
  const weight = weightRaw ? Number(weightRaw) : null
  const imagesRaw = String(formData.get('images') ?? '')
  const images = imagesRaw ? imagesRaw.split(',').filter(Boolean) : []
  const imageUrl = images[0] ?? ''

  if (!name || !slug || !series || !priceRubles || !description || !imageUrl) {
    throw new Error('Missing required fields')
  }

  await db.product.create({
    data: {
      name,
      slug,
      series,
      price: Math.round(priceRubles * 100),
      description,
      imageUrl,
      images,
      ...(weight !== null ? { weight } : {}),
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()

  const name = String(formData.get('name') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const series = String(formData.get('series') ?? '').trim()
  const priceRubles = Number(formData.get('price'))
  const description = String(formData.get('description') ?? '').trim()
  const weightRaw = formData.get('weight')
  const weight = weightRaw ? Number(weightRaw) : null
  const imagesRaw = String(formData.get('images') ?? '')
  const images = imagesRaw ? imagesRaw.split(',').filter(Boolean) : []
  const imageUrl = images[0] ?? ''

  if (!name || !slug || !series || !priceRubles || !description || !imageUrl) {
    throw new Error('Missing required fields')
  }

  const existing = await db.product.findUnique({ where: { id } })
  if (!existing) throw new Error('Product not found')

  await db.product.update({
    where: { id },
    data: {
      name,
      slug,
      series,
      price: Math.round(priceRubles * 100),
      description,
      imageUrl,
      images,
      weight: weight ?? undefined,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/products/${slug}`)
  redirect('/admin')
}

export async function deleteProduct(id: string) {
  await requireAdmin()

  const product = await db.product.findUnique({ where: { id } })
  if (!product) throw new Error('Product not found')

  await db.product.delete({ where: { id } })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/products/${product.slug}`)
}
