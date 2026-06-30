'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="group bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-green-200)] transition-all duration-300 hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms, box-shadow 0.3s, border-color 0.3s`,
      }}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--color-green-50)] to-[var(--color-cream-100)] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="h-16 w-16 text-[var(--color-green-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 backdrop-blur-sm text-[var(--color-primary)] px-2.5 py-1 rounded-full border border-[var(--color-green-100)]">
          {product.category === 'milk' ? 'Fresh Milk' : 'Dairy'}
        </span>
        {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
            Low Stock
          </span>
        )}
        {product.stock_quantity === 0 && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-red-100 text-red-800 px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-xl text-[var(--color-primary)]">
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] ml-1">/ {product.unit}</span>
          </div>
          <Link href={`/portal/products?add=${product.id}`}>
            <Button
              size="sm"
              variant="primary"
              disabled={product.stock_quantity === 0}
              leftIcon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            >
              Add to Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface ProductsPreviewProps {
  products: Product[]
}

export function ProductsPreview({ products }: ProductsPreviewProps) {
  const titleRef = useRef<HTMLDivElement>(null)
  const [titleVisible, setTitleVisible] = useState(false)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTitleVisible(true); observer.disconnect() } },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-padding bg-[var(--color-background)]" aria-labelledby="products-heading">
      <div className="container-custom">
        <div
          ref={titleRef}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-green-50)] px-3 py-1.5 rounded-full border border-[var(--color-green-200)] inline-block mb-4">
              Our Products
            </span>
            <h2 id="products-heading" className="font-serif text-[var(--color-text-primary)] mb-2">
              Farm Fresh Dairy
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-lg">
              Every product crafted with care from our free-range herd. Delivered fresh, daily.
            </p>
          </div>
          <Link href="/products">
            <Button
              variant="outline"
              rightIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              }
            >
              View All Products
            </Button>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-2xl bg-[var(--color-green-50)] flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-[var(--color-green-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[var(--color-text-muted)]">Products coming soon</p>
          </div>
        )}
      </div>
    </section>
  )
}
