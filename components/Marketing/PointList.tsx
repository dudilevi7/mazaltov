import { splitPoint } from './helper'

interface PointListProps {
  points: string[]
}

const NOTE_MARK = ' — '

const PointList = ({ points }: PointListProps) => {
  const detailed = points.some((point) => point.includes(NOTE_MARK))
  if (detailed) {
    return (
      <ul className="mt-3 divide-y divide-gray-100">
        {points.map((point) => {
          const { label, note } = splitPoint(point)
          return (
            <li key={point} className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
              <span className="font-medium text-gray-900">{label}</span>
              {note && <span className="text-xs text-gray-500">{note}</span>}
            </li>
          )
        })}
      </ul>
    )
  }
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {points.map((point) => (
        <li key={point} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
          {point}
        </li>
      ))}
    </ul>
  )
}

export default PointList
