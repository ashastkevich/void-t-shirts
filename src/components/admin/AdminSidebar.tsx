'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Plus } from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Товары', icon: Package, exact: true },
    { href: '/admin/products/new', label: 'Добавить', icon: Plus, exact: false },
  ]

  return (
    <aside className="w-56 shrink-0 border-r border-white/10 bg-black min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-[#00d9ff] font-bold tracking-widest text-sm">VOID ADMIN</span>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-3">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-[#00d9ff]/10 text-[#00d9ff]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-6 py-4 border-t border-white/10">
        <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
          ← На сайт
        </Link>
      </div>
    </aside>
  )
}
