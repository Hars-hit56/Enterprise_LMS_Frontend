import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-[32px] bg-white p-10 text-center shadow-soft">
        <h1 className="font-display text-4xl font-semibold text-ink-950">Page not found</h1>
        <p className="mt-4 text-ink-500">
          The page you requested doesn&apos;t exist or may have moved.
        </p>
        <Link to="/">
          <Button className="mt-6">Go to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
