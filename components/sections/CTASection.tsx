'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-padding bg-[var(--color-cream-50)]" aria-labelledby="cta-heading">
      <div className="container-custom">
        <div
          ref={ref}
          className="bg-[var(--color-primary)] rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--color-green-600)] rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--color-gold-600)] rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3" aria-hidden="true" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden="true" />

          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-gold-400)] bg-white/10 px-3 py-1.5 rounded-full border border-white/20 inline-block mb-6">
              Get Started Today
            </span>
            <h2 id="cta-heading" className="font-serif text-white mb-4 max-w-2xl mx-auto">
              Ready to Taste the Difference?
            </h2>
            <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
              Join hundreds of families and farms already enjoying the freshest dairy products from GreenMeadow. Sign up in minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="xl"
                  variant="accent"
                  className="font-bold shadow-[var(--shadow-gold)]"
                  rightIcon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  }
                >
                  Create Free Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="xl"
                  variant="ghost"
                  className="text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50"
                >
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <p className="mt-8 text-sm text-white/50 flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required · Free delivery on first order · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
