import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Reset Password' }

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sign In
        </Link>
        <h1 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-2">
          Reset your password
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
