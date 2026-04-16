import { UsersTable } from "../components/UsersTable";
import { useUsers } from "../hooks/useUsers";

export function StudentsPage() {
  const { users } = useUsers();
  const students = users.filter((user) => user.role === "student");

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
      <UsersTable users={students} title="Student roster" />
    </section>
  );
}
