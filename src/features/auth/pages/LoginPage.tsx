import { Navigate } from 'react-router-dom'
import { roleHomePaths } from '../../../utils/constants'
import { AuthShell } from '../components/AuthShell'
import { LoginForm } from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={roleHomePaths[user.role]} replace />
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue learning">
      <LoginForm />
    </AuthShell>
  )
}
