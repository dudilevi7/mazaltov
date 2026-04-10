'use client'

import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDownload,
  faUpload,
  faSpinner,
  faFloppyDisk,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import ImportGuestsPreview from './ImportGuestsPreview'
import {
  downloadMazalTovTemplate,
  readFileAsArrayBuffer,
  parseMazalTovExcel,
  saveImportedGuests,
  MAZALTOV_COLUMNS,
  type ParsedImportGuest,
  type ImportRowError,
} from './importGuestsHelper'
import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import { ToastType } from '@/types/Toast'

interface MazalTovImportFlowProps {
  onBack: () => void
  onClose: () => void
}

const MazalTovImportFlow = ({ onBack, onClose }: MazalTovImportFlowProps) => {
  const { guests, setGuests } = useGuestsContext()
  const { showToast } = useAppContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [parsedGuests, setParsedGuests] = useState<ParsedImportGuest[]>([])
  const [errors, setErrors] = useState<ImportRowError[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setUploading(true)
    setParsedGuests([])
    setErrors([])

    try {
      const buffer = await readFileAsArrayBuffer(file)
      const result = parseMazalTovExcel(buffer)
      setParsedGuests(result.guests)
      setErrors(result.errors)
    } catch {
      setErrors([{ row: 0, message: 'שגיאה בקריאת הקובץ. ודאו שהקובץ בפורמט Excel תקין.' }])
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (parsedGuests.length === 0) return
    setSaving(true)
    try {
      const created = await saveImportedGuests(parsedGuests)
      setGuests([...guests, ...created])
      showToast({
        type: ToastType.SUCCESS,
        title: 'הצלחה',
        message: `${created.length} אורחים יובאו בהצלחה`,
      })
      onClose()
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: 'שגיאה',
        message: 'שגיאה בשמירת האורחים. נסו שוב.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">ייבוא בפורמט MazalTov</h2>
      </div>

      <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-800 leading-relaxed" dir="rtl">
        <p className="font-medium mb-1">תבנית עם השדות שקיימים במערכת, מלאו:</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {MAZALTOV_COLUMNS.map((col) => (
            <span
              key={col.key}
              className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
              {col.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CustomButton
          size={ButtonSize.SM}
          variant="white"
          onClick={downloadMazalTovTemplate}
          icon={<FontAwesomeIcon icon={faDownload} />}>
          הורד תבנית ריקה
        </CustomButton>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
        <CustomButton
          size={ButtonSize.SM}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          icon={
            <FontAwesomeIcon
              icon={uploading ? faSpinner : faUpload}
              className={uploading ? 'animate-spin' : ''}
            />
          }>
          {uploading ? 'טוען...' : 'העלה קובץ אקסל'}
        </CustomButton>
      </div>

      {fileName && !uploading && (
        <p className="text-xs text-gray-500">
          קובץ: <span className="font-medium">{fileName}</span>
        </p>
      )}

      {(parsedGuests.length > 0 || errors.length > 0) && !uploading && (
        <ImportGuestsPreview guests={parsedGuests} errors={errors} />
      )}

      {parsedGuests.length > 0 && !uploading && (
        <CustomButton
          size={ButtonSize.MD}
          onClick={handleSave}
          disabled={saving}
          icon={
            <FontAwesomeIcon
              icon={saving ? faSpinner : faFloppyDisk}
              className={saving ? 'animate-spin' : ''}
            />
          }>
          {saving ? 'שומר...' : `שמור ${parsedGuests.length} אורחים`}
        </CustomButton>
      )}
    </div>
  )
}

export default MazalTovImportFlow
