import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'green' | 'gold'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  'bg-[var(--color-cream-200)] text-[var(--color-cream-900)]',
  success:  'bg-green-100 text-green-800',
  warning:  'bg-amber-100 text-amber-800',
  error:    'bg-red-100 text-red-800',
  info:     'bg-blue-100 text-blue-800',
  green:    'bg-[var(--color-green-100)] text-[var(--color-green-800)]',
  gold:     'bg-[var(--color-gold-100)] text-[var(--color-gold-700)]',
}

const dotStyles: Record<BadgeVariant, string> = {
  default:  'bg-[var(--color-cream-900)]',
  success:  'bg-green-500',
  warning:  'bg-amber-500',
  error:    'bg-red-500',
  info:     'bg-blue-500',
  green:    'bg-[var(--color-green-600)]',
  gold:     'bg-[var(--color-gold-600)]',
}

function Badge({ variant = 'default', size = 'md', dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotStyles[variant])} />}
      {children}
    </span>
  )
}

export { Badge }
export type { BadgeVariant }
