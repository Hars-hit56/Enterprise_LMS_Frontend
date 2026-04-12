import { ChevronDown, GraduationCap, LogOut } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useAppStore } from '../../store/appStore'
import type { MenuSection, UserRole } from '../../types'
import { roleLabels } from '../../utils/constants'
import { menuConfig } from '../../utils/menuConfig'

interface SidebarProps {
  role: UserRole
  basePath: string
}

function filterSections(sections: MenuSection[], role: UserRole) {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0)
}

export function Sidebar({ role, basePath }: SidebarProps) {
  const { logout } = useAuth()
  const { isSidebarOpen, closeSidebar } = useAppStore()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(menuConfig.map((section) => [section.title, true])),
  )

  const sections = filterSections(menuConfig, role)

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-ink-950/30 transition lg:hidden ${
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeSidebar}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[288px] flex-col border-r border-white/60 bg-white transition lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-line-100 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-[0_14px_24px_rgba(37,99,235,0.28)]">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink-950">LearnHub</p>
              <p className="text-sm text-ink-500">{roleLabels[role]} workspace</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-5">
            {sections.map((section) => {
              const isOpen = expanded[section.title]

              return (
                <div key={section.title}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((current) => ({
                        ...current,
                        [section.title]: !current[section.title],
                      }))
                    }
                    className="flex w-full items-center justify-between px-2 py-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-500"
                  >
                    {section.title}
                    <ChevronDown
                      size={16}
                      className={`transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen ? (
                    <nav className="mt-1 space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon

                        return (
                          <NavLink
                            key={item.path}
                            to={`${basePath}/${item.path}`}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                              `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                                isActive
                                  ? 'bg-soft text-ink-950 shadow-[inset_0_0_0_1px_rgba(220,229,243,0.8)]'
                                  : 'text-ink-700 hover:bg-soft'
                              }`
                            }
                          >
                            <Icon size={18} />
                            {item.label}
                          </NavLink>
                        )
                      })}
                    </nav>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t border-line-100 p-4">
          <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-[#4f6fff] p-4 text-white">
            <p className="text-sm font-semibold">Upgrade to Pro</p>
            <p className="mt-1 text-sm text-white/80">Unlock automation, analytics, and premium content.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-line-200 px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-soft"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
