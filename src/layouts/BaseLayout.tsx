import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/common/Sidebar'
import { Topbar } from '../components/common/Topbar'
import type { UserRole } from '../types'

interface BaseLayoutProps {
  role: UserRole
}

export function BaseLayout({ role }: BaseLayoutProps) {
  const basePath = `/${role}`

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar role={role} basePath={basePath} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
