import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-right-5">
      <div
        className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg border ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        )}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current hover:opacity-70"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
