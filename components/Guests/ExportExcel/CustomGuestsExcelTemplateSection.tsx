'use client'

import type { RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faUpload, faSpinner, faDownload, faCheck } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'

interface CustomGuestsExcelTemplateSectionProps {
  mapByTemplate: boolean
  onMapByTemplateChange: (checked: boolean) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  templateLoading: boolean
  templateReady: boolean
  templateBuffer: ArrayBuffer | null
  templateError: string | null
  templateFileName: string | null
  templateMatchCount: number
  onTemplateFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDownloadBlankTemplate: () => void
  onExportFilledTemplate: () => void
}

const CustomGuestsExcelTemplateSection = ({
  mapByTemplate,
  onMapByTemplateChange,
  fileInputRef,
  templateLoading,
  templateReady,
  templateBuffer,
  templateError,
  templateFileName,
  templateMatchCount,
  onTemplateFileChange,
  onDownloadBlankTemplate,
  onExportFilledTemplate,
}: CustomGuestsExcelTemplateSectionProps) => {
  const { languageDirection } = useAppContext()

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5">
      <div className="flex items-start gap-2.5 select-none">
        <input
          id="guest-excel-template-map"
          type="checkbox"
          checked={mapByTemplate}
          onChange={(e) => onMapByTemplateChange(e.target.checked)}
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
                        <span className="font-semibold">{languageDirection === LanguageDirection.HEB ? '←' : '→'}</span>
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
              onChange={onTemplateFileChange}
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
              {templateReady && !templateLoading && templateBuffer && (
                <CustomButton
                  size={ButtonSize.SM}
                  onClick={onExportFilledTemplate}
                  className="bg-green-600 hover:bg-green-700 border border-green-500 text-white"
                  icon={<FontAwesomeIcon icon={faDownload} />}>
                  הורדה
                </CustomButton>
              )}
            </div>
          </div>
          {templateError && <p className="text-xs text-red-600">{templateError}</p>}
          {templateReady && templateFileName && !templateError && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-emerald-700" />
              <p className="text-xs text-emerald-700">
                הותאם &quot;{templateFileName}&quot; — נמצאו {templateMatchCount} עמודות לפי המיפוי
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CustomGuestsExcelTemplateSection
