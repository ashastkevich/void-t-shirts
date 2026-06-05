import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  redirect: vi.fn(),
}))

// Mock next/image as a plain <img>
vi.mock('next/image', () => ({
  default: ({ src, alt, fill: _fill, sizes: _sizes, ...props }: Record<string, unknown>) =>
    React.createElement('img', { src: src as string, alt: alt as string, ...props }),
}))

// Mock next/link as a plain <a>
vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...props }: Record<string, unknown>) =>
    React.createElement('a', { href: href as string, onClick: onClick as React.MouseEventHandler, ...props }, children as React.ReactNode),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock motion/react — render plain HTML elements, skip animations
vi.mock('motion/react', () => {
  const tags = ['div', 'button', 'span', 'section', 'header', 'footer', 'nav', 'aside', 'main', 'h1', 'h2', 'h3', 'p', 'a', 'form', 'input', 'ul', 'li']
  const motion: Record<string, React.FC<Record<string, unknown>>> = {}
  for (const tag of tags) {
    motion[tag] = ({ children, whileHover: _wh, whileTap: _wt, initial: _i, animate: _a, exit: _e, transition: _t, ...props }: Record<string, unknown>) =>
      React.createElement(tag, props, children as React.ReactNode)
  }
  const AnimatePresence = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children)
  return { motion, AnimatePresence }
})
