import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Pure Milk. Pure Life.`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['dairy farm', 'fresh milk', 'organic dairy', 'silage', 'dairy products', 'Pakistan'],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Pure Milk. Pure Life.`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B4332',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: 'var(--font-plus-jakarta), sans-serif',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
