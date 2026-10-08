'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Trip, TripTask } from '@/types/Trip'
import { useTripsContext } from '@/context/TripsContext'
import DeleteModal from '@/components/DeleteModal'
import { getTripCopy, SUGGESTED_TRIP_TASKS, TRIP_SECTION_META } from '@/constants/trips'
import { newNestedId } from './helper'
import TaskRow from './TaskRow'
import TripTaskModal from './TripTaskModal'
import TripSection, { sectionTitle } from './TripSection'

const TripTasks = ({ trip, isRtl }: { trip: Trip; isRtl: boolean }) => {
  const { updateTrip } = useTripsContext()
  const copy = getTripCopy(isRtl)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TripTask | null>(null)
  const [toDelete, setToDelete] = useState<TripTask | null>(null)
  const remainingSuggested = SUGGESTED_TRIP_TASKS.filter((item) => !trip.tasks.some((task) => task.templateId === item.templateId))

  const handleSave = (task: Omit<TripTask, 'id'>) => {
    if (editing) {
      updateTrip(trip.id, { tasks: trip.tasks.map((item) => (item.id === editing.id ? { ...task, id: item.id } : item)) })
    } else {
      updateTrip(trip.id, { tasks: [...trip.tasks, { ...task, id: newNestedId() }] })
    }
    setOpen(false)
    setEditing(null)
  }

  const addSuggested = (templateId: string, title: string) => {
    if (trip.tasks.some((task) => task.templateId === templateId)) return
    updateTrip(trip.id, { tasks: [...trip.tasks, { id: newNestedId(), title, isDone: false, isSuggested: true, templateId }] })
  }

  return (
    <>
      <TripSection
        icon={TRIP_SECTION_META.tasks.icon}
        title={sectionTitle('tasks', isRtl)}
        count={trip.tasks.length}
        onAdd={() => {
          setEditing(null)
          setOpen(true)
        }}
        addLabel={copy.addTask}
        headerExtra={
          remainingSuggested.length > 0 ? (
            <div className="mb-3">
              <p className="mb-2 text-sm text-gray-500">{copy.suggestedTasks}</p>
              <div className="flex flex-wrap gap-2">
                {remainingSuggested.map((item) => (
                  <button
                    key={item.templateId}
                    type="button"
                    onClick={() => addSuggested(item.templateId, isRtl ? item.he : item.en)}
                    className="flex items-center gap-2 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                    <FontAwesomeIcon icon={item.icon} />
                    {isRtl ? item.he : item.en}
                  </button>
                ))}
              </div>
            </div>
          ) : null
        }>
        {trip.tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            editLabel={copy.edit}
            deleteLabel={copy.delete}
            onToggle={(checked) =>
              updateTrip(trip.id, { tasks: trip.tasks.map((item) => (item.id === task.id ? { ...item, isDone: checked } : item)) }, { silent: true })
            }
            onEdit={() => {
              setEditing(task)
              setOpen(true)
            }}
            onDelete={() => setToDelete(task)}
          />
        ))}
      </TripSection>
      {open && (
        <TripTaskModal
          isOpen={open}
          onClose={() => {
            setOpen(false)
            setEditing(null)
          }}
          onSave={handleSave}
          task={editing}
          isRtl={isRtl}
        />
      )}
      <DeleteModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return
          updateTrip(trip.id, { tasks: trip.tasks.filter((task) => task.id !== toDelete.id) })
          setToDelete(null)
        }}
        title={toDelete?.title || ''}
      />
    </>
  )
}

export default TripTasks
