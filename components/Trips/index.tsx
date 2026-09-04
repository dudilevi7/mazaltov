'use client'

import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlane, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { useTripsContext } from '@/context/TripsContext'
import { LanguageDirection } from '@/types/General'
import type { Trip } from '@/types/Trip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import DeleteModal from '@/components/DeleteModal'
import { getTripCopy, TRIP_TYPE_META } from '@/constants/trips'
import TripCard from './TripCard'
import TripDetail from './TripDetail'
import TripModal, { type TripFormData } from './TripModal'

const Trips = () => {
  const { languageDirection } = useAppContext()
  const { trips, isLoadingTrips, addTrip, updateTrip, deleteTrip } = useTripsContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const copy = getTripCopy(isRtl)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null)

  const selectedTrip = trips.find((t) => t.id === selectedTripId) ?? null

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return trips
    return trips.filter((trip) => {
      const typeLabel = isRtl ? TRIP_TYPE_META[trip.tripType].he : TRIP_TYPE_META[trip.tripType].en
      return trip.name.toLowerCase().includes(q) || typeLabel.toLowerCase().includes(q)
    })
  }, [trips, searchQuery, isRtl])

  const handleSaveTrip = async (data: TripFormData) => {
    if (editingTrip) {
      await updateTrip(editingTrip.id, data)
    } else {
      await addTrip({
        name: data.name,
        tripType: data.tripType,
        flights: [],
        hotels: [],
        attractions: [],
        tasks: [],
        additionalCosts: [],
      })
    }
    setIsModalOpen(false)
    setEditingTrip(null)
  }

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return
    const id = tripToDelete.id
    await deleteTrip(id)
    if (selectedTripId === id) setSelectedTripId(null)
    setTripToDelete(null)
  }

  if (isLoadingTrips) return <SpinnerLoader size="lg" isLoadingPage />

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden font-sans animate-fade-in" dir={languageDirection}>
      {selectedTrip ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <TripDetail
            trip={selectedTrip}
            onBack={() => setSelectedTripId(null)}
            onEditTrip={() => {
              setEditingTrip(selectedTrip)
              setIsModalOpen(true)
            }}
            onDeleteTrip={() => setTripToDelete(selectedTrip)}
          />
        </div>
      ) : (
        <>
          <div className="mb-4 flex shrink-0 flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <CustomButton
                size={ButtonSize.SM}
                onClick={() => {
                  setEditingTrip(null)
                  setIsModalOpen(true)
                }}>
                <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                {copy.addTrip}
              </CustomButton>
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={copy.search} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-gray-100 p-6 text-center text-gray-500">
              <FontAwesomeIcon icon={faPlane} className="h-10 w-10 text-gray-400" />
              <span className="text-sm font-medium">{copy.emptyList}</span>
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto lg:grid-cols-2">
              {filtered.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onOpen={(t) => setSelectedTripId(t.id)}
                  onEdit={(t) => {
                    setEditingTrip(t)
                    setIsModalOpen(true)
                  }}
                  onDelete={setTripToDelete}
                  editLabel={copy.edit}
                  deleteLabel={copy.delete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <TripModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTrip(null)
          }}
          onSave={handleSaveTrip}
          trip={editingTrip}
          isRtl={isRtl}
        />
      )}
      <DeleteModal
        isOpen={!!tripToDelete}
        onClose={() => setTripToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={tripToDelete?.name || ''}
      />
    </div>
  )
}

export default Trips
