'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import type { SilageProduct } from '@/types'

export default function SilageQuotePage() {
  const router = useRouter()
  const [products, setProducts] = useState<SilageProduct[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    farm_name: '',
    contact_person: '',
    email: '',
    phone: '',
    product_id: '',
    quantity_tons: '',
    delivery_address: '',
    requested_delivery_date: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const [{ data: prods }, { data: profile }] = await Promise.all([
        supabase.from('silage_products').select('*').eq('is_available', true),
        user ? supabase.from('profiles').select('full_name, phone, business_name').eq('id', user.id).single() : Promise.resolve({ data: null }),
      ])
      setProducts(prods ?? [])
      if (profile) {
        setForm((f) => ({
          ...f,
          farm_name: profile.business_name ?? '',
          contact_person: profile.full_name ?? '',
          phone: profile.phone ?? '',
        }))
      }
    }
    load()
  }, [])

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.farm_name) errs.farm_name = 'Farm name is required'
    if (!form.contact_person) errs.contact_person = 'Contact person required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.phone || !/^(\+92|0)[0-9]{10}$/.test(form.phone)) errs.phone = 'Valid phone required'
    if (!form.product_id) errs.product_id = 'Please select a product'
    if (!form.quantity_tons || parseFloat(form.quantity_tons) < 0.5) errs.quantity_tons = 'Min. 0.5 tons required'
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

      const { error } = await supabase.from('silage_orders').insert({
        user_id: user?.id ?? null,
        farm_name: form.farm_name,
        contact_person: form.contact_person,
        email: form.email,
        phone: form.phone,
        product_id: form.product_id,
        quantity_tons: parseFloat(form.quantity_tons),
        delivery_address: form.delivery_address || null,
        requested_delivery_date: form.requested_delivery_date || null,
        notes: form.notes || null,
        status: 'inquiry',
      })

      if (error) throw error
      setSubmitted(true)
      toast.success('Inquiry submitted! We will contact you within 24 hours.')
    } catch {
      toast.error('Failed to submit inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="h-20 w-20 rounded-full bg-[var(--color-green-50)] flex items-center justify-center mx-auto mb-5">
          <svg className="h-10 w-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-serif font-bold text-2xl mb-3">Inquiry Submitted!</h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Thank you! Our team will review your inquiry and contact you within 24 hours with a customized quote.
        </p>
        <Button onClick={() => router.push('/silage-portal/orders')}>
          View My Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">
          Request a Quote
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Fill in the form below and we'll send you a customized price quote within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[var(--color-border)] p-6 flex flex-col gap-5" noValidate>
        <h2 className="font-serif font-bold text-lg">Farm Information</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Farm / Business Name" value={form.farm_name} onChange={(e) => setForm({ ...form, farm_name: e.target.value })} error={errors.farm_name} required />
          <Input label="Contact Person" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} error={errors.contact_person} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} required autoComplete="email" />
          <Input label="Phone" type="tel" placeholder="03XX-XXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} required />
        </div>

        <div className="border-t border-[var(--color-border)] pt-5">
          <h2 className="font-serif font-bold text-lg mb-4">Silage Requirements</h2>
          <div className="flex flex-col gap-4">
            <Select
              label="Silage Product"
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              error={errors.product_id}
              required
              placeholder="Select a product"
              options={products.map((p) => ({ value: p.id, label: `${p.name} — PKR ${p.price_per_ton.toLocaleString()}/ton` }))}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Quantity (tons)"
                type="number"
                min="0.5"
                step="0.5"
                placeholder="e.g. 5"
                value={form.quantity_tons}
                onChange={(e) => setForm({ ...form, quantity_tons: e.target.value })}
                error={errors.quantity_tons}
                required
                helper="Minimum 0.5 tons"
              />
              <Input
                label="Preferred Delivery Date"
                type="date"
                value={form.requested_delivery_date}
                onChange={(e) => setForm({ ...form, requested_delivery_date: e.target.value })}
                helper="Optional"
              />
            </div>
            <Input
              label="Delivery Address"
              value={form.delivery_address}
              onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
              placeholder="Farm location / delivery address"
              helper="Optional — helps us calculate delivery cost"
            />
            <Textarea
              label="Additional Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any specific requirements, special instructions..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={submitting} fullWidth>
            Submit Inquiry
          </Button>
        </div>
      </form>
    </div>
  )
}
