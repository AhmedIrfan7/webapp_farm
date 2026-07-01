import { NextResponse } from 'next/server'
import { createClient as createRawAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  // Get current user from session cookie
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Raw admin client — no cookie session, pure service role, bypasses RLS
  const adminDb = createRawAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: profile, error: profileError } = await adminDb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('[/api/me/role] profile fetch error:', profileError.message, 'for user:', user.id)
    return NextResponse.json({ error: 'Profile not found', userId: user.id }, { status: 404 })
  }

  return NextResponse.json({ role: profile.role })
}
