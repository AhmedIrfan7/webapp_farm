import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Fresh Dairy Products',
  description: 'Browse our full range of farm-fresh dairy products. Pure milk, cream, butter, yogurt, and more delivered to your door.',
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('category', { ascending: true })
    .order('created_at', { ascending: true })

  const milk = products?.filter((p) => p.category === 'milk') ?? []
  const dairy = products?.filter((p) => p.category === 'dairy') ?? []

  return (
    <>
      {/* Hero */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-[var(--color-green-50)] to-[var(--color-background)]">
        <div className="container-custom text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-green-100)] px-3 py-1.5 rounded-full border border-[var(--color-green-200)] inline-block mb-4">
            Our Products
          </span>
          <h1 className="font-serif font-bold text-[var(--color-text-primary)] mb-4">
            Farm Fresh Dairy Products
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto text-lg">
            Every product is crafted daily from the milk of our free-range cows. No additives, no preservatives — just pure goodness.
          </p>
          <div className="mt-6">
            <Link href="/auth/register">
              <Button size="lg" variant="primary" className="mr-3">
                Create Account to Order
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom pb-20">
        {/* Milk section */}
        {milk.length > 0 && (
          <section className="mb-16" aria-labelledby="milk-heading">
            <div className="flex items-center gap-4 mb-8">
              <h2 id="milk-heading" className="font-serif font-bold text-2xl text-[var(--color-text-primary)]">
                Fresh Milk
              </h2>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {milk.map((p: Product) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Dairy section */}
        {dairy.length > 0 && (
          <section aria-labelledby="dairy-heading">
            <div className="flex items-center gap-4 mb-8">
              <h2 id="dairy-heading" className="font-serif font-bold text-2xl text-[var(--color-text-primary)]">
                Dairy Products
              </h2>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {dairy.map((p: Product) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-green-200)] transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-[var(--color-green-50)] to-[var(--color-cream-100)]">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="h-16 w-16 text-[var(--color-green-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-[var(--color-primary)] transition-colors">{product.name}</h3>
        {product.description && <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">{product.description}</p>}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-xl text-[var(--color-primary)]">{formatCurrency(product.price)}</span>
            <span className="text-xs text-[var(--color-text-muted)] ml-1">/ {product.unit}</span>
          </div>
          <Link href="/auth/register">
            <Button size="sm" disabled={product.stock_quantity === 0}>
              {product.stock_quantity === 0 ? 'Sold Out' : 'Order Now'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
