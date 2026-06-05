import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/admin', () => ({ isAdmin: vi.fn() }))
vi.mock('@/lib/db', () => ({
  db: {
    product: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

import { createProduct, updateProduct, deleteProduct } from './products'
import { isAdmin } from '@/lib/admin'
import { db } from '@/lib/db'

const mockIsAdmin = isAdmin as ReturnType<typeof vi.fn>
const mockDb = db as {
  product: {
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
  }
}

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

const validFields = {
  name: 'TEST SHIRT',
  slug: 'test-shirt',
  series: 'CORE',
  price: '12900',
  description: 'Great shirt',
  images: 'https://example.com/img.jpg',
}

beforeEach(() => {
  vi.clearAllMocks()
  mockIsAdmin.mockResolvedValue(true)
  mockDb.product.create.mockResolvedValue({ id: 'new-1' })
  mockDb.product.findUnique.mockResolvedValue({ id: 'existing-1', slug: 'test-shirt' })
  mockDb.product.update.mockResolvedValue({ id: 'existing-1' })
  mockDb.product.delete.mockResolvedValue({})
})

describe('toSlug (via createProduct)', () => {
  it('generates slug from name when slug field is empty', async () => {
    const fd = makeFormData({ ...validFields, slug: '' })
    await createProduct(fd).catch(() => {}) // redirect throws in test
    const call = mockDb.product.create.mock.calls[0]?.[0]
    expect(call?.data.slug).toBe('test-shirt')
  })

  it('uses provided slug over auto-generated one', async () => {
    const fd = makeFormData({ ...validFields, slug: 'my-custom-slug' })
    await createProduct(fd).catch(() => {})
    const call = mockDb.product.create.mock.calls[0]?.[0]
    expect(call?.data.slug).toBe('my-custom-slug')
  })

  it('converts uppercase name to lowercase slug with hyphens', async () => {
    const fd = makeFormData({ ...validFields, name: 'VOID ULTRA BLACK', slug: '' })
    await createProduct(fd).catch(() => {})
    const call = mockDb.product.create.mock.calls[0]?.[0]
    expect(call?.data.slug).toBe('void-ultra-black')
  })

  it('strips special characters from slug', async () => {
    const fd = makeFormData({ ...validFields, name: 'Hello, World! #1', slug: '' })
    await createProduct(fd).catch(() => {})
    const call = mockDb.product.create.mock.calls[0]?.[0]
    expect(call?.data.slug).toBe('hello-world-1')
  })

  it('trims leading and trailing hyphens from slug', async () => {
    const fd = makeFormData({ ...validFields, name: '---test---', slug: '' })
    await createProduct(fd).catch(() => {})
    const call = mockDb.product.create.mock.calls[0]?.[0]
    expect(call?.data.slug).toBe('test')
  })
})

describe('price conversion', () => {
  it('converts rubles to kopecks (×100) when creating', async () => {
    const fd = makeFormData({ ...validFields, price: '12900' })
    await createProduct(fd).catch(() => {})
    const data = mockDb.product.create.mock.calls[0]?.[0]?.data
    expect(data?.price).toBe(1290000)
  })

  it('converts rubles to kopecks (×100) when updating', async () => {
    const fd = makeFormData({ ...validFields, price: '11500' })
    await updateProduct('existing-1', fd).catch(() => {})
    const data = mockDb.product.update.mock.calls[0]?.[0]?.data
    expect(data?.price).toBe(1150000)
  })
})

describe('authorization', () => {
  it('throws Unauthorized when not admin on createProduct', async () => {
    mockIsAdmin.mockResolvedValue(false)
    const fd = makeFormData(validFields)
    await expect(createProduct(fd)).rejects.toThrow('Unauthorized')
  })

  it('throws Unauthorized when not admin on updateProduct', async () => {
    mockIsAdmin.mockResolvedValue(false)
    const fd = makeFormData(validFields)
    await expect(updateProduct('id', fd)).rejects.toThrow('Unauthorized')
  })

  it('throws Unauthorized when not admin on deleteProduct', async () => {
    mockIsAdmin.mockResolvedValue(false)
    await expect(deleteProduct('id')).rejects.toThrow('Unauthorized')
  })
})

describe('validation', () => {
  it('throws when required fields are missing', async () => {
    const fd = makeFormData({ name: '', slug: '', series: '', price: '0', description: '', images: '' })
    await expect(createProduct(fd)).rejects.toThrow('Missing required fields')
  })
})

describe('deleteProduct', () => {
  it('throws Product not found when product does not exist', async () => {
    mockDb.product.findUnique.mockResolvedValue(null)
    await expect(deleteProduct('ghost-id')).rejects.toThrow('Product not found')
  })

  it('calls db.product.delete with correct id', async () => {
    await deleteProduct('existing-1').catch(() => {})
    expect(mockDb.product.delete).toHaveBeenCalledWith({ where: { id: 'existing-1' } })
  })
})
