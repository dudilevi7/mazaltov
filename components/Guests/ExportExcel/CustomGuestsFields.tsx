'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import {
  exportGuestsCustomExcel,
  validateGuestTemplateUpload,
  exportGuestsFilledUploadedTemplate,
  downloadGuestsExcelTemplate,
} from '../helper'
import type { Guest } from '@/types/Guest'
import { templateParseErrorHebrew } from './guestExportExcelMessages'
import GuestFieldMappingList, { type FieldMapping } from './GuestFieldMappingList'
import CustomGuestsExcelTemplateSection from './CustomGuestsExcelTemplateSection'

interface CustomGuestsFieldsProps {
  columns: { key: keyof Guest; label: string }[]
  guests: Guest[]
  sideLabels: Record<string, string>
  onClose: () => void
}

const CustomGuestsFields = ({ columns, guests, sideLabels, onClose }: CustomGuestsFieldsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mapByTemplate, setMapByTemplate] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [templateReady, setTemplateReady] = useState(false)
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null)
  const [templateFileName, setTemplateFileName] = useState<string | null>(null)
  const [templateMatchCount, setTemplateMatchCount] = useState(0)
  const [templateMatched, setTemplateMatched] = useState<string[]>([])
  const [templateUnmatched, setTemplateUnmatched] = useState<string[]>([])
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
    setTemplateMatched([])
    setTemplateUnmatched([])
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
      const { matchCount, matched, unmatched } = validateGuestTemplateUpload(buf, columns, fieldMap)
      setTemplateBuffer(buf)
      setTemplateMatchCount(matchCount)
      setTemplateMatched(matched)
      setTemplateUnmatched(unmatched)
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
      const { matchCount, matched, unmatched } = validateGuestTemplateUpload(templateBuffer, columns, fieldMap)
      setTemplateMatchCount(matchCount)
      setTemplateMatched(matched)
      setTemplateUnmatched(unmatched)
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

  const handleExportFilledTemplate = () => {
    if (!templateBuffer || templateLoading || !templateReady) return
    try {
      exportGuestsFilledUploadedTemplate(templateBuffer, guests, columns, fieldMap, sideLabels, templateFileName)
      onClose()
    } catch (err) {
      const code = err instanceof Error ? err.message : ''
      setTemplateError(templateParseErrorHebrew(code))
    }
  }

  const effectiveColumnsForBlankTemplate = columns.map((c) => ({
    key: c.key,
    label: fieldMap[c.key].customLabel.trim() || c.label,
  }))

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      <CustomGuestsExcelTemplateSection
        mapByTemplate={mapByTemplate}
        onMapByTemplateChange={handleMapByTemplateChange}
        fileInputRef={fileInputRef}
        templateLoading={templateLoading}
        templateReady={templateReady}
        templateBuffer={templateBuffer}
        templateError={templateError}
        templateFileName={templateFileName}
        templateMatchCount={templateMatchCount}
        templateMatched={templateMatched}
        templateUnmatched={templateUnmatched}
        onTemplateFileChange={handleTemplateFile}
        onDownloadBlankTemplate={() => downloadGuestsExcelTemplate(effectiveColumnsForBlankTemplate)}
        onExportFilledTemplate={handleExportFilledTemplate}
      />

      <GuestFieldMappingList
        columns={columns}
        fieldMap={fieldMap}
        onLabelChange={handleLabelChange}
        onToggleIgnore={handleToggleIgnore}
      />

      {!mapByTemplate && (
        <CustomButton
          size={ButtonSize.MD}
          onClick={handleExport}
          className="w-full justify-center mt-2"
          icon={<FontAwesomeIcon icon={faDownload} />}>
          הורדה
        </CustomButton>
      )}
    </div>
  )
}

export default CustomGuestsFields
