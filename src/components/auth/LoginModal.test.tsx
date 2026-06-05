import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginModal } from './LoginModal'

const mockSignInWithPassword = vi.fn()
const mockResetPasswordForEmail = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  }),
}))

const baseProps = {
  show: true,
  onClose: vi.fn(),
  onSwitchToRegister: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSignInWithPassword.mockResolvedValue({ error: null })
  mockResetPasswordForEmail.mockResolvedValue({ error: null })
})

describe('LoginModal — rendering', () => {
  it('renders login form when show=true', () => {
    render(<LoginModal {...baseProps} />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByText('ВОЙТИ')).toBeInTheDocument()
  })

  it('does not render when show=false', () => {
    render(<LoginModal {...baseProps} show={false} />)
    expect(screen.queryByText('LOGIN')).not.toBeInTheDocument()
  })
})

describe('LoginModal — login flow', () => {
  it('calls signInWithPassword with entered credentials', async () => {
    const user = userEvent.setup()
    render(<LoginModal {...baseProps} />)
    await user.type(screen.getByPlaceholderText('your@email.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
    await user.click(screen.getByRole('button', { name: 'ВОЙТИ' }))
    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })
  })

  it('calls onClose after successful login', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<LoginModal {...baseProps} onClose={onClose} />)
    await user.type(screen.getByPlaceholderText('your@email.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'pass')
    await user.click(screen.getByRole('button', { name: 'ВОЙТИ' }))
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('displays error message on auth failure', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: 'Invalid credentials' } })
    const user = userEvent.setup()
    render(<LoginModal {...baseProps} />)
    await user.type(screen.getByPlaceholderText('your@email.com'), 'bad@test.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'ВОЙТИ' }))
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument())
  })
})

describe('LoginModal — forgot password', () => {
  it('switches to forgot password form on link click', async () => {
    const user = userEvent.setup()
    render(<LoginModal {...baseProps} />)
    await user.click(screen.getByText('Забыли пароль?'))
    expect(screen.getByText('ВОССТАНОВИТЬ ПАРОЛЬ')).toBeInTheDocument()
  })

  it('calls resetPasswordForEmail with entered email', async () => {
    const user = userEvent.setup()
    render(<LoginModal {...baseProps} />)
    await user.click(screen.getByText('Забыли пароль?'))
    await user.type(screen.getByPlaceholderText('your@email.com'), 'reset@test.com')
    await user.click(screen.getByRole('button', { name: 'ВОССТАНОВИТЬ ПАРОЛЬ' }))
    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        'reset@test.com',
        expect.objectContaining({ redirectTo: expect.any(String) }),
      )
    })
  })

  it('shows confirmation screen after reset email sent', async () => {
    const user = userEvent.setup()
    render(<LoginModal {...baseProps} />)
    await user.click(screen.getByText('Забыли пароль?'))
    await user.type(screen.getByPlaceholderText('your@email.com'), 'reset@test.com')
    await user.click(screen.getByRole('button', { name: 'ВОССТАНОВИТЬ ПАРОЛЬ' }))
    await waitFor(() => expect(screen.getByText('ПИСЬМО ОТПРАВЛЕНО')).toBeInTheDocument())
  })
})

describe('LoginModal — navigation', () => {
  it('calls onSwitchToRegister when register link is clicked', async () => {
    const onSwitchToRegister = vi.fn()
    const user = userEvent.setup()
    render(<LoginModal {...baseProps} onSwitchToRegister={onSwitchToRegister} />)
    await user.click(screen.getByText('Зарегистрироваться'))
    expect(onSwitchToRegister).toHaveBeenCalled()
  })
})
