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
}

const staticProducts: Product[] = [
  {
    id: '1',
    slug: 'ultra-black',
    name: 'ULTRA BLACK',
    series: 'SIGNATURE',
    price: '12,900 ₽',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: '100% органический хлопок • 220 г/м²',
  },
  {
    id: '2',
    slug: 'void-essential',
    name: 'VOID ESSENTIAL',
    series: 'CORE',
    price: '11,500 ₽',
    image: 'https://images.unsplash.com/photo-1562135291-7728cc647783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Премиум хлопок • 200 г/м²',
  },
  {
    id: '3',
    slug: 'minimal-black',
    name: 'MINIMAL BLACK',
    series: 'CLASSIC',
    price: '10,900 ₽',
    image: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Качественный хлопок • 180 г/м²',
  },
  {
    id: '4',
    slug: 'dark-matter',
    name: 'DARK MATTER',
    series: 'LIMITED',
    price: '13,500 ₽',
    image: 'https://images.unsplash.com/photo-1759572095317-3a96f9a98e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Премиум материал • 240 г/м²',
  },
  {
    id: '5',
    slug: 'shadow-form',
    name: 'SHADOW FORM',
    series: 'PREMIUM',
    price: '12,200 ₽',
    image: 'https://images.unsplash.com/photo-1759572095384-1a7e646d0d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Органический хлопок • 210 г/м²',
  },
  {
    id: '6',
    slug: 'obsidian-core',
    name: 'OBSIDIAN CORE',
    series: 'EXCLUSIVE',
    price: '14,900 ₽',
    image: 'https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
