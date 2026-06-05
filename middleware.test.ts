import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockGetUser = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: { getUser: () => mockGetUser() },
  }),
}))

import { middleware } from './middleware'

function makeRequest(pathname: string): NextRequest {
  return new NextRequest(`http://localhost${pathname}`)
}

function adminUser() {
  return { data: { user: { app_metadata: { role: 'admin' } } } }
}

function regularUser() {
  return { data: { user: { app_metadata: {} } } }
}

function noUser() {
  return { data: { user: null } }
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-key'
})

describe('middleware — /admin route protection', () => {
  it('redirects non-admin user from /admin to /', async () => {
    mockGetUser.mockResolvedValue(regularUser())
    const req = makeRequest('/admin')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toMatch(/\/$/)
  })

  it('redirects unauthenticated user from /admin to /', async () => {
    mockGetUser.mockResolvedValue(noUser())
    const req = makeRequest('/admin')
    const res = await middleware(req)
    expect(res.status).toBe(307)
  })

  it('redirects from /admin/products/new for non-admin', async () => {
    mockGetUser.mockResolvedValue(regularUser())
    const req = makeRequest('/admin/products/new')
    const res = await middleware(req)
    expect(res.status).toBe(307)
  })

  it('allows admin user to access /admin', async () => {
    mockGetUser.mockResolvedValue(adminUser())
    const req = makeRequest('/admin')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('allows admin user to access /admin/products/edit/123', async () => {
    mockGetUser.mockResolvedValue(adminUser())
    const req = makeRequest('/admin/products/edit/123')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })
})

describe('middleware — non-admin routes', () => {
  it('does not redirect from / for any user', async () => {
    mockGetUser.mockResolvedValue(regularUser())
    const req = makeRequest('/')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('does not redirect from /products/ultra-black for any user', async () => {
    mockGetUser.mockResolvedValue(noUser())
    const req = makeRequest('/products/ultra-black')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })
})
