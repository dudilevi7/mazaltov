'use client'

export interface CustomTableColumn<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface CustomTableProps<T> {
  columns: CustomTableColumn<T>[]
  data: T[]
  getRowKey: (item: T) => string | number
  emptyMessage?: string
  className?: string
}

const CustomTable = <T,>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'אין נתונים',
  className = '',
}: CustomTableProps<T>) => {
  return (
    <div className={`overflow-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-linear-to-b from-gray-50 to-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
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
