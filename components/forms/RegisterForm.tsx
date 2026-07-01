'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Role = 'customer' | 'farm'

type FieldErrors = {
  fullName?: string
  businessName?: string
  email?: string
  phone?: string
  password?: string
  confirm?: string
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ]
  const passed = checks.filter((c) => c.pass).length
  if (!password) return null

  const color = passed === 3 ? 'bg-green-500' : passed === 2 ? 'bg-amber-400' : 'bg-red-400'
  const label = passed === 3 ? 'Strong' : passed === 2 ? 'Fair' : 'Weak'

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1 h-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`flex-1 rounded-full transition-colors duration-300 ${i < passed ? color : 'bg-[var(--color-border)]'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {checks.map((c) => (
            <span key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? 'text-green-600' : 'text-[var(--color-text-muted)]'}`}>
              <span aria-hidden="true">{c.pass ? '✓' : '○'}</span> {c.label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-semibold ${passed === 3 ? 'text-green-600' : passed === 2 ? 'text-amber-600' : 'text-red-500'}`}>
          {label}
        </span>
      </div>
    </div>
  )
}

export function RegisterForm() {
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get('role') as Role) ?? 'customer'

  const [role, setRole] = useState<Role>(defaultRole)
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const router = useRouter()

  function clearError(field: keyof FieldErrors) {
    setErrors((p) => ({ ...p, [field]: undefined }))
    setFormError(null)
  }

  function validate(): FieldErrors {
    const errs: FieldErrors = {}

    if (!fullName.trim() || fullName.trim().length < 2)
      errs.fullName = 'Full name must be at least 2 characters'

    if (role === 'farm' && (!businessName.trim() || businessName.trim().length < 2))
      errs.businessName = 'Business name is required for farm accounts'

    if (!email.trim())
      errs.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = 'Enter a valid email address'

    if (phone && !/^(\+92|0)[0-9]{10}$/.test(phone.replace(/[-\s]/g, '')))
      errs.phone = 'Enter a valid Pakistani phone number (e.g. 03001234567)'

    if (!password)
      errs.password = 'Password is required'
    else if (password.length < 8)
      errs.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(password))
      errs.password = 'Password must contain at least one uppercase letter'
    else if (!/[0-9]/.test(password))
      errs.password = 'Password must contain at least one number'

    if (!confirm)
      errs.confirm = 'Please confirm your password'
    else if (password !== confirm)
      errs.confirm = 'Passwords do not match'

    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      // Focus first error field
      const firstKey = Object.keys(errs)[0] as keyof FieldErrors
      document.getElementById(`field-${firstKey}`)?.focus()
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
            business_name: role === 'farm' ? businessName.trim() : null,
            phone: phone.trim() || null,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        if (
          error.message.includes('already registered') ||
          error.message.includes('User already registered') ||
          error.message.includes('email_exists') ||
          error.code === 'user_already_exists'
        ) {
          setFormError('An account with this email already exists. Please sign in instead.')
          setErrors({ email: 'This email is already registered' })
        } else if (error.message.includes('Password should be')) {
          setFormError('Password does not meet the requirements. Please choose a stronger password.')
          setErrors({ password: error.message })
        } else if (error.status === 429 || error.message.includes('Too many')) {
          setFormError('Too many sign-up attempts. Please wait a few minutes and try again.')
        } else {
          setFormError(error.message)
        }
        setLoading(false)
        return
      }

      // Supabase can silently succeed for duplicate emails when email confirmation is ON
      // (it sends another confirmation email). Detect this: user exists but session is null.
      if (data.user && !data.session) {
        // Email confirmation required — account may or may not be new
        if (data.user.identities && data.user.identities.length === 0) {
          // identities empty = email already exists (Supabase 2.x behavior)
          setFormError('An account with this email already exists. Please sign in instead.')
          setErrors({ email: 'This email is already registered' })
          setLoading(false)
          return
        }
        // Genuine new user — confirmation email sent
        toast.success('Account created! Check your email to confirm and then sign in.')
        router.push('/auth/login?registered=1')
        return
      }

      if (data.session) {
        // Email confirmation is OFF — user is signed in immediately
        toast.success('Account created! Welcome to GreenMeadow.')
        if (role === 'admin') window.location.href = '/admin'
        else if (role === 'farm') window.location.href = '/silage-portal'
        else window.location.href = '/portal'
        return
      }

      // Fallback
      toast.success('Account created! Please sign in.')
      router.push('/auth/login')

    } catch {
      setFormError('Something went wrong. Please check your internet connection and try again.')
      setLoading(false)
    }
  }

  const EyeIcon = ({ show }: { show: boolean }) => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      {show ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      )}
    </svg>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate aria-label="Create account form">

      {/* Form-level error */}
      {formError && (
        <div role="alert" className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium">{formError}</p>
            {formError.includes('already exists') && (
              <a href="/auth/login" className="text-sm font-semibold underline mt-1 inline-block">
                Sign in instead →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Role selector */}
      <div role="group" aria-label="Account type">
        <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">I am a:</p>
        <div className="grid grid-cols-2 gap-3 p-1 bg-[var(--color-cream-100)] rounded-xl">
          {([
            ['customer', '🥛', 'Dairy Customer', 'Buy fresh milk & dairy products'],
            ['farm', '🌾', 'Farm Partner', 'Order silage in bulk'],
          ] as const).map(([r, icon, label, desc]) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setErrors((p) => ({ ...p, businessName: undefined })) }}
              className={`flex flex-col items-center gap-1 py-3 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === r
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/50'
              }`}
              aria-pressed={role === r}
            >
              <span className="text-xl" aria-hidden="true">{icon}</span>
              <span>{label}</span>
              <span className={`text-xs font-normal ${role === r ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {role === 'farm' && (
        <Input
          id="field-businessName"
          label="Farm / Business Name"
          type="text"
          placeholder="GreenPasture Farm"
          value={businessName}
          onChange={(e) => { setBusinessName(e.target.value); clearError('businessName') }}
          error={errors.businessName}
          autoComplete="organization"
          required
        />
      )}

      <Input
        id="field-fullName"
        label="Full Name"
        type="text"
        placeholder="Muhammad Ahmed"
        value={fullName}
        onChange={(e) => { setFullName(e.target.value); clearError('fullName') }}
        error={errors.fullName}
        autoComplete="name"
        required
      />

      <Input
        id="field-email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); clearError('email') }}
        error={errors.email}
        autoComplete="email"
        inputMode="email"
        required
      />

      <Input
        id="field-phone"
        label="Phone Number"
        type="tel"
        placeholder="03001234567"
        value={phone}
        onChange={(e) => { setPhone(e.target.value); clearError('phone') }}
        error={errors.phone}
        autoComplete="tel"
        inputMode="tel"
        helper="Optional · Used for order updates"
      />

      <div>
        <Input
          id="field-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearError('password') }}
          error={errors.password}
          autoComplete="new-password"
          required
          rightIcon={<EyeIcon show={showPassword} />}
          onRightIconClick={() => setShowPassword(!showPassword)}
          rightIconLabel={showPassword ? 'Hide password' : 'Show password'}
        />
        <PasswordStrength password={password} />
      </div>

      <Input
        id="field-confirm"
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        placeholder="Repeat your password"
        value={confirm}
        onChange={(e) => { setConfirm(e.target.value); clearError('confirm') }}
        error={errors.confirm}
        autoComplete="new-password"
        required
        rightIcon={<EyeIcon show={showConfirm} />}
        onRightIconClick={() => setShowConfirm(!showConfirm)}
        rightIconLabel={showConfirm ? 'Hide password' : 'Show password'}
      />

      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
        By creating an account you agree to our{' '}
        <a href="/terms" className="text-[var(--color-primary)] hover:underline font-medium">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-[var(--color-primary)] hover:underline font-medium">Privacy Policy</a>.
      </p>

      <Button type="submit" size="lg" fullWidth loading={loading} className="mt-1">
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  )
}
