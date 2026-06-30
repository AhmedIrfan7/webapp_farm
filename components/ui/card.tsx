import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glass?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

function Card({ hover = false, glass = false, padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-white',
        paddingMap[padding],
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-green-200)] cursor-pointer',
        glass && 'bg-white/80 backdrop-blur-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-serif font-bold text-xl text-[var(--color-text-primary)] leading-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-[var(--color-text-secondary)]', className)} {...props}>
      {children}
    </p>
  )
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center mt-4 pt-4 border-t border-[var(--color-border)]', className)} {...props}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
