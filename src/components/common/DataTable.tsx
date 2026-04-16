import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { TableColumn } from "../../types";
import { Card } from "../ui/Card";

interface DataTableProps<T> {
  title: string;
  rows: T[];
  columns: TableColumn<T>[];
  searchKey?: (item: T) => string;
}

export function DataTable<T>({
  title,
  rows,
  columns,
  searchKey,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!query || !searchKey) {
      return rows;
    }

    return rows.filter((item) =>
      searchKey(item).toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, rows, searchKey]);

  return (
    <Card className="overflow-hidden p-0 ">
      <div className="flex flex-col gap-3 border-b border-line-100  pt-0 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-[14px] font-medium text-ink-950">{title}</h3>
          <p className="text-[12px] text-ink-500">
            {filteredRows.length} records
          </p>
        </div>
        {searchKey ?
          <label className="flex items-center gap-2 rounded-lg border border-line-200 bg-soft px-3.5 py-2 text-sm text-ink-500">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="w-52 border-none bg-transparent outline-none placeholder:text-ink-500"
            />
          </label>
        : null}
      </div>
      <div className="max-h-[500px] overflow-y-auto overflow-x-auto no-scrollbar">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 bg-soft text-[12px] text-ink-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-5 py-3 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr
                key={index}
                className="border-t border-line-100 text-[12px] text-ink-900"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-5 py-3.5 align-middle"
                  >
                    {column.render ?
                      column.render(row)
                    : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
