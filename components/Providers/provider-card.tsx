'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPhone, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import type { Provider } from '@/types/Provider'
import { formatCurrency } from '@/lib/utils'
import { getMobileUrl, getWhatsappUrl } from './helper'
import { useMemo } from 'react'
import { useAppContext } from '@/context/AppContext'
import Tooltip from '../Tooltip'
import CustomButton, { ButtonSize } from '../Button/custom-button'

interface ProviderCardProps {
  provider: Provider
  onEdit: (provider: Provider) => void
  onDelete: (provider: Provider) => void
  onAddProviderTask: (provider: Provider) => void
}

const ProviderCard = ({ provider, onEdit, onDelete, onAddProviderTask }: ProviderCardProps) => {
  const { languageDirection } = useAppContext()
  const { name, phone, service, price, advancePayment, toBePaid, comments, paymentMethod } = provider

  const hasPhone = !!phone && phone.trim().length > 0
  const whatsappUrl = useMemo(() => getWhatsappUrl(phone || ''), [phone])
  const mobileUrl = useMemo(() => getMobileUrl(phone || ''), [phone])

  const paymentMethodLabel: Record<string, string> = {
    cash: 'מזומן',
    transfer: 'העברה',
    check: 'צ׳ק',
    other: 'אחר',
  }

  return (
    <div
      className={`flex flex-col justify-between rounded-lg bg-white p-4 border border-gray-200 animate-fade-in-0.5`}
      dir={languageDirection}>
      <div className="flex flex-col gap-1">
        <div className={`flex justify-between items-center mb-1`}>
          <div className="flex items-center gap-2" dir={languageDirection}>
            {!toBePaid && <span className="text-sm bg-green-500 text-white px-2 py-0.5 rounded-md">שולם</span>}
            <span className="text-lg font-semibold text-gray-800">{name}</span>
          </div>
          <span className="text-sm text-gray-500">{service}</span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>
            <div className="text-gray-500 text-xs">מחיר כולל</div>
            <div className="font-medium">{formatCurrency(price)}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">תשלום מקדמה</div>
            <div className="font-medium">{formatCurrency(advancePayment)}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">נותר לתשלום</div>
            <div className="font-medium">{formatCurrency(toBePaid)}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">אמצעי תשלום</div>
            <div className="font-medium">{paymentMethodLabel[paymentMethod] || paymentMethodLabel.other}</div>
          </div>
        </div>
        {comments && (
          <div className="flex flex-col mt-1">
            <span className="bg-gray-100 text-gray-500 text-xs px-1 py-0.5 rounded-md self-start">הערות</span>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{comments}</p>
          </div>
        )}
        <CustomButton
          size={ButtonSize.SM}
          variant="white"
          className={`mt-2 self-start bg-gray-100! hover:bg-blue-200! hover:text-blue-600!`}
          onClick={() => onAddProviderTask(provider)}
          icon={<FontAwesomeIcon icon={faPlus} />}>
          הוסף משימת ספק
        </CustomButton>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onDelete(provider)}
            className="cursor-pointer text-red-500 hover:text-red-600 transition-colors">
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(provider)}
            className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors">
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
        {hasPhone && (
          <div className="flex items-center gap-2">
            <Tooltip
              content="התקשר לספק"
              place="top"
              className="cursor-pointer text-gray-500 hover:text-green-600 transition-colors">
              <FontAwesomeIcon
                icon={faPhone}
                className="cursor-pointer text-gray-500 hover:text-green-600 transition-colors"
                onClick={() => window.open(mobileUrl, '_blank')}
              />
            </Tooltip>
            <a
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-green-500 hover:text-green-600 transition-colors"
              aria-label="שלח הודעת ווטסאפ"
              onClick={() => window.open(whatsappUrl, '_blank')}>
              <FontAwesomeIcon icon={faWhatsapp} scale={1.2} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProviderCard
