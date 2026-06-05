import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the db module so Prisma never connects
vi.mock('./db', () => ({
  db: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

import { getAllProducts, getProductBySlug } from './products'
import { db } from './db'

const mockDb = db as {
  product: {
    findMany: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getAllProducts', () => {
  it('returns 6 static products when DB throws', async () => {
    mockDb.product.findMany.mockRejectedValue(new Error('no db'))
    const products = await getAllProducts()
    expect(products).toHaveLength(6)
  })

  it('returns 6 static products when DB returns empty array', async () => {
    mockDb.product.findMany.mockResolvedValue([])
    const products = await getAllProducts()
    expect(products).toHaveLength(6)
  })

  it('returns mapped products from DB when rows exist', async () => {
    mockDb.product.findMany.mockResolvedValue([
      {
        id: 'db-1',
        slug: 'test-shirt',
        name: 'TEST SHIRT',
        series: 'CORE',
        price: 1290000,
        imageUrl: 'https://example.com/img.jpg',
        images: [],
        description: 'Test desc',
      },
    ])
    const products = await getAllProducts()
    expect(products).toHaveLength(1)
    expect(products[0].id).toBe('db-1')
    expect(products[0].price).toBe('12 900 ₽')
  })
})

describe('getProductBySlug', () => {
  it('returns static product by slug when DB throws', async () => {
    mockDb.product.findUnique.mockRejectedValue(new Error('no db'))
    const product = await getProductBySlug('ultra-black')
    expect(product).toBeDefined()
    expect(product?.slug).toBe('ultra-black')
  })

  it('returns undefined for unknown slug when DB throws', async () => {
    mockDb.product.findUnique.mockRejectedValue(new Error('no db'))
    const product = await getProductBySlug('does-not-exist')
    expect(product).toBeUndefined()
  })

  it('returns DB product when found', async () => {
    mockDb.product.findUnique.mockResolvedValue({
      id: 'db-1',
      slug: 'ultra-black',
      name: 'ULTRA BLACK DB',
      series: 'SIGNATURE',
      price: 1290000,
      imageUrl: 'https://example.com/img.jpg',
      images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
      description: 'DB description',
    })
    const product = await getProductBySlug('ultra-black')
    expect(product?.name).toBe('ULTRA BLACK DB')
    expect(product?.price).toBe('12 900 ₽')
    expect(product?.images).toHaveLength(2)
  })

  it('falls back to static when DB returns null', async () => {
    mockDb.product.findUnique.mockResolvedValue(null)
    const product = await getProductBySlug('ultra-black')
    expect(product?.name).toBe('ULTRA BLACK')
  })
})

describe('dbRowToProduct price conversion', () => {
  it('converts kopecks to formatted rubles (1290000 → "12 900 ₽")', async () => {
    mockDb.product.findMany.mockResolvedValue([
      {
        id: '1', slug: 's', name: 'N', series: 'CORE',
        price: 1290000,
        imageUrl: 'u', images: [], description: 'd',
      },
    ])
    const [p] = await getAllProducts()
    expect(p.price).toBe('12 900 ₽')
  })

  it('uses imageUrl as first image when images array is empty', async () => {
    mockDb.product.findMany.mockResolvedValue([
      {
        id: '1', slug: 's', name: 'N', series: 'CORE',
        price: 100,
        imageUrl: 'https://example.com/cover.jpg', images: [], description: 'd',
      },
    ])
    const [p] = await getAllProducts()
    expect(p.image).toBe('https://example.com/cover.jpg')
    expect(p.images).toEqual(['https://example.com/cover.jpg'])
  })
})
