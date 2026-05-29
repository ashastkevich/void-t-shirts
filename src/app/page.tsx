import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/products'
import App from './App'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'VOID Store — Премиум футболки',
  description:
    'Лимитированные коллекции премиум футболок. Органический хлопок, уникальный дизайн, бесплатная доставка.',
  openGraph: {
    title: 'VOID Store — Премиум футболки',
    description:
      'Лимитированные коллекции премиум футболок. Органический хлопок, уникальный дизайн.',
    type: 'website',
    locale: 'ru_RU',
  },
}

export default async function Page() {
  const products = await getAllProducts()
  return <App products={products} />
}
