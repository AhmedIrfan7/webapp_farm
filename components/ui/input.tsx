'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
  rightIconLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, leftIcon, rightIcon, onRightIconClick, rightIconLabel, className, id, ...props }, ref) => {
    const inputId = id || React.useId()

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--color-text-primary)]"
          >
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 rounded-xl border border-[var(--color-border)] bg-white',
              'px-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'transition-all duration-200',
              'hover:border-[var(--color-green-400)]',
              'focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20',
              'disabled:bg-[var(--color-cream-100)] disabled:opacity-60 disabled:cursor-not-allowed',
              error && 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              aria-label={rightIconLabel}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus:text-[var(--color-primary)]"
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {!error && helper && (
          <p id={`${inputId}-helper`} className="text-xs text-[var(--color-text-muted)]">
            {helper}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, className, id, ...props }, ref) => {
    const inputId = id || React.useId()

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--color-text-primary)]">
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-[var(--color-border)] bg-white',
            'px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
            'transition-all duration-200 resize-y min-h-[100px]',
            'hover:border-[var(--color-green-400)]',
            'focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20',
            'disabled:bg-[var(--color-cream-100)] disabled:opacity-60 disabled:cursor-not-allowed',
            error && 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]',
            className,
          )}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {!error && helper && <p className="text-xs text-[var(--color-text-muted)]">{helper}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id || React.useId()

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--color-text-primary)]">
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 rounded-xl border border-[var(--color-border)] bg-white',
              'pl-4 pr-10 text-sm text-[var(--color-text-primary)] appearance-none',
              'transition-all duration-200',
              'hover:border-[var(--color-green-400)]',
              'focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20',
              'disabled:bg-[var(--color-cream-100)] disabled:opacity-60 disabled:cursor-not-allowed',
              error && 'border-[var(--color-error)]',
              className,
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {!error && helper && <p className="text-xs text-[var(--color-text-muted)]">{helper}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'

export { Input, Textarea, Select }
