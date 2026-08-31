'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  header?: React.ReactNode
  actions?: React.ReactNode
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  overlayClassName?: string
}

const Modal = ({
  isOpen,
  onClose,
  children,
  className = '',
  header,
  actions,
  showCloseButton = true,
  closeOnBackdropClick = false,
  overlayClassName = '',
}: ModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${overlayClassName}`}
      onClick={closeOnBackdropClick ? onClose : undefined}>
      <div
        className={`relative w-full max-w-md rounded-lg bg-white shadow-xl animate-fade-in ${className} overflow-y-auto max-h-full`}
        onClick={closeOnBackdropClick ? (e) => e.stopPropagation() : undefined}>
        {header ? (
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex-1">
              {typeof header === 'string' ? <h2 className="text-lg font-semibold text-gray-900">{header}</h2> : header}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="cursor-pointer rounded-md text-gray-400 hover:text-gray-600 transition-colors p-1 ms-2"
                onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : (
          showCloseButton && (
            <button
              type="button"
              className="absolute top-3 left-3 cursor-pointer rounded-md text-gray-400 hover:text-gray-600 transition-colors p-1"
              onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          )
        )}

        {children}

        {actions && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4">{actions}</div>
        )}
      </div>
    </div>
  )
}

export default Modal
