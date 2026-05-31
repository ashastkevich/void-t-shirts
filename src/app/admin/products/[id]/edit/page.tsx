import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata = { title: 'Редактирование — VOID Admin' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id } })
  if (!product) notFound()

  return (
    <div>
      <h1 className="text-xl font-bold tracking-wide mb-8">
        Редактирование: <span className="text-[#00d9ff]">{product.name}</span>
      </h1>
      <ProductForm
        mode="edit"
        defaultValues={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          series: product.series,
          priceRubles: Math.floor(product.price / 100),
          description: product.description,
          weight: product.weight,
          images: product.images.length > 0 ? product.images : [product.imageUrl],
        }}
      />
    </div>
  )
}
