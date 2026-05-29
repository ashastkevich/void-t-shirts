import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/products'

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (index) =>
        set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'void-cart' },
  ),
)
