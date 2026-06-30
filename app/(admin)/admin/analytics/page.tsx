import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const [
    { data: orders },
    { data: silageOrders },
    { data: customers },
    { data: products },
  ] = await Promise.all([
    supabase.from('orders').select('id, total_amount, status, created_at, payment_method').order('created_at', { ascending: false }),
    supabase.from('silage_orders').select('id, quote_amount, status, created_at').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, role, created_at').neq('role', 'admin'),
    supabase.from('products').select('id, name, stock_quantity, category'),
  ])

  const totalRevenue = orders?.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0
  const silageRevenue = silageOrders?.filter((o) => o.status !== 'cancelled' && o.quote_amount).reduce((s, o) => s + (o.quote_amount ?? 0), 0) ?? 0
  const totalOrders = orders?.length ?? 0
  const completedOrders = orders?.filter((o) => o.status === 'delivered').length ?? 0
  const customerCount = customers?.filter((c) => c.role === 'customer').length ?? 0
  const farmCount = customers?.filter((c) => c.role === 'farm').length ?? 0

  // Monthly breakdown (last 6 months)
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return {
      label: d.toLocaleDateString('en-PK', { month: 'short', year: '2-digit' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    }
  }).reverse()

  const monthlyData = months.map((m) => {
    const monthOrders = orders?.filter((o) => {
      const d = new Date(o.created_at)
      return d.getFullYear() === m.year && d.getMonth() === m.month
    }) ?? []
    const revenue = monthOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + (o.total_amount ?? 0), 0)
    return { ...m, orders: monthOrders.length, revenue }
  })

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1)

  // Payment methods breakdown
  const paymentMethods: Record<string, number> = {}
  orders?.forEach((o) => {
    const pm = o.payment_method ?? 'unknown'
    paymentMethods[pm] = (paymentMethods[pm] ?? 0) + 1
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">Analytics</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Business performance overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue + silageRevenue), sub: 'Dairy + Silage', color: 'text-[var(--color-primary)]' },
          { label: 'Total Orders', value: String(totalOrders), sub: `${completedOrders} delivered`, color: '' },
          { label: 'Customers', value: String(customerCount), sub: `${farmCount} farm partners`, color: '' },
          { label: 'Silage Revenue', value: formatCurrency(silageRevenue), sub: `${silageOrders?.length ?? 0} inquiries`, color: 'text-[var(--color-accent)]' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <p className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mb-2">{k.label}</p>
            <p className={`font-serif font-bold text-2xl ${k.color || 'text-[var(--color-text-primary)]'}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue chart (CSS bars) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)] p-5">
          <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-5">Monthly Revenue (Last 6 Months)</h2>
          <div className="flex items-end gap-3 h-40" role="img" aria-label="Monthly revenue bar chart">
            {monthlyData.map((m) => {
              const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                    {m.revenue > 0 ? `${Math.round(m.revenue / 1000)}k` : '—'}
                  </span>
                  <div className="w-full bg-[var(--color-green-50)] rounded-t-lg relative" style={{ height: '100px' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-[var(--color-primary)] rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">{m.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-5">Payment Methods</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(paymentMethods).length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No orders yet</p>
            ) : (
              Object.entries(paymentMethods).map(([method, count]) => {
                const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0
                return (
                  <div key={method}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold capitalize text-[var(--color-text-secondary)]">
                        {method.replace('_', ' ')}
                      </span>
                      <span className="text-[var(--color-text-muted)]">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-[var(--color-green-50)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full"
                        style={{ width: `${pct}%` }}
                        role="presentation"
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Stock alerts */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
        <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-4">Inventory Status</h2>
        {!products || products.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No products</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.sort((a, b) => (a.stock_quantity ?? 0) - (b.stock_quantity ?? 0)).map((p) => {
              const stock = p.stock_quantity ?? 0
              const status = stock === 0 ? 'out' : stock <= 5 ? 'low' : 'ok'
              return (
                <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                  status === 'out' ? 'border-[var(--color-error)] bg-red-50' :
                  status === 'low' ? 'border-[var(--color-warning)] bg-amber-50' :
                  'border-[var(--color-border)] bg-[var(--color-green-50)]'
                }`}>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{p.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] capitalize">{p.category}</p>
                  </div>
                  <span className={`text-sm font-bold ${
                    status === 'out' ? 'text-[var(--color-error)]' :
                    status === 'low' ? 'text-[var(--color-warning)]' :
                    'text-[var(--color-success)]'
                  }`}>
                    {stock === 0 ? 'Out' : `${stock} left`}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
