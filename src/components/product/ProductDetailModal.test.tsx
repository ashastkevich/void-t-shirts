import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductDetailModal } from './ProductDetailModal'

vi.mock('@/components/product/ProductGallery', () => ({
  ProductGallery: () => <div data-testid="gallery" />,
}))

const product = {
  id: '1',
  slug: 'ultra-black',
  name: 'ULTRA BLACK',
  series: 'SIGNATURE',
  price: '12,900 ₽',
  image: '/img.jpg',
  images: ['/img.jpg', '/img2.jpg'],
  description: '100% органический хлопок',
}

const baseProps = {
  show: true,
  onClose: vi.fn(),
  product,
  selectedSize: 'M',
  onSizeChange: vi.fn(),
  onAddToCart: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ProductDetailModal — rendering', () => {
  it('renders product name and price', () => {
    render(<ProductDetailModal {...baseProps} />)
    expect(screen.getByText('ULTRA')).toBeInTheDocument()
    expect(screen.getByText('12,900 ₽')).toBeInTheDocument()
  })

  it('does not render when show=false', () => {
    render(<ProductDetailModal {...baseProps} show={false} />)
    expect(screen.queryByText('12,900 ₽')).not.toBeInTheDocument()
  })

  it('renders all 5 sizes', () => {
    render(<ProductDetailModal {...baseProps} />)
    for (const size of ['XS', 'S', 'M', 'L', 'XL']) {
      expect(screen.getByRole('button', { name: size })).toBeInTheDocument()
    }
  })
})

describe('ProductDetailModal — size selection', () => {
  it('calls onSizeChange with correct size when size button clicked', () => {
    const onSizeChange = vi.fn()
    render(<ProductDetailModal {...baseProps} onSizeChange={onSizeChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'XL' }))
    expect(onSizeChange).toHaveBeenCalledWith('XL')
  })
})

describe('ProductDetailModal — quantity', () => {
  it('starts with quantity 1', () => {
    render(<ProductDetailModal {...baseProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('increments quantity when + is clicked', () => {
    render(<ProductDetailModal {...baseProps} />)
    fireEvent.click(screen.getByText('+'))
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('does not go below 1 when − is clicked at minimum', () => {
    render(<ProductDetailModal {...baseProps} />)
    fireEvent.click(screen.getByText('−'))
    // Should still show 1
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('decrements when quantity > 1', () => {
    render(<ProductDetailModal {...baseProps} />)
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('−'))
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})

describe('ProductDetailModal — add to cart', () => {
  it('calls onAddToCart with current quantity', () => {
    const onAddToCart = vi.fn()
    render(<ProductDetailModal {...baseProps} onAddToCart={onAddToCart} />)
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('ДОБАВИТЬ В КОРЗИНУ'))
    expect(onAddToCart).toHaveBeenCalledWith(2)
  })

  it('calls onAddToCart with qty=1 by default', () => {
    const onAddToCart = vi.fn()
    render(<ProductDetailModal {...baseProps} onAddToCart={onAddToCart} />)
    fireEvent.click(screen.getByText('ДОБАВИТЬ В КОРЗИНУ'))
    expect(onAddToCart).toHaveBeenCalledWith(1)
  })
})
