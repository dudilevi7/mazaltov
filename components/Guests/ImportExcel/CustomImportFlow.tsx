'use client'

import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faFloppyDisk, faSpinner, faUpload } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { useAppContext } from '@/context/AppContext'
import { useGuestsContext } from '@/context/GuestsContext'
import { ToastType } from '@/types/Toast'
import ImportGuestsPreview from './ImportGuestsPreview'
import CustomColumnMap from './CustomColumnMap'
import { readFileAsArrayBuffer, saveImportedGuests, type ImportRowError, type ParsedImportGuest } from './importGuestsHelper'
import { guessColumnMap, parseMappedRows, readSheetRows, type ColumnMap } from './customImportHelper'

interface CustomImportFlowProps {
  onBack: () => void
  onClose: () => void
}

const STEPS = [
  'השאירו את הקובץ כמו שהוא. השורה הראשונה היא שמות העמודות שלכם.',
  'העלו את הקובץ, ולכל עמודה בחרו את השדה ב-MazalTov, או «לא לייבא».',
  'שם הוא חובה. כמות בלי מספר תיחשב 1. טלפון, צד, קבוצה והערות נכנסים רק אם מיפיתם אותם.',
  'בדקו את התצוגה המקדימה, ואז שמרו.',
]

const CustomImportFlow = ({ onBack, onClose }: CustomImportFlowProps) => {
  const { guests, setGuests } = useGuestsContext()
  const { showToast } = useAppContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [columnMap, setColumnMap] = useState<ColumnMap>({})
  const [parsedGuests, setParsedGuests] = useState<ParsedImportGuest[]>([])
  const [errors, setErrors] = useState<ImportRowError[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setParsedGuests([])
    setErrors([])
    try {
      const buffer = await readFileAsArrayBuffer(file)
      const sheet = readSheetRows(buffer)
      setFileName(file.name)
      setHeaders(sheet.headers)
      setRows(sheet.rows)
      setColumnMap(guessColumnMap(sheet.headers))
      if (sheet.headers.length === 0) setErrors([{ row: 0, message: 'לא נמצאו עמודות בקובץ' }])
    } catch {
      setErrors([{ row: 0, message: 'שגיאה בקריאת הקובץ. ודאו שהקובץ בפורמט Excel תקין.' }])
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handlePreview = () => {
    const result = parseMappedRows(rows, columnMap)
    setParsedGuests(result.guests)
    setErrors(
      result.guests.length === 0 && result.errors.length === 0
        ? [{ row: 0, message: 'אין שורות נתונים בקובץ' }]
        : result.errors
    )
  }

  const handleSave = async () => {
    if (parsedGuests.length === 0) return
    setSaving(true)
    try {
      const created = await saveImportedGuests(parsedGuests)
      setGuests([...guests, ...created])
      showToast({ type: ToastType.SUCCESS, title: 'הצלחה', message: `${created.length} אורחים יובאו בהצלחה` })
      onClose()
    } catch {
      showToast({ type: ToastType.ERROR, title: 'שגיאה', message: 'שגיאה בשמירת האורחים. נסו שוב.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onBack} className="cursor-pointer text-gray-400 hover:text-gray-600">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">מיפוי מותאם אישית</h2>
      </div>
      <ol className="flex flex-col gap-1 rounded-lg bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900">
        {STEPS.map((step, index) => (
          <li key={step}>
            {index + 1}. {step}
          </li>
        ))}
      </ol>
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
      <CustomButton
        size={ButtonSize.SM}
        className="w-fit bg-green-600 text-white hover:bg-green-700"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        icon={<FontAwesomeIcon icon={uploading ? faSpinner : faUpload} className={uploading ? 'animate-spin' : ''} />}>
        {uploading ? 'טוען...' : 'העלה קובץ אקסל'}
      </CustomButton>
      {fileName && <p className="text-xs text-gray-500">קובץ: {fileName}</p>}
      {headers.length > 0 && <CustomColumnMap headers={headers} columnMap={columnMap} onChange={setColumnMap} />}
      {headers.length > 0 && (
        <CustomButton size={ButtonSize.SM} variant="white" onClick={handlePreview}>
          הצג תצוגה מקדימה
        </CustomButton>
      )}
      {(parsedGuests.length > 0 || errors.length > 0) && <ImportGuestsPreview guests={parsedGuests} errors={errors} />}
      {parsedGuests.length > 0 && (
        <CustomButton
          size={ButtonSize.MD}
          onClick={handleSave}
          disabled={saving}
          icon={<FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} className={saving ? 'animate-spin' : ''} />}>
          {saving ? 'שומר...' : `שמור ${parsedGuests.length} אורחים`}
        </CustomButton>
      )}
    </div>
  )
}

export default CustomImportFlow
