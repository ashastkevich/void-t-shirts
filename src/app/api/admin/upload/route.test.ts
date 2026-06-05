import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const mockIsAdmin = vi.fn()
const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()

vi.mock('@/lib/admin', () => ({ isAdmin: () => mockIsAdmin() }))
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseAdmin: () => ({
    storage: {
      from: (_bucket: string) => ({
        upload: (...args: unknown[]) => mockUpload(...args),
        getPublicUrl: (...args: unknown[]) => mockGetPublicUrl(...args),
      }),
    },
  }),
}))

import { POST } from './route'

beforeEach(() => {
  vi.clearAllMocks()
  mockIsAdmin.mockResolvedValue(true)
  mockUpload.mockResolvedValue({ error: null })
  mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/img.jpg' } })
})

function makeFile(name = 'photo.jpg', type = 'image/jpeg') {
  return { name, type, arrayBuffer: async () => new ArrayBuffer(4) } as unknown as File
}

function makeRequest(files: ReturnType<typeof makeFile>[]) {
  const req = {
    formData: async () => {
      const fd = {
        getAll: (key: string) => (key === 'files' ? files : []),
      }
      return fd as unknown as FormData
    },
    nextUrl: { pathname: '/api/admin/upload' },
  } as unknown as NextRequest
  return req
}

describe('POST /api/admin/upload', () => {
  it('returns 401 when user is not admin', async () => {
    mockIsAdmin.mockResolvedValue(false)
    const req = makeRequest([makeFile()])
    const res = await POST(req)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Unauthorized')
  })

  it('returns 400 when no files are provided', async () => {
    const req = makeRequest([])
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('No files provided')
  })

  it('uploads file to Supabase storage with generated filename preserving extension', async () => {
    const req = makeRequest([makeFile('photo.jpg', 'image/jpeg')])
    await POST(req)
    expect(mockUpload).toHaveBeenCalledOnce()
    const [filename, , opts] = mockUpload.mock.calls[0]
    expect(filename).toMatch(/\.jpg$/)
    expect(opts.contentType).toBe('image/jpeg')
    expect(opts.upsert).toBe(false)
  })

  it('returns 200 with urls array on success', async () => {
    const req = makeRequest([makeFile()])
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.urls).toHaveLength(1)
    expect(json.urls[0]).toBe('https://cdn.example.com/img.jpg')
  })

  it('returns 500 when Supabase upload fails', async () => {
    mockUpload.mockResolvedValue({ error: { message: 'Bucket not found' } })
    const req = makeRequest([makeFile()])
    const res = await POST(req)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Bucket not found')
  })

  it('uploads multiple files and returns multiple urls', async () => {
    mockGetPublicUrl
      .mockReturnValueOnce({ data: { publicUrl: 'https://cdn.example.com/a.jpg' } })
      .mockReturnValueOnce({ data: { publicUrl: 'https://cdn.example.com/b.jpg' } })

    const req = makeRequest([makeFile('a.jpg'), makeFile('b.png', 'image/png')])
    const res = await POST(req)
    const json = await res.json()
    expect(json.urls).toHaveLength(2)
    expect(json.urls).toContain('https://cdn.example.com/a.jpg')
    expect(json.urls).toContain('https://cdn.example.com/b.jpg')
  })

  it('preserves webp extension in uploaded filename', async () => {
    const req = makeRequest([makeFile('photo.webp', 'image/webp')])
    await POST(req)
    const [filename] = mockUpload.mock.calls[0]
    expect(filename).toMatch(/\.webp$/)
  })
})
