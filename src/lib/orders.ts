import { db } from './db'
import type { CartItem } from './products'

export async function createOrder(userId: string, items: CartItem[]) {
  const total = items.reduce((sum, item) => {
    const rubles = parseInt(item.price.replace(/[^\d]/g, ''), 10)
    return sum + rubles * 100
  }, 0)

  return db.order.create({
    data: {
      userId,
      total,
      items: {
        create: items.map((item) => ({
          productId: item.id,
          size: item.size,
          quantity: 1,
          price: parseInt(item.price.replace(/[^\d]/g, ''), 10) * 100,
        })),
      },
    },
    include: { items: true },
  })
}
