import { DataTable } from "../../../components/common/DataTable";
import { Badge } from "../../../components/ui/Badge";
import { RowActions } from "../../../components/common/RowActions";
import type { TableColumn, User, UserRole } from "../../../types";

function formatJoinedDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-IN", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const hour12 = hours % 12 || 12;
  const meridiem = hours >= 12 ? "PM" : "AM";

  return `${day} ${month} ${year} ${hour12}:${minutes}${meridiem}`;
}

const columns: TableColumn<User>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  {
    key: "role",
    header: "Role",
    render: (user) => (
      <Badge
        tone={
          user.role === "admin"
            ? "warning"
            : user.role === "instructor"
              ? "brand"
              : "neutral"
        }
      >
        {user.role}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (user) => <Badge tone="success">{user.status ?? "Active"}</Badge>,
  },
  {
    key: "joined",
    header: "Joined",
    render: (user) => formatJoinedDate(user.joined),
  },
];

interface UsersTableProps {
  users: User[];
  title: string;
  currentUserRole?: UserRole;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UsersTable({
  users,
  title,
  currentUserRole,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const tableColumns = [...columns];
  if (currentUserRole && onEdit && onDelete) {
    tableColumns.push({
      key: "actions",
      header: "Actions",
      render: (user) => {
        const canEdit =
          currentUserRole === "admin" ||
          (currentUserRole === "instructor" && user.role === "student");
        const canDelete = currentUserRole === "admin";
        return (
          <RowActions
            onEdit={canEdit ? () => onEdit(user) : undefined}
            onDelete={canDelete ? () => onDelete(user) : undefined}
            editLabel="Edit"
            deleteLabel="Delete"
          />
        );
      },
    });
  }

  return (
    <DataTable
      title={title}
      rows={users}
      columns={tableColumns}
      searchKey={(user) => `${user.name} ${user.email} ${user.role}`}
    />
  );
}
