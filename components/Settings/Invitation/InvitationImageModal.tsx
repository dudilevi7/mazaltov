'use client'

import type { InvitationImageModalProps } from './types'

const InvitationImageModal = ({ isOpen, onClose, imageUrl }: InvitationImageModalProps) => {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-800 transition hover:bg-white"
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        src={imageUrl}
        alt="Invitation"
        className="max-h-[90vh] max-w-full object-contain animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default InvitationImageModal
