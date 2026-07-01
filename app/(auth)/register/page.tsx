import { Metadata } from 'next'
import { Suspense } from 'react'
import { RegisterForm } from '@/components/forms/RegisterForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-2">
          Create your account
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Join GreenMeadow — fresh dairy delivered to you
        </p>
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--color-text-muted)] text-sm">Loading form...</div>}>
        <RegisterForm />
      </Suspense>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
