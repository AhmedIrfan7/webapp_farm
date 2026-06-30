'use client'

import { useEffect, useRef, useState } from 'react'
import { TESTIMONIALS } from '@/lib/constants'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-[var(--color-gold-500)]' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) {
  const ref = useRef<HTMLBlockquoteElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <blockquote
      ref={ref}
      className="relative p-6 bg-white rounded-2xl border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-green-200)] transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms`,
      }}
    >
      {/* Quote mark */}
      <div className="absolute top-5 right-5 text-6xl font-serif text-[var(--color-green-100)] leading-none select-none" aria-hidden="true">
        "
      </div>

      <StarRating rating={testimonial.rating} />

      <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed relative z-10">
        "{testimonial.content}"
      </p>

      <footer className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[var(--color-green-100)] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm shrink-0">
          {testimonial.name[0]}
        </div>
        <cite className="not-italic">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {testimonial.name}
          </p>
        </cite>
      </footer>
    </blockquote>
  )
}

export function TestimonialsSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const [titleVisible, setTitleVisible] = useState(false)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTitleVisible(true); observer.disconnect() } },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-padding bg-white" aria-labelledby="testimonials-heading">
      <div className="container-custom">
        <div
          ref={titleRef}
          className="text-center mb-14"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-green-50)] px-3 py-1.5 rounded-full border border-[var(--color-green-200)] inline-block mb-4">
            Testimonials
          </span>
          <h2 id="testimonials-heading" className="font-serif text-[var(--color-text-primary)] mb-4">
            Loved by Our Community
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Don't just take our word for it — hear from our happy customers and farm partners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          {[
            { label: '4.9/5', sub: 'Average Rating' },
            { label: '500+', sub: 'Happy Customers' },
            { label: '100%', sub: 'Natural Products' },
            { label: '15+', sub: 'Years Serving' },
          ].map((badge) => (
            <div key={badge.sub} className="text-center">
              <div className="font-serif font-bold text-2xl text-[var(--color-primary)]">{badge.label}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{badge.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
