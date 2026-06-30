export const SITE_NAME = 'GreenMeadow Dairy'
export const SITE_TAGLINE = 'Pure Milk. Pure Life.'
export const SITE_DESCRIPTION =
  'Premium organic dairy products delivered fresh from our farm to your doorstep. We also supply high-quality silage to dairy farms across the region.'

export const CONTACT_EMAIL = 'info@greenmeadowdairy.com'
export const CONTACT_PHONE = '+92-300-0000000'
export const CONTACT_ADDRESS = 'GreenMeadow Farm, District Road, Punjab, Pakistan'

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  whatsapp: 'https://wa.me/923000000000',
}

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Silage', href: '/silage' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const PRODUCT_CATEGORIES = [
  { value: 'milk', label: 'Fresh Milk' },
  { value: 'dairy', label: 'Dairy Products' },
]

export const SILAGE_TYPES = [
  { value: 'corn', label: 'Corn Silage' },
  { value: 'grass', label: 'Grass Silage' },
  { value: 'alfalfa', label: 'Alfalfa Silage' },
  { value: 'sorghum', label: 'Sorghum Silage' },
  { value: 'mixed', label: 'Mixed Silage' },
]

export const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export const SILAGE_ORDER_STATUSES = [
  'inquiry',
  'quoted',
  'confirmed',
  'processing',
  'delivered',
  'cancelled',
] as const

export const ITEMS_PER_PAGE = 10
export const FEATURED_PRODUCTS_LIMIT = 6

export const TESTIMONIALS = [
  {
    name: 'Ayesha Khan',
    city: 'Lahore',
    content:
      'The milk is incredibly fresh and pure. My family has been using GreenMeadow for over a year and we noticed a huge difference in quality. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Muhammad Tariq',
    city: 'Faisalabad',
    content:
      "Best dairy products I've ever had. The delivery is always on time and the quality is consistently excellent. Their butter and yogurt are outstanding.",
    rating: 5,
  },
  {
    name: 'Sara Malik',
    city: 'Islamabad',
    content:
      'We switched to GreenMeadow for our restaurant and our customers immediately noticed the difference. The cream and paneer are top quality.',
    rating: 5,
  },
  {
    name: 'Ahmed Dairy Farm',
    city: 'Gujranwala',
    content:
      "GreenMeadow's corn silage has significantly improved our herd's milk production. Excellent quality, reliable supply, and fair pricing. Highly recommend for farm owners.",
    rating: 5,
  },
]

export const FARM_FEATURES = [
  {
    title: '100% Natural',
    description: 'No artificial hormones, antibiotics, or preservatives. Just pure, natural dairy.',
    icon: 'Leaf',
  },
  {
    title: 'Farm Fresh Daily',
    description: 'Milk collected and processed daily for maximum freshness and nutritional value.',
    icon: 'Sun',
  },
  {
    title: 'Cold Chain Delivery',
    description: 'Temperature-controlled delivery ensures products arrive perfectly fresh.',
    icon: 'Thermometer',
  },
  {
    title: 'Ethically Raised',
    description: 'Our cows roam free on lush green pastures, stress-free and well-nourished.',
    icon: 'Heart',
  },
  {
    title: 'Quality Tested',
    description: 'Every batch is lab-tested for quality, purity, and nutritional content.',
    icon: 'Shield',
  },
  {
    title: 'Doorstep Delivery',
    description: 'Convenient home delivery across the region, on your schedule.',
    icon: 'Truck',
  },
]
