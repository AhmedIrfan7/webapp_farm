import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default async function SilagePortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/silage-portal')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'admin') redirect('/admin')
  if (profile?.role === 'customer') redirect('/portal')

  return (
    <div className="min-h-dvh bg-[var(--color-background)]">
      {/* Top nav */}
      <header className="bg-[var(--color-primary)] text-white">
        <nav className="container-custom flex items-center justify-between h-16">
          <Link href="/silage-portal" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white" aria-hidden="true">
                <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm-2 16.5c-1.4 0-2.5-1.1-2.5-2.5S12.6 15.5 14 15.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm6-5c-1.4 0-2.5-1.1-2.5-2.5S18.6 10.5 20 10.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div>
              <div className="font-serif font-bold text-sm leading-none">{SITE_NAME}</div>
              <div className="text-xs text-white/60 leading-none mt-0.5">Silage Portal</div>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            {[
              { label: 'Dashboard', href: '/silage-portal' },
              { label: 'Products', href: '/silage-portal/products' },
              { label: 'My Orders', href: '/silage-portal/orders' },
              { label: 'Request Quote', href: '/silage-portal/quote' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="hidden sm:block px-3 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/" className="ml-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors">
              Exit
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className="container-custom py-8">
        {children}
      </main>
    </div>
  )
}
