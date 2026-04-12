import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

const styles = {
  primary:
    'bg-brand-500 text-white shadow-[0_14px_30px_rgba(37,99,235,0.26)] hover:bg-brand-600',
  secondary:
    'border border-line-200 bg-white text-ink-900 hover:border-brand-200 hover:bg-brand-50',
  ghost: 'text-ink-700 hover:bg-line-100',
}

export function Button({
  children,
  className = '',
  fullWidth = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        styles[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
