'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { formatDate, formatCurrency, SILAGE_STATUS_LABELS, SILAGE_STATUS_COLORS } from '@/lib/utils'

type SilageStatus = 'inquiry' | 'quoted' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled'

interface SilageOrder {
  id: string
  user_id: string | null
  farm_name: string
  contact_person: string
  email: string
  phone: string
  product_id: string | null
  quantity_tons: number
  delivery_address: string | null
  requested_delivery_date: string | null
  notes: string | null
  status: SilageStatus
  quote_amount: number | null
  created_at: string
  silage_products: { name: string; type: string } | null
}

const STATUSES: SilageStatus[] = ['inquiry', 'quoted', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled']

export default function AdminSilageOrdersPage() {
  const [orders, setOrders] = useState<SilageOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<SilageStatus | 'all'>('all')
  const [quoteModal, setQuoteModal] = useState<SilageOrder | null>(null)
  const [quoteAmount, setQuoteAmount] = useState('')
  const [savingQuote, setSavingQuote] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('silage_orders')
      .select('*, silage_products(name, type)')
      .order('created_at', { ascending: false })

    if (error) { toast.error('Failed to load orders'); setLoading(false); return }
    setOrders((data ?? []) as SilageOrder[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: SilageStatus) {
    const supabase = createClient()
    const { error } = await supabase.from('silage_orders').update({ status }).eq('id', id)
    if (error) { toast.error('Failed to update status'); return }
    toast.success('Status updated')
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
  }

  async function saveQuote() {
    if (!quoteModal || !quoteAmount || isNaN(parseFloat(quoteAmount))) {
      toast.error('Enter a valid amount')
      return
    }
    setSavingQuote(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('silage_orders')
      .update({ quote_amount: parseFloat(quoteAmount), status: 'quoted' })
      .eq('id', quoteModal.id)

    if (error) { toast.error('Failed to save quote'); setSavingQuote(false); return }
    toast.success('Quote sent')
    setSavingQuote(false)
    setQuoteModal(null)
    setQuoteAmount('')
    load()
  }

  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">Silage Orders</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{orders.length} total inquiries &amp; orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap mb-5 p-1 bg-[var(--color-green-50)] rounded-xl w-fit border border-[var(--color-border)]">
        {(['all', ...STATUSES] as const).map((s) => {
          const count = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:bg-white'
              }`}
            >
              {s === 'all' ? 'All' : SILAGE_STATUS_LABELS[s]} ({count})
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="bg-white rounded-xl border border-[var(--color-border)] flex items-center justify-center py-20 text-[var(--color-text-muted)]">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--color-border)] text-center py-20 text-[var(--color-text-muted)]">No orders in this category</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-green-200)] transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs text-[var(--color-text-muted)] bg-[var(--color-green-50)] px-2 py-0.5 rounded">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <Badge
                      variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'cancelled' ? 'error' :
                        order.status === 'confirmed' || order.status === 'processing' ? 'info' :
                        order.status === 'quoted' ? 'gold' : 'warning'
                      }
                      dot
                    >
                      {SILAGE_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <p className="font-serif font-bold text-lg text-[var(--color-text-primary)]">
                    {order.farm_name}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {order.silage_products?.name ?? 'Silage Product'} — {order.quantity_tons} tons
                  </p>
                </div>
                <div className="text-right">
                  {order.quote_amount ? (
                    <p className="font-serif font-bold text-xl text-[var(--color-primary)]">
                      {formatCurrency(order.quote_amount)}
                    </p>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">No quote yet</span>
                  )}
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDate(order.created_at)}</p>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid sm:grid-cols-3 gap-3 py-3 border-t border-b border-[var(--color-border)] mb-3">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Contact</p>
                  <p className="text-sm font-medium">{order.contact_person}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Email</p>
                  <p className="text-sm font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Phone</p>
                  <p className="text-sm font-medium">{order.phone}</p>
                </div>
              </div>

              {order.delivery_address && (
                <p className="text-sm text-[var(--color-text-muted)] mb-3">📍 {order.delivery_address}</p>
              )}
              {order.notes && (
                <p className="text-sm text-[var(--color-text-muted)] mb-3 italic">"{order.notes}"</p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as SilageStatus)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  aria-label="Update status"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{SILAGE_STATUS_LABELS[s]}</option>
                  ))}
                </select>

                {(order.status === 'inquiry' || order.status === 'quoted') && (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => {
                      setQuoteModal(order)
                      setQuoteAmount(order.quote_amount ? String(order.quote_amount) : '')
                    }}
                  >
                    {order.quote_amount ? 'Update Quote' : 'Send Quote'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote modal */}
      <Modal
        open={!!quoteModal}
        onClose={() => setQuoteModal(null)}
        title="Send Quote"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setQuoteModal(null)}>Cancel</Button>
            <Button loading={savingQuote} onClick={saveQuote}>Send Quote</Button>
          </div>
        }
      >
        {quoteModal && (
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--color-green-50)] rounded-xl p-4 border border-[var(--color-green-200)]">
              <p className="font-semibold">{quoteModal.farm_name}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {quoteModal.silage_products?.name} — {quoteModal.quantity_tons} tons
              </p>
            </div>
            <Input
              label="Quote Amount (PKR)"
              type="number"
              min="0"
              step="1000"
              placeholder="e.g. 150000"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              helper="This will also set the order status to 'Quoted'"
              required
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
