import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'GreenMeadow Dairy — A family farm committed to producing the finest fresh dairy products and silage feed for Pakistan.',
}

const TIMELINE = [
  { year: '1985', title: 'The Farm is Founded', desc: 'Our grandfather established GreenMeadow with just 12 cows on the outskirts of Lahore.' },
  { year: '1998', title: 'Expanding the Herd', desc: 'We grew to 120 cows and introduced our first delivery service to local neighborhoods.' },
  { year: '2008', title: 'Silage Division Launched', desc: 'We began producing and supplying silage to other dairy farms across Punjab.' },
  { year: '2018', title: 'Modern Processing Unit', desc: 'Installed state-of-the-art pasteurization and packaging equipment to meet food safety standards.' },
  { year: '2024', title: 'Going Digital', desc: 'Launched our online portal to bring farm-fresh dairy directly to your door and streamline silage orders.' },
]

const TEAM = [
  { name: 'Muhammad Hassan', role: 'Founder & Farm Director', initials: 'MH' },
  { name: 'Ahmed Ali', role: 'Head of Operations', initials: 'AA' },
  { name: 'Fatima Malik', role: 'Quality Assurance Manager', initials: 'FM' },
  { name: 'Bilal Sheikh', role: 'Silage & Feed Division', initials: 'BS' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-[var(--color-green-50)] to-[var(--color-background)]">
        <div className="container-custom text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-green-100)] px-3 py-1.5 rounded-full border border-[var(--color-green-200)] inline-block mb-4">
            Our Story
          </span>
          <h1 className="font-serif font-bold text-[var(--color-text-primary)] mb-4">
            Four Decades of Pure Dairy
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto text-lg">
            From 12 cows in 1985 to one of Punjab's most trusted dairy farms — GreenMeadow has always put the health of our animals and our customers first.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="container-custom pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-4">Our Mission</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              At GreenMeadow Dairy, we believe that the best dairy comes from happy, healthy cows raised in clean, spacious, and stress-free environments. Every litre of milk we produce carries the integrity of our farming practices.
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              We never use artificial hormones or antibiotics unless absolutely necessary for animal health. Our feed is grown on-farm or sourced locally, and our silage division helps other farms in Pakistan maintain the same high-quality nutrition standards.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { number: '300+', label: 'Cows' },
                { number: '15,000L', label: 'Daily Production' },
                { number: '500+', label: 'Happy Customers' },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-2xl bg-[var(--color-green-50)] border border-[var(--color-green-100)]">
                  <p className="font-serif font-bold text-2xl text-[var(--color-primary)]">{s.number}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-green-50)] to-[var(--color-green-100)] border border-[var(--color-green-200)] flex items-center justify-center">
              <svg className="h-24 w-24 text-[var(--color-green-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl border border-[var(--color-border)] shadow-lg p-4 w-40">
              <p className="font-serif font-bold text-3xl text-[var(--color-primary)]">39</p>
              <p className="text-xs text-[var(--color-text-muted)]">Years of excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[var(--color-green-50)] border-y border-[var(--color-green-100)]">
        <div className="container-custom py-16">
          <h2 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-10 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-[var(--color-green-200)]" aria-hidden="true" />
            <div className="flex flex-col gap-8">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className={`relative flex gap-6 sm:gap-8 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} flex-row`}>
                  <div className={`hidden sm:block sm:w-1/2 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block ${i % 2 === 0 ? 'text-right' : ''}`}>
                      {i % 2 !== 0 && (
                        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-sm">
                          <p className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-1">{item.title}</p>
                          <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 relative z-10">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[var(--color-primary)] text-white font-serif font-bold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-md">
                      {item.year.slice(2)}
                    </div>
                  </div>
                  <div className={`sm:w-1/2 ${i % 2 === 0 ? '' : 'hidden sm:block'}`}>
                    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-sm sm:block">
                      <p className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-1">{item.year} — {item.title}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="container-custom py-16">
        <h2 className="font-serif font-bold text-3xl text-[var(--color-text-primary)] mb-10 text-center">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center p-6 rounded-2xl border border-[var(--color-border)] bg-white hover:shadow-lg hover:border-[var(--color-green-200)] transition-all">
              <div className="h-16 w-16 rounded-full bg-[var(--color-primary)] text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {member.initials}
              </div>
              <p className="font-serif font-bold text-[var(--color-text-primary)]">{member.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container-custom pb-20 text-center">
        <div className="bg-gradient-to-br from-[var(--color-green-900)] to-[var(--color-green-700)] rounded-3xl p-10 text-white">
          <h2 className="font-serif font-bold text-3xl mb-3">Experience the GreenMeadow Difference</h2>
          <p className="text-white/70 mb-7 max-w-md mx-auto">Order farm-fresh dairy today or partner with us for your silage needs.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products">
              <Button size="lg" variant="accent">Shop Our Products</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
