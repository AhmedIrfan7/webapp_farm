import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ProductsPreview } from '@/components/sections/ProductsPreview'
import { SilageSection } from '@/components/sections/SilageSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: `${SITE_NAME} — Premium Dairy Farm`,
  description: SITE_DESCRIPTION,
}

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: products }, { data: silageProducts }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: true })
      .limit(6),
    supabase
      .from('silage_products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: true })
      .limit(4),
  ])

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductsPreview products={products ?? []} />
      <SilageSection products={silageProducts ?? []} />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
