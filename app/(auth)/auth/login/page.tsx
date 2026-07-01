import { Metadata } from 'next'
import { LoginForm } from '@/components/forms/LoginForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sign In' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; verified?: string }>
}) {
  const params = await searchParams
  const justRegistered = params.registered === '1'
  const needsVerification = params.verified === 'pending'

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-2">
          Welcome back
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Sign in to your GreenMeadow account
        </p>
      </div>

      {justRegistered && (
        <div role="status" className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 mb-5">
          <svg className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">
            Account created! Check your email for a confirmation link, then sign in below.
          </p>
        </div>
      )}

      {needsVerification && (
        <div role="status" className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 mb-5">
          <svg className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium">
            Please check your email and click the confirmation link before signing in.
          </p>
        </div>
      )}

      <LoginForm />

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-[var(--color-primary)] hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
