'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { formatDate, getInitials } from '@/lib/utils'

interface Customer {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  business_name: string | null
  created_at: string
  address: string | null
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'farm'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .order('created_at', { ascending: false })

    if (error) { toast.error('Failed to load customers'); setLoading(false); return }
    setCustomers(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = customers.filter((c) => {
    const matchRole = roleFilter === 'all' || c.role === roleFilter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.business_name?.toLowerCase().includes(q)
    return matchRole && matchSearch
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">Customers</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{customers.length} registered users</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          aria-label="Search customers"
        />
        <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden text-sm font-semibold">
          {(['all', 'customer', 'farm'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 transition-colors capitalize ${
                roleFilter === r
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-green-50)]'
              }`}
            >
              {r === 'all' ? 'All' : r === 'farm' ? 'Farm Partners' : 'Customers'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
            <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading customers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            {search || roleFilter !== 'all' ? 'No customers match your filters' : 'No customers yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-green-50)]">
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Business</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-green-50)] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0" aria-hidden="true">
                          {getInitials(c.full_name ?? 'U')}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)]">{c.full_name ?? 'No name'}</p>
                          <p className="text-xs text-[var(--color-text-muted)] font-mono">{c.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-[var(--color-text-secondary)]">{c.email ?? '—'}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{c.phone ?? '—'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={c.role === 'farm' ? 'green' : 'info'} dot>
                        {c.role === 'farm' ? 'Farm Partner' : 'Customer'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      {c.business_name ?? '—'}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-muted)] whitespace-nowrap">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
