import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { PortalSidebar } from '@/components/layout/PortalSidebar'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  // Step 1: verify identity via anon client (validates JWT properly)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/portal')

  // Step 2: read profile via service client (bypasses RLS — no cookie interference)
  const db = createServiceClient()
  const { data: profile } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Redirect to the correct portal based on actual DB role
  if (profile?.role === 'admin') redirect('/admin')
  if (profile?.role === 'farm') redirect('/silage-portal')

  return (
    <div className="flex min-h-dvh bg-[var(--color-background)]">
      <PortalSidebar profile={profile} />
      <main id="main-content" className="flex-1 pt-14 lg:pt-0 overflow-x-hidden">
        <div className="p-6 lg:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
