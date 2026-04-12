import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-[32px] bg-white p-10 text-center shadow-soft">
        <h1 className="font-display text-4xl font-semibold text-ink-950">Access denied</h1>
        <p className="mt-4 text-ink-500">
          Your current role doesn&apos;t have permission to access this workspace.
        </p>
        <Link to="/">
          <Button className="mt-6">Return home</Button>
        </Link>
      </div>
    </div>
  )
}
