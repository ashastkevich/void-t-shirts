import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./db', () => ({
  db: {
    order: {
      create: vi.fn(),
    },
  },
}))

import { createOrder } from './orders'
import { db } from './db'

const mockDb = db as { order: { create: ReturnType<typeof vi.fn> } }

const shipping = {
  recipientName: 'Иван Иванов',
  phone: '+7 999 123-45-67',
  city: 'Москва',
  address: 'ул. Ленина, 1',
}

beforeEach(() => {
  vi.clearAllMocks()
  mockDb.order.create.mockResolvedValue({ id: 'order-1', items: [] })
})

describe('createOrder', () => {
  it('calculates total in kopecks from ruble-string prices', async () => {
    const items = [
      { id: 'p1', name: 'ULTRA BLACK', size: 'M', price: '12,900 ₽', image: '/img.jpg', quantity: 1 },
      { id: 'p2', name: 'VOID ESSENTIAL', size: 'L', price: '11,500 ₽', image: '/img2.jpg', quantity: 2 },
    ]
    await createOrder('user-1', 'test@test.com', items, shipping)

    const call = mockDb.order.create.mock.calls[0][0]
    // 12900*100*1 + 11500*100*2 = 1290000 + 2300000 = 3590000
    expect(call.data.total).toBe(3590000)
  })

  it('creates order with connectOrCreate user pattern', async () => {
    await createOrder('user-42', 'user@example.com', [
      { id: 'p1', name: 'T', size: 'S', price: '10,000 ₽', image: '/i.jpg', quantity: 1 },
    ], shipping)

    const { user } = mockDb.order.create.mock.calls[0][0].data
    expect(user.connectOrCreate.where).toEqual({ id: 'user-42' })
    expect(user.connectOrCreate.create).toEqual({ id: 'user-42', email: 'user@example.com' })
  })

  it('creates order items with correct structure', async () => {
    const items = [
      { id: 'prod-99', name: 'SHIRT', size: 'XL', price: '15,000 ₽', image: '/img.jpg', quantity: 3 },
    ]
    await createOrder('u1', 'u@u.com', items, shipping)

    const { items: orderItems } = mockDb.order.create.mock.calls[0][0].data
    expect(orderItems.create).toHaveLength(1)
    expect(orderItems.create[0]).toMatchObject({
      productId: 'prod-99',
      size: 'XL',
      quantity: 3,
      price: 1500000,
    })
  })

  it('stores shipping info on the order', async () => {
    await createOrder('u1', 'u@u.com', [
      { id: 'p1', name: 'T', size: 'M', price: '10,000 ₽', image: '/i.jpg', quantity: 1 },
    ], shipping)

    const data = mockDb.order.create.mock.calls[0][0].data
    expect(data.recipientName).toBe('Иван Иванов')
    expect(data.phone).toBe('+7 999 123-45-67')
    expect(data.city).toBe('Москва')
    expect(data.address).toBe('ул. Ленина, 1')
  })
})
