import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RowActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
};

export function RowActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: RowActionsProps) {
  if (!onEdit && !onDelete) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close when clicked outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* 3 dots button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-soft"
      >
        <MoreHorizontal size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-10  w-30 rounded-lg border border-line-200 bg-white shadow-lg p-1">
          {onEdit && (
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-2 py-2 text-left text-sm hover:bg-soft rounded-lg"
            >
              <Pencil size={14} />
              {editLabel}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-2 py-2 text-left text-sm text-red-500 hover:bg-soft"
            >
              <Trash2 size={14} />
              {deleteLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
