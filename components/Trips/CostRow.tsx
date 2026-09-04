'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import type { AdditionalCost } from '@/types/Trip'
import { formatTripCost, formatTripDate } from './helper'
import TripItemActions from './TripItemActions'

interface CostRowProps {
  cost: AdditionalCost
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}

const CostRow = ({ cost, onEdit, onDelete, editLabel, deleteLabel }: CostRowProps) => (
  <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3">
    <FontAwesomeIcon icon={faMoneyBill} className="shrink-0 text-gray-500" />
    <div className="min-w-0 flex-1">
      <span className="font-medium text-gray-900">{cost.name}</span>
      <div className="text-sm text-gray-500">
        {cost.date ? formatTripDate(cost.date) : ''}
        {cost.description ? `${cost.date ? ' · ' : ''}${cost.description}` : ''}
      </div>
    </div>
    {cost.price > 0 && (
      <span className="shrink-0 text-sm font-medium text-gray-700">{formatTripCost(cost.price, cost.currency)}</span>
    )}
    <TripItemActions onEdit={onEdit} onDelete={onDelete} editLabel={editLabel} deleteLabel={deleteLabel} />
  </div>
)

export default CostRow
