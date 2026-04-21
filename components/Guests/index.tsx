'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import GuestsSummaryBar from './GuestsSummaryBar'
import GuestModal, { GuestFormData } from './GuestModal'
import GuestsFilters from './filters'
import GuestsTable from './GuestsTable'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faFilterCircleXmark,
  faFileDownload,
  faChartPie,
} from '@fortawesome/free-solid-svg-icons'
import { GuestStatus, type Guest } from '@/types/Guest'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import { getSideOptions, getSideLabels, exportToIplanTemplate } from './helper'
import ImportGuestsExcelButton from './ImportExcel/ImportGuestsExcelButton'
import { EventType } from '@/types/Settings'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import fetchData, { METHODS } from '@/lib/fetchData'
import CustomSlideover from '@/components/Shared/CustomSlideover'
import GuestsStatistics from './GuestsStatistics'

const Guests = () => {
  const {
    guests,
    addGuest,
    updateGuest,
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
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false)
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null)

  const fetchInvitationUrl = useCallback(async () => {
    try {
      const res = await fetchData<void, { url?: string }>({
        url: `${API_URL}${API_ROUTES.INVITATION}`,
        method: METHODS.GET,
      })
      if (res?.url) setInvitationUrl(res.url)
    } catch {
      setInvitationUrl(null)
    }
  }, [])

  useEffect(() => {
    fetchInvitationUrl()
  }, [fetchInvitationUrl])

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

  const handleDeleteGuest = (guest: Guest) => {
    deleteGuest(guest.id)
  }

  const handleToggleManualApproval = (guest: Guest, value: boolean) => {
    updateGuest(guest.id, {
      ...guest,
      status: value ? GuestStatus.ACCEPTED : GuestStatus.PENDING,
    })
  }

  const handleStatusChange = (guest: Guest, status: GuestStatus) => {
    updateGuest(guest.id, { ...guest, status })
  }

  const handleNotesChange = (guest: Guest, notes: string) => {
    updateGuest(guest.id, { ...guest, notes: notes || undefined })
  }

  const handleApprovedChange = (guest: Guest, approved: number) => {
    updateGuest(guest.id, { ...guest, approved })
  }

  const handleBooleanFieldChange = (
    guest: Guest,
    field: 'vegan' | 'vegetarian' | 'glatKosher' | 'transportation',
    value: boolean
  ) => {
    updateGuest(guest.id, { ...guest, [field]: value })
  }

  if (isLoadingGuests) {
    return <SpinnerLoader size="lg" isLoadingPage />
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-sans" dir={languageDirection}>
      <div className="flex flex-col gap-3 min-h-0 flex-1">
        <GuestsSummaryBar />

        <div className="flex flex-wrap items-center gap-2">
          <CustomButton size={ButtonSize.SM} onClick={openAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
            הוסף אורח
          </CustomButton>
          <ImportGuestsExcelButton />
          <CustomButton
            size={ButtonSize.SM}
            className="bg-gray-700 hover:bg-gray-800 text-white"
            onClick={() => exportToIplanTemplate(guests, guestSideByName, eventSettings)}
            icon={<FontAwesomeIcon icon={faFileDownload} />}>
            ייצא ל IPlan
          </CustomButton>
          <CustomButton
            size={ButtonSize.SM}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={() => setIsStatisticsOpen(true)}
            icon={<FontAwesomeIcon icon={faChartPie} />}>
            סטטיסטיקות
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
            invitationUrl={invitationUrl}
            onEdit={openEdit}
            onDeleteGuest={handleDeleteGuest}
            onToggleManualApproval={handleToggleManualApproval}
            onStatusChange={handleStatusChange}
            onNotesChange={handleNotesChange}
            onApprovedChange={handleApprovedChange}
            onBooleanFieldChange={handleBooleanFieldChange}
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

      <CustomSlideover isOpen={isStatisticsOpen} onClose={() => setIsStatisticsOpen(false)} title="סטטיסטיקות אורחים">
        <GuestsStatistics />
      </CustomSlideover>
    </div>
  )
}

export default Guests
