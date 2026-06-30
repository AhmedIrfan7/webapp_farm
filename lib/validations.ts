import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^(\+92|0)[0-9]{10}$/, 'Enter a valid Pakistani phone number')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirm_password: z.string(),
    role: z.enum(['customer', 'farm']).default('customer'),
    business_name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })
  .refine(
    (data) => {
      if (data.role === 'farm') return !!data.business_name && data.business_name.length >= 2
      return true
    },
    {
      message: 'Business name is required for farm accounts',
      path: ['business_name'],
    },
  )

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^(\+92|0)[0-9]{10}$/, 'Enter a valid Pakistani phone number')
    .optional()
    .or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
})

export const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  phone: z
    .string()
    .regex(/^(\+92|0)[0-9]{10}$/, 'Enter a valid Pakistani phone number'),
  delivery_address: z.string().min(10, 'Please enter your full address'),
  delivery_city: z.string().min(2, 'City is required'),
  payment_method: z.enum(['cod', 'bank_transfer']),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
})

export const silageOrderSchema = z.object({
  farm_name: z.string().min(2, 'Farm name is required'),
  contact_person: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^(\+92|0)[0-9]{10}$/, 'Enter a valid Pakistani phone number'),
  product_id: z.string().uuid('Please select a product'),
  quantity_tons: z.number().min(0.5, 'Minimum order is 0.5 tons').max(10000),
  delivery_address: z.string().min(10, 'Please enter delivery address').optional().or(z.literal('')),
  requested_delivery_date: z.string().optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  category: z.enum(['milk', 'dairy']),
  stock_quantity: z.number().int().min(0),
  is_available: z.boolean().default(true),
})

export const silageProductSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(200),
  type: z.string().min(1, 'Type is required'),
  description: z.string().max(2000).optional().or(z.literal('')),
  price_per_ton: z.number().min(0.01, 'Price must be greater than 0'),
  available_quantity: z.number().min(0).optional(),
  minimum_order: z.number().min(0.5, 'Minimum order must be at least 0.5 tons').default(1),
  is_available: z.boolean().default(true),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type SilageOrderFormData = z.infer<typeof silageOrderSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type SilageProductFormData = z.infer<typeof silageProductSchema>
