'use client'

import { useEffect, useRef, useState } from 'react'
import { FARM_FEATURES } from '@/lib/constants'

const ICONS: Record<string, React.ReactNode> = {
  Leaf: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3s8 0 13 8c-5 5-13 8-13 8S1 8 5 3z" />
    </svg>
  ),
  Sun: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  ),
  Thermometer: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9a3 3 0 114.927 2.28A4.5 4.5 0 1012 21a4.5 4.5 0 00-3-7.87V9z" />
    </svg>
  ),
  Heart: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Shield: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Truck: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l.293.293M13 16l.293.293M13 16H9m0 0l-.293-.293M19 16h2a1 1 0 001-1v-4.586a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0017.586 6H13" />
    </svg>
  ),
}

function FeatureCard({ feature, index }: { feature: typeof FARM_FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
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
    <div
      ref={ref}
      className="group p-6 rounded-2xl border border-[var(--color-border)] bg-white hover:border-[var(--color-green-200)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, box-shadow 0.3s, border-color 0.3s`,
      }}
    >
      <div className="h-12 w-12 rounded-xl bg-[var(--color-green-50)] text-[var(--color-primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300 group-hover:shadow-[var(--shadow-green)]">
        {ICONS[feature.icon]}
      </div>
      <h3 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {feature.description}
      </p>
    </div>
  )
}

export function FeaturesSection() {
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
    <section className="section-padding bg-[var(--color-cream-50)]" aria-labelledby="features-heading">
      <div className="container-custom">
        {/* Section title */}
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
            Why Choose Us
          </span>
          <h2 id="features-heading" className="font-serif text-[var(--color-text-primary)] mb-4">
            The GreenMeadow Difference
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
            We believe great dairy starts with happy cows, clean fields, and a commitment to doing things the right way — every single day.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FARM_FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
