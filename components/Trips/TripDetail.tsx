'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import type { AdditionalCost, Attraction, Flight, Hotel, Trip, TripTask } from '@/types/Trip'
import { LanguageDirection } from '@/types/General'
import { useAppContext } from '@/context/AppContext'
import { useTripsContext } from '@/context/TripsContext'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import ActionButton, { ActionButtonSize, ActionButtonVariant } from '@/components/Button/action-button'
import DeleteModal from '@/components/DeleteModal'
import { getTripCopy, SUGGESTED_TRIP_TASKS, TRIP_SECTION_META, TRIP_TYPE_META } from '@/constants/trips'
import {
  computeTripTotals,
  getOutboundForReturn,
  getPairedReturn,
  linkedFlightIds,
  newNestedId,
  sortAttractionsByDateAsc,
  sortAdditionalCostsByDateAsc,
  sortFlightsByDateAsc,
  sortHotelsByDateAsc,
} from './helper'
import TripCostSummary from './TripCostSummary'
import TripSection from './TripSection'
import FlightRow from './FlightRow'
import HotelRow from './HotelRow'
import AttractionRow from './AttractionRow'
import TaskRow from './TaskRow'
import FlightModal, { type FlightFormResult } from './FlightModal'
import HotelModal from './HotelModal'
import AttractionModal from './AttractionModal'
import TripTaskModal from './TripTaskModal'
import CostModal from './CostModal'
import CostRow from './CostRow'

interface TripDetailProps {
  trip: Trip
  onBack: () => void
  onEditTrip: () => void
  onDeleteTrip: () => void
}

const TripDetail = ({ trip, onBack, onEditTrip, onDeleteTrip }: TripDetailProps) => {
  const { languageDirection } = useAppContext()
  const { updateTrip } = useTripsContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const copy = getTripCopy(isRtl)
  const typeMeta = TRIP_TYPE_META[trip.tripType]
  const totals = computeTripTotals(trip)

  const [flightModalOpen, setFlightModalOpen] = useState(false)
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [editingReturnFlight, setEditingReturnFlight] = useState<Flight | null>(null)
  const [hotelModalOpen, setHotelModalOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [attractionModalOpen, setAttractionModalOpen] = useState(false)
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TripTask | null>(null)
  const [costModalOpen, setCostModalOpen] = useState(false)
  const [editingCost, setEditingCost] = useState<AdditionalCost | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{
    kind: 'flight' | 'hotel' | 'attraction' | 'task' | 'cost'
    id: string
    title: string
  } | null>(null)

  const section = (key: keyof typeof TRIP_SECTION_META) =>
    isRtl ? TRIP_SECTION_META[key].he : TRIP_SECTION_META[key].en

  const handleSaveFlight = (result: FlightFormResult) => {
    const outboundId = editingFlight?.isReturn
      ? (getOutboundForReturn(trip.flights, editingFlight)?.id ?? editingFlight.id)
      : (editingFlight?.id ?? newNestedId())
    const existingReturnId = editingFlight
      ? editingFlight.isReturn
        ? editingFlight.id
        : editingFlight.returnFlightId
      : undefined
    const returnId = result.returnFlight ? existingReturnId ?? newNestedId() : undefined

    const outbound: Flight = {
      ...result.outbound,
      id: outboundId,
      isReturn: false,
      returnFlightId: returnId,
      price: result.outbound.price,
    }
    const returnLeg: Flight | undefined = result.returnFlight
      ? { ...result.returnFlight, id: returnId as string, isReturn: true, price: 0, returnFlightId: outboundId }
      : undefined

    const replaceIds = linkedFlightIds(trip.flights, outboundId)
    if (existingReturnId) replaceIds.add(existingReturnId)
    const rest = trip.flights.filter((f) => !replaceIds.has(f.id))
    updateTrip(trip.id, { flights: returnLeg ? [...rest, outbound, returnLeg] : [...rest, outbound] })
    setFlightModalOpen(false)
    setEditingFlight(null)
    setEditingReturnFlight(null)
  }

  const openFlightEditor = (flight: Flight) => {
    const outbound = flight.isReturn ? getOutboundForReturn(trip.flights, flight) ?? flight : flight
    setEditingFlight(outbound)
    setEditingReturnFlight(getPairedReturn(trip.flights, outbound) ?? null)
    setFlightModalOpen(true)
  }

  const handleSaveCost = (cost: Omit<AdditionalCost, 'id'>) => {
    const additionalCosts = trip.additionalCosts ?? []
    if (editingCost) {
      updateTrip(trip.id, {
        additionalCosts: additionalCosts.map((c) => (c.id === editingCost.id ? { ...cost, id: c.id } : c)),
      })
    } else {
      updateTrip(trip.id, { additionalCosts: [...additionalCosts, { ...cost, id: newNestedId() }] })
    }
    setCostModalOpen(false)
    setEditingCost(null)
  }

  const handleSaveHotel = (hotel: Omit<Hotel, 'id'>) => {
    if (editingHotel) {
      updateTrip(trip.id, {
        hotels: trip.hotels.map((h) => (h.id === editingHotel.id ? { ...hotel, id: h.id } : h)),
      })
    } else {
      updateTrip(trip.id, { hotels: [...trip.hotels, { ...hotel, id: newNestedId() }] })
    }
    setHotelModalOpen(false)
    setEditingHotel(null)
  }

  const handleSaveAttraction = (attraction: Omit<Attraction, 'id'>) => {
    if (editingAttraction) {
      updateTrip(trip.id, {
        attractions: trip.attractions.map((a) =>
          a.id === editingAttraction.id ? { ...attraction, id: a.id } : a
        ),
      })
    } else {
      updateTrip(trip.id, { attractions: [...trip.attractions, { ...attraction, id: newNestedId() }] })
    }
    setAttractionModalOpen(false)
    setEditingAttraction(null)
  }

  const handleSaveTask = (task: Omit<TripTask, 'id'>) => {
    if (editingTask) {
      updateTrip(trip.id, {
        tasks: trip.tasks.map((t) => (t.id === editingTask.id ? { ...task, id: t.id } : t)),
      })
    } else {
      updateTrip(trip.id, { tasks: [...trip.tasks, { ...task, id: newNestedId() }] })
    }
    setTaskModalOpen(false)
    setEditingTask(null)
  }

  const handleAddSuggested = (templateId: string, title: string) => {
    if (trip.tasks.some((t) => t.templateId === templateId)) return
    updateTrip(trip.id, {
      tasks: [...trip.tasks, { id: newNestedId(), title, isDone: false, isSuggested: true, templateId }],
    })
  }

  const handleConfirmDelete = () => {
    if (!itemToDelete) return
    if (itemToDelete.kind === 'flight') {
      const ids = linkedFlightIds(trip.flights, itemToDelete.id)
      updateTrip(trip.id, { flights: trip.flights.filter((f) => !ids.has(f.id)) })
    } else if (itemToDelete.kind === 'hotel') {
      updateTrip(trip.id, { hotels: trip.hotels.filter((h) => h.id !== itemToDelete.id) })
    } else if (itemToDelete.kind === 'attraction') {
      updateTrip(trip.id, { attractions: trip.attractions.filter((a) => a.id !== itemToDelete.id) })
    } else if (itemToDelete.kind === 'cost') {
      updateTrip(trip.id, { additionalCosts: (trip.additionalCosts ?? []).filter((c) => c.id !== itemToDelete.id) })
    } else {
      updateTrip(trip.id, { tasks: trip.tasks.filter((t) => t.id !== itemToDelete.id) })
    }
    setItemToDelete(null)
  }

  const remainingSuggested = SUGGESTED_TRIP_TASKS.filter(
    (s) => !trip.tasks.some((t) => t.templateId === s.templateId)
  )
  const sortedFlights = sortFlightsByDateAsc(trip.flights)
  const sortedHotels = sortHotelsByDateAsc(trip.hotels)
  const sortedAttractions = sortAttractionsByDateAsc(trip.attractions)
  const sortedCosts = sortAdditionalCostsByDateAsc(trip.additionalCosts ?? [])

  return (
    <div className="flex flex-col gap-6 animate-fade-in-0.5" dir={languageDirection}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CustomButton
          variant="white"
          size={ButtonSize.SM}
          onClick={onBack}
          icon={<FontAwesomeIcon icon={languageDirection === LanguageDirection.HEB ? faChevronRight : faChevronLeft} />}>
          {copy.back}
        </CustomButton>
        <div className="flex items-center gap-0.5">
          <ActionButton
            icon={faPen}
            variant={ActionButtonVariant.EDIT}
            size={ActionButtonSize.SM}
            tooltip={copy.edit}
            onClick={onEditTrip}
          />
          <ActionButton
            icon={faTrash}
            variant={ActionButtonVariant.DELETE}
            size={ActionButtonSize.SM}
            tooltip={copy.delete}
            onClick={onDeleteTrip}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FontAwesomeIcon icon={typeMeta.icon} className={typeMeta.color} />
        <h1 className="text-lg font-semibold text-gray-800">{trip.name}</h1>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          {isRtl ? typeMeta.he : typeMeta.en}
        </span>
      </div>

      <TripCostSummary totals={totals} label={copy.totalCost} />

      <TripSection
        key={`flights-${trip.id}`}
        icon={TRIP_SECTION_META.flights.icon}
        title={section('flights')}
        count={trip.flights.length}
        onAdd={() => {
          setEditingFlight(null)
          setEditingReturnFlight(null)
          setFlightModalOpen(true)
        }}
        addLabel={copy.addFlight}>
        {sortedFlights.map((flight) => (
          <FlightRow
            key={flight.id}
            flight={flight}
            editLabel={copy.edit}
            deleteLabel={copy.delete}
            onEdit={() => openFlightEditor(flight)}
            onDelete={() =>
              setItemToDelete({ kind: 'flight', id: flight.id, title: flight.flightCompany || copy.addFlight })
            }
          />
        ))}
      </TripSection>

      <TripSection
        key={`hotels-${trip.id}`}
        icon={TRIP_SECTION_META.hotels.icon}
        title={section('hotels')}
        count={trip.hotels.length}
        onAdd={() => {
          setEditingHotel(null)
          setHotelModalOpen(true)
        }}
        addLabel={copy.addHotel}>
        {sortedHotels.map((hotel) => (
          <HotelRow
            key={hotel.id}
            hotel={hotel}
            editLabel={copy.edit}
            deleteLabel={copy.delete}
            bookingLabel={copy.bookingLink}
            onEdit={() => {
              setEditingHotel(hotel)
              setHotelModalOpen(true)
            }}
            onDelete={() => setItemToDelete({ kind: 'hotel', id: hotel.id, title: hotel.name })}
          />
        ))}
      </TripSection>

      <TripSection
        key={`attractions-${trip.id}`}
        icon={TRIP_SECTION_META.attractions.icon}
        title={section('attractions')}
        count={trip.attractions.length}
        onAdd={() => {
          setEditingAttraction(null)
          setAttractionModalOpen(true)
        }}
        addLabel={copy.addAttraction}>
        {sortedAttractions.map((attraction) => (
          <AttractionRow
            key={attraction.id}
            attraction={attraction}
            editLabel={copy.edit}
            deleteLabel={copy.delete}
            onEdit={() => {
              setEditingAttraction(attraction)
              setAttractionModalOpen(true)
            }}
            onDelete={() => setItemToDelete({ kind: 'attraction', id: attraction.id, title: attraction.name })}
          />
        ))}
      </TripSection>

      <TripSection
        key={`additional-costs-${trip.id}`}
        icon={TRIP_SECTION_META.additionalCosts.icon}
        title={section('additionalCosts')}
        count={(trip.additionalCosts ?? []).length}
        onAdd={() => {
          setEditingCost(null)
          setCostModalOpen(true)
        }}
        addLabel={copy.addCost}>
        {sortedCosts.map((cost) => (
          <CostRow
            key={cost.id}
            cost={cost}
            editLabel={copy.edit}
            deleteLabel={copy.delete}
            onEdit={() => {
              setEditingCost(cost)
              setCostModalOpen(true)
            }}
            onDelete={() => setItemToDelete({ kind: 'cost', id: cost.id, title: cost.name })}
          />
        ))}
      </TripSection>

      <TripSection
        key={`tasks-${trip.id}`}
        icon={TRIP_SECTION_META.tasks.icon}
        title={section('tasks')}
        count={trip.tasks.length}
        onAdd={() => {
          setEditingTask(null)
          setTaskModalOpen(true)
        }}
        addLabel={copy.addTask}
        headerExtra={
          remainingSuggested.length > 0 ? (
            <div className="mb-3">
              <p className="mb-2 text-sm text-gray-500">{copy.suggestedTasks}</p>
              <div className="flex flex-wrap gap-2">
                {remainingSuggested.map((s) => (
                  <button
                    key={s.templateId}
                    type="button"
                    onClick={() => handleAddSuggested(s.templateId, isRtl ? s.he : s.en)}
                    className="flex items-center gap-2 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                    <FontAwesomeIcon icon={s.icon} />
                    {isRtl ? s.he : s.en}
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
              updateTrip(
                trip.id,
                { tasks: trip.tasks.map((t) => (t.id === task.id ? { ...t, isDone: checked } : t)) },
                { silent: true }
              )
            }
            onEdit={() => {
              setEditingTask(task)
              setTaskModalOpen(true)
            }}
            onDelete={() => setItemToDelete({ kind: 'task', id: task.id, title: task.title })}
          />
        ))}
      </TripSection>

      {flightModalOpen && (
        <FlightModal
          isOpen={flightModalOpen}
          onClose={() => {
            setFlightModalOpen(false)
            setEditingFlight(null)
            setEditingReturnFlight(null)
          }}
          onSave={handleSaveFlight}
          flight={editingFlight}
          pairedReturn={editingReturnFlight}
          isRtl={isRtl}
        />
      )}
      {hotelModalOpen && (
        <HotelModal
          isOpen={hotelModalOpen}
          onClose={() => {
            setHotelModalOpen(false)
            setEditingHotel(null)
          }}
          onSave={handleSaveHotel}
          hotel={editingHotel}
          isRtl={isRtl}
        />
      )}
      {attractionModalOpen && (
        <AttractionModal
          isOpen={attractionModalOpen}
          onClose={() => {
            setAttractionModalOpen(false)
            setEditingAttraction(null)
          }}
          onSave={handleSaveAttraction}
          attraction={editingAttraction}
          isRtl={isRtl}
        />
      )}
      {taskModalOpen && (
        <TripTaskModal
          isOpen={taskModalOpen}
          onClose={() => {
            setTaskModalOpen(false)
            setEditingTask(null)
          }}
          onSave={handleSaveTask}
          task={editingTask}
          isRtl={isRtl}
        />
      )}
      {costModalOpen && (
        <CostModal
          isOpen={costModalOpen}
          onClose={() => {
            setCostModalOpen(false)
            setEditingCost(null)
          }}
          onSave={handleSaveCost}
          cost={editingCost}
          isRtl={isRtl}
        />
      )}
      <DeleteModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={itemToDelete?.title || ''}
      />
    </div>
  )
}

export default TripDetail
