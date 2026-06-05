import { db } from './db'
import type { CartItem } from './products'

export type ShippingInfo = {
  recipientName: string
  phone: string
  city: string
  address: string
}

export async function createOrder(
  userId: string,
  userEmail: string,
  items: CartItem[],
  shipping: ShippingInfo,
) {
  const total = items.reduce((sum, item) => {
    const rubles = parseInt(item.price.replace(/[^\d]/g, ''), 10)
    return sum + rubles * 100 * item.quantity
  }, 0)

  return db.order.create({
    data: {
      user: {
        connectOrCreate: {
          where: { id: userId },
          create: { id: userId, email: userEmail },
        },
      },
      total,
      recipientName: shipping.recipientName,
      phone: shipping.phone,
      city: shipping.city,
      address: shipping.address,
      items: {
        create: items.map((item) => ({
          productId: item.id,
          size: item.size,
          quantity: item.quantity,
          price: parseInt(item.price.replace(/[^\d]/g, ''), 10) * 100,
        })),
      },
    },
    include: { items: true },
  })
}
