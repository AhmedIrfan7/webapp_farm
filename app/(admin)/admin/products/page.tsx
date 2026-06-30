'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal, ConfirmModal } from '@/components/ui/modal'
import { formatCurrency } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import type { Product } from '@/types'

const UNIT_OPTIONS = [
  { value: 'liter', label: 'Liter' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: '500ml', label: '500ml Pack' },
  { value: '1L', label: '1 Liter Pack' },
  { value: '500g', label: '500g Pack' },
  { value: '400g', label: '400g Pack' },
  { value: 'pack', label: 'Pack' },
]

const DEFAULT_FORM = { name: '', description: '', price: '', unit: 'liter', category: 'milk', stock_quantity: '', is_available: true }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)

  async function fetchProducts() {
    const supabase = createClient()
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  function openAdd() { setEditing(null); setForm(DEFAULT_FORM); setModalOpen(true) }
  function openEdit(p: Product) {
    setEditing(p)
    setForm({ name: p.name, description: p.description ?? '', price: String(p.price), unit: p.unit, category: p.category, stock_quantity: String(p.stock_quantity), is_available: p.is_available })
    setModalOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price || !form.unit) { toast.error('Fill in all required fields'); return }

    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      unit: form.unit,
      category: form.category,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_available: form.is_available,
    }

    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert(payload)

    if (error) toast.error(error.message)
    else {
      toast.success(editing ? 'Product updated' : 'Product added')
      setModalOpen(false)
      fetchProducts()
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', deleteId)
    if (error) toast.error(error.message)
    else { toast.success('Product deleted'); fetchProducts() }
    setDeleteId(null)
  }

  async function toggleAvailability(p: Product) {
    const supabase = createClient()
    await supabase.from('products').update({ is_available: !p.is_available }).eq('id', p.id)
    toast.success(`Product ${!p.is_available ? 'enabled' : 'disabled'}`)
    fetchProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">Dairy Products</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{products.length} products</p>
        </div>
        <Button onClick={openAdd} leftIcon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>Add Product</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-[var(--color-cream-100)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-cream-50)]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Stock</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-cream-50)] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{p.name}</p>
                      {p.description && <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-0.5">{p.description}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="green">{p.category === 'milk' ? 'Milk' : 'Dairy'}</Badge>
                    </td>
                    <td className="px-5 py-4 font-serif font-bold text-[var(--color-primary)]">
                      {formatCurrency(p.price)} / {p.unit}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={p.stock_quantity === 0 ? 'error' : p.stock_quantity <= 10 ? 'warning' : 'success'} dot>
                        {p.stock_quantity} units
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleAvailability(p)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${p.is_available ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}
                        role="switch"
                        aria-checked={p.is_available}
                        aria-label={`${p.is_available ? 'Disable' : 'Enable'} ${p.name}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${p.is_available ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">Edit</button>
                        <button onClick={() => setDeleteId(p.id)} className="text-xs font-semibold text-[var(--color-error)] hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[var(--color-text-muted)] mb-4">No products yet</p>
                <Button onClick={openAdd} size="sm">Add First Product</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="md">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Fresh Full Cream Milk" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (PKR)" type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="120" />
            <Select label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} options={UNIT_OPTIONS} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={PRODUCT_CATEGORIES} required />
            <Input label="Stock Quantity" type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} placeholder="0" />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="h-4 w-4 rounded accent-[var(--color-primary)]" />
            <span className="text-sm font-medium">Available for sale</span>
          </label>
          <div className="flex gap-3 justify-end mt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save Changes' : 'Add Product'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
