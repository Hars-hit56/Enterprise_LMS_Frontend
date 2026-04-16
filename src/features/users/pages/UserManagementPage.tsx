import { UsersTable } from "../components/UsersTable";
import { useUsers } from "../hooks/useUsers";

export function UserManagementPage() {
  const { users } = useUsers();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
          User Management
        </h1>
        <p className="mt-1 max-w-2xl text-[12px] text-ink-500">
          Search and manage every workspace member from a single control center.
        </p>
      </div>
      <UsersTable users={users} title="Users" />
    </section>
  );
}
