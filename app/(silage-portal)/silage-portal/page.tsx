import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateShort, SILAGE_STATUS_LABELS } from '@/lib/utils'

export const metadata: Metadata = { title: 'Silage Portal Dashboard' }

export default async function SilagePortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: orders }, { data: silageProducts }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('silage_orders').select('*, silage_products(name)').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('silage_products').select('*').eq('is_available', true).limit(4),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">
          Welcome, {profile?.business_name ?? profile?.full_name ?? 'Farm Partner'} 🌾
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage your silage orders and inquiries</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders?.length ?? 0, icon: '📋' },
          { label: 'Active Orders', value: orders?.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length ?? 0, icon: '🚚' },
          { label: 'Products Available', value: silageProducts?.length ?? 0, icon: '🌿' },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <span className="text-2xl mb-2 block" aria-hidden="true">{stat.icon}</span>
            <p className="font-serif font-bold text-2xl text-[var(--color-text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-lg">Recent Orders</h2>
            <Link href="/silage-portal/orders" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">View All</Link>
          </div>
          {orders && orders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <Card key={order.id} padding="md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {/* @ts-expect-error nested */}
                        {order.silage_products?.name ?? 'Silage'} — {order.quantity_tons} tons
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {formatDateShort(order.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'cancelled' ? 'error' :
                        order.status === 'confirmed' ? 'info' : 'warning'
                      }
                      dot
                    >
                      {SILAGE_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  {order.quote_amount && (
                    <p className="text-xs text-[var(--color-success)] font-semibold mt-2">
                      Quoted: PKR {order.quote_amount.toLocaleString()}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card padding="lg" className="text-center">
              <p className="text-sm text-[var(--color-text-muted)] mb-4">No orders yet. Browse our silage products to get started.</p>
              <Link href="/silage-portal/products" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
                Browse Products →
              </Link>
            </Card>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-serif font-bold text-lg mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Browse Silage Products', href: '/silage-portal/products', icon: '🌿', desc: 'View all available silage' },
              { label: 'Request Quote', href: '/silage-portal/quote', icon: '📄', desc: 'Get a custom price quote' },
              { label: 'My Orders', href: '/silage-portal/orders', icon: '📦', desc: 'Track your orders' },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-green-200)] hover:shadow-md transition-all duration-200 group">
                  <span className="text-xl" aria-hidden="true">{action.icon}</span>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-[var(--color-primary)] transition-colors">{action.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{action.desc}</p>
                  </div>
                  <svg className="h-4 w-4 text-[var(--color-text-muted)] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
