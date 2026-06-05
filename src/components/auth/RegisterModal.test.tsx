import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterModal } from './RegisterModal'

const mockSignUp = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
    },
  }),
}))

const baseProps = {
  show: true,
  onClose: vi.fn(),
  onSwitchToLogin: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSignUp.mockResolvedValue({ error: null })
})

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>, overrides: Record<string, string> = {}) {
  const name = overrides.name ?? 'Иван'
  const email = overrides.email ?? 'ivan@test.com'
  const password = overrides.password ?? 'password123'
  const confirm = overrides.confirm ?? password

  await user.type(screen.getByPlaceholderText('Ваше имя'), name)
  await user.type(screen.getByPlaceholderText('your@email.com'), email)
  const passwordInputs = screen.getAllByPlaceholderText('••••••••')
  await user.type(passwordInputs[0], password)
  await user.type(passwordInputs[1], confirm)
  const checkbox = screen.getByRole('checkbox')
  await user.click(checkbox)
  await user.click(screen.getByRole('button', { name: 'ЗАРЕГИСТРИРОВАТЬСЯ' }))
}

describe('RegisterModal — rendering', () => {
  it('renders registration form when show=true', () => {
    render(<RegisterModal {...baseProps} />)
    expect(screen.getByPlaceholderText('Ваше имя')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ЗАРЕГИСТРИРОВАТЬСЯ' })).toBeInTheDocument()
  })

  it('does not render when show=false', () => {
    render(<RegisterModal {...baseProps} show={false} />)
    expect(screen.queryByText('REGISTER')).not.toBeInTheDocument()
  })
})

describe('RegisterModal — validation', () => {
  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<RegisterModal {...baseProps} />)
    await fillAndSubmit(user, { password: 'abc123', confirm: 'xyz789' })
    await waitFor(() => expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument())
    expect(mockSignUp).not.toHaveBeenCalled()
  })
})

describe('RegisterModal — signup flow', () => {
  it('calls signUp with correct data including name', async () => {
    const user = userEvent.setup()
    render(<RegisterModal {...baseProps} />)
    await fillAndSubmit(user, { name: 'Алексей', email: 'alex@test.com', password: 'secret123' })
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'alex@test.com',
        password: 'secret123',
        options: { data: { name: 'Алексей' } },
      })
    })
  })

  it('shows success screen after successful registration', async () => {
    const user = userEvent.setup()
    render(<RegisterModal {...baseProps} />)
    await fillAndSubmit(user, { email: 'success@test.com' })
    await waitFor(() => expect(screen.getByText('Проверьте почту')).toBeInTheDocument())
    expect(screen.getByText('success@test.com')).toBeInTheDocument()
  })

  it('shows error message on signup failure', async () => {
    mockSignUp.mockResolvedValue({ error: { message: 'Email already in use' } })
    const user = userEvent.setup()
    render(<RegisterModal {...baseProps} />)
    await fillAndSubmit(user)
    await waitFor(() => expect(screen.getByText('Email already in use')).toBeInTheDocument())
  })
})

describe('RegisterModal — navigation', () => {
  it('calls onSwitchToLogin when "Войти" link is clicked', async () => {
    const onSwitchToLogin = vi.fn()
    const user = userEvent.setup()
    render(<RegisterModal {...baseProps} onSwitchToLogin={onSwitchToLogin} />)
    await user.click(screen.getByText('Войти'))
    expect(onSwitchToLogin).toHaveBeenCalled()
  })
})
