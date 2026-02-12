'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface PageHeaderProps {
  title: string
  icon: IconDefinition
  className?: string
}

const PageHeader = ({ title, icon, className = '' }: PageHeaderProps) => (
  <div className={`flex items-center gap-2 text-gray-700 ${className}`}>
    <FontAwesomeIcon icon={icon} className="text-lg text-gray-700" />
    <span className="text-base font-semibold">{title}</span>
  </div>
)

export default PageHeader
