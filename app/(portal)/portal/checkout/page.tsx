'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/lib/constants'
import type { CartItem } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    delivery_address: '',
    delivery_city: '',
    payment_method: 'cod',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const [{ data: items }, { data: profile }] = await Promise.all([
        supabase.from('cart_items').select('*, products(*)').eq('user_id', user.id),
        supabase.from('profiles').select('full_name, phone, address, city').eq('id', user.id).single(),
      ])

      setCartItems(items ?? [])
      if (profile) {
        setForm((f) => ({
          ...f,
          full_name: profile.full_name ?? '',
          phone: profile.phone ?? '',
          delivery_address: profile.address ?? '',
          delivery_city: profile.city ?? '',
        }))
      }
      setLoading(false)
    }
    load()
  }, [router])

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.full_name) errs.full_name = 'Name is required'
    if (!form.phone || !/^(\+92|0)[0-9]{10}$/.test(form.phone)) errs.phone = 'Valid phone is required'
    if (!form.delivery_address || form.delivery_address.length < 10) errs.delivery_address = 'Full address required'
    if (!form.delivery_city) errs.delivery_city = 'City is required'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const subtotal = cartItems.reduce((sum, i) => sum + (i.products?.price ?? 0) * i.quantity, 0)
      const deliveryFee = subtotal < 1000 ? 150 : 0
      const total = subtotal + deliveryFee

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_amount: total,
          delivery_address: form.delivery_address,
          delivery_city: form.delivery_city,
          payment_method: form.payment_method,
          payment_status: form.payment_method === 'cod' ? 'pending' : 'pending',
          notes: form.notes || null,
        })
        .select()
        .single()

      if (orderErr || !order) throw orderErr ?? new Error('Failed to create order')

      const items = cartItems.map((ci) => ({
        order_id: order.id,
        product_id: ci.product_id,
        quantity: ci.quantity,
        price_at_purchase: ci.products?.price ?? 0,
      }))

      await supabase.from('order_items').insert(items)
      await supabase.from('cart_items').delete().eq('user_id', user.id)

      toast.success('Order placed successfully!')
      router.push(`/portal/orders?new=${order.id}`)
    } catch (err) {
      toast.error('Failed to place order. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const subtotal = cartItems.reduce((sum, i) => sum + (i.products?.price ?? 0) * i.quantity, 0)
  const deliveryFee = subtotal > 0 && subtotal < 1000 ? 150 : 0
  const total = subtotal + deliveryFee

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" aria-label="Loading..." />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-[var(--color-text-secondary)] mb-4">Your cart is empty</p>
        <Button onClick={() => router.push('/portal/products')}>Browse Products</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">Checkout</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Review your order and complete your purchase</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Delivery form */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
              <h2 className="font-serif font-bold text-lg mb-5">Delivery Information</h2>
              <div className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} error={errors.full_name} required autoComplete="name" />
                  <Input label="Phone Number" type="tel" placeholder="03XX-XXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} required autoComplete="tel" />
                </div>
                <Input label="Delivery Address" placeholder="House #, Street, Area" value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} error={errors.delivery_address} required autoComplete="street-address" />
                <Input label="City" placeholder="Lahore, Karachi, Islamabad..." value={form.delivery_city} onChange={(e) => setForm({ ...form, delivery_city: e.target.value })} error={errors.delivery_city} required autoComplete="address-level2" />
                <Select
                  label="Payment Method"
                  value={form.payment_method}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  options={PAYMENT_METHODS}
                />
                <Textarea label="Order Notes (Optional)" placeholder="Any special instructions for delivery..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 sticky top-6">
              <h2 className="font-serif font-bold text-lg mb-4">Order Summary</h2>
              <div className="flex flex-col gap-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)] truncate mr-2">
                      {item.products?.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatCurrency((item.products?.price ?? 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--color-border)] pt-3 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-[var(--color-success)] font-medium' : ''}>
                    {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-[var(--color-border)]">
                  <span>Total</span>
                  <span className="text-[var(--color-primary)] font-serif">{formatCurrency(total)}</span>
                </div>
              </div>

              {form.payment_method === 'cod' && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs text-amber-800">
                    <strong>Cash on Delivery:</strong> Please keep exact change ready for delivery.
                  </p>
                </div>
              )}

              <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-5">
                Place Order
              </Button>
              <p className="text-xs text-[var(--color-text-muted)] text-center mt-3">
                By placing this order you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
