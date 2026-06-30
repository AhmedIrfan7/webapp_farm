'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (id: string) => Promise<void> }) {
  const [adding, setAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  async function handleAdd() {
    setAdding(true)
    await onAddToCart(product.id)
    setAdding(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-green-200)] transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative h-48 bg-gradient-to-br from-[var(--color-green-50)] to-[var(--color-cream-100)] overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="h-16 w-16 text-[var(--color-green-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 backdrop-blur-sm text-[var(--color-primary)] px-2.5 py-1 rounded-full border border-[var(--color-green-100)]">
          {product.category === 'milk' ? 'Fresh Milk' : 'Dairy'}
        </span>
        {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
          <Badge variant="warning" className="absolute top-3 right-3">Low Stock</Badge>
        )}
        {product.stock_quantity === 0 && (
          <Badge variant="error" className="absolute top-3 right-3">Out of Stock</Badge>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-8 w-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-sm font-bold"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
            className="h-8 w-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-sm font-bold"
            aria-label="Increase quantity"
            disabled={product.stock_quantity === 0}
          >
            +
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-xl text-[var(--color-primary)]">
              {formatCurrency(product.price * quantity)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] ml-1">/ {quantity} {product.unit}</span>
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            loading={adding}
            disabled={product.stock_quantity === 0}
            leftIcon={
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CustomerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | 'milk' | 'dairy'>('all')

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      let query = supabase.from('products').select('*').eq('is_available', true).order('created_at')
      if (category !== 'all') query = query.eq('category', category)
      if (search) query = query.ilike('name', `%${search}%`)
      const { data } = await query
      setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [search, category])

  const addToCart = useCallback(async (productId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please sign in first'); return }

    const { error } = await supabase.from('cart_items').upsert(
      { user_id: user.id, product_id: productId, quantity: 1 },
      { onConflict: 'user_id,product_id', ignoreDuplicates: false },
    )

    if (error) toast.error('Failed to add to cart')
    else toast.success('Added to cart!')
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)] mb-1">
          Fresh Dairy Products
        </h1>
        <p className="text-[var(--color-text-secondary)]">Farm-fresh, delivered daily</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'milk', 'dairy'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                category === cat
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-green-300)]'
              }`}
            >
              {cat === 'all' ? 'All' : cat === 'milk' ? 'Fresh Milk' : 'Dairy'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-[var(--color-cream-100)] animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="h-20 w-20 rounded-2xl bg-[var(--color-cream-100)] flex items-center justify-center mx-auto mb-4">
            <svg className="h-10 w-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[var(--color-text-muted)]">No products found</p>
          <button onClick={() => { setSearch(''); setCategory('all') }} className="mt-3 text-sm text-[var(--color-primary)] hover:underline font-medium">
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
