import { Menu, PanelLeft, Search } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useAppStore } from "../../store/appStore";
import { initials } from "../../utils/format";

export function Topbar() {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery, toggleSidebar, toggleSidebarCollapsed } =
    useAppStore();

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line-100 bg-white/90 px-4 py-2.5 backdrop-blur md:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          className="rounded-lg border border-line-200 p-1.5 text-ink-700 lg:hidden"
          onClick={toggleSidebar}
          type="button"
          aria-label="Open sidebar"
        >
          <Menu size={16} />
        </button>
        <button
          className="hidden rounded-lg border border-line-200 p-1.5 text-ink-700 transition hover:bg-soft lg:inline-flex"
          onClick={toggleSidebarCollapsed}
          type="button"
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={16} />
        </button>
        {/* <label className="flex max-w-xl flex-1 items-center gap-2.5 rounded-xl border border-line-100 bg-soft px-3 py-2 text-ink-500">
          <Search size={15} />
          <input
            className="w-full border-none bg-transparent text-[12px] outline-none placeholder:text-ink-500"
            placeholder="Search courses, lessons..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label> */}
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-[11px] font-medium text-brand-600">
          {initials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink-950">
            {user.name}
          </p>
          <p className="text-[11px] capitalize text-ink-500">{user.role}</p>
        </div>
      </div>
    </header>
  );
}
