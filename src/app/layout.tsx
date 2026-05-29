import type { Metadata } from 'next'
import '@/styles/index.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://void-store.ru'),
  title: {
    default: 'VOID Store — Премиум футболки',
    template: '%s — VOID Store',
  },
  description: 'Лимитированные коллекции премиум футболок. Органический хлопок, уникальный дизайн, бесплатная доставка.',
  openGraph: {
    siteName: 'VOID Store',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
