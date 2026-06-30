import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import type { Order } from '@/types'

export const metadata: Metadata = { title: 'My Orders' }

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, unit))')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">
          My Orders
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {orders?.length ?? 0} total orders
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <div className="h-20 w-20 rounded-2xl bg-[var(--color-cream-100)] flex items-center justify-center mx-auto mb-4">
            <svg className="h-10 w-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">No orders yet</p>
          <p className="text-sm text-[var(--color-text-muted)]">Your order history will appear here</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {(orders as Order[]).map((order) => (
            <Card key={order.id} padding="md">
              {/* Order header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-[var(--color-text-primary)]">
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
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-lg text-[var(--color-primary)]">
                    {formatCurrency(Number(order.total_amount))}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                  </p>
                </div>
              </div>

              {/* Order items */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="border-t border-[var(--color-border)] pt-4">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                    Items
                  </p>
                  <div className="flex flex-col gap-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-[var(--color-text-secondary)]">
                          {/* @ts-expect-error - nested join */}
                          {item.products?.name ?? 'Product'} × {item.quantity} {item.products?.unit}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.price_at_purchase * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery info */}
              {order.delivery_address && (
                <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                    Delivery Address
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {order.delivery_address}, {order.delivery_city}
                  </p>
                </div>
              )}

              {/* Status tracker */}
              {order.status !== 'cancelled' && (
                <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                  <div className="flex items-center gap-1">
                    {(['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as const).map((step, idx) => {
                      const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
                      const currentIdx = statusOrder.indexOf(order.status)
                      const isDone = idx <= currentIdx
                      const isActive = idx === currentIdx

                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className={`h-2 w-2 rounded-full shrink-0 transition-colors ${isDone ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'} ${isActive ? 'ring-2 ring-[var(--color-primary)] ring-offset-1' : ''}`} />
                          {idx < 4 && <div className={`flex-1 h-0.5 mx-1 transition-colors ${idx < currentIdx ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['Placed', 'Confirmed', 'Preparing', 'Shipped', 'Delivered'].map((label) => (
                      <span key={label} className="text-xs text-[var(--color-text-muted)] flex-1 text-center first:text-left last:text-right">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
