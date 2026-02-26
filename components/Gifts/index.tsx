'use client'

import { useMemo, useState } from 'react'
import { useGiftsContext } from '@/context/GiftsContext'
import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import GiftsSummaryBar from './GiftsSummaryBar'
import GiftModal, { GiftFormData } from './GiftModal'
import GiftsFilters from './GiftsFilters'
import GiftsTable from './GiftsTable'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import type { Gift } from '@/types/Gift'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import { getSideOptions, getSideLabels } from '@/components/Guests/helper'

const Gifts = () => {
  const {
    addGift,
    updateGift,
    deleteGift,
    searchQuery,
    setSearchQuery,
    sideFilter,
    setSideFilter,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    filteredGifts,
    clearAllFilters,
    hasFiltersOrSearch,
    isLoadingGifts,
    gifts,
  } = useGiftsContext()
  const { guests } = useGuestsContext()
  const { languageDirection, eventSettings } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)

  const sideOptions = useMemo(() => getSideOptions(eventSettings), [eventSettings])
  const sideFilterOptions: SelectOption[] = useMemo(
    () => [{ value: 'all', label: 'הכל' }, ...sideOptions],
    [sideOptions]
  )
  const categoryOptions: SelectOption[] = useMemo(() => {
    const categories = Array.from(new Set(gifts.map((g) => g.guestCategory.trim()).filter(Boolean)))
    return [{ value: 'all', label: 'הכל' }, ...categories.map((c) => ({ value: c, label: c }))]
  }, [gifts])

  const openAdd = () => {
    setEditingGift(null)
    setIsModalOpen(true)
  }

  const openEdit = (gift: Gift) => {
    setEditingGift(gift)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingGift(null)
  }

  const handleSave = (data: GiftFormData) => {
    if (editingGift) {
      updateGift(editingGift.id, data)
    } else {
      addGift(data)
    }
    closeModal()
  }

  const handleDeleteGift = (gift: Gift) => {
    deleteGift(gift.id)
  }

  if (isLoadingGifts) {
    return <SpinnerLoader size="lg" isLoadingPage />
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-sans" dir={languageDirection}>
      <div className="flex flex-col gap-3 min-h-0 flex-1">
        <GiftsSummaryBar />

        <div className="flex items-center gap-2">
          <CustomButton size={ButtonSize.SM} onClick={openAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
            הוסף מתנה
          </CustomButton>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <GiftsFilters
            sideFilter={sideFilter}
            onSideFilterChange={setSideFilter}
            sideFilterOptions={sideFilterOptions}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categoryOptions={categoryOptions}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
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
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="חיפוש מתנה" />
          <span className="text-gray-500 text-sm ms-auto">{filteredGifts.length} מתנות</span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <GiftsTable
            gifts={filteredGifts}
            sideLabels={getSideLabels(eventSettings)}
            onEdit={openEdit}
            onDeleteGift={handleDeleteGift}
          />
        </div>
      </div>

      <GiftModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        gift={editingGift}
        guests={guests}
      />
    </div>
  )
}

export default Gifts
