import { startTransition, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { roleHomePaths } from '../../../utils/constants'
import { useAuth } from '../hooks/useAuth'

const demoAccounts = [
  { label: 'Student Demo', email: 'student@learnhub.dev', password: 'password123' },
  { label: 'Instructor Demo', email: 'instructor@learnhub.dev', password: 'password123' },
  { label: 'Admin Demo', email: 'admin@learnhub.dev', password: 'password123' },
]

export function LoginForm() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [form, setForm] = useState({ email: 'admin@learnhub.dev', password: 'password123' })
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    try {
      const user = await login(form.email, form.password)
      startTransition(() => navigate(roleHomePaths[user.role]))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Login failed.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2 sm:grid-cols-3">
        {demoAccounts.map((account) => (
          <button
            key={account.label}
            type="button"
            className="rounded-lg border border-line-200 bg-white px-3 py-1.5 text-[11px] font-medium text-ink-700 transition hover:border-brand-200 hover:bg-brand-50"
            onClick={() => setForm({ email: account.email, password: account.password })}
          >
            {account.label}
          </button>
        ))}
      </div>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={form.password}
        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        hint="Use password123 for the seeded demo accounts."
      />
      {error ? <p className="text-sm font-medium text-danger-700">{error}</p> : null}
      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-ink-500">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-brand-600">
          Sign up
        </Link>
      </p>
    </form>
  )
}
