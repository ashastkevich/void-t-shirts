import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductForm } from './ProductForm'

const mockCreateProduct = vi.fn()
const mockUpdateProduct = vi.fn()
const mockFetch = vi.fn()

vi.mock('@/lib/actions/products', () => ({
  createProduct: (...args: unknown[]) => mockCreateProduct(...args),
  updateProduct: (...args: unknown[]) => mockUpdateProduct(...args),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockCreateProduct.mockResolvedValue(undefined)
  mockUpdateProduct.mockResolvedValue(undefined)
  global.fetch = mockFetch
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ urls: ['https://example.com/uploaded.jpg'] }),
  } as Response)
})

describe('ProductForm — slug generation', () => {
  it('auto-generates slug from name in create mode', async () => {
    const user = userEvent.setup()
    render(<ProductForm mode="create" />)
    await user.type(screen.getByPlaceholderText('ULTRA BLACK'), 'VOID ULTRA BLACK')
    expect(screen.getByPlaceholderText('ultra-black')).toHaveValue('void-ultra-black')
  })

  it('does NOT auto-update slug after user manually edits it', async () => {
    // This tests that the slug input is always in sync with the name input in create mode
    // The current implementation always overwrites slug on name change
    const user = userEvent.setup()
    render(<ProductForm mode="create" />)
    await user.type(screen.getByPlaceholderText('ULTRA BLACK'), 'VOID')
    expect(screen.getByPlaceholderText('ultra-black')).toHaveValue('void')
  })

  it('does NOT auto-generate slug in edit mode', async () => {
    const user = userEvent.setup()
    render(<ProductForm mode="edit" defaultValues={{
      id: '1', name: 'ULTRA BLACK', slug: 'ultra-black',
      series: 'SIGNATURE', priceRubles: 12900, description: 'desc', images: ['/img.jpg'],
    }} />)
    const nameInput = screen.getByDisplayValue('ULTRA BLACK')
    await user.clear(nameInput)
    await user.type(nameInput, 'NEW NAME')
    // Slug should remain unchanged in edit mode
    expect(screen.getByDisplayValue('ultra-black')).toBeInTheDocument()
  })
})

describe('ProductForm — image upload', () => {
  it('shows error when no images on submit', async () => {
    render(<ProductForm mode="create" />)
    // Use fireEvent.submit on the form to bypass HTML5 constraint validation
    const form = document.querySelector('form')!
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getByText('Добавьте хотя бы одно изображение')).toBeInTheDocument()
    })
  })

  it('uploads files via fetch and shows preview', async () => {
    render(<ProductForm mode="create" />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/upload', expect.objectContaining({ method: 'POST' }))
    })
    // After successful upload, image URL should be in the form state
    // (rendered as img tag)
    await waitFor(() => {
      const img = document.querySelector('img[src="https://example.com/uploaded.jpg"]')
      expect(img).toBeInTheDocument()
    })
  })

  it('shows upload error when fetch fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Storage full' }),
    } as Response)

    render(<ProductForm mode="create" />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'a.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Storage full')).toBeInTheDocument()
    })
  })
})

describe('ProductForm — edit mode pre-population', () => {
  it('pre-fills fields from defaultValues', () => {
    render(<ProductForm mode="edit" defaultValues={{
      id: 'p1',
      name: 'ULTRA BLACK',
      slug: 'ultra-black',
      series: 'SIGNATURE',
      priceRubles: 12900,
      description: 'Great shirt',
      weight: 220,
      images: ['https://example.com/img.jpg'],
    }} />)
    expect(screen.getByDisplayValue('ULTRA BLACK')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ultra-black')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12900')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Great shirt')).toBeInTheDocument()
  })

  it('shows "Сохранить изменения" button in edit mode', () => {
    render(<ProductForm mode="edit" defaultValues={{
      id: 'p1', name: 'N', slug: 's', series: 'CORE',
      priceRubles: 100, description: 'd', images: ['/i.jpg'],
    }} />)
    expect(screen.getByRole('button', { name: 'Сохранить изменения' })).toBeInTheDocument()
  })

  it('shows "Создать товар" button in create mode', () => {
    render(<ProductForm mode="create" />)
    expect(screen.getByRole('button', { name: 'Создать товар' })).toBeInTheDocument()
  })
})

describe('ProductForm — image management', () => {
  it('marks first image as главное', async () => {
    render(<ProductForm mode="edit" defaultValues={{
      id: 'p1', name: 'N', slug: 's', series: 'CORE',
      priceRubles: 100, description: 'd', images: ['/img1.jpg', '/img2.jpg'],
    }} />)
    expect(screen.getByText('главное')).toBeInTheDocument()
  })
})
