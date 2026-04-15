'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faCircleInfo, faTableColumns, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Modal from '@/components/Shared/Modal'
import Logo from '@/components/AppHeader/Logo'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'
import Card, { CardVariant } from '@/components/Shared/Card'
import CustomGuestsFields from './CustomGuestsFields'
import { exportGuestsToExcel } from '../helper'
import type { Guest } from '@/types/Guest'

type ModalView = 'select' | 'custom'

interface GuestsExportExcelButtonProps {
  guests: Guest[]
  columns: { key: keyof Guest; label: string }[]
  sideLabels: Record<string, string>
}

const GuestsExportExcelButton = ({ guests, columns, sideLabels }: GuestsExportExcelButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<ModalView>('select')

  const handleClose = () => {
    setIsOpen(false)
    setView('select')
  }

  const handleMazalTovExport = () => {
    exportGuestsToExcel(guests, columns, sideLabels)
    handleClose()
  }

  return (
    <>
      <CustomButton
        size={ButtonSize.SM}
        variant="white"
        onClick={() => setIsOpen(true)}
        icon={<FontAwesomeIcon icon={faFileExcel} className="text-green-600" />}>
        ייצוא לאקסל
      </CustomButton>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnBackdropClick
        overlayClassName="animate-fade-in-0.5 overflow-y-auto"
        className="rounded-xl p-6 max-w-lg mx-4 max-h-[95vh] overflow-y-auto">
        {view === 'select' ? (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 text-center">ייצוא אורחים לאקסל</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    variant={CardVariant.GRADIENT}
                    onClick={handleMazalTovExport}
                    className="flex flex-col items-center justify-center gap-3 min-h-[160px]">
                    <Logo className="group-hover:*:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-white transition-colors">
                      פורמט MazalTov
                    </span>
                  </Card>

                  <Card
                    variant={CardVariant.GRADIENT}
                    onClick={() => setView('custom')}
                    className="flex flex-col items-center justify-center gap-3 min-h-[160px]">
                    <FontAwesomeIcon
                      icon={faTableColumns}
                      className="text-blue-500 text-2xl group-hover:text-white transition-colors"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-600 group-hover:text-white transition-colors">
                        מיפוי מותאם אישית
                      </span>
                      <Tooltip
                        place={TooltipPlace.TOP}
                        contentClassName="whitespace-normal w-max max-w-[min(17rem,calc(100vw-2rem))] px-3.5 py-3"
                        content={
                          <div className="flex flex-col gap-2.5 text-right" dir="rtl">
                            <span className="text-sm font-semibold text-white leading-snug">מיפוי לאקסל לפי שדות</span>
                            <span className="block rounded-md bg-white/10 px-2.5 py-2 text-xs font-bold leading-relaxed text-sky-200 ring-1 ring-white/15">
                              *ממולץ למערכות אחרות כמו מערכות הושבה/אישורי הגעה.
                            </span>
                          </div>
                        }>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          className="text-gray-400 text-xs group-hover:text-white/80 transition-colors"
                        />
                      </Tooltip>
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-5  overflow-y-auto">
                  <button
                    onClick={() => setView('select')}
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                  <h2 className="text-lg font-bold text-gray-800">מיפוי שדות מותאם אישית</h2>
                </div>
                <CustomGuestsFields columns={columns} guests={guests} sideLabels={sideLabels} onClose={handleClose} />
              </>
            )}
      </Modal>
    </>
  )
}

export default GuestsExportExcelButton
