import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdminSidebar } from './AdminSidebar'

const mockUsePathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('AdminSidebar — links', () => {
  it('renders Products and Add links', () => {
    mockUsePathname.mockReturnValue('/admin')
    render(<AdminSidebar />)
    expect(screen.getByText('Товары')).toBeInTheDocument()
    expect(screen.getByText('Добавить')).toBeInTheDocument()
  })

  it('links have correct href attributes', () => {
    mockUsePathname.mockReturnValue('/admin')
    render(<AdminSidebar />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/admin')
    expect(hrefs).toContain('/admin/products/new')
  })
})

describe('AdminSidebar — active state', () => {
  it('marks Товары as active on exact /admin path', () => {
    mockUsePathname.mockReturnValue('/admin')
    render(<AdminSidebar />)
    const link = screen.getByText('Товары').closest('a')
    expect(link?.className).toContain('text-[#00d9ff]')
  })

  it('does NOT mark Товары as active on /admin/products/new', () => {
    mockUsePathname.mockReturnValue('/admin/products/new')
    render(<AdminSidebar />)
    const link = screen.getByText('Товары').closest('a')
    expect(link?.className).not.toContain('text-[#00d9ff]')
  })

  it('marks Добавить as active on /admin/products/new', () => {
    mockUsePathname.mockReturnValue('/admin/products/new')
    render(<AdminSidebar />)
    const link = screen.getByText('Добавить').closest('a')
    expect(link?.className).toContain('text-[#00d9ff]')
  })

  it('marks Добавить as active on nested /admin/products/new/something', () => {
    mockUsePathname.mockReturnValue('/admin/products/new/something')
    render(<AdminSidebar />)
    const link = screen.getByText('Добавить').closest('a')
    expect(link?.className).toContain('text-[#00d9ff]')
  })
})
