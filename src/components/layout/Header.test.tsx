import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'
import { useCartStore } from '@/store/cart'

vi.mock('@/store/cart', () => ({
  useCartStore: vi.fn(),
}))

const mockUseCartStore = useCartStore as unknown as ReturnType<typeof vi.fn>

const baseProps = {
  currentIndex: 0,
  total: 3,
  onGoToSlide: vi.fn(),
  onCartOpen: vi.fn(),
  onLoginOpen: vi.fn(),
  onRegisterOpen: vi.fn(),
  onLogout: vi.fn(),
  onLogoClick: vi.fn(),
  user: null,
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUseCartStore.mockReturnValue(0)
})

describe('Header — auth state', () => {
  it('shows login and register buttons when user is null', () => {
    render(<Header {...baseProps} user={null} />)
    expect(screen.getByText('ВОЙТИ')).toBeInTheDocument()
    expect(screen.getByText('РЕГИСТРАЦИЯ')).toBeInTheDocument()
  })

  it('shows user email and logout button when user is set', () => {
    render(<Header {...baseProps} user="test@example.com" />)
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('ВЫЙТИ')).toBeInTheDocument()
    expect(screen.queryByText('ВОЙТИ')).not.toBeInTheDocument()
  })
})

describe('Header — cart badge', () => {
  it('hides badge when cart is empty', () => {
    mockUseCartStore.mockReturnValue(0)
    render(<Header {...baseProps} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows badge with correct count when cart has items', () => {
    mockUseCartStore.mockReturnValue(3)
    render(<Header {...baseProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

describe('Header — callbacks', () => {
  it('calls onCartOpen when cart icon is clicked', () => {
    const onCartOpen = vi.fn()
    render(<Header {...baseProps} onCartOpen={onCartOpen} />)
    // Find the button containing the cart icon — it's the first button in the actions area
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onCartOpen).toHaveBeenCalled()
  })

  it('calls onLoginOpen when ВОЙТИ is clicked', () => {
    const onLoginOpen = vi.fn()
    render(<Header {...baseProps} onLoginOpen={onLoginOpen} />)
    fireEvent.click(screen.getByText('ВОЙТИ'))
    expect(onLoginOpen).toHaveBeenCalled()
  })

  it('calls onRegisterOpen when РЕГИСТРАЦИЯ is clicked', () => {
    const onRegisterOpen = vi.fn()
    render(<Header {...baseProps} onRegisterOpen={onRegisterOpen} />)
    fireEvent.click(screen.getByText('РЕГИСТРАЦИЯ'))
    expect(onRegisterOpen).toHaveBeenCalled()
  })

  it('calls onLogout when ВЫЙТИ is clicked', () => {
    const onLogout = vi.fn()
    render(<Header {...baseProps} user="user@test.com" onLogout={onLogout} />)
    fireEvent.click(screen.getByText('ВЫЙТИ'))
    expect(onLogout).toHaveBeenCalled()
  })
})

describe('Header — carousel dots', () => {
  it('renders correct number of dots based on total', () => {
    render(<Header {...baseProps} total={4} />)
    // Each dot is a div with onClick handler
    const dots = screen.getAllByRole('generic').filter((el) =>
      el.hasAttribute('class') && el.getAttribute('class')?.includes('cursor-pointer'),
    )
    expect(dots.length).toBeGreaterThanOrEqual(4)
  })
})
