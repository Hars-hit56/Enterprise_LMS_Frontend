import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-[28px] border border-white/70 bg-white p-6 shadow-soft ${className}`}>
      {children}
    </div>
  )
}
