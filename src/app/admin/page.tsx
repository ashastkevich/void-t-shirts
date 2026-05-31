import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil } from 'lucide-react'
import { getAllProducts } from '@/lib/products'
import { DeleteButton } from './DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold tracking-wide">Товары</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00d9ff] text-black font-semibold text-sm rounded-md hover:bg-[#00d9ff]/90 transition-colors"
        >
          <Plus size={15} />
          Добавить товар
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          Нет товаров. <Link href="/admin/products/new" className="text-[#00d9ff] hover:underline">Добавить первый</Link>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-white/40 font-medium w-16">Фото</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Название</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Серия</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Цена</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Slug</th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                    i === products.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-white/5">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-white/50">{product.series}</td>
                  <td className="px-4 py-3 text-[#00d9ff]">{product.price}</td>
                  <td className="px-4 py-3 text-white/30 font-mono text-xs">{product.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-white/30 hover:text-[#00d9ff] transition-colors"
                        title="Редактировать"
                      >
                        <Pencil size={15} />
                      </Link>
                      <DeleteButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
