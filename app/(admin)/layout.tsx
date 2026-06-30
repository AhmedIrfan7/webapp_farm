import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/portal')

  return (
    <div className="flex min-h-dvh bg-[var(--color-background)]">
      <AdminSidebar adminName={profile?.full_name ?? 'Admin'} />
      <main id="main-content" className="flex-1 pt-14 lg:pt-0 overflow-x-hidden">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
