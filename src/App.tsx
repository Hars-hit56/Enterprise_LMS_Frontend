import { useEffect } from 'react'
import { AppRouter } from './app/router'
import { Toast } from './components/ui/Toast'
import { useAuth } from './features/auth/hooks/useAuth'

function App() {
  const { token, successMessage, clearMessage, refreshCurrentUser } = useAuth()

  useEffect(() => {
    if (!token) {
      return
    }

    refreshCurrentUser().catch(() => {
      // Route guards and auth state handle the visible error paths.
    })
  }, [refreshCurrentUser, token])

  return (
    <>
      <AppRouter />
      {successMessage ? <Toast message={successMessage} type="success" onClose={clearMessage} /> : null}
    </>
  )
}

export default App
