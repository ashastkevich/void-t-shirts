import { db } from './db'

export type Product = {
  id: string
  slug: string
  name: string
  series: string
  price: string
  image: string
  images: string[]
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

const BASE = 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products'

function staticImgs(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    i === 0 ? `${BASE}/${slug}.jpg` : `${BASE}/${slug}-${i + 1}.jpg`
  )
}

const staticProducts: Product[] = [
  {
    id: '1',
    slug: 'ultra-black',
    name: 'ULTRA BLACK',
    series: 'SIGNATURE',
    price: '12,900 ₽',
    image: `${BASE}/ultra-black.jpg`,
    images: staticImgs('ultra-black', 3),
    description: '100% органический хлопок • 220 г/м²',
  },
  {
    id: '2',
    slug: 'void-essential',
    name: 'VOID ESSENTIAL',
    series: 'CORE',
    price: '11,500 ₽',
    image: `${BASE}/void-essential.jpg`,
    images: staticImgs('void-essential', 3),
    description: 'Премиум хлопок • 200 г/м²',
  },
  {
    id: '3',
    slug: 'minimal-black',
    name: 'MINIMAL BLACK',
    series: 'CLASSIC',
    price: '10,900 ₽',
    image: `${BASE}/minimal-black.jpg`,
    images: staticImgs('minimal-black', 3),
    description: 'Качественный хлопок • 180 г/м²',
  },
  {
    id: '4',
    slug: 'dark-matter',
    name: 'DARK MATTER',
    series: 'LIMITED',
    price: '13,500 ₽',
    image: `${BASE}/dark-matter.jpg`,
    images: staticImgs('dark-matter', 3),
    description: 'Премиум материал • 240 г/м²',
  },
  {
    id: '5',
    slug: 'shadow-form',
    name: 'SHADOW FORM',
    series: 'PREMIUM',
    price: '12,200 ₽',
    image: `${BASE}/shadow-form.jpg`,
    images: staticImgs('shadow-form', 3),
    description: 'Органический хлопок • 210 г/м²',
  },
  {
    id: '6',
    slug: 'obsidian-core',
    name: 'OBSIDIAN CORE',
    series: 'EXCLUSIVE',
    price: '14,900 ₽',
    image: `${BASE}/obsidian-core.jpg`,
    images: staticImgs('obsidian-core', 3),
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
  images: string[]
  description: string
}): Product {
  const rubles = Math.floor(row.price / 100)
  const images = row.images.length > 0 ? row.images : [row.imageUrl]
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    series: row.series,
    price: rubles.toLocaleString('ru-RU') + ' ₽',
    image: images[0],
    images,
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
