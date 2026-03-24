'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEyeSlash,
  faEye,
  faArrowLeftLong,
  faDownload,
  faCircleInfo,
  faUpload,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'
import {
  exportGuestsCustomExcel,
  validateGuestTemplateUpload,
  exportGuestsFilledUploadedTemplate,
  downloadGuestsExcelTemplate,
} from '../helper'
import type { Guest } from '@/types/Guest'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'

interface FieldMapping {
  customLabel: string
  ignored: boolean
}

interface CustomGuestsFieldsProps {
  columns: { key: keyof Guest; label: string }[]
  guests: Guest[]
  sideLabels: Record<string, string>
  onClose: () => void
}

const templateParseErrorHebrew = (code: string): string => {
  if (code === 'NO_MATCHES') {
    return 'לא נמצאו עמודות שתואמות למיפוי. ודאו ששורת הכותרת בתבנית זהה לטקסט בעמודה הימנית (למשל שם מלא → שם מלא).'
  }
  if (code === 'EMPTY_SHEET') return 'גיליון ריק או לא תקין.'
  return 'לא ניתן לקרוא את הקובץ.'
}

const CustomGuestsFields = ({ columns, guests, sideLabels, onClose }: CustomGuestsFieldsProps) => {
  const { languageDirection } = useAppContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mapByTemplate, setMapByTemplate] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [templateReady, setTemplateReady] = useState(false)
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null)
  const [templateFileName, setTemplateFileName] = useState<string | null>(null)
  const [templateMatchCount, setTemplateMatchCount] = useState(0)
  const [templateError, setTemplateError] = useState<string | null>(null)

  const [fieldMap, setFieldMap] = useState<Record<string, FieldMapping>>(() => {
    const initial: Record<string, FieldMapping> = {}
    columns.forEach((col) => {
      initial[col.key] = { customLabel: '', ignored: false }
    })
    return initial
  })

  const resetTemplateState = () => {
    setTemplateReady(false)
    setTemplateBuffer(null)
    setTemplateFileName(null)
    setTemplateMatchCount(0)
    setTemplateError(null)
  }

  const handleMapByTemplateChange = (checked: boolean) => {
    setMapByTemplate(checked)
    resetTemplateState()
  }

  const handleTemplateFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setTemplateError(null)
    setTemplateLoading(true)
    setTemplateReady(false)
    setTemplateBuffer(null)
    try {
      const buf = await file.arrayBuffer()
      const { matchCount } = validateGuestTemplateUpload(buf, columns, fieldMap)
      setTemplateBuffer(buf)
      setTemplateMatchCount(matchCount)
      setTemplateFileName(file.name)
      setTemplateReady(true)
    } catch (err) {
      resetTemplateState()
      const code = err instanceof Error ? err.message : ''
      setTemplateError(templateParseErrorHebrew(code))
    } finally {
      setTemplateLoading(false)
    }
  }

  const handleLabelChange = (key: string, value: string) => {
    setFieldMap((prev) => ({ ...prev, [key]: { ...prev[key], customLabel: value } }))
  }

  const handleToggleIgnore = (key: string) => {
    setFieldMap((prev) => ({ ...prev, [key]: { ...prev[key], ignored: !prev[key].ignored } }))
  }

  useEffect(() => {
    if (!mapByTemplate || !templateBuffer) return
    try {
      const { matchCount } = validateGuestTemplateUpload(templateBuffer, columns, fieldMap)
      setTemplateMatchCount(matchCount)
      setTemplateError(null)
      setTemplateReady(true)
    } catch {
      setTemplateError(templateParseErrorHebrew('NO_MATCHES'))
      setTemplateReady(false)
    }
  }, [fieldMap, columns, mapByTemplate, templateBuffer])

  const handleExport = () => {
    const mappedColumns = columns
      .filter((col) => !fieldMap[col.key].ignored)
      .map((col) => ({
        key: col.key,
        customLabel: fieldMap[col.key].customLabel.trim() || col.label,
      }))
    exportGuestsCustomExcel(guests, mappedColumns, sideLabels)
    onClose()
  }

  const handleExportByTemplate = () => {
    if (mapByTemplate) {
      if (!templateBuffer || templateLoading || !templateReady) return
      try {
        exportGuestsFilledUploadedTemplate(templateBuffer, guests, columns, fieldMap, sideLabels, templateFileName)
        onClose()
      } catch (err) {
        const code = err instanceof Error ? err.message : ''
        setTemplateError(templateParseErrorHebrew(code))
      }
      return
    }
  }

  const effectiveColumnsForBlankTemplate = columns.map((c) => ({
    key: c.key,
    label: fieldMap[c.key].customLabel.trim() || c.label,
  }))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5">
        <div className="flex items-start gap-2.5 select-none">
          <input
            id="guest-excel-template-map"
            type="checkbox"
            checked={mapByTemplate}
            onChange={(e) => handleMapByTemplateChange(e.target.checked)}
            className="mt-1 size-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            <label htmlFor="guest-excel-template-map" className="text-sm font-medium text-gray-800 cursor-pointer">
              מילוי לפי תבנית אקסל שהועלתה
            </label>
            <Tooltip
              place={TooltipPlace.BOTTOM}
              contentClassName="whitespace-normal w-max px-3.5 py-3 text-right"
              content={
                <div className="flex flex-col gap-2" dir="rtl">
                  <span>המיפוי לעמודות חייב להתאים לשמות העמודות בתבנית שסיפקתם.</span>
                  <div className="flex flex-col gap-1 border rounded-md bg-white/90 p-3 shadow-sm w-full max-w-xs mx-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-100 rounded px-2 py-0.5">
                        שם העמודה בתבנית: קבוצה (חובה)
                      </span>
                      <span className="mx-1 text-gray-400">
                        {languageDirection === LanguageDirection.HEB ? '←' : '→'}
                      </span>
                      <span className="text-xs text-emerald-700 bg-emerald-100 rounded px-2 py-0.5 w-60">
                        שם העמודה במיפוי:
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">קירבה</span>
                          <span className="font-semibold">
                            {languageDirection === LanguageDirection.HEB ? '←' : '→'}
                          </span>
                          קבוצה (חובה)
                        </div>
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-500 leading-snug">
                    חשוב! למפות בדיוק לפי השדות שקיימים. מה שלא קיים בעמודות בתבנית להסיר.
                  </span>
                </div>
              }>
              <span className="inline-flex text-gray-400 hover:text-gray-600 transition-colors cursor-help">
                <FontAwesomeIcon icon={faCircleInfo} className="text-sm" />
              </span>
            </Tooltip>
          </div>
        </div>

        {mapByTemplate && (
          <div className="flex flex-col gap-2 ps-7 border-t border-gray-200/80 pt-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                className="hidden"
                onChange={handleTemplateFile}
              />
              <div className="flex items-center justify-center gap-2">
                <CustomButton
                  size={ButtonSize.SM}
                  variant="white"
                  type="button"
                  disabled={templateLoading}
                  onClick={() => fileInputRef.current?.click()}
                  icon={
                    templateLoading ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    ) : (
                      <FontAwesomeIcon icon={faUpload} />
                    )
                  }>
                  {templateLoading ? 'טוען…' : 'העלה תבנית'}
                </CustomButton>
                {mapByTemplate && templateReady && !templateLoading && templateBuffer && (
                  <CustomButton
                    size={ButtonSize.SM}
                    onClick={handleExportByTemplate}
                    className="bg-green-600 hover:bg-green-700 border border-green-500 text-white"
                    icon={<FontAwesomeIcon icon={faDownload} />}>
                    הורדה
                  </CustomButton>
                )}
              </div>
            </div>
            {templateError && <p className="text-xs text-red-600">{templateError}</p>}
            {templateReady && templateFileName && !templateError && (
              <p className="text-xs text-emerald-700">
                הותאם &quot;{templateFileName}&quot; — נמצאו {templateMatchCount} עמודות לפי המיפוי (שורת נתונים מתחילה
                מתחת לכותרות).
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pe-1">
        {columns.map((col) => {
          const mapping = fieldMap[col.key]
          const isIgnored = mapping.ignored

          return (
            <div
              key={col.key}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                isIgnored ? 'border-gray-100 bg-gray-50 opacity-50' : 'border-gray-200 bg-white hover:border-blue-200'
              }`}>
              <span
                className={`text-sm font-medium min-w-[80px] ${
                  isIgnored ? 'line-through text-gray-400' : 'text-gray-700'
                }`}>
                {col.label}
              </span>

              <FontAwesomeIcon icon={faArrowLeftLong} className="text-gray-300 text-xs" />

              <input
                type="text"
                value={mapping.customLabel}
                onChange={(e) => handleLabelChange(col.key, e.target.value)}
                placeholder={col.label}
                disabled={isIgnored}
                className={`flex-1 text-sm border rounded-md px-2.5 py-1.5 outline-none transition-all ${
                  isIgnored
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100'
                }`}
              />

              <button
                type="button"
                onClick={() => handleToggleIgnore(col.key)}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  isIgnored
                    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                }`}>
                <FontAwesomeIcon icon={isIgnored ? faEye : faEyeSlash} className="text-sm" />
              </button>
            </div>
          )
        })}
      </div>

      <CustomButton
        size={ButtonSize.MD}
        onClick={handleExport}
        className="w-full justify-center mt-2"
        icon={<FontAwesomeIcon icon={faDownload} />}>
        הורדה
      </CustomButton>
    </div>
  )
}

export default CustomGuestsFields
