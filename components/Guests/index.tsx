'use client'

import { useMemo, useState } from 'react'
import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import GuestsSummaryBar from './GuestsSummaryBar'
import GuestModal, { GuestFormData } from './GuestModal'
import GuestsFilters from './filters'
import GuestsTable from './GuestsTable'
import DeleteModal from '@/components/DeleteModal'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSpinner, faTrash, faUpload, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import type { Guest } from '@/types/Guest'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import { getSideOptions, getSideLabels, importGuestsFromExcel } from './helper'

const Guests = () => {
  const { guests, addGuest, updateGuest, clearGuests, deleteGuest, setGuests } = useGuestsContext()
  const { languageDirection, eventSettings } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sideFilter, setSideFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isImportingExcel, setIsImportingExcel] = useState(false)

  const clearAllFilters = () => {
    setSideFilter('all')
    setStatusFilter('all')
    setCategoryFilter('all')
    setSearchQuery('')
  }

  const sideOptions = useMemo(() => getSideOptions(eventSettings), [eventSettings])
  const sideFilterOptions: SelectOption[] = useMemo(
    () => [{ value: 'all', label: 'הכל' }, ...sideOptions],
    [sideOptions]
  )
  const categoryOptions: SelectOption[] = useMemo(() => {
    const categories = Array.from(new Set(guests.map((g) => g.category.trim()).filter(Boolean)))
    return [{ value: 'all', label: 'הכל' }, ...categories.map((c) => ({ value: c, label: c }))]
  }, [guests])

  const filteredGuests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return guests.filter((guest) => {
      const matchSearch =
        !q ||
        guest.name.toLowerCase().includes(q) ||
        (guest.category || '').toLowerCase().includes(q) ||
        (guest.phoneNumber || '').includes(q)
      const matchSide = sideFilter === 'all' || guest.side === sideFilter
      const matchStatus = statusFilter === 'all' || guest.status === statusFilter
      const matchCategory = categoryFilter === 'all' || guest.category === categoryFilter
      return matchSearch && matchSide && matchStatus && matchCategory
    })
  }, [guests, searchQuery, sideFilter, statusFilter, categoryFilter])

  const filteredGuestsByQuantityCount = useMemo(
    () => filteredGuests.reduce((sum, guest) => sum + guest.quantity, 0),
    [filteredGuests]
  )

  const hasFiltersOrSearch =
    searchQuery.trim() !== '' || sideFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all'

  const openAdd = () => {
    setEditingGuest(null)
    setIsModalOpen(true)
  }

  const openEdit = (guest: Guest) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingGuest(null)
  }

  const handleSave = (data: GuestFormData) => {
    if (editingGuest) {
      updateGuest(editingGuest.id, data)
    } else {
      addGuest(data)
    }
    closeModal()
  }

  const handleConfirmDeleteAll = () => {
    clearGuests()
    setShowDeleteAllModal(false)
  }

  const handleDeleteGuest = (guest: Guest) => {
    deleteGuest(guest.id)
  }

  const handleImportGuestsFromExcel = async () => {
    setIsImportingExcel(true)
    const guests = await importGuestsFromExcel()
    setGuests(guests)
    setIsImportingExcel(false)
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-sans" dir={languageDirection}>
      <div className="flex flex-col gap-4 min-h-0 flex-1">
        <GuestsSummaryBar />

        <div className="flex items-center gap-2">
          <CustomButton size={ButtonSize.SM} onClick={openAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
            הוסף אורח
          </CustomButton>
          <CustomButton
            size={ButtonSize.SM}
            onClick={handleImportGuestsFromExcel}
            className="bg-green-600 hover:bg-green-700 text-white"
            icon={
              <FontAwesomeIcon
                icon={isImportingExcel ? faSpinner : faUpload}
                className={isImportingExcel ? 'animate-spin' : ''}
              />
            }>
            ייבא מאקסל{' '}
          </CustomButton>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <GuestsFilters
            sideFilter={sideFilter}
            onSideFilterChange={setSideFilter}
            sideFilterOptions={sideFilterOptions}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categoryOptions={categoryOptions}
          />
          {hasFiltersOrSearch && (
            <CustomButton
              size={ButtonSize.SM}
              variant="white"
              onClick={clearAllFilters}
              icon={<FontAwesomeIcon icon={faFilterCircleXmark} />}
              className="border border-gray-300 hover:border-gray-400 ms-2">
              נקה מסננים
            </CustomButton>
          )}
        </div>

        <div className="flex items-center gap-2 w-full">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="חיפוש אורח" />
          <CustomButton
            size={ButtonSize.SM}
            variant="red"
            onClick={() => setShowDeleteAllModal(true)}
            icon={<FontAwesomeIcon icon={faTrash} />}>
            מחק הכל
          </CustomButton>
          {hasFiltersOrSearch && (
            <span className="text-gray-500 text-sm ms-auto">{filteredGuestsByQuantityCount} אורחים</span>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <GuestsTable
            guests={filteredGuests}
            sideLabels={getSideLabels(eventSettings)}
            onEdit={openEdit}
            onDeleteGuest={handleDeleteGuest}
          />
        </div>
      </div>

      <GuestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        guest={editingGuest}
        existingGuests={guests}
        sideOptions={sideOptions}
      />

      <DeleteModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={handleConfirmDeleteAll}
        title="כל האורחים"
      />
    </div>
  )
}

export default Guests
