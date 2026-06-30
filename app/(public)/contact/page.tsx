'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

const SUBJECTS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'order', label: 'Order Support' },
  { value: 'silage', label: 'Silage / B2B' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'other', label: 'Other' },
]

const CONTACT_INFO = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Phone',
    value: '+92 300 123 4567',
    href: 'tel:+923001234567',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'info@greenmeadow.pk',
    href: 'mailto:info@greenmeadow.pk',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Farm Address',
    value: 'GreenMeadow Dairy Farm, Raiwind Road, Lahore, Punjab, Pakistan',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Hours',
    value: 'Mon–Sat: 6:00 AM – 8:00 PM\nSunday: 7:00 AM – 2:00 PM',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    // In production, this would call an API route or email service.
    // For now we store contact messages in Supabase (you can add a contact_messages table).
    // We'll just simulate success with a delay.
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    setSubmitting(false)
    toast.success('Message sent! We\'ll reply within 24 hours.')
  }

  return (
    <>
      {/* Header */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-[var(--color-green-50)] to-[var(--color-background)]">
        <div className="container-custom text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-green-100)] px-3 py-1.5 rounded-full border border-[var(--color-green-200)] inline-block mb-4">
            Get in Touch
          </span>
          <h1 className="font-serif font-bold text-[var(--color-text-primary)] mb-4">Contact Us</h1>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto text-lg">
            Questions about an order, silage pricing, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container-custom pb-20">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2">
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-6">How to Reach Us</h2>
            <div className="flex flex-col gap-5">
              {CONTACT_INFO.map((item) => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-green-50)] border border-[var(--color-green-200)] flex items-center justify-center flex-shrink-0 text-[var(--color-primary)]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-[var(--color-text-primary)] whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-[var(--color-green-50)] border border-[var(--color-green-200)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Looking to buy silage in bulk?</p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">Register as a farm partner for dedicated B2B support and pricing.</p>
              <Link href="/silage">
                <Button size="sm" variant="primary">Learn About Silage</Button>
              </Link>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-[var(--color-border)] p-10 text-center">
                <div className="h-20 w-20 rounded-full bg-[var(--color-green-50)] flex items-center justify-center mx-auto mb-5">
                  <svg className="h-10 w-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">Message Sent!</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: 'general', message: '' }) }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[var(--color-border)] p-6 flex flex-col gap-5" noValidate>
                <h2 className="font-serif font-bold text-xl text-[var(--color-text-primary)]">Send a Message</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    error={errors.name}
                    required
                    autoComplete="name"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    error={errors.email}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    helper="Optional"
                    autoComplete="tel"
                  />
                  <Select
                    label="Subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    options={SUBJECTS}
                  />
                </div>

                <Textarea
                  label="Message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  error={errors.message}
                  required
                />

                <Button type="submit" loading={submitting} size="lg">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
