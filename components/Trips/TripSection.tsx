'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import CollapsibleContainer from '@/components/Shared/CollapsibleContainer'

interface TripSectionProps {
  icon: IconDefinition
  title: string
  count: number
  onAdd: () => void
  addLabel: string
  children: React.ReactNode
  headerExtra?: React.ReactNode
  emptyMessage?: string
}

const TripSection = ({ icon, title, count, onAdd, addLabel, children, headerExtra, emptyMessage }: TripSectionProps) => {
  const [isOpen, setIsOpen] = useState(count > 0 || !!emptyMessage)
  const prevCount = useRef(count)

  useEffect(() => {
    if (prevCount.current === 0 && count > 0) setIsOpen(true)
    prevCount.current = count
  }, [count])

  useEffect(() => {
    if (emptyMessage && count === 0) setIsOpen(true)
  }, [emptyMessage, count])

  return (
    <CollapsibleContainer
      count={count}
      open={isOpen}
      onOpenChange={setIsOpen}
      title={
        <>
          <FontAwesomeIcon icon={icon} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </>
      }
      actions={
        <CustomButton size={ButtonSize.SM} onClick={onAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
          {addLabel}
        </CustomButton>
      }
      showZeroCount={!!emptyMessage && count === 0}>
      {headerExtra || count > 0 || emptyMessage ? (
        <>
          {headerExtra}
          {count > 0 ? (
            <div className="flex flex-col gap-2">{children}</div>
          ) : emptyMessage ? (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          ) : null}
        </>
      ) : null}
    </CollapsibleContainer>
  )
}

export default TripSection
