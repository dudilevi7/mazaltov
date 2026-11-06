'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Modal from '@/components/Shared/Modal'
import ImportFormatSelection from './ImportFormatSelection'
import MazalTovImportFlow from './MazalTovImportFlow'
import CustomImportFlow from './CustomImportFlow'
import useEventGate from '@/hooks/useEventGate'

enum ImportView {
  SELECT = 'select',
  MAZALTOV = 'mazaltov',
  CUSTOM = 'custom',
}

const ImportGuestsExcelButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<ImportView>(ImportView.SELECT)
  const { canCreate, gateTooltip } = useEventGate()

  const handleClose = () => {
    setIsOpen(false)
    setView(ImportView.SELECT)
  }

  return (
    <>
      <CustomButton
        size={ButtonSize.SM}
        onClick={() => setIsOpen(true)}
        disabled={!canCreate}
        tooltip={gateTooltip}
        className="bg-green-600 hover:bg-green-700 text-white"
        icon={<FontAwesomeIcon icon={faUpload} />}>
        ייבא מאקסל
      </CustomButton>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnBackdropClick
        overlayClassName="animate-fade-in-0.5 overflow-y-auto"
        className={`mx-4 max-h-[95vh] overflow-y-auto rounded-xl p-6 ${view === ImportView.CUSTOM ? 'max-w-2xl' : 'max-w-lg'}`}>
        {view === 'select' && (
              <ImportFormatSelection
                onSelectMazalTov={() => setView(ImportView.MAZALTOV)}
                onSelectCustom={() => setView(ImportView.CUSTOM)}
              />
            )}

            {view === 'mazaltov' && (
              <MazalTovImportFlow onBack={() => setView(ImportView.SELECT)} onClose={handleClose} />
            )}

            {view === 'custom' && <CustomImportFlow onBack={() => setView(ImportView.SELECT)} onClose={handleClose} />}
      </Modal>
    </>
  )
}

export default ImportGuestsExcelButton
