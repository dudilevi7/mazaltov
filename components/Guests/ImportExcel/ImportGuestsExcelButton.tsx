'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Modal from '@/components/Shared/Modal'
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

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnBackdropClick
        overlayClassName="animate-fade-in-0.5 overflow-y-auto"
        className="rounded-xl p-6 max-w-lg mx-4 max-h-[95vh] overflow-y-auto">
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
      </Modal>
    </>
  )
}

export default ImportGuestsExcelButton
