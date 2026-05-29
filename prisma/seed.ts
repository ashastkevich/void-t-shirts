import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const products = [
  {
    slug: 'ultra-black',
    name: 'ULTRA BLACK',
    series: 'SIGNATURE',
    price: 1290000,
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: '100% органический хлопок • 220 г/м²',
    weight: 220,
  },
  {
    slug: 'void-essential',
    name: 'VOID ESSENTIAL',
    series: 'CORE',
    price: 1150000,
    imageUrl: 'https://images.unsplash.com/photo-1562135291-7728cc647783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Премиум хлопок • 200 г/м²',
    weight: 200,
  },
  {
    slug: 'minimal-black',
    name: 'MINIMAL BLACK',
    series: 'CLASSIC',
    price: 1090000,
    imageUrl: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Качественный хлопок • 180 г/м²',
    weight: 180,
  },
  {
    slug: 'dark-matter',
    name: 'DARK MATTER',
    series: 'LIMITED',
    price: 1350000,
    imageUrl: 'https://images.unsplash.com/photo-1759572095317-3a96f9a98e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Премиум материал • 240 г/м²',
    weight: 240,
  },
  {
    slug: 'shadow-form',
    name: 'SHADOW FORM',
    series: 'PREMIUM',
    price: 1220000,
    imageUrl: 'https://images.unsplash.com/photo-1759572095384-1a7e646d0d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Органический хлопок • 210 г/м²',
    weight: 210,
  },
  {
    slug: 'obsidian-core',
    name: 'OBSIDIAN CORE',
    series: 'EXCLUSIVE',
    price: 1490000,
    imageUrl: 'https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
