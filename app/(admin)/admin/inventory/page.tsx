'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Product {
  id: string
  name: string
  category: string
  stock_quantity: number
  unit: string
  is_available: boolean
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('id, name, category, stock_quantity, unit, is_available')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) { toast.error('Failed to load inventory'); setLoading(false); return }
    setProducts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStock(id: string) {
    const qty = parseInt(editing[id] ?? '0', 10)
    if (isNaN(qty) || qty < 0) { toast.error('Enter a valid quantity (0 or more)'); return }
    setSaving((s) => ({ ...s, [id]: true }))
    const supabase = createClient()
    const { error } = await supabase.from('products').update({ stock_quantity: qty }).eq('id', id)
    if (error) { toast.error('Failed to update stock'); setSaving((s) => ({ ...s, [id]: false })); return }
    toast.success('Stock updated')
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock_quantity: qty } : p))
    setEditing((e) => { const next = { ...e }; delete next[id]; return next })
    setSaving((s) => ({ ...s, [id]: false }))
  }

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  const stockAlerts = products.filter((p) => p.stock_quantity <= 5)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">Inventory</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{products.length} products tracked</p>
      </div>

      {/* Alerts */}
      {stockAlerts.length > 0 && (
        <div className="bg-amber-50 border border-[var(--color-warning)] rounded-xl p-4 mb-6">
          <p className="text-sm font-bold text-amber-800 mb-2">
            ⚠ {stockAlerts.length} product{stockAlerts.length !== 1 ? 's' : ''} low on stock
          </p>
          <div className="flex flex-wrap gap-2">
            {stockAlerts.map((p) => (
              <span key={p.id} className="text-xs bg-white border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                {p.name}: {p.stock_quantity} {p.unit}{p.stock_quantity !== 1 ? 's' : ''} left
              </span>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[var(--color-border)] flex items-center justify-center py-20 text-[var(--color-text-muted)]">Loading inventory...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-3 capitalize">{category}</h2>
              <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-green-50)]">
                      <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Current Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p) => {
                      const isEditing = editing[p.id] !== undefined
                      const stock = p.stock_quantity
                      const stockStatus = stock === 0 ? 'error' : stock <= 5 ? 'warning' : 'success'
                      return (
                        <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-green-50)] transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-[var(--color-text-primary)]">{p.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">per {p.unit}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-lg text-[var(--color-text-primary)]">{stock}</span>
                            <span className="text-xs text-[var(--color-text-muted)] ml-1">{p.unit}s</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={stockStatus} dot>
                              {stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock'}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2 justify-end">
                              {isEditing ? (
                                <>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={editing[p.id]}
                                    onChange={(e) => setEditing((prev) => ({ ...prev, [p.id]: e.target.value }))}
                                    className="w-24 text-right"
                                    aria-label={`New stock for ${p.name}`}
                                  />
                                  <Button size="sm" loading={saving[p.id]} onClick={() => updateStock(p.id)}>Save</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditing((e) => { const n = { ...e }; delete n[p.id]; return n })}>Cancel</Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditing((prev) => ({ ...prev, [p.id]: String(p.stock_quantity) }))}
                                >
                                  Edit
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
