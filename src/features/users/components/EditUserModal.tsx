import { X } from "lucide-react";
import type { User } from "../../../types";
import UserForm from "./UserForm";

interface EditUserModalProps {
  open: boolean;
  user: User | null;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, "id" | "joined" | "photoUrl">) => void;
}

export function EditUserModal({
  open,
  user,
  isSaving,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-[16px]  md:text-xl font-semibold text-slate-950">
              Edit User
            </h2>
            <p className="mt-1 text-[12px]  md:text-sm text-slate-500">
              Update the user&apos;s profile information and access.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <UserForm mode="edit" initialData={user} onSubmit={onSubmit} />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 !text-[12px] md:text-sm bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              const form =
                document.querySelector<HTMLFormElement>("#edit-user-form");
              form?.requestSubmit();
            }}
            disabled={isSaving}
            className="rounded-full bg-indigo-600 px-4 py-2 !text-[12px] md:text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
