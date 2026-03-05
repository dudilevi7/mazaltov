'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'

interface CustomSlideoverProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

const CustomSlideover = ({ isOpen, onClose, title, children, className = '' }: CustomSlideoverProps) => {
  const { languageDirection } = useAppContext()
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`pointer-events-none fixed inset-y-0 right-0 flex max-w-full`}>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <Dialog.Panel className={`pointer-events-auto w-[50vw] phone:w-screen tablet:w-[50vw] ${className}`}>
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    {title && (
                      <div
                        className="flex items-center justify-between border-b border-gray-200 px-5 py-4"
                        dir={languageDirection}>
                        <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
                        <button
                          type="button"
                          className="cursor-pointer rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={onClose}>
                          <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1 px-5 py-4">{children}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CustomSlideover
