import { Bell, Menu, Search } from 'lucide-react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useAppStore } from '../../store/appStore'
import { initials } from '../../utils/format'

export function Topbar() {
  const { user } = useAuth()
  const { searchQuery, setSearchQuery, toggleSidebar } = useAppStore()

  if (!user) {
    return null
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/60 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
      <button
        className="rounded-2xl border border-line-200 p-3 text-ink-700 lg:hidden"
        onClick={toggleSidebar}
        type="button"
      >
        <Menu size={18} />
      </button>
      <label className="flex flex-1 items-center gap-3 rounded-2xl border border-line-100 bg-soft px-4 py-3 text-ink-500">
        <Search size={18} />
        <input
          className="w-full border-none bg-transparent text-sm outline-none placeholder:text-ink-500"
          placeholder="Search courses, lessons..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>
      <button
        type="button"
        className="relative rounded-2xl border border-line-200 p-3 text-ink-700"
      >
        <Bell size={18} />
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
      </button>
      <div className="hidden items-center gap-3 md:flex">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
          {initials(user.name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-950">{user.name}</p>
          <p className="text-xs text-ink-500 capitalize">{user.role}</p>
        </div>
      </div>
    </header>
  )
}
