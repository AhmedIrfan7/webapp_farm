'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/input'
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { profiles: { full_name: string | null } | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  async function fetchOrders() {
    const supabase = createClient()
    let query = supabase
      .from('orders')
      .select('*, profiles(full_name), order_items(quantity, price_at_purchase, products(name))')
      .order('created_at', { ascending: false })

    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setOrders((data as any) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [filter])

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId)
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) toast.error('Failed to update status')
    else { toast.success('Order status updated'); fetchOrders() }
    setUpdating(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">
            Dairy Orders
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{orders.length} orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                filter === s
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-green-300)]'
              }`}
            >
              {s === 'all' ? 'All Orders' : ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--color-cream-100)] animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">No orders found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-cream-50)]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Payment</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-cream-50)] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[var(--color-text-muted)]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{order.profiles?.full_name ?? 'Unknown'}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{order.delivery_city}</p>
                    </td>
                    <td className="px-5 py-4 font-serif font-bold text-[var(--color-primary)]">
                      {formatCurrency(Number(order.total_amount))}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={order.payment_status === 'paid' ? 'success' : order.payment_status === 'failed' ? 'error' : 'warning'} dot>
                        {order.payment_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-xs text-[var(--color-text-muted)]">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`text-xs font-semibold rounded-lg px-2 py-1 border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] transition-colors ${updating === order.id ? 'opacity-50' : ''}`}
                        aria-label="Update order status"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
