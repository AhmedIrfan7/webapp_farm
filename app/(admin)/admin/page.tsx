import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateShort, ORDER_STATUS_LABELS } from '@/lib/utils'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalOrders },
    { count: totalCustomers },
    { data: recentOrders },
    { data: products },
    { count: silageOrders },
    { data: revenue },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('*, profiles(full_name), order_items(*)').order('created_at', { ascending: false }).limit(8),
    supabase.from('products').select('name, stock_quantity, is_available').order('stock_quantity', { ascending: true }).limit(5),
    supabase.from('silage_orders').select('*', { count: 'exact', head: true }).in('status', ['inquiry', 'quoted']),
    supabase.from('orders').select('total_amount, payment_status').eq('payment_status', 'paid'),
  ])

  const totalRevenue = revenue?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0
  const pendingOrders = recentOrders?.filter((o) => o.status === 'pending').length ?? 0

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: '💰', color: 'bg-emerald-50 text-emerald-700', change: '+12%' },
    { label: 'Total Orders', value: totalOrders ?? 0, icon: '📋', color: 'bg-blue-50 text-blue-700', change: '+8%' },
    { label: 'Customers', value: totalCustomers ?? 0, icon: '👥', color: 'bg-purple-50 text-purple-700', change: '+5%' },
    { label: 'Silage Inquiries', value: silageOrders ?? 0, icon: '🌾', color: 'bg-amber-50 text-amber-700', change: 'Pending' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">
          Admin Dashboard
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Overview of your dairy farm business
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl ${stat.color}`} aria-hidden="true">
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-[var(--color-success)] bg-green-50 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="font-serif font-bold text-2xl text-[var(--color-text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {pendingOrders > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">⚠️</span>
            <p className="text-sm font-semibold text-amber-800">
              {pendingOrders} order{pendingOrders > 1 ? 's' : ''} waiting for confirmation
            </p>
          </div>
          <Link href="/admin/orders" className="text-sm font-bold text-amber-800 hover:underline whitespace-nowrap">
            Review →
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">View All</Link>
          </div>
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Order</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders?.map((order) => (
                    <tr key={order.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-cream-50)] transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-[var(--color-text-muted)]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 font-medium">
                        {/* @ts-expect-error nested join */}
                        {order.profiles?.full_name ?? 'Unknown'}
                      </td>
                      <td className="px-5 py-3 font-serif font-bold text-[var(--color-primary)]">
                        {formatCurrency(Number(order.total_amount))}
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'cancelled' ? 'error' :
                            order.status === 'shipped' ? 'info' : 'warning'
                          }
                          dot
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-[var(--color-text-muted)]">
                        {formatDateShort(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!recentOrders || recentOrders.length === 0) && (
                <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">No orders yet</div>
              )}
            </div>
          </Card>
        </div>

        {/* Low stock + Quick actions */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)]">Low Stock</h2>
              <Link href="/admin/inventory" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">View All</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {products?.map((p) => (
                <div key={p.name} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[var(--color-border)]">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {p.stock_quantity} units left
                    </p>
                  </div>
                  <Badge
                    variant={p.stock_quantity === 0 ? 'error' : p.stock_quantity <= 10 ? 'warning' : 'success'}
                    dot
                  >
                    {p.stock_quantity === 0 ? 'Out' : p.stock_quantity <= 10 ? 'Low' : 'OK'}
                  </Badge>
                </div>
              ))}
              {!products || products.length === 0 && (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-4">All products in stock</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Add Product', href: '/admin/products', icon: '➕' },
                { label: 'Manage Orders', href: '/admin/orders', icon: '📦' },
                { label: 'Silage Orders', href: '/admin/silage/orders', icon: '🌾' },
                { label: 'Customers', href: '/admin/customers', icon: '👥' },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-green-200)] hover:shadow-md transition-all duration-200 text-center group cursor-pointer">
                    <span className="text-xl mb-1 block" aria-hidden="true">{action.icon}</span>
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
