import { Metadata } from 'next'
import { LoginForm } from '@/components/forms/LoginForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
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
