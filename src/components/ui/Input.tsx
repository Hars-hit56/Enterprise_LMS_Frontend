import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export function Input({ label, hint, className = '', ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink-900">
      {label ? <span>{label}</span> : null}
      <input
        className={`rounded-2xl border border-line-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs font-normal text-ink-500">{hint}</span> : null}
    </label>
  )
}
