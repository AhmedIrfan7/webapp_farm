import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { SilageProduct } from '@/types'

export const metadata: Metadata = {
  title: 'Silage for Dairy Farms',
  description: 'Premium quality silage for livestock feed. Corn silage, wheat silage, sorghum silage and custom blends. Bulk orders and delivery across Pakistan.',
}

const BENEFITS = [
  { title: 'Year-Round Supply', desc: 'Consistent availability regardless of season — no more feed shortages for your herd.' },
  { title: 'Verified Nutrition', desc: 'Each batch is produced and packed to maintain optimal dry matter and digestibility.' },
  { title: 'Bulk Delivery', desc: 'We deliver directly to your farm gate. Minimum 0.5 tons. No transport hassle.' },
  { title: 'Custom Quotes', desc: 'Pricing based on quantity, type, and delivery distance. Contact us for the best deal.' },
]

export default async function SilagePage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('silage_products')
    .select('*')
    .eq('is_available', true)
    .order('price_per_ton', { ascending: true })

  return (
    <>
      {/* Hero */}
      <div className="relative pt-24 pb-20 overflow-hidden bg-[var(--color-green-900)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-green-900)] via-[var(--color-green-800)] to-[#0d2818]" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          aria-hidden="true"
        />
        <div className="relative container-custom text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 px-3 py-1.5 rounded-full inline-block mb-4">
            B2B Silage Supply
          </span>
          <h1 className="font-serif font-bold text-white text-4xl sm:text-5xl mb-4">
            Premium Silage for<br />Dairy &amp; Livestock Farms
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-lg mb-8">
            Corn, wheat, sorghum, and custom blend silage produced under controlled conditions. Bulk supply with direct farm delivery across Pakistan.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/auth/register?role=farm">
              <Button size="lg" variant="accent">Register as Farm Partner</Button>
            </Link>
            <Link href="/silage-portal/quote">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container-custom py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-lg hover:border-[var(--color-green-200)] transition-all">
              <div className="h-10 w-10 rounded-xl bg-[var(--color-green-50)] border border-[var(--color-green-200)] flex items-center justify-center mb-3" aria-hidden="true">
                <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif font-bold text-lg mb-1.5 text-[var(--color-text-primary)]">{b.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      {products && products.length > 0 && (
        <div className="bg-[var(--color-green-50)] border-y border-[var(--color-green-100)]">
          <div className="container-custom py-16">
            <div className="text-center mb-10">
              <h2 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-2">Available Silage Products</h2>
              <p className="text-[var(--color-text-secondary)]">All prices are per metric ton. Bulk discounts available.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p: SilageProduct) => (
                <div key={p.id} className="bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-xl hover:border-[var(--color-green-300)] transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{p.name}</h3>
                      <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-green-50)] px-2 py-0.5 rounded-full border border-[var(--color-green-200)] capitalize mt-1 inline-block">
                        {p.type.replace('_', ' ')} silage
                      </span>
                    </div>
                  </div>
                  {p.description && <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">{p.description}</p>}
                  <div className="border-t border-[var(--color-border)] pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-2xl text-[var(--color-primary)]">{formatCurrency(p.price_per_ton)}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">per metric ton · Min {p.min_quantity_tons} ton{p.min_quantity_tons > 1 ? 's' : ''}</p>
                    </div>
                    <Link href="/silage-portal/quote">
                      <Button size="sm">Get Quote</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="container-custom py-16 text-center">
        <h2 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-4">Ready to Partner With Us?</h2>
        <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto mb-8">
          Register as a farm partner to access the silage portal, request quotes, and track your orders — all in one place.
        </p>
        <Link href="/auth/register?role=farm">
          <Button size="lg" variant="primary">Create Farm Account</Button>
        </Link>
        <p className="text-sm text-[var(--color-text-muted)] mt-4">
          Already registered?{' '}
          <Link href="/auth/login" className="text-[var(--color-primary)] font-semibold hover:underline">
            Sign in to your portal
          </Link>
        </p>
      </div>
    </>
  )
}
