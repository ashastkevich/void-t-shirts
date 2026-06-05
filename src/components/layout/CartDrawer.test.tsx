import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartDrawer } from './CartDrawer'
import { useCartStore } from '@/store/cart'

vi.mock('@/store/cart', () => ({
  useCartStore: vi.fn(),
}))

const mockUseCartStore = useCartStore as unknown as ReturnType<typeof vi.fn>

const baseProps = {
  show: true,
  onClose: vi.fn(),
  onCheckout: vi.fn(),
}

const sampleItem = {
  id: '1',
  name: 'ULTRA BLACK',
  size: 'M',
  price: '12,900 ₽',
  image: '/img.jpg',
  quantity: 2,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CartDrawer', () => {
  it('renders empty state when cart has no items', () => {
    mockUseCartStore.mockReturnValue({ items: [], removeItem: vi.fn() })
    render(<CartDrawer {...baseProps} />)
    expect(screen.getByText('Корзина пуста')).toBeInTheDocument()
  })

  it('does not render when show=false', () => {
    mockUseCartStore.mockReturnValue({ items: [], removeItem: vi.fn() })
    render(<CartDrawer {...baseProps} show={false} />)
    expect(screen.queryByText('КОРЗИНА')).not.toBeInTheDocument()
  })

  it('renders cart items with name and size', () => {
    mockUseCartStore.mockReturnValue({ items: [sampleItem], removeItem: vi.fn() })
    render(<CartDrawer {...baseProps} />)
    expect(screen.getByText('ULTRA BLACK')).toBeInTheDocument()
    expect(screen.getByText(/Размер: M/)).toBeInTheDocument()
  })

  it('shows correct item count in subtitle', () => {
    mockUseCartStore.mockReturnValue({ items: [sampleItem], removeItem: vi.fn() })
    render(<CartDrawer {...baseProps} />)
    expect(screen.getByText(/1 товар/)).toBeInTheDocument()
  })

  it('calls removeItem with correct index when × clicked', () => {
    const removeItem = vi.fn()
    mockUseCartStore.mockReturnValue({ items: [sampleItem], removeItem })
    render(<CartDrawer {...baseProps} />)
    const removeButtons = screen.getAllByRole('button', { name: '×' })
    // First × is the close button, last ones are item remove buttons
    fireEvent.click(removeButtons[removeButtons.length - 1])
    expect(removeItem).toHaveBeenCalledWith(0)
  })

  it('calls onCheckout when checkout button is clicked', () => {
    const onCheckout = vi.fn()
    mockUseCartStore.mockReturnValue({ items: [sampleItem], removeItem: vi.fn() })
    render(<CartDrawer {...baseProps} onCheckout={onCheckout} />)
    fireEvent.click(screen.getByText('ОФОРМИТЬ ЗАКАЗ'))
    expect(onCheckout).toHaveBeenCalled()
  })

  it('calculates total price correctly (price × quantity)', () => {
    // price = 12900 rubles, quantity = 2 → total = 25800
    mockUseCartStore.mockReturnValue({ items: [sampleItem], removeItem: vi.fn() })
    render(<CartDrawer {...baseProps} />)
    // 12900 * 2 = 25800, formatted as ru-RU
    expect(screen.getAllByText(/25.800/)[0]).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    mockUseCartStore.mockReturnValue({ items: [], removeItem: vi.fn() })
    render(<CartDrawer {...baseProps} onClose={onClose} />)
    // The first button is the × close button
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onClose).toHaveBeenCalled()
  })
})
