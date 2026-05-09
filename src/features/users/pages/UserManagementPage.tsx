import { useState } from "react";
import { UsersTable } from "../components/UsersTable";
import { EditUserModal } from "../components/EditUserModal";
import { Toast } from "../../../components/ui/Toast";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../../auth/hooks/useAuth";
import type { User } from "../../../types";

export function UserManagementPage() {
  const { users, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteUser(user.id);
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleSubmit = async (data: Omit<User, "id" | "joined" | "photoUrl">) => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      await updateUser(selectedUser.id, data);
      setSuccessMessage("User updated successfully.");
      setSelectedUser(null);
    } catch (error) {
      alert("Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

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
      <UsersTable
        users={users}
        title="Users"
        currentUserRole={currentUser?.role}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditUserModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        isSaving={isSaving}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage("")}
        />
      )}
    </section>
  );
}
