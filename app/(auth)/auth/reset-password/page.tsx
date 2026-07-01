'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase sets session from URL hash after redirect
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  function validate() {
    const errs: typeof errors = {}
    if (!password || password.length < 8) errs.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(password)) errs.password = 'Must include at least one uppercase letter'
    else if (!/[0-9]/.test(password)) errs.password = 'Must include at least one number'
    if (!confirm) errs.confirm = 'Please confirm your new password'
    else if (password !== confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setFormError(error.message)
      setLoading(false)
      return
    }

    toast.success('Password updated successfully!')
    router.push('/auth/login')
  }

  if (!ready) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin mx-auto mb-4" aria-label="Loading" />
        <p className="text-sm text-[var(--color-text-secondary)]">Verifying reset link…</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-2">
          If nothing happens,{' '}
          <a href="/auth/forgot-password" className="text-[var(--color-primary)] hover:underline">
            request a new link
          </a>
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-2">Set New Password</h1>
        <p className="text-[var(--color-text-secondary)]">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {formError && (
          <div role="alert" className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{formError}</p>
          </div>
        )}

        <Input
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
          error={errors.password}
          autoComplete="new-password"
          required
          helper="Must include uppercase letter and number"
        />

        <Input
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repeat your new password"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })) }}
          error={errors.confirm}
          autoComplete="new-password"
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-pw"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
          />
          <label htmlFor="show-pw" className="text-sm text-[var(--color-text-secondary)] cursor-pointer">
            Show passwords
          </label>
        </div>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? 'Updating…' : 'Update Password'}
        </Button>
      </form>
    </div>
  )
}
