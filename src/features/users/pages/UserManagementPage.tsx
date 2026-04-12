import { UsersTable } from '../components/UsersTable'
import { useUsers } from '../hooks/useUsers'

export function UserManagementPage() {
  const { users } = useUsers()

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink-950">User Management</h1>
        <p className="mt-2 text-base text-ink-500">
          Search and manage every workspace member from a single control center.
        </p>
      </div>
      <UsersTable users={users} title="Users" />
    </section>
  )
}
