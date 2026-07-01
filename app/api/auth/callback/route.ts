import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to portal — layout will redirect admin/farm to the correct portal
  const redirectTo = next && next.startsWith('/') ? next : '/portal'
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
