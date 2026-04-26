'use client'

export interface CustomTableColumn<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface CustomTableProps<T> {
  columns: CustomTableColumn<T>[]
  data: T[]
  getRowKey: (item: T) => string | number
  emptyMessage?: string
  className?: string
  sortKey?: string | null
  sortDir?: 'asc' | 'desc' | null
  onSort?: (key: string) => void
}

const SortArrow = ({ dir }: { dir: 'asc' | 'desc' | null }) => (
  <span
    className="inline-flex items-center ms-1"
    style={{
      opacity: dir ? 1 : 0,
      transform: dir === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)',
      transition: 'transform 200ms ease, opacity 150ms ease',
    }}>
    ▲
  </span>
)

const CustomTable = <T,>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'אין נתונים',
  className = '',
  sortKey = null,
  sortDir = null,
  onSort,
}: CustomTableProps<T>) => {
  return (
    <div className={`overflow-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-linear-to-b from-gray-50 to-gray-100">
          <tr>
            {columns.map((col) => {
              const isActive = col.sortable && sortKey === col.key
              return (
                <th
                  key={col.key}
                  scope="col"
                  onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                  className={`px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider select-none ${
                    col.sortable ? 'cursor-pointer hover:text-gray-900' : ''
                  }`}>
                  <span className="inline-flex items-center gap-0.5">
                    {col.label}
                    {col.sortable && <SortArrow dir={isActive ? (sortDir ?? null) : null} />}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={getRowKey(item)} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-sm text-gray-900">
                    {col.render ? col.render(item) : ((item as Record<string, unknown>)[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable
