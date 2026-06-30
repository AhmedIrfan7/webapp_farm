import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'GreenMeadow Dairy terms and conditions of service.',
}

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-green-100)] px-3 py-1.5 rounded-full border border-[var(--color-green-200)] inline-block mb-4">
          Legal
        </span>
        <h1 className="font-serif font-bold text-4xl text-[var(--color-text-primary)] mb-2">Terms of Service</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-10">Last updated: June 2024</p>

        <div className="prose prose-slate max-w-none space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">1. Acceptance of Terms</h2>
            <p>By creating an account or placing an order on GreenMeadow Dairy, you agree to these terms of service. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">2. Orders and Delivery</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>All orders are subject to availability and confirmation</li>
              <li>Delivery is available within our service area</li>
              <li>Free delivery on orders above PKR 1,000</li>
              <li>Delivery times are estimates and may vary</li>
              <li>You must provide accurate delivery address information</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">3. Silage B2B Orders</h2>
            <p>For farm partners placing silage orders:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Quote requests do not constitute a binding order until confirmed by both parties</li>
              <li>Final pricing is subject to quantity and delivery location</li>
              <li>Payment terms will be agreed upon during the quote process</li>
              <li>Minimum order quantities apply as specified per product</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">4. Payment</h2>
            <p>We accept cash on delivery (COD), bank transfer, and mobile payments (JazzCash, Easypaisa). All prices are in Pakistani Rupees (PKR) including applicable taxes.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">5. Returns and Refunds</h2>
            <p>Due to the perishable nature of dairy products, we accept complaints about damaged or incorrect items within 2 hours of delivery. Contact us immediately at +92 300 123 4567. Approved refunds are processed within 3–5 business days.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">6. Account Responsibility</h2>
            <p>You are responsible for maintaining the security of your account. Do not share your login credentials. We reserve the right to suspend accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)] mb-3">7. Contact</h2>
            <p>
              For questions about these terms, contact us at{' '}
              <a href="mailto:info@greenmeadow.pk" className="text-[var(--color-primary)] hover:underline font-semibold">
                info@greenmeadow.pk
              </a>{' '}
              or call{' '}
              <a href="tel:+923001234567" className="text-[var(--color-primary)] hover:underline font-semibold">
                +92 300 123 4567
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
