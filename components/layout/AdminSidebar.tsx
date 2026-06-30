'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
      },
      {
        label: 'Analytics',
        href: '/admin/analytics',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      },
    ],
  },
  {
    label: 'Products & Inventory',
    items: [
      {
        label: 'Dairy Products',
        href: '/admin/products',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
      },
      {
        label: 'Silage Products',
        href: '/admin/silage',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3s8 0 13 8c-5 5-13 8-13 8S1 8 5 3z" /></svg>,
      },
      {
        label: 'Inventory',
        href: '/admin/inventory',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
      },
    ],
  },
  {
    label: 'Orders',
    items: [
      {
        label: 'Dairy Orders',
        href: '/admin/orders',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
      },
      {
        label: 'Silage Orders',
        href: '/admin/silage/orders',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>,
      },
    ],
  },
  {
    label: 'Customers',
    items: [
      {
        label: 'All Customers',
        href: '/admin/customers',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        label: 'Settings',
        href: '/admin/settings',
        icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      },
    ],
  },
]

export function AdminSidebar({ adminName }: { adminName: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white" aria-hidden="true">
              <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm-2 16.5c-1.4 0-2.5-1.1-2.5-2.5S12.6 15.5 14 15.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm6-5c-1.4 0-2.5-1.1-2.5-2.5S18.6 10.5 20 10.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-[var(--color-primary)] leading-none">{SITE_NAME}</div>
            <div className="text-xs text-[var(--color-text-muted)] leading-none mt-0.5">Admin Panel</div>
          </div>
        </Link>
      </div>

      {adminName && (
        <div className="px-5 py-3.5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[var(--color-gold-500)] flex items-center justify-center text-white font-bold text-xs">
              {adminName[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold truncate">{adminName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Administrator</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 overflow-y-auto admin-scroll" aria-label="Admin navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5" role="list">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
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
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-cream-50)] transition-colors mb-1">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          View Website
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-error)] hover:bg-red-50 transition-colors">
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
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--color-border)] bg-white h-screen sticky top-0 overflow-hidden">
        <SidebarContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[var(--color-border)] px-4 h-14 flex items-center justify-between">
        <span className="font-serif font-bold text-sm text-[var(--color-primary)]">Admin Panel</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-[var(--color-cream-100)]" aria-label="Menu">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-hidden">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
