import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/common/Sidebar";
import { Topbar } from "../components/common/Topbar";
import type { UserRole } from "../types";

interface BaseLayoutProps {
  role: UserRole;
}

export function BaseLayout({ role }: BaseLayoutProps) {
  const basePath = `/${role}`;

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar role={role} basePath={basePath} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Topbar />
          <main className="flex-1 px-4 py-5 md:px-6 lg:px-8 xl:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
