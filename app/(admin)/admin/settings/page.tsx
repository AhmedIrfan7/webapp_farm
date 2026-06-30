import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Admin Settings' }

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Admin account and site configuration</p>
      </div>

      {/* Admin profile info */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-5">
        <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-4">Admin Account</h2>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)] font-semibold">Name</span>
            <span className="font-medium text-[var(--color-text-primary)]">{profile?.full_name ?? '—'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)] font-semibold">Email</span>
            <span className="font-medium text-[var(--color-text-primary)]">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)] font-semibold">Role</span>
            <span className="font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs">Administrator</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--color-text-muted)] font-semibold">User ID</span>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">{user?.id}</span>
          </div>
        </div>
      </div>

      {/* Business info */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-5">
        <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-4">Business Information</h2>
        <div className="flex flex-col gap-2 text-sm">
          {[
            { label: 'Business Name', value: 'GreenMeadow Dairy' },
            { label: 'Contact Number', value: '+92 300 123 4567' },
            { label: 'Email', value: 'info@greenmeadow.pk' },
            { label: 'Address', value: 'Raiwind Road, Lahore, Punjab, Pakistan' },
            { label: 'Currency', value: 'PKR — Pakistani Rupee' },
            { label: 'Free Delivery Threshold', value: 'PKR 1,000+' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
              <span className="text-[var(--color-text-muted)] font-semibold">{item.label}</span>
              <span className="font-medium text-[var(--color-text-primary)] text-right">{item.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-4">
          To update business information, edit <code className="bg-[var(--color-green-50)] px-1.5 py-0.5 rounded font-mono">lib/constants.ts</code> in the codebase.
        </p>
      </div>

      {/* Supabase info */}
      <div className="bg-[var(--color-green-50)] rounded-2xl border border-[var(--color-green-200)] p-5">
        <h2 className="font-serif font-bold text-base text-[var(--color-text-primary)] mb-2">Database &amp; Auth</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          This website uses Supabase for database, authentication, and file storage. Manage tables, RLS policies, and users from the Supabase dashboard.
        </p>
        <div className="text-xs text-[var(--color-text-muted)] space-y-1 font-mono">
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Connected' : '✗ Not configured'}</p>
        </div>
      </div>
    </div>
  )
}
