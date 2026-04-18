import React from "react";
import { Edit, Trash2 } from "lucide-react";
import type { User, UserRole } from "../../../types";

interface UserRowActionsProps {
  user: User;
  currentUserRole: UserRole;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserRowActions: React.FC<UserRowActionsProps> = ({
  user,
  currentUserRole,
  onEdit,
  onDelete,
}) => {
  const canEdit =
    currentUserRole === "admin" ||
    (currentUserRole === "instructor" && user.role === "student");
  const canDelete = currentUserRole === "admin";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canEdit && (
        <button
          onClick={() => onEdit(user)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <Edit size={14} />
          Edit
        </button>
      )}
      {canDelete && (
        <button
          onClick={() => onDelete(user)}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          <Trash2 size={14} />
          Delete
        </button>
      )}
    </div>
  );
};

export default UserRowActions;
