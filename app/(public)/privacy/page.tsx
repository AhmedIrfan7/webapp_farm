import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'GreenMeadow Dairy privacy policy — how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-green-100)] px-3 py-1.5 rounded-full border border-[var(--color-green-200)] inline-block mb-4">
          Legal
        </span>
        <h1 className="font-serif font-bold text-4xl text-[var(--color-text-primary)] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-10">Last updated: June 2024</p>

        <div className="prose prose-slate max-w-none space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">1. Information We Collect</h2>
            <p>When you create an account or place an order on GreenMeadow Dairy, we collect:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Your full name, email address, and phone number</li>
              <li>Delivery address and payment method preference</li>
              <li>Order history and product preferences</li>
              <li>For farm partners: business name and farm contact details</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">2. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Process and deliver your orders</li>
              <li>Send order confirmations and delivery updates</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Improve our products and services</li>
              <li>Send promotional offers (you may unsubscribe at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">3. Data Security</h2>
            <p>We take the security of your personal information seriously. Your data is stored securely using Supabase, which provides enterprise-grade encryption at rest and in transit. We never sell or rent your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">4. Cookies</h2>
            <p>We use cookies to maintain your login session and remember your cart. We do not use tracking cookies or share cookie data with advertisers.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Access your personal data at any time via your profile page</li>
              <li>Request deletion of your account and associated data</li>
              <li>Update or correct your personal information</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">6. Contact</h2>
            <p>
              For privacy-related questions, contact us at{' '}
              <a href="mailto:info@greenmeadow.pk" className="text-[var(--color-primary)] hover:underline font-semibold">
                info@greenmeadow.pk
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
