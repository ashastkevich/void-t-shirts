import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/products'

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.findIndex(
            (i) => i.id === item.id && i.size === item.size,
          )
          if (existing !== -1) {
            const updated = [...state.items]
            updated[existing] = {
              ...updated[existing],
              quantity: updated[existing].quantity + item.quantity,
            }
            return { items: updated }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (index) =>
        set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
      updateQuantity: (index, quantity) =>
        set((state) => {
          if (quantity < 1) return state
          const updated = [...state.items]
          updated[index] = { ...updated[index], quantity }
          return { items: updated }
        }),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'void-cart' },
  ),
)
