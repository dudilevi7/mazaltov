'use client'

import Modal from '@/components/Shared/Modal'
import type { InvitationImageModalProps } from './types'

const InvitationImageModal = ({ isOpen, onClose, imageUrl }: InvitationImageModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropClick
      showCloseButton={false}
      overlayClassName="bg-black/70! p-4"
      className="bg-transparent! shadow-none! rounded-none! max-w-none">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-800 transition hover:bg-white z-10"
        aria-label="Close">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        src={imageUrl}
        alt="Invitation"
        className="max-h-[90vh] max-w-full object-contain"
      />
    </Modal>
  )
}

export default InvitationImageModal
