import { MAZALTOV_COLUMNS } from './importGuestsHelper'
import { assignColumn, type ColumnMap, type MazalTovFieldKey } from './customImportHelper'

interface CustomColumnMapProps {
  headers: string[]
  columnMap: ColumnMap
  onChange: (next: ColumnMap) => void
}

const CustomColumnMap = ({ headers, columnMap, onChange }: CustomColumnMapProps) => (
  <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pe-1">
    {headers.map((header) => (
      <label key={header} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <span className="truncate font-medium text-gray-800">{header}</span>
        <span className="text-gray-300">←</span>
        <select
          className="cursor-pointer rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-400"
          value={columnMap[header] ?? ''}
          onChange={(event) => onChange(assignColumn(columnMap, header, event.target.value as MazalTovFieldKey | ''))}>
          <option value="">לא לייבא</option>
          {MAZALTOV_COLUMNS.map((column) => (
            <option key={column.key} value={column.key}>
              {column.label}
            </option>
          ))}
        </select>
      </label>
    ))}
  </div>
)

export default CustomColumnMap
