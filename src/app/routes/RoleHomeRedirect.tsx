import { Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { roleHomePaths } from '../../utils/constants'

export function RoleHomeRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={roleHomePaths[user.role]} replace />
}
