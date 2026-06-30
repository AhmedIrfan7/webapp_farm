import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, SILAGE_STATUS_LABELS } from '@/lib/utils'

export const metadata: Metadata = { title: 'My Silage Orders' }

export default async function SilageOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('silage_orders')
    .select('*, silage_products(name, type)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">My Silage Orders</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{orders?.length ?? 0} total orders</p>
      </div>

      {!orders || orders.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <p className="text-[var(--color-text-muted)] mb-4">No silage orders yet</p>
          <a href="/silage-portal/quote" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Request your first quote →
          </a>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card key={order.id} padding="md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
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
                  {/* @ts-expect-error nested */}
                  <p className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1">{order.silage_products?.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{order.quantity_tons} tons</p>
                  {order.quote_amount ? (
                    <p className="text-sm font-serif font-bold text-[var(--color-primary)]">
                      {formatCurrency(order.quote_amount)}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--color-text-muted)]">Awaiting quote</p>
                  )}
                </div>
              </div>

              {order.notes && (
                <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)]">Notes: {order.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
