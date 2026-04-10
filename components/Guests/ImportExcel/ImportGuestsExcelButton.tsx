'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import ImportFormatSelection from './ImportFormatSelection'
import MazalTovImportFlow from './MazalTovImportFlow'

enum ImportView {
  SELECT = 'select',
  MAZALTOV = 'mazaltov',
  CUSTOM = 'custom',
}

const ImportGuestsExcelButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<ImportView>(ImportView.SELECT)

  const handleClose = () => {
    setIsOpen(false)
    setView(ImportView.SELECT)
  }

  return (
    <>
      <CustomButton
        size={ButtonSize.SM}
        onClick={() => setIsOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white"
        icon={<FontAwesomeIcon icon={faUpload} />}>
        ייבא מאקסל
      </CustomButton>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in-0.5 overflow-y-auto"
          onClick={handleClose}>
          <div
            className="relative bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleClose}
              className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>

            {view === 'select' && (
              <ImportFormatSelection
                onSelectMazalTov={() => setView(ImportView.MAZALTOV)}
                onSelectCustom={() => setView(ImportView.CUSTOM)}
              />
            )}

            {view === 'mazaltov' && (
              <MazalTovImportFlow onBack={() => setView(ImportView.SELECT)} onClose={handleClose} />
            )}

            {view === 'custom' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-sm text-gray-500">מיפוי מותאם אישית - בקרוב</p>
                <CustomButton size={ButtonSize.SM} variant="white" onClick={() => setView(ImportView.SELECT)}>
                  חזרה
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ImportGuestsExcelButton
