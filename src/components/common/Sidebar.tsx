import { ChevronDown, GraduationCap, LogOut } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useAppStore } from "../../store/appStore";
import type { MenuSection, UserRole } from "../../types";
import { roleLabels } from "../../utils/constants";
import { getMenuConfig } from "../../utils/menuConfig";

interface SidebarProps {
  role: UserRole;
  basePath: string;
}

function filterSections(sections: MenuSection[], role: UserRole) {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
}

export function Sidebar({ role, basePath }: SidebarProps) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const activeRole = user?.role ?? role;
  const activeBasePath = user ? `/${user.role}` : basePath;
  const menuConfig = getMenuConfig(activeRole);
  const { isSidebarCollapsed, isSidebarOpen, closeSidebar } = useAppStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(menuConfig.map((section) => [section.title, true])),
  );
  const sections = filterSections(menuConfig, activeRole);
  const isSingleSection = sections.length === 1;
  const showLabels = !isSidebarCollapsed;

  const isMyCoursesDetailRoute =
    activeRole === "student" &&
    location.pathname.startsWith(`${activeBasePath}/courses/`) &&
    location.search.includes("source=my-courses");
  const isCoursesDetailRoute =
    activeRole === "student" &&
    location.pathname.startsWith(`${activeBasePath}/courses/`) &&
    !location.search.includes("source=my-courses");

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-ink-950/30 transition lg:hidden ${
          isSidebarOpen ?
            "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-line-100 bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none w-[220px] sm:w-[230px] ${
          isSidebarCollapsed ? "lg:w-[92px]" : "lg:w-[258px]"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`border-b border-line-100 ${showLabels ? "px-5 py-5" : "px-4 py-5"}`}
        >
          <div
            className={`flex items-center ${showLabels ? "justify-between gap-3" : "justify-center"}`}
          >
            <div className={`flex items-center ${showLabels ? "gap-3" : ""}`}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500 text-white shadow-[0_10px_20px_rgba(37,99,235,0.22)]">
                <GraduationCap size={18} />
              </div>
              {showLabels ?
                <div>
                  <p className="font-display text-[14px] font-medium text-ink-950">
                    LearnHub
                  </p>
                  <p className="text-[11px] text-ink-500">
                    {roleLabels[activeRole]} workspace
                  </p>
                </div>
              : null}
            </div>
            {/* <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className={`hidden rounded-lg border border-line-100 p-2 text-ink-500 transition hover:bg-soft hover:text-ink-900 lg:inline-flex ${
                isSidebarCollapsed ? 'rotate-180' : ''
              }`}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft size={16} />
            </button> */}
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto ${showLabels ? "px-3 py-5" : "px-2 py-5"}`}
        >
          <div className="space-y-4">
            {sections.map((section) => {
              const isOpen = expanded[section.title];

              return (
                <div key={section.title}>
                  {!isSingleSection && showLabels ?
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((current) => ({
                          ...current,
                          [section.title]: !current[section.title],
                        }))
                      }
                      className="flex w-full items-center justify-between px-2 py-2 text-[9px] font-medium uppercase tracking-[0.18em] text-ink-500"
                    >
                      {section.title}
                      <ChevronDown
                        size={13}
                        className={`transition ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  : showLabels ?
                    <p className="px-2 py-2 text-[9px] font-medium uppercase tracking-[0.18em] text-ink-500">
                      {section.title}
                    </p>
                  : null}
                  {isOpen || isSingleSection ?
                    <nav className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isMyCoursesItem = item.path === "my-courses";
                        const isCoursesItem = item.path === "courses";
                        const itemUrl = `${activeBasePath}/${item.path}`;

                        return (
                          <NavLink
                            key={item.path}
                            to={itemUrl}
                            end={item.path === "dashboard" || item.path === "my-courses" || item.path === "courses"}
                            onClick={closeSidebar}
                            className={() => {
                              const isSelected =
                                location.pathname === itemUrl ||
                                (isMyCoursesItem && isMyCoursesDetailRoute) ||
                                (isCoursesItem && isCoursesDetailRoute);

                              return `group flex items-center ${
                                showLabels ?
                                  "justify-start gap-3 px-3"
                                : "justify-center px-0"
                              } rounded-xl py-2 text-[12px] font-medium transition ${
                                isSelected ?
                                  "bg-brand-50 text-brand-600 shadow-[inset_0_0_0_1px_rgba(191,210,255,0.9)]"
                                : "text-ink-700 hover:bg-soft"
                              }`;
                            }}
                            title={!showLabels ? item.label : undefined}
                          >
                            <Icon
                              size={16}
                              className={`shrink-0 ${showLabels ? "" : "mx-auto"}`}
                            />
                            {showLabels ?
                              <span className="truncate">{item.label}</span>
                            : null}
                          </NavLink>
                        );
                      })}
                    </nav>
                  : null}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`${showLabels ? "p-4" : "p-3"} border-t border-line-100`}
        >
          {showLabels ?
            <div className="rounded-xl border border-line-100 bg-soft p-3.5">
              <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-brand-600">
                Workspace
              </p>
              <p className="mt-1.5 text-[12px] font-medium text-ink-950">
                Stay on top of your daily flow
              </p>
              <p className="mt-1 text-[11px] leading-[16px] text-ink-500">
                Quick access to learning, teaching, and admin tools.
              </p>
            </div>
          : null}
          <button
            type="button"
            onClick={logout}
            className={`${showLabels ? "mt-4" : "mt-0"} flex w-full items-center ${
              showLabels ? "justify-center gap-2 px-4" : "justify-center px-0"
            } rounded-lg border border-line-200 py-2 text-[12px] font-medium text-ink-700 transition hover:bg-soft`}
            title={!showLabels ? "Sign out" : undefined}
          >
            <LogOut size={14} />
            {showLabels ? "Sign out" : null}
          </button>
        </div>
      </aside>
    </>
  );
}
