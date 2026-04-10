'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableColumns, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import Logo from '@/components/AppHeader/Logo'
import Card, { CardVariant } from '@/components/Shared/Card'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'

interface ImportFormatSelectionProps {
  onSelectMazalTov: () => void
  onSelectCustom: () => void
}

const ImportFormatSelection = ({ onSelectMazalTov, onSelectCustom }: ImportFormatSelectionProps) => (
  <>
    <h2 className="text-lg font-bold text-gray-800 mb-5 text-center">ייבוא אורחים מאקסל</h2>
    <div className="grid grid-cols-2 gap-4">
      <Card
        variant={CardVariant.GRADIENT}
        onClick={onSelectMazalTov}
        className="flex flex-col items-center justify-center gap-3 min-h-[160px]">
        <Logo className="group-hover:*:text-white transition-colors" />
        <span className="text-sm font-medium text-gray-600 group-hover:text-white transition-colors">
          פורמט MazalTov
        </span>
      </Card>

      <Card
        variant={CardVariant.GRADIENT}
        onClick={onSelectCustom}
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
              <span className="text-sm text-white leading-snug" dir="rtl">
                ייבוא מאקסל עם מיפוי עמודות מותאם אישית
              </span>
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
)

export default ImportFormatSelection
