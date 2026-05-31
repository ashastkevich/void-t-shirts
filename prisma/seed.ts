import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const BASE = 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products'

function imgs(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    i === 0 ? `${BASE}/${slug}.jpg` : `${BASE}/${slug}-${i + 1}.jpg`
  )
}

const products = [
  {
    slug: 'ultra-black',
    name: 'ULTRA BLACK',
    series: 'SIGNATURE',
    price: 1290000,
    imageUrl: `${BASE}/ultra-black.jpg`,
    images: imgs('ultra-black', 3),
    description: '100% органический хлопок • 220 г/м²',
    weight: 220,
  },
  {
    slug: 'void-essential',
    name: 'VOID ESSENTIAL',
    series: 'CORE',
    price: 1150000,
    imageUrl: `${BASE}/void-essential.jpg`,
    images: imgs('void-essential', 3),
    description: 'Премиум хлопок • 200 г/м²',
    weight: 200,
  },
  {
    slug: 'minimal-black',
    name: 'MINIMAL BLACK',
    series: 'CLASSIC',
    price: 1090000,
    imageUrl: `${BASE}/minimal-black.jpg`,
    images: imgs('minimal-black', 3),
    description: 'Качественный хлопок • 180 г/м²',
    weight: 180,
  },
  {
    slug: 'dark-matter',
    name: 'DARK MATTER',
    series: 'LIMITED',
    price: 1350000,
    imageUrl: `${BASE}/dark-matter.jpg`,
    images: imgs('dark-matter', 3),
    description: 'Премиум материал • 240 г/м²',
    weight: 240,
  },
  {
    slug: 'shadow-form',
    name: 'SHADOW FORM',
    series: 'PREMIUM',
    price: 1220000,
    imageUrl: `${BASE}/shadow-form.jpg`,
    images: imgs('shadow-form', 3),
    description: 'Органический хлопок • 210 г/м²',
    weight: 210,
  },
  {
    slug: 'obsidian-core',
    name: 'OBSIDIAN CORE',
    series: 'EXCLUSIVE',
    price: 1490000,
    imageUrl: `${BASE}/obsidian-core.jpg`,
    images: imgs('obsidian-core', 3),
    description: '100% премиум хлопок • 260 г/м²',
    weight: 260,
  },
]

async function main() {
  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }
  console.log('Seeded', products.length, 'products')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
