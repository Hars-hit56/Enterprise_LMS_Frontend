import { Navigate } from 'react-router-dom'
import { roleHomePaths } from '../../../utils/constants'
import { AuthShell } from '../components/AuthShell'
import { SignupForm } from '../components/SignupForm'
import { useAuth } from '../hooks/useAuth'

export function SignupPage() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={roleHomePaths[user.role]} replace />
  }

  return (
    <AuthShell title="Create your account" subtitle="Choose your role and launch your workspace">
      <SignupForm />
    </AuthShell>
  )
}
