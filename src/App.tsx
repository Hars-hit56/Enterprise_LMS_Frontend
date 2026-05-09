import { AppRouter } from './app/router'
import { Toast } from './components/ui/Toast'
import { useAuth } from './features/auth/hooks/useAuth'

function App() {
  const { successMessage, clearMessage } = useAuth()

  return (
    <>
      <AppRouter />
      {successMessage ? <Toast message={successMessage} type="success" onClose={clearMessage} /> : null}
    </>
  )
}

export default App
