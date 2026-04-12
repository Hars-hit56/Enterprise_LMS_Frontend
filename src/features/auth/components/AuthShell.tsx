import { GraduationCap } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-[#4f6fff] text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_28%)]" />
        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center justify-center px-12 text-center">
          <div className="mb-10 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/15">
              <GraduationCap size={26} />
            </div>
            <span className="font-display text-5xl font-semibold">LearnHub</span>
          </div>
          <h1 className="font-display text-5xl font-semibold leading-tight">
            Transform your learning journey
          </h1>
          <p className="mt-6 text-lg text-white/82">
            Access thousands of courses, track progress, and earn certificates from industry experts.
          </p>
          <div className="mt-16 grid grid-cols-3 gap-10 text-left">
            <div>
              <p className="text-4xl font-semibold">10K+</p>
              <p className="mt-2 text-white/72">Students</p>
            </div>
            <div>
              <p className="text-4xl font-semibold">500+</p>
              <p className="mt-2 text-white/72">Courses</p>
            </div>
            <div>
              <p className="text-4xl font-semibold">50+</p>
              <p className="mt-2 text-white/72">Instructors</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white p-8 shadow-soft sm:p-10">
          <h2 className="font-display text-4xl font-semibold text-ink-950">{title}</h2>
          <p className="mt-3 text-base text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  )
}
