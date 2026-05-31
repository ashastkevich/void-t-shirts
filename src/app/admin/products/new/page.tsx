import { ProductForm } from '@/components/admin/ProductForm'

export const metadata = { title: 'Новый товар — VOID Admin' }

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-xl font-bold tracking-wide mb-8">Новый товар</h1>
      <ProductForm mode="create" />
    </div>
  )
}
