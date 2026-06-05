'use server'

import { createClient } from '@/lib/supabase/server'
import { createOrder, type ShippingInfo } from '@/lib/orders'
import type { CartItem } from '@/lib/products'

export type PlaceOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string }

export async function placeOrder(
  items: CartItem[],
  shipping: ShippingInfo,
): Promise<PlaceOrderResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Необходимо войти в аккаунт' }
    }
    if (items.length === 0) {
      return { success: false, error: 'Корзина пуста' }
    }

    const order = await createOrder(user.id, user.email ?? '', items, shipping)
    return { success: true, orderId: order.id }
  } catch (err) {
    console.error('placeOrder error:', err)
    return { success: false, error: 'Не удалось создать заказ. Попробуйте снова.' }
  }
}
