'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Parallax on scroll
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const handleScroll = () => {
      const scrolled = window.scrollY
      const parallaxBg = hero.querySelector('[data-parallax]') as HTMLElement
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrolled * 0.4}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-dvh flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image with parallax */}
      <div
        data-parallax
        className="absolute inset-0 will-change-transform"
        style={{ top: '-10%', height: '120%' }}
      >
        {/* Gradient overlay — rich deep green */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2b1e] via-[#1B4332] to-[#2D6A4F] z-10" />
        {/* Animated orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[var(--color-green-600)] opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} aria-hidden="true" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[var(--color-gold-500)] opacity-15 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-green-500)] opacity-10 blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} aria-hidden="true" />
      </div>

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 z-10 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-custom relative z-20 py-32 lg:py-40">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="h-2 w-2 rounded-full bg-[var(--color-gold-500)] animate-pulse" aria-hidden="true" />
            <span className="text-sm font-semibold text-white/90">100% Natural & Organic</span>
          </div>

          {/* Heading */}
          <h1
            className="font-serif font-bold text-white mb-6 leading-[1.1] animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            From Our Farm
            <br />
            <span className="text-gradient-gold" style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, #E9C46A, #D4A017)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              To Your Table
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-lg lg:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            Experience the purity of farm-fresh milk and premium dairy products, delivered straight from our green meadows to your doorstep. No additives. No preservatives. Just nature.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Link href="/products">
              <Button
                size="lg"
                variant="accent"
                className="font-bold shadow-[0_4px_20px_rgba(212,160,23,0.4)] hover:shadow-[0_6px_28px_rgba(212,160,23,0.5)]"
                rightIcon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                }
              >
                Shop Fresh Dairy
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="ghost"
                className="text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
              >
                Discover Our Farm
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="mt-16 flex flex-wrap gap-8 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            {[
              { value: '15+', label: 'Years of Excellence' },
              { value: '500+', label: 'Happy Families' },
              { value: '100%', label: 'Natural Milk' },
              { value: '50+', label: 'Farm Clients' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-serif font-bold text-3xl text-white">{stat.value}</span>
                <span className="text-sm text-white/60 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce" aria-hidden="true">
        <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
        <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 lg:h-20">
          <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="#FAFAF8" />
        </svg>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </section>
  )
}
