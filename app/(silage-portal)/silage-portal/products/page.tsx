import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { SilageProduct } from '@/types'

export const metadata: Metadata = { title: 'Silage Products' }

export default async function SilageProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('silage_products')
    .select('*')
    .eq('is_available', true)
    .order('price_per_ton', { ascending: true })

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">
            Available Silage Products
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {products?.length ?? 0} products available. Request a quote for bulk pricing.
          </p>
        </div>
        <Link href="/silage-portal/quote">
          <Button leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }>
            Request Quote
          </Button>
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] text-center py-20">
          <p className="text-[var(--color-text-muted)] mb-2">No silage products available right now.</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Contact us at{' '}
            <a href="tel:+923001234567" className="text-[var(--color-primary)] hover:underline">+92 300 123 4567</a>
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p: SilageProduct) => (
            <div key={p.id} className="group bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-xl hover:border-[var(--color-green-300)] transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-green-50)] border border-[var(--color-green-200)] px-2.5 py-1 rounded-full capitalize">
                  {p.type.replace('_', ' ')}
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                {p.name}
              </h3>

              {p.description && (
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  {p.description}
                </p>
              )}

              <div className="border-t border-[var(--color-border)] pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)]">Price per ton</span>
                  <span className="font-serif font-bold text-xl text-[var(--color-primary)]">
                    {formatCurrency(p.price_per_ton)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)]">Minimum order</span>
                  <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
                    {p.min_quantity_tons} ton{p.min_quantity_tons > 1 ? 's' : ''}
                  </span>
                </div>
                {p.max_quantity_tons && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-muted)]">Maximum order</span>
                    <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
                      {p.max_quantity_tons} tons
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Link href={`/silage-portal/quote?product=${p.id}`}>
                  <Button size="sm" variant="primary" fullWidth>
                    Request Quote
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info card */}
      <div className="mt-8 bg-[var(--color-green-50)] rounded-2xl border border-[var(--color-green-200)] p-5">
        <div className="flex gap-3 items-start">
          <svg className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">About Bulk Pricing</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Prices shown are base rates. Actual quote depends on quantity, delivery distance, and current availability. Submit a quote request and our team will contact you within 24 hours with a customized price.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
