import { DataTable } from '../../../components/common/DataTable'
import { Badge } from '../../../components/ui/Badge'
import type { TableColumn, User } from '../../../types'

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    render: (user) => (
      <Badge tone={user.role === 'admin' ? 'warning' : user.role === 'instructor' ? 'brand' : 'neutral'}>
        {user.role}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (user) => <Badge tone="success">{user.status ?? 'Active'}</Badge>,
  },
  { key: 'joined', header: 'Joined' },
]

interface UsersTableProps {
  users: User[]
  title: string
}

export function UsersTable({ users, title }: UsersTableProps) {
  return (
    <DataTable
      title={title}
      rows={users}
      columns={columns}
      searchKey={(user) => `${user.name} ${user.email} ${user.role}`}
    />
  )
}
