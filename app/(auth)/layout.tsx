import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2b1e 0%, #1B4332 50%, #2D6A4F 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[var(--color-green-600)] opacity-20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-[var(--color-gold-500)] opacity-15 blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} aria-hidden="true" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white" aria-hidden="true">
                <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm-2 16.5c-1.4 0-2.5-1.1-2.5-2.5S12.6 15.5 14 15.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm6-5c-1.4 0-2.5-1.1-2.5-2.5S18.6 10.5 20 10.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div>
              <div className="font-serif font-bold text-xl text-white leading-none">{SITE_NAME}</div>
              <div className="text-xs text-white/50 leading-none mt-0.5">Pure Milk. Pure Life.</div>
            </div>
          </Link>

          {/* Quote */}
          <div className="mt-auto mb-12">
            <blockquote className="relative">
              <div className="text-7xl font-serif text-white/10 absolute -top-6 -left-2 leading-none select-none" aria-hidden="true">"</div>
              <p className="text-xl text-white/80 leading-relaxed font-serif italic">
                The purity of nature in every drop. Our cows roam free, our fields stay green, and our milk stays pure.
              </p>
              <footer className="mt-4">
                <p className="font-semibold text-white">Muhammad Irfan</p>
                <p className="text-sm text-white/50">Founder, GreenMeadow Dairy</p>
              </footer>
            </blockquote>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🌿', label: '100% Natural' },
              { icon: '🚚', label: 'Daily Delivery' },
              { icon: '🧪', label: 'Lab Tested' },
              { icon: '🐄', label: 'Free Range' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 bg-white/8 rounded-xl px-4 py-3">
                <span className="text-lg" aria-hidden="true">{f.icon}</span>
                <span className="text-sm font-semibold text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-[var(--color-background)]">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white" aria-hidden="true">
              <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm-2 16.5c-1.4 0-2.5-1.1-2.5-2.5S12.6 15.5 14 15.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm6-5c-1.4 0-2.5-1.1-2.5-2.5S18.6 10.5 20 10.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="font-serif font-bold text-lg text-[var(--color-primary)]">{SITE_NAME}</span>
        </Link>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
