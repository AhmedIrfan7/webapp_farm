'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { CartItem } from '@/types'

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchCart() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id)
    setCartItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchCart() }, [])

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) { await removeItem(itemId); return }
    const supabase = createClient()
    const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', itemId)
    if (error) toast.error('Failed to update')
    else fetchCart()
  }

  async function removeItem(itemId: string) {
    const supabase = createClient()
    await supabase.from('cart_items').delete().eq('id', itemId)
    toast.success('Item removed')
    fetchCart()
  }

  async function clearCart() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('cart_items').delete().eq('user_id', user.id)
    toast.success('Cart cleared')
    setCartItems([])
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0)
  const deliveryFee = subtotal > 0 && subtotal < 1000 ? 150 : 0
  const total = subtotal + deliveryFee

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" aria-label="Loading cart..." />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">
            My Cart
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{cartItems.length} items</p>
        </div>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="text-sm text-[var(--color-error)] hover:underline font-medium">
            Clear All
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24">
          <div className="h-24 w-24 rounded-3xl bg-[var(--color-cream-100)] flex items-center justify-center mx-auto mb-5">
            <svg className="h-12 w-12 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="font-serif font-bold text-xl text-[var(--color-text-primary)] mb-2">Your cart is empty</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">Add some fresh dairy products to get started</p>
          <Link href="/portal/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[var(--color-border)]">
                <div className="h-16 w-16 rounded-xl bg-[var(--color-green-50)] flex items-center justify-center shrink-0">
                  {item.products?.image_url ? (
                    <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <svg className="h-8 w-8 text-[var(--color-green-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-text-primary)] truncate">{item.products?.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{formatCurrency(item.products?.price ?? 0)} / {item.products?.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary)] transition-colors text-sm font-bold"
                    aria-label="Decrease"
                  >−</button>
                  <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary)] transition-colors text-sm font-bold"
                    aria-label="Increase"
                  >+</button>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif font-bold text-[var(--color-primary)]">
                    {formatCurrency((item.products?.price ?? 0) * item.quantity)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-red-50 transition-colors"
                  aria-label="Remove item"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 sticky top-6">
              <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-4">Order Summary</h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Delivery Fee</span>
                  <span className="font-semibold text-[var(--color-success)]">
                    {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Add {formatCurrency(1000 - subtotal)} more for free delivery
                  </p>
                )}
                <div className="border-t border-[var(--color-border)] pt-3 flex justify-between">
                  <span className="font-bold text-[var(--color-text-primary)]">Total</span>
                  <span className="font-serif font-bold text-lg text-[var(--color-primary)]">{formatCurrency(total)}</span>
                </div>
              </div>
              <Link href="/portal/checkout" className="block mt-5">
                <Button size="lg" fullWidth rightIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                }>
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/portal/products">
                <Button variant="ghost" size="md" fullWidth className="mt-2">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
