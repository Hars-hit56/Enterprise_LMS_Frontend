import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { TableColumn } from '../../types'
import { Card } from '../ui/Card'

interface DataTableProps<T> {
  title: string
  rows: T[]
  columns: TableColumn<T>[]
  searchKey?: (item: T) => string
}

export function DataTable<T>({
  title,
  rows,
  columns,
  searchKey,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')

  const filteredRows = useMemo(() => {
    if (!query || !searchKey) {
      return rows
    }

    return rows.filter((item) =>
      searchKey(item).toLowerCase().includes(query.toLowerCase()),
    )
  }, [query, rows, searchKey])

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-4 border-b border-line-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-ink-950">{title}</h3>
          <p className="text-sm text-ink-500">{filteredRows.length} records</p>
        </div>
        {searchKey ? (
          <label className="flex items-center gap-2 rounded-2xl border border-line-200 bg-soft px-4 py-3 text-sm text-ink-500">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="w-52 border-none bg-transparent outline-none placeholder:text-ink-500"
            />
          </label>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-soft text-sm text-ink-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-6 py-4 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr key={index} className="border-t border-line-100 text-sm text-ink-900">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4 align-middle">
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
