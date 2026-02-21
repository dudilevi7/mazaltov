'use client'

import { useMemo, useState } from 'react'
import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import GuestsSummaryBar from './GuestsSummaryBar'
import GuestModal, { GuestFormData } from './GuestModal'
import GuestsFilters from './filters'
import GuestsTable from './GuestsTable'
import DeleteModal from '@/components/DeleteModal'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faSpinner,
  faTrash,
  faUpload,
  faFilterCircleXmark,
  faFileDownload,
} from '@fortawesome/free-solid-svg-icons'
import { GuestStatus, type Guest } from '@/types/Guest'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import { getSideOptions, getSideLabels, importGuestsFromExcel, exportToIplanTemplate } from './helper'
import { EventType } from '@/types/Settings'

const Guests = () => {
  const {
    guests,
    addGuest,
    updateGuest,
    clearGuests,
    deleteGuest,
    setGuests,
    searchQuery,
    setSearchQuery,
    sideFilter,
    setSideFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    filteredGuests,
    filteredGuestsByQuantityCount,
    filteredPhoneNumbersCount,
    clearAllFilters,
    hasFiltersOrSearch,
    isLoadingGuests,
  } = useGuestsContext()
  const { languageDirection, eventSettings } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [isImportingExcel, setIsImportingExcel] = useState(false)

  const guestSideByName = useMemo(() => {
    if (eventSettings.eventType === EventType.WEDDING && eventSettings.brideName && eventSettings.groomName) {
      return {
        [eventSettings.brideName as string]: 'כלה',
        [eventSettings.groomName as string]: 'חתן',
      }
    }
    return {
      [eventSettings.ownerName as string]: 'חתן',
    }
  }, [eventSettings])

  const sideOptions = useMemo(() => getSideOptions(eventSettings), [eventSettings])
  const sideFilterOptions: SelectOption[] = useMemo(
    () => [{ value: 'all', label: 'הכל' }, ...sideOptions],
    [sideOptions]
  )
  const categoryOptions: SelectOption[] = useMemo(() => {
    const categories = Array.from(new Set(guests.map((g) => g.category.trim()).filter(Boolean)))
    return [{ value: 'all', label: 'הכל' }, ...categories.map((c) => ({ value: c, label: c }))]
  }, [guests])

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

  const handleToggleManualApproval = (guest: Guest, value: boolean) => {
    updateGuest(guest.id, {
      ...guest,
      manualApproval: value,
      status: value ? GuestStatus.ACCEPTED : GuestStatus.PENDING,
    })
  }

  const handleImportGuestsFromExcel = async () => {
    setIsImportingExcel(true)
    const guests = await importGuestsFromExcel()
    setGuests(guests)
    setIsImportingExcel(false)
  }

  if (isLoadingGuests) {
    return <SpinnerLoader size="lg" isLoadingPage />
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-sans" dir={languageDirection}>
      <div className="flex flex-col gap-3 min-h-0 flex-1">
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
          <CustomButton
            size={ButtonSize.SM}
            className="bg-gray-700 hover:bg-gray-800 text-white"
            onClick={() => exportToIplanTemplate(guests, guestSideByName, eventSettings)}
            icon={<FontAwesomeIcon icon={faFileDownload} />}>
            ייצא ל IPlan
          </CustomButton>
          <CustomButton
            size={ButtonSize.SM}
            variant="red"
            onClick={() => setShowDeleteAllModal(true)}
            icon={<FontAwesomeIcon icon={faTrash} />}>
            מחק הכל
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

          <span className="text-gray-500 text-sm ms-auto">{filteredGuestsByQuantityCount} אורחים</span>
          {filteredPhoneNumbersCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm ms-auto">|</span>
              <span className="text-gray-500 text-sm ms-auto">{filteredPhoneNumbersCount} רשומות</span>
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <GuestsTable
            guests={filteredGuests}
            sideLabels={getSideLabels(eventSettings)}
            onEdit={openEdit}
            onDeleteGuest={handleDeleteGuest}
            onToggleManualApproval={handleToggleManualApproval}
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
