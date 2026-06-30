'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { Modal, ConfirmModal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { SILAGE_TYPES } from '@/lib/constants'
import type { SilageProduct } from '@/types'

interface FormState {
  name: string
  description: string
  type: string
  price_per_ton: string
  min_quantity_tons: string
  max_quantity_tons: string
  is_available: boolean
}

const EMPTY: FormState = {
  name: '',
  description: '',
  type: 'corn',
  price_per_ton: '',
  min_quantity_tons: '0.5',
  max_quantity_tons: '',
  is_available: true,
}

export default function AdminSilagePage() {
  const [products, setProducts] = useState<SilageProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<SilageProduct | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('silage_products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load silage products'); setLoading(false); return }
    setProducts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  function openEdit(p: SilageProduct) {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description ?? '',
      type: p.type,
      price_per_ton: String(p.price_per_ton),
      min_quantity_tons: String(p.min_quantity_tons),
      max_quantity_tons: p.max_quantity_tons ? String(p.max_quantity_tons) : '',
      is_available: p.is_available,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price_per_ton || !form.min_quantity_tons) {
      toast.error('Name, price, and minimum quantity are required')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: form.name.trim(),
      description: form.description || null,
      type: form.type,
      price_per_ton: parseFloat(form.price_per_ton),
      min_quantity_tons: parseFloat(form.min_quantity_tons),
      max_quantity_tons: form.max_quantity_tons ? parseFloat(form.max_quantity_tons) : null,
      is_available: form.is_available,
    }

    if (editing) {
      const { error } = await supabase.from('silage_products').update(payload).eq('id', editing.id)
      if (error) { toast.error('Failed to update'); setSaving(false); return }
      toast.success('Product updated')
    } else {
      const { error } = await supabase.from('silage_products').insert(payload)
      if (error) { toast.error('Failed to create'); setSaving(false); return }
      toast.success('Product added')
    }

    setSaving(false)
    setModalOpen(false)
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    const supabase = createClient()
    const { error } = await supabase.from('silage_products').delete().eq('id', deleteId)
    if (error) { toast.error('Failed to delete'); return }
    toast.success('Product deleted')
    setDeleteId(null)
    load()
  }

  async function toggleAvailability(p: SilageProduct) {
    const supabase = createClient()
    const { error } = await supabase
      .from('silage_products')
      .update({ is_available: !p.is_available })
      .eq('id', p.id)
    if (error) { toast.error('Failed to update'); return }
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, is_available: !x.is_available } : x))
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">Silage Products</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{products.length} products</p>
        </div>
        <Button onClick={openAdd} leftIcon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">No silage products yet. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-green-50)]">
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Price/ton</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Min Qty</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-green-50)] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[var(--color-text-primary)]">{p.name}</p>
                      {p.description && <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-0.5">{p.description}</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="green" className="capitalize">{p.type.replace('_', ' ')}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[var(--color-primary)]">
                      {formatCurrency(p.price_per_ton)}/ton
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      {p.min_quantity_tons} tons
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        role="switch"
                        aria-checked={p.is_available}
                        onClick={() => toggleAvailability(p)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                          p.is_available ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                        }`}
                        aria-label={`Toggle availability for ${p.name}`}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteId(p.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Silage Product' : 'Add Silage Product'}
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>{editing ? 'Save Changes' : 'Add Product'}</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this silage product..." />
          <Select
            label="Silage Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={SILAGE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          />
          <Input
            label="Price per Ton (PKR)"
            type="number"
            min="0"
            step="100"
            value={form.price_per_ton}
            onChange={(e) => setForm({ ...form, price_per_ton: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Quantity (tons)"
              type="number"
              min="0.5"
              step="0.5"
              value={form.min_quantity_tons}
              onChange={(e) => setForm({ ...form, min_quantity_tons: e.target.value })}
              required
            />
            <Input
              label="Max Quantity (tons)"
              type="number"
              min="1"
              step="1"
              value={form.max_quantity_tons}
              onChange={(e) => setForm({ ...form, max_quantity_tons: e.target.value })}
              helper="Optional"
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              role="switch"
              aria-checked={form.is_available}
              onClick={() => setForm({ ...form, is_available: !form.is_available })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                form.is_available ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
              }`}
              aria-label="Toggle availability"
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {form.is_available ? 'Available for orders' : 'Hidden from ordering'}
            </span>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Silage Product"
        message="This will permanently delete this product. Existing orders will not be affected."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
