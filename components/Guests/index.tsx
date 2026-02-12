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
import { faPlus, faSpinner, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import type { Guest } from '@/types/Guest'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import { importGuestsFromExcel } from './helper'

const Guests = () => {
  const { guests, addGuest, updateGuest, clearGuests, deleteGuest, setGuests } = useGuestsContext()
  const { languageDirection } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sideFilter, setSideFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isImportingExcel, setIsImportingExcel] = useState(false)

  const categoryOptions: SelectOption[] = useMemo(() => {
    const categories = Array.from(new Set(guests.map((g) => g.category.trim()).filter(Boolean)))
    return [{ value: 'all', label: 'הכל' }, ...categories.map((c) => ({ value: c, label: c }))]
  }, [guests])

  const filteredGuests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return guests.filter((g) => {
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        (g.category || '').toLowerCase().includes(q) ||
        (g.phoneNumber || '').includes(q)
      const matchSide = sideFilter === 'all' || g.side === sideFilter
      const matchStatus = statusFilter === 'all' || g.status === statusFilter
      const matchCategory = categoryFilter === 'all' || g.category === categoryFilter
      return matchSearch && matchSide && matchStatus && matchCategory
    })
  }, [guests, searchQuery, sideFilter, statusFilter, categoryFilter])

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

        <GuestsFilters
          sideFilter={sideFilter}
          onSideFilterChange={setSideFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categoryOptions={categoryOptions}
        />

        <div className="flex items-center gap-2">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="חיפוש אורח" />
          <CustomButton
            size={ButtonSize.SM}
            variant="red"
            onClick={() => setShowDeleteAllModal(true)}
            icon={<FontAwesomeIcon icon={faTrash} />}>
            מחק הכל
          </CustomButton>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <GuestsTable guests={filteredGuests} onEdit={openEdit} onDeleteGuest={handleDeleteGuest} />
        </div>
      </div>

      <GuestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        guest={editingGuest}
        existingGuests={guests}
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
