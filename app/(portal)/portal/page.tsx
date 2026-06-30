import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateShort, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils'

export const metadata: Metadata = { title: 'My Dashboard' }

export default async function CustomerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: orders }, { data: cartItems }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('orders').select('*, order_items(*)').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('cart_items').select('*').eq('user_id', user!.id),
  ])

  const totalSpent = orders?.filter((o) => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0
  const activeOrders = orders?.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length ?? 0

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Customer'} 👋
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Here's an overview of your account
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Orders',
            value: orders?.length ?? 0,
            icon: '📋',
            href: '/portal/orders',
          },
          {
            label: 'Active Orders',
            value: activeOrders,
            icon: '🚚',
            href: '/portal/orders',
          },
          {
            label: 'Cart Items',
            value: cartItems?.length ?? 0,
            icon: '🛒',
            href: '/portal/cart',
          },
          {
            label: 'Total Spent',
            value: formatCurrency(totalSpent),
            icon: '💰',
            href: '/portal/orders',
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card
              hover
              className="cursor-pointer group"
              padding="md"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
                <svg className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="font-serif font-bold text-xl text-[var(--color-text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)]">Recent Orders</h2>
            <Link href="/portal/orders" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              View All
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <Card key={order.id} padding="md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
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
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {formatDateShort(order.created_at)} · {order.order_items?.length ?? 0} items
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif font-bold text-[var(--color-primary)]">
                        {formatCurrency(Number(order.total_amount))}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] capitalize mt-0.5">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card padding="lg" className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-[var(--color-cream-100)] flex items-center justify-center mx-auto mb-3">
                <svg className="h-8 w-8 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">No orders yet</p>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">Start shopping for fresh dairy products</p>
              <Link href="/portal/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline">
                Browse Products
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Card>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Shop Fresh Milk', href: '/portal/products', icon: '🥛', desc: 'Browse all products' },
              { label: 'My Cart', href: '/portal/cart', icon: '🛒', desc: `${cartItems?.length ?? 0} items` },
              { label: 'Track Order', href: '/portal/orders', icon: '📦', desc: 'View order status' },
              { label: 'Edit Profile', href: '/portal/profile', icon: '👤', desc: 'Update your details' },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-green-200)] hover:shadow-md transition-all duration-200 group">
                  <span className="text-xl" aria-hidden="true">{action.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{action.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{action.desc}</p>
                  </div>
                  <svg className="h-4 w-4 text-[var(--color-text-muted)] ml-auto group-hover:text-[var(--color-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
