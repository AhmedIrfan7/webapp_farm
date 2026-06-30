import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PortalSidebar } from '@/components/layout/PortalSidebar'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/portal')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Admin gets redirected to admin panel, not customer portal
  if (profile?.role === 'admin') redirect('/admin')

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
