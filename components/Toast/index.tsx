'use client'

import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { ToastType } from '@/types/Toast'

const TOAST_CONFIG: Record<ToastType, { icon: typeof faInfo; bgClass: string; iconClass: string }> = {
  [ToastType.INFO]: {
    icon: faInfo,
    bgClass: 'bg-linear-to-r from-blue-400 to-blue-500 border-none shadow-md shadow-blue-500 ',
    iconClass: 'text-white',
  },
  [ToastType.SUCCESS]: {
    icon: faCheck,
    bgClass: 'bg-linear-to-r from-green-400 to-green-500 border-none shadow-md shadow-green-500 ',
    iconClass: 'text-white',
  },
  [ToastType.ERROR]: {
    icon: faXmark,
    bgClass: 'bg-linear-to-r from-red-400 to-red-500 border-none shadow-md shadow-red-500 ',
    iconClass: 'text-white',
  },
}

const DEFAULT_DURATION = 4000

const Toast = () => {
  const { toast, hideToast, languageDirection } = useAppContext()

  useEffect(() => {
    if (!toast) return
    const duration = toast.duration ?? DEFAULT_DURATION
    const timer = setTimeout(hideToast, duration)
    return () => clearTimeout(timer)
  }, [toast, hideToast])

  if (!toast) return null

  const config = TOAST_CONFIG[toast.type]

  return (
    <div
      className={`fixed left-1/2 top-4 z-100 w-full max-w-md -translate-x-1/2
         animate-fade-in-0.5 rounded-lg border px-4 py-3 shadow-lg transition-all ${config.bgClass}`}
      role="alert"
      dir={languageDirection}>
      <div className="flex items-start gap-3">
        <FontAwesomeIcon icon={config.icon} className={`mt-1 shrink-0 ${config.iconClass}`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{toast.title}</p>
          {toast.message && <p className="mt-0.5 text-sm text-gray-600">{toast.message}</p>}
        </div>
        <button
          type="button"
          onClick={hideToast}
          className="shrink-0 text-gray-800 transition-colors hover:text-gray-600 cursor-pointer"
          aria-label="Close">
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast
