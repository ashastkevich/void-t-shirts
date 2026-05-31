import { db } from './db'

export type Product = {
  id: string
  slug: string
  name: string
  series: string
  price: string
  image: string
  description: string
}

export type CartItem = {
  id: string
  name: string
  size: string
  price: string
  image: string
  quantity: number
}

const staticProducts: Product[] = [
  {
    id: '1',
    slug: 'ultra-black',
    name: 'ULTRA BLACK',
    series: 'SIGNATURE',
    price: '12,900 ₽',
    image: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/ultra-black.jpg',
    description: '100% органический хлопок • 220 г/м²',
  },
  {
    id: '2',
    slug: 'void-essential',
    name: 'VOID ESSENTIAL',
    series: 'CORE',
    price: '11,500 ₽',
    image: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/void-essential.jpg',
    description: 'Премиум хлопок • 200 г/м²',
  },
  {
    id: '3',
    slug: 'minimal-black',
    name: 'MINIMAL BLACK',
    series: 'CLASSIC',
    price: '10,900 ₽',
    image: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/minimal-black.jpg',
    description: 'Качественный хлопок • 180 г/м²',
  },
  {
    id: '4',
    slug: 'dark-matter',
    name: 'DARK MATTER',
    series: 'LIMITED',
    price: '13,500 ₽',
    image: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/dark-matter.jpg',
    description: 'Премиум материал • 240 г/м²',
  },
  {
    id: '5',
    slug: 'shadow-form',
    name: 'SHADOW FORM',
    series: 'PREMIUM',
    price: '12,200 ₽',
    image: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/shadow-form.jpg',
    description: 'Органический хлопок • 210 г/м²',
  },
  {
    id: '6',
    slug: 'obsidian-core',
    name: 'OBSIDIAN CORE',
    series: 'EXCLUSIVE',
    price: '14,900 ₽',
    image: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/obsidian-core.jpg',
    description: '100% премиум хлопок • 260 г/м²',
  },
]

function dbRowToProduct(row: {
  id: string
  slug: string
  name: string
  series: string
  price: number
  imageUrl: string
  description: string
}): Product {
  const rubles = Math.floor(row.price / 100)
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    series: row.series,
    price: rubles.toLocaleString('ru-RU') + ' ₽',
    image: row.imageUrl,
    description: row.description,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await db.product.findMany({ orderBy: { createdAt: 'asc' } })
    if (rows.length === 0) return staticProducts
    return rows.map(dbRowToProduct)
  } catch {
    return staticProducts
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const row = await db.product.findUnique({ where: { slug } })
    if (!row) return staticProducts.find((p) => p.slug === slug)
    return dbRowToProduct(row)
  } catch {
    return staticProducts.find((p) => p.slug === slug)
  }
}
