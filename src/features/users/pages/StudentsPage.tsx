import { useState } from "react";
import { UsersTable } from "../components/UsersTable";
import { EditUserModal } from "../components/EditUserModal";
import { Toast } from "../../../components/ui/Toast";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../../auth/hooks/useAuth";
import type { User } from "../../../types";

export function StudentsPage() {
  const { users, isLoading, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const students = users.filter((user) => user.role === "student");

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-600">Loading students...</div>
    );
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleSubmit = async (data: Omit<User, "id" | "joined" | "photoUrl">) => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      await updateUser(selectedUser.id, data);
      setSuccessMessage("Student updated successfully.");
      setSelectedUser(null);
    } catch (error) {
      alert("Failed to update student.");
    } finally {
      setIsSaving(false);
    }
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

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
          Students
        </h1>
        <p className="mt-1 max-w-2xl text-[12px] text-ink-500">
          Monitor cohort health, engagement, and learner readiness across your
          programs.
        </p>
      </div>
      <UsersTable
        users={students}
        title="Student roster"
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
