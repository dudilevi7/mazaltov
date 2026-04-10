'use client'

import type { ParsedImportGuest, ImportRowError } from './importGuestsHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

interface ImportGuestsPreviewProps {
  guests: ParsedImportGuest[]
  errors: ImportRowError[]
}

const ImportGuestsPreview = ({ guests, errors }: ImportGuestsPreviewProps) => (
  <div className="flex flex-col gap-3">
    {guests.length > 0 && (
      <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
        <FontAwesomeIcon icon={faCircleCheck} />
        <span className="font-medium">{guests.length} אורחים נקראו בהצלחה</span>
      </div>
    )}

    {errors.length > 0 && (
      <div className="flex flex-col gap-1.5 bg-red-50 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-sm text-red-700 font-medium">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <span>{errors.length} שגיאות</span>
        </div>
        <ul className="flex flex-col gap-0.5 max-h-32 overflow-y-auto">
          {errors.map((err, i) => (
            <li key={i} className="text-xs text-red-600">
              {err.message}
            </li>
          ))}
        </ul>
      </div>
    )}

    {guests.length > 0 && (
      <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">#</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">שם</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">טלפון</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">כמות</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">צד</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">קבוצה</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/50">
                <td className="px-2 py-1 text-gray-400">{i + 1}</td>
                <td className="px-2 py-1 text-gray-800">{g.name}</td>
                <td className="px-2 py-1 text-gray-600" dir="ltr">
                  {g.phoneNumber || '-'}
                </td>
                <td className="px-2 py-1 text-gray-600">{g.quantity}</td>
                <td className="px-2 py-1 text-gray-600">{g.side || '-'}</td>
                <td className="px-2 py-1 text-gray-600">{g.category || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

export default ImportGuestsPreview
