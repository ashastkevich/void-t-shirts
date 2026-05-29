import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const products = [
  {
    slug: 'ultra-black',
    name: 'ULTRA BLACK',
    series: 'SIGNATURE',
    price: 1290000,
    imageUrl: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/ultra-black.jpg',
    description: '100% органический хлопок • 220 г/м²',
    weight: 220,
  },
  {
    slug: 'void-essential',
    name: 'VOID ESSENTIAL',
    series: 'CORE',
    price: 1150000,
    imageUrl: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/void-essential.jpg',
    description: 'Премиум хлопок • 200 г/м²',
    weight: 200,
  },
  {
    slug: 'minimal-black',
    name: 'MINIMAL BLACK',
    series: 'CLASSIC',
    price: 1090000,
    imageUrl: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/minimal-black.jpg',
    description: 'Качественный хлопок • 180 г/м²',
    weight: 180,
  },
  {
    slug: 'dark-matter',
    name: 'DARK MATTER',
    series: 'LIMITED',
    price: 1350000,
    imageUrl: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/dark-matter.jpg',
    description: 'Премиум материал • 240 г/м²',
    weight: 240,
  },
  {
    slug: 'shadow-form',
    name: 'SHADOW FORM',
    series: 'PREMIUM',
    price: 1220000,
    imageUrl: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/shadow-form.jpg',
    description: 'Органический хлопок • 210 г/м²',
    weight: 210,
  },
  {
    slug: 'obsidian-core',
    name: 'OBSIDIAN CORE',
    series: 'EXCLUSIVE',
    price: 1490000,
    imageUrl: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/obsidian-core.jpg',
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
