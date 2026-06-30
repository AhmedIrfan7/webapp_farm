'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { SilageProduct } from '@/types'

export function SilageSection({ products }: { products: SilageProduct[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="section-padding relative overflow-hidden"
      aria-labelledby="silage-heading"
      style={{ background: 'linear-gradient(135deg, var(--color-green-900) 0%, var(--color-green-700) 100%)' }}
    >
      {/* Decorative */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--color-green-500)] opacity-20 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--color-gold-500)] opacity-15 blur-3xl" aria-hidden="true" />

      <div
        ref={ref}
        className="container-custom relative z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <div className="lg:flex items-center justify-between mb-12 gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-gold-400)] bg-white/10 px-3 py-1.5 rounded-full border border-white/20 inline-block mb-4">
              For Dairy Farms
            </span>
            <h2 id="silage-heading" className="font-serif text-white mb-4">
              Premium Silage Supply
            </h2>
            <p className="text-white/70 max-w-lg text-lg leading-relaxed">
              Boost your herd's milk production with our high-quality silage. Freshly harvested, perfectly fermented, and delivered to your farm.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 shrink-0">
            <Link href="/silage">
              <Button
                size="lg"
                variant="accent"
                className="shadow-[var(--shadow-gold)]"
                rightIcon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                }
              >
                View Silage Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product, i) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-5 hover:bg-white/15 hover:border-white/25 transition-all duration-300 hover:-translate-y-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${0.2 + i * 0.1}s, transform 0.5s ease ${0.2 + i * 0.1}s`,
              }}
            >
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-[var(--color-gold-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3s8 0 13 8c-5 5-13 8-13 8S1 8 5 3z" />
                </svg>
              </div>
              <h3 className="font-serif font-bold text-white mb-1 text-lg">{product.name}</h3>
              <p className="text-sm text-white/60 mb-3 capitalize">Type: {product.type}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-bold text-xl text-[var(--color-gold-400)]">
                  {formatCurrency(product.price_per_ton)}
                </span>
                <span className="text-xs text-white/50">/ ton</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Min. order: {product.minimum_order} ton</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🌾', title: 'Fresh Harvest', desc: 'Cut and fermented at peak nutritional value' },
            { icon: '📦', title: 'Bulk Orders', desc: 'Flexible quantities from 0.5 to 500+ tons' },
            { icon: '🚛', title: 'Farm Delivery', desc: 'Delivered directly to your farm, on schedule' },
          ].map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3">
              <span className="text-2xl shrink-0" aria-hidden="true">{benefit.icon}</span>
              <div>
                <p className="font-semibold text-white">{benefit.title}</p>
                <p className="text-sm text-white/60 mt-0.5">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
