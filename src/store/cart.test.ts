import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cart'

const item1 = { id: '1', name: 'ULTRA BLACK', size: 'M', price: '12,900 ₽', image: '/img1.jpg', quantity: 1 }
const item2 = { id: '2', name: 'VOID ESSENTIAL', size: 'L', price: '11,500 ₽', image: '/img2.jpg', quantity: 2 }

beforeEach(() => {
  useCartStore.setState({ items: [] })
})

describe('addItem', () => {
  it('adds a new item to empty cart', () => {
    useCartStore.getState().addItem(item1)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0]).toMatchObject({ id: '1', size: 'M', quantity: 1 })
  })

  it('adds different items separately', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem(item2)
    expect(useCartStore.getState().items).toHaveLength(2)
  })

  it('merges duplicate item (same id + size) by summing quantity', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem({ ...item1, quantity: 3 })
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(4)
  })

  it('does NOT merge items with same id but different size', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem({ ...item1, size: 'L' })
    expect(useCartStore.getState().items).toHaveLength(2)
  })
})

describe('removeItem', () => {
  it('removes item at given index', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem(item2)
    useCartStore.getState().removeItem(0)
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('2')
  })

  it('does nothing with out-of-range index (filter returns same array)', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().removeItem(99)
    expect(useCartStore.getState().items).toHaveLength(1)
  })
})

describe('updateQuantity', () => {
  it('updates quantity for item at index', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().updateQuantity(0, 5)
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('does NOT allow quantity below 1', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().updateQuantity(0, 0)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('does NOT allow negative quantity', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().updateQuantity(0, -3)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })
})

describe('clearCart', () => {
  it('removes all items', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem(item2)
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
