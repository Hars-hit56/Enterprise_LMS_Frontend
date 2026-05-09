import { startTransition, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { UserRole } from '../../../types'
import { roleLabels, roleHomePaths } from '../../../utils/constants'
import { useAuth } from '../hooks/useAuth'

const roles: UserRole[] = ['student', 'instructor', 'admin']

export function SignupForm() {
  const navigate = useNavigate()
  const { signup, isLoading } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as UserRole,
  })
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoading) {
      return
    }

    setError('')

    try {
      const user = await signup(form)
      startTransition(() => navigate(roleHomePaths[user.role]))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Signup failed.')
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        label="Full name"
        placeholder="Jane Cooper"
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
      />
      <Input
        label="Email"
        type="email"
        placeholder="jane@company.com"
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Create a secure password"
        value={form.password}
        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink-900">Select your role</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setForm((current) => ({ ...current, role }))}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                form.role === role
                  ? 'border-brand-500 bg-brand-100 text-brand-600'
                  : 'border-line-200 bg-white text-ink-700 hover:border-brand-200'
              }`}
            >
              {roleLabels[role]}
            </button>
          ))}
        </div>
      </div>
      {error ? <p className="text-sm font-medium text-danger-700">{error}</p> : null}
      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600">
          Sign in
        </Link>
      </p>
    </form>
  )
}
