import { Bell, Menu, PanelLeft, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useAppStore } from '../../store/appStore'
import { initials } from '../../utils/format'

export function Topbar() {
  const { user } = useAuth()
  const { searchQuery, setSearchQuery, toggleSidebar, toggleSidebarCollapsed } = useAppStore()

  if (!user) {
    return null
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line-100 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          className="rounded-lg border border-line-200 p-2 text-ink-700 lg:hidden"
          onClick={toggleSidebar}
          type="button"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>
        <button
          className="hidden rounded-lg border border-line-200 p-2 text-ink-700 transition hover:bg-soft lg:inline-flex"
          onClick={toggleSidebarCollapsed}
          type="button"
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={18} />
        </button>
        <label className="flex max-w-xl flex-1 items-center gap-3 rounded-lg border border-line-100 bg-soft px-3.5 py-2 text-ink-500">
          <Search size={16} />
          <input
            className="w-full border-none bg-transparent text-sm outline-none placeholder:text-ink-500"
            placeholder="Search courses, lessons..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      </div>
      <button
        type="button"
        className="relative rounded-lg border border-line-200 p-2 text-ink-700 transition hover:bg-soft"
        aria-label="Notifications"
      >
        <Bell size={17} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
      </button>
      <div className="hidden items-center gap-3 md:flex">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-medium text-brand-600">
          {initials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink-950">{user.name}</p>
          <p className="text-xs capitalize text-ink-500">{user.role}</p>
        </div>
        <button
          type="button"
          className="rounded-lg p-1 text-ink-500 transition hover:bg-soft hover:text-ink-900"
          aria-label="User menu"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  )
}
