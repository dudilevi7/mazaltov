'use client'

import { useEffect, useState } from 'react'
import type { Guest } from '@/types/Guest'
import { getWhatsAppUrl } from '../helper'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import Modal from '@/components/Shared/Modal'
import { getDefaultEventManualMessage } from './helper'

export interface WhatsAppInvitationModalProps {
  isOpen: boolean
  onClose: () => void
  guest: Guest | null
  invitationUrl: string | null
}

const WhatsAppInvitationModal = ({ isOpen, onClose, guest, invitationUrl }: WhatsAppInvitationModalProps) => {
  const { languageDirection, eventSettings } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const defaultEventManualMessage = getDefaultEventManualMessage(eventSettings, isRtl)
  const [message, setMessage] = useState(defaultEventManualMessage)
  const [attachInvitation, setAttachInvitation] = useState(true)

  useEffect(() => {
    if (isOpen && guest?.name) {
      setAttachInvitation(!!invitationUrl)
    }
  }, [isOpen, guest?.name, invitationUrl, isRtl])

  const canSend = !!guest?.phoneNumber?.trim()
  const finalMessage = [message.trim(), attachInvitation && invitationUrl ? invitationUrl : '']
    .filter(Boolean)
    .join('\n\n')

  const whatsappHref = canSend ? getWhatsAppUrl(guest?.phoneNumber ?? '', finalMessage) : undefined

  const handleSend = () => {
    if (whatsappHref) window.open(whatsappHref, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-6"
      overlayClassName="p-4"
      closeOnBackdropClick
      header={isRtl ? 'שליחת הודעה בוואטסאפ' : 'Send WhatsApp message'}>
        {guest && (
          <p className="mb-3 text-sm text-gray-600">
            {isRtl ? 'אל' : 'To'}: <span className="font-medium">{guest.name}</span>
            {guest.phoneNumber && <span className="text-gray-500"> ({guest.phoneNumber})</span>}
          </p>
        )}
        {!canSend && guest && (
          <p className="mb-3 text-sm text-amber-600" role="alert">
            {isRtl ? 'לא הוגדר מספר טלפון לאורח זה' : 'No phone number for this guest'}
          </p>
        )}
        <div className="mb-4">
          <label htmlFor="whatsapp-message" className="mb-1 block text-sm font-medium text-gray-700">
            {isRtl ? 'הודעה' : 'Message'}
          </label>
          <textarea
            id="whatsapp-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder={isRtl ? 'כתוב את ההודעה...' : 'Type your message...'}
          />
        </div>
        {invitationUrl && (
          <label className="mb-4 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={attachInvitation}
              onChange={(e) => setAttachInvitation(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">{isRtl ? 'צרף את הזמנת האירוע' : 'Attach event invitation'}</span>
          </label>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <CustomButton size={ButtonSize.SM} variant="white" onClick={onClose}>
            {isRtl ? 'ביטול' : 'Cancel'}
          </CustomButton>
          <CustomButton
            size={ButtonSize.SM}
            onClick={handleSend}
            disabled={!canSend}
            className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            icon={<FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />}>
            {isRtl ? 'פתח בוואטסאפ' : 'Open in WhatsApp'}
          </CustomButton>
        </div>
    </Modal>
  )
}

export default WhatsAppInvitationModal
