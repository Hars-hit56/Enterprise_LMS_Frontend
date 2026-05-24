import { useState } from "react";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import { UsersTable } from "../components/UsersTable";
import { EditUserModal } from "../components/EditUserModal";
import { Toast } from "../../../components/ui/Toast";
import { DataTableSkeleton } from "../../../components/skeletons/DataTableSkeleton";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../../auth/hooks/useAuth";
import type { User } from "../../../types";

export function UserManagementPage() {
  const { users, isLoading, error, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      setSuccessMessage("User deleted successfully.");
      setUserToDelete(null);
    } catch {
      alert("Failed to delete user");
    } finally {
      setIsDeleting(false);
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
    } catch {
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
      {error ? (
        <p className="text-sm font-medium text-danger-700">{error}</p>
      ) : null}
      {isLoading ? (
        <DataTableSkeleton columns={6} />
      ) : (
        <UsersTable
          users={users}
          title="Users"
          currentUserRole={currentUser?.role}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <EditUserModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        isSaving={isSaving}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
      <ConfirmModal
        open={Boolean(userToDelete)}
        title="Delete user?"
        message={`Are you sure you want to delete "${
          userToDelete?.name ?? "this user"
        }"? This action cannot be undone.`}
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
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
