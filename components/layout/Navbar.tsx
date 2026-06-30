'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_LINKS, SITE_NAME } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

interface NavbarProps {
  user?: { id: string; email: string } | null
  profile?: Profile | null
}

export function Navbar({ user, profile }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const portalLink =
    profile?.role === 'admin'
      ? '/admin'
      : profile?.role === 'farm'
        ? '/silage-portal'
        : '/portal'

  const portalLabel =
    profile?.role === 'admin'
      ? 'Admin Panel'
      : profile?.role === 'farm'
        ? 'Silage Portal'
        : 'My Account'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-[var(--color-border)]'
          : 'bg-transparent',
      )}
      role="banner"
    >
      <nav
        className="container-custom flex items-center justify-between h-16 lg:h-18"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label={`${SITE_NAME} - Home`}
        >
          <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-sm group-hover:shadow-[var(--shadow-green)] transition-shadow duration-300">
            <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white" aria-hidden="true">
              <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm-2 16.5c-1.4 0-2.5-1.1-2.5-2.5S12.6 15.5 14 15.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm6-5c-1.4 0-2.5-1.1-2.5-2.5S18.6 10.5 20 10.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className={cn(
                'font-serif font-bold text-lg leading-none transition-colors duration-300',
                scrolled ? 'text-[var(--color-primary)]' : 'text-white',
              )}
            >
              {SITE_NAME}
            </span>
            <span
              className={cn(
                'text-xs transition-colors duration-300 leading-none mt-0.5',
                scrolled ? 'text-[var(--color-text-muted)]' : 'text-white/70',
              )}
            >
              Pure Milk. Pure Life.
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                    isActive
                      ? scrolled
                        ? 'bg-[var(--color-green-50)] text-[var(--color-primary)]'
                        : 'bg-white/20 text-white'
                      : scrolled
                        ? 'text-[var(--color-text-primary)] hover:bg-[var(--color-cream-100)]'
                        : 'text-white/90 hover:bg-white/10 hover:text-white',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop auth area */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200',
                  scrolled
                    ? 'hover:bg-[var(--color-cream-100)]'
                    : 'hover:bg-white/10',
                )}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
                  {profile?.full_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <span className={cn('text-sm font-semibold leading-none', scrolled ? 'text-[var(--color-text-primary)]' : 'text-white')}>
                    {profile?.full_name?.split(' ')[0] ?? 'Account'}
                  </span>
                  <span className={cn('text-xs leading-none mt-0.5', scrolled ? 'text-[var(--color-text-muted)]' : 'text-white/70')}>
                    {portalLabel}
                  </span>
                </div>
                <svg className={cn('h-4 w-4 transition-transform', scrolled ? 'text-[var(--color-text-muted)]' : 'text-white/70', userMenuOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-[var(--color-border)] py-1.5 z-[var(--z-modal)]"
                  role="menu"
                >
                  <Link
                    href={portalLink}
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--color-cream-50)] transition-colors"
                  >
                    <svg className="h-4 w-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {portalLabel}
                  </Link>
                  {profile?.role === 'customer' && (
                    <Link
                      href="/portal/orders"
                      role="menuitem"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--color-cream-50)] transition-colors"
                    >
                      <svg className="h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      My Orders
                    </Link>
                  )}
                  <Link
                    href="/portal/profile"
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--color-cream-50)] transition-colors"
                  >
                    <svg className="h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <div className="border-t border-[var(--color-border)] my-1" />
                  <button
                    onClick={handleSignOut}
                    role="menuitem"
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-error)] hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  'px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200',
                  scrolled
                    ? 'text-[var(--color-primary)] hover:bg-[var(--color-green-50)]'
                    : 'text-white hover:bg-white/10',
                )}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className={cn(
                  'px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200',
                  scrolled
                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm'
                    : 'bg-white text-[var(--color-primary)] hover:bg-white/90',
                )}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            'lg:hidden p-2 rounded-lg transition-colors',
            scrolled
              ? 'text-[var(--color-text-primary)] hover:bg-[var(--color-cream-100)]'
              : 'text-white hover:bg-white/10',
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300',
          'bg-white border-t border-[var(--color-border)] shadow-lg',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!mobileOpen}
      >
        <ul className="container-custom py-4 flex flex-col gap-1" role="list">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-[var(--color-green-50)] text-[var(--color-primary)]'
                      : 'text-[var(--color-text-primary)] hover:bg-[var(--color-cream-100)]',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
          <li className="pt-3 border-t border-[var(--color-border)] flex gap-2">
            {user ? (
              <>
                <Link
                  href={portalLink}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-center bg-[var(--color-green-50)] text-[var(--color-primary)] rounded-lg"
                >
                  {portalLabel}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2.5 text-sm font-semibold text-[var(--color-error)] rounded-lg border border-[var(--color-error)] hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-center border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-cream-100)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-center bg-[var(--color-primary)] text-white rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </header>
  )
}
