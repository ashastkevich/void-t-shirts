import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { isAdmin } from './admin'
import { createClient } from '@/lib/supabase/server'

const mockCreateClient = createClient as ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
})

function mockUser(role: string | undefined) {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: role !== undefined
            ? { app_metadata: { role } }
            : { app_metadata: {} },
        },
      }),
    },
  })
}

describe('isAdmin', () => {
  it('returns true when user has admin role', async () => {
    mockUser('admin')
    expect(await isAdmin()).toBe(true)
  })

  it('returns false when user has a different role', async () => {
    mockUser('user')
    expect(await isAdmin()).toBe(false)
  })

  it('returns false when user has no role field', async () => {
    mockUser(undefined)
    expect(await isAdmin()).toBe(false)
  })

  it('returns false when there is no user', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    })
    expect(await isAdmin()).toBe(false)
  })
})
