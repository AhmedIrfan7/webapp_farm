'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()

  function validate() {
    const errs: typeof fieldErrors = {}
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address'
    if (!password) errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setFieldErrors({})
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        if (
          error.message.includes('Invalid login credentials') ||
          error.message.includes('invalid_credentials') ||
          error.code === 'invalid_credentials'
        ) {
          setFormError('Incorrect email or password. Please check and try again.')
        } else if (
          error.message.includes('Email not confirmed') ||
          error.message.includes('email_not_confirmed')
        ) {
          setFormError('Your email is not confirmed. Please check your inbox for the confirmation link.')
        } else if (
          error.message.includes('Too many requests') ||
          error.status === 429
        ) {
          setFormError('Too many login attempts. Please wait a few minutes and try again.')
        } else if (error.message.includes('User not found')) {
          setFormError('No account found with this email address.')
        } else {
          setFormError(error.message)
        }
        setLoading(false)
        return
      }

      if (!data.user) {
        setFormError('Login failed. Please try again.')
        setLoading(false)
        return
      }

      // Fetch role to redirect correctly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      toast.success('Welcome back!')

      const role = profile?.role
      if (role === 'admin') {
        window.location.href = '/admin'
      } else if (role === 'farm') {
        window.location.href = '/silage-portal'
      } else {
        window.location.href = '/portal'
      }

    } catch {
      setFormError('Something went wrong. Please check your internet connection and try again.')
      setLoading(false)
    }
  }

  const eyeIcon = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      tabIndex={-1}
    >
      <svg className="h-4 w-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        {showPassword ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        ) : (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </>
        )}
      </svg>
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

      {/* Form-level error banner */}
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
        >
          <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">{formError}</p>
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); setFormError(null) }}
        error={fieldErrors.email}
        autoComplete="email"
        required
        inputMode="email"
      />

      <div>
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); setFormError(null) }}
          error={fieldErrors.password}
          autoComplete="current-password"
          required
          rightIcon={eyeIcon}
        />
        <div className="mt-2 text-right">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-[var(--color-primary)] hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <Button type="submit" size="lg" fullWidth loading={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--color-border)]" aria-hidden="true" />
        <span className="text-xs text-[var(--color-text-muted)]">New here?</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" aria-hidden="true" />
      </div>

      <Link href="/auth/register">
        <Button type="button" variant="secondary" size="lg" fullWidth>
          Create an Account
        </Button>
      </Link>
    </form>
  )
}
