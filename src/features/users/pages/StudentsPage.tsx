import { useState } from "react";
import { UsersTable } from "../components/UsersTable";
import { EditUserModal } from "../components/EditUserModal";
import { Toast } from "../../../components/ui/Toast";
import { DataTableSkeleton } from "../../../components/skeletons/DataTableSkeleton";
import { useInstructorStudents } from "../hooks/useUsers";
import { useAuth } from "../../auth/hooks/useAuth";
import type { User } from "../../../types";
import type { InstructorUpdateUserPayload } from "../services/userService";

export function StudentsPage() {
  const { users: students, isLoading, error, updateUser, deleteUser } =
    useInstructorStudents();
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleSubmit = async (data: InstructorUpdateUserPayload) => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      await updateUser(selectedUser.id, data);
      setSuccessMessage("Student updated successfully.");
      setSelectedUser(null);
    } catch {
      alert("Failed to update student.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteUser(user.id);
      } catch {
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
      {error ? (
        <p className="text-sm font-medium text-danger-700">{error}</p>
      ) : null}
      {isLoading ? (
        <DataTableSkeleton columns={6} />
      ) : (
        <UsersTable
          users={students}
          title="Student roster"
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
