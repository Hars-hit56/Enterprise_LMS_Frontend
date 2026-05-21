import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/Button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loadingLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loadingLabel,
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-sm rounded-lg border border-line-200 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-danger-100 text-danger-700">
              <AlertTriangle size={18} />
            </span>
            <h2
              id="confirm-modal-title"
              className="text-[15px] font-semibold text-ink-950"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md p-1 text-ink-500 transition hover:bg-line-100 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-ink-600">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 shadow-none hover:bg-red-700"
          >
            {isLoading ? (loadingLabel ?? `${confirmLabel}...`) : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
