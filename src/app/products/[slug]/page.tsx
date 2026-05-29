import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllProducts, getProductBySlug } from '@/lib/products'
import { ProductPageClient } from '@/components/product/ProductPageClient'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return {}

  return {
    title: product.name,
    description: `${product.series} коллекция. ${product.description}. Цена: ${product.price}.`,
    openGraph: {
      title: `${product.name} — VOID Store`,
      description: `${product.series} коллекция. ${product.description}.`,
      images: [{ url: product.image, width: 1080, height: 1080, alt: product.name }],
      type: 'website',
    },
  }
}

function productJsonLd(product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>) {
  const priceNum = parseInt(product.price.replace(/[^\d]/g, ''), 10)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { '@type': 'Brand', name: 'VOID' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: priceNum,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'VOID Store' },
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <ProductPageClient product={product} />
    </>
  )
}
