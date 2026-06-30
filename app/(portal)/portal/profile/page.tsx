'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getInitials } from '@/lib/utils'

interface ProfileForm {
  full_name: string
  phone: string
  address: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null; address: string | null; email?: string | null } | null>(null)
  const [form, setForm] = useState<ProfileForm>({ full_name: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email ?? null)

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setForm({
          full_name: data.full_name ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name || null,
        phone: form.phone || null,
        address: form.address || null,
      })
      .eq('id', user.id)

    if (error) { toast.error('Failed to save changes'); setSaving(false); return }
    toast.success('Profile updated successfully')
    setProfile((p) => p ? { ...p, ...form } : p)
    setSaving(false)
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!pwForm.newPassword || pwForm.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters'
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length) { setPwErrors(errs); return }

    setChangingPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPassword })

    if (error) { toast.error('Failed to change password: ' + error.message); setChangingPassword(false); return }
    toast.success('Password changed successfully')
    setPwForm({ newPassword: '', confirmPassword: '' })
    setPwErrors({})
    setChangingPassword(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading profile...
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)]">My Profile</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage your personal information and account settings</p>
      </div>

      {/* Avatar section */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-5 flex items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-[var(--color-primary)] text-white font-bold text-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
          {getInitials(profile?.full_name ?? userEmail ?? 'U')}
        </div>
        <div>
          <p className="font-serif font-bold text-lg text-[var(--color-text-primary)]">{profile?.full_name ?? 'No name set'}</p>
          <p className="text-sm text-[var(--color-text-muted)]">{userEmail}</p>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-5 flex flex-col gap-5">
        <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)]">Personal Information</h2>

        <Input
          label="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Your full name"
          autoComplete="name"
        />

        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={userEmail ?? ''}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-green-50)] text-[var(--color-text-muted)] text-sm cursor-not-allowed"
            aria-label="Email (read-only)"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Email cannot be changed here. Contact support if needed.</p>
        </div>

        <Input
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="03XX-XXXXXXX"
          helper="Used for order updates and delivery coordination"
          autoComplete="tel"
        />

        <Input
          label="Delivery Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Your default delivery address"
          helper="Pre-filled during checkout"
          autoComplete="street-address"
        />

        <Button type="submit" loading={saving} className="self-start">
          Save Changes
        </Button>
      </form>

      {/* Password change */}
      <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-[var(--color-border)] p-6 flex flex-col gap-5" noValidate>
        <h2 className="font-serif font-bold text-lg text-[var(--color-text-primary)]">Change Password</h2>

        <Input
          label="New Password"
          type="password"
          value={pwForm.newPassword}
          onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
          error={pwErrors.newPassword}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />

        <Input
          label="Confirm New Password"
          type="password"
          value={pwForm.confirmPassword}
          onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
          error={pwErrors.confirmPassword}
          placeholder="Repeat new password"
          autoComplete="new-password"
        />

        <Button type="submit" loading={changingPassword} variant="secondary" className="self-start">
          Change Password
        </Button>
      </form>
    </div>
  )
}
