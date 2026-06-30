'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Role = 'customer' | 'farm'

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
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  function validate() {
    const errs: Record<string, string> = {}
    if (!fullName || fullName.length < 2) errs.fullName = 'Name must be at least 2 characters'
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required'
    if (!password || password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) errs.password = 'Password must contain at least one uppercase letter'
    if (!/[0-9]/.test(password)) errs.password = 'Password must contain at least one number'
    if (password !== confirm) errs.confirm = 'Passwords do not match'
    if (role === 'farm' && (!businessName || businessName.length < 2)) errs.businessName = 'Business name is required for farm accounts'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setErrors({})

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            business_name: role === 'farm' ? businessName : null,
            phone: phone || null,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in.')
          router.push('/auth/login')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Account created! Please check your email to confirm your account.')
      router.push('/auth/login?verified=pending')

    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const eyeIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      {showPassword ? (
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 p-1 bg-[var(--color-cream-100)] rounded-xl">
        {([['customer', '🥛', 'Dairy Customer'], ['farm', '🌾', 'Farm Partner']] as const).map(([r, icon, label]) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex flex-col items-center gap-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              role === r
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
            aria-pressed={role === r}
          >
            <span className="text-xl" aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {role === 'farm' && (
        <Input
          label="Farm / Business Name"
          type="text"
          placeholder="Your Farm Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          error={errors.businessName}
          required
        />
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="Muhammad Ahmed"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
        autoComplete="name"
        required
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="03XX-XXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
        autoComplete="tel"
        helper="Optional — for order updates"
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Min. 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
        required
        helper="Must include uppercase letter and number"
        rightIcon={eyeIcon}
        onRightIconClick={() => setShowPassword(!showPassword)}
      />

      <Input
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Repeat your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        autoComplete="new-password"
        required
      />

      <p className="text-xs text-[var(--color-text-muted)]">
        By creating an account you agree to our{' '}
        <a href="/terms" className="text-[var(--color-primary)] hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-[var(--color-primary)] hover:underline">Privacy Policy</a>.
      </p>

      <Button type="submit" size="lg" fullWidth loading={loading} className="mt-1">
        Create Account
      </Button>
    </form>
  )
}
