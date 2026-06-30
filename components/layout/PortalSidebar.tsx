'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import { toast } from 'sonner'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/portal',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Shop Products',
    href: '/portal/products',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'My Cart',
    href: '/portal/cart',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: 'My Orders',
    href: '/portal/orders',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'My Profile',
    href: '/portal/profile',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

interface PortalSidebarProps {
  profile: Profile | null
}

export function PortalSidebar({ profile }: PortalSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-sm group-hover:shadow-[var(--shadow-green)] transition-shadow">
            <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white" aria-hidden="true">
              <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm-2 16.5c-1.4 0-2.5-1.1-2.5-2.5S12.6 15.5 14 15.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm6-5c-1.4 0-2.5-1.1-2.5-2.5S18.6 10.5 20 10.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-[var(--color-primary)] leading-none">{SITE_NAME}</div>
            <div className="text-xs text-[var(--color-text-muted)] leading-none mt-0.5">Customer Portal</div>
          </div>
        </Link>
      </div>

      {/* User info */}
      {profile && (
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {profile.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {profile.full_name ?? 'Customer'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {profile.city ?? 'Customer Account'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto admin-scroll" aria-label="Portal navigation">
        <ul className="flex flex-col gap-1" role="list">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-cream-50)] hover:text-[var(--color-text-primary)]',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={isActive ? 'text-white' : 'text-[var(--color-text-muted)]'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-cream-50)] transition-colors mb-1"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Website
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-error)] hover:bg-red-50 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--color-border)] bg-white h-screen sticky top-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[var(--color-border)] px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="h-4 w-4 fill-white" aria-hidden="true">
              <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm-2 16.5c-1.4 0-2.5-1.1-2.5-2.5S12.6 15.5 14 15.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm6-5c-1.4 0-2.5-1.1-2.5-2.5S18.6 10.5 20 10.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="font-serif font-bold text-sm text-[var(--color-primary)]">My Account</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-[var(--color-cream-100)] transition-colors"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-hidden">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
