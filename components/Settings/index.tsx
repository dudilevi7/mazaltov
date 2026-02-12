'use client'

import { ChangeEvent } from 'react'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { EventType } from '@/types/Settings'
import SelectDropdownWithCustomOption from '@/components/Shared/SelectDropdownWithCustomOption'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faUser, faUserGroup, faLanguage, faBuilding } from '@fortawesome/free-solid-svg-icons'
import { faFlagUsa, faStarOfDavid } from '@fortawesome/free-solid-svg-icons'
import { EVENT_TYPE_OPTIONS, LANGUAGE_OPTIONS } from './helper'

const Settings = () => {
  const { languageDirection, setLanguageDirection, eventSettings, updateEventSettings } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB

  const handleEventTypeChange = (value: string) => {
    const nextType = value as EventType | '__custom__'
    if (nextType === '__custom__') {
      updateEventSettings({
        eventType: EventType.CUSTOM,
      })
    } else {
      updateEventSettings({
        eventType: nextType as EventType,
      })
    }
  }

  const handleCustomEventTypeChange = (value: string) => {
    updateEventSettings({
      customEventType: value,
    })
  }
  const handleOwnerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateEventSettings({
      ownerName: e.target.value,
    })
  }
  const handleBrideNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateEventSettings({
      brideName: e.target.value,
    })
  }

  const handleGroomNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateEventSettings({
      groomName: e.target.value,
    })
  }

  const handleEventHallChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateEventSettings({
      ...eventSettings,
      eventHall: e.target.value,
    })
  }

  const handleEventDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateEventSettings({
      ...eventSettings,
      eventDate: e.target.value,
    })
  }

  const handleLanguageChange = (value: string) => {
    const dir = value as LanguageDirection
    setLanguageDirection(dir)
  }

  const isWedding = eventSettings.eventType === EventType.WEDDING

  return (
    <div className="flex w-full flex-col font-sans" dir={languageDirection}>
      <div className="flex flex-col gap-6">
        <section className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
          <div className="mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faHeart} className="text-pink-500" />
            <h2 className="text-base font-semibold text-gray-800">{isRtl ? 'סוג אירוע' : 'Event Type'}</h2>
          </div>
          <SelectDropdownWithCustomOption
            value={eventSettings.eventType === EventType.CUSTOM ? '__custom__' : eventSettings.eventType}
            onValueChange={handleEventTypeChange}
            customValue={eventSettings.customEventType || ''}
            onCustomValueChange={handleCustomEventTypeChange}
            options={EVENT_TYPE_OPTIONS}
            customOptionLabel={isRtl ? 'אחר' : 'Custom'}
            placeholder={isRtl ? 'בחר סוג אירוע' : 'Select event type'}
          />
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
          <div className="mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={isWedding ? faUserGroup : faUser} className="text-green-500" />
            <h2 className="text-base font-semibold text-gray-800">{isRtl ? 'בעלי שמחה' : 'Event Owners'}</h2>
          </div>

          {isWedding ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600" dir={languageDirection}>
                  {isRtl ? 'שם הכלה' : 'Bride name'}
                </label>
                <input
                  type="text"
                  value={eventSettings.brideName || ''}
                  onChange={handleBrideNameChange}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder={isRtl ? 'הכנס שם כלה' : 'Enter bride name'}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600" dir={languageDirection}>
                  {isRtl ? 'שם החתן' : 'Groom name'}
                </label>
                <input
                  type="text"
                  value={eventSettings.groomName || ''}
                  onChange={handleGroomNameChange}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder={isRtl ? 'הכנס שם חתן' : 'Enter groom name'}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600" dir={languageDirection}>
                {isRtl ? 'שם בעל השמחה' : 'Owner name'}
              </label>
              <input
                type="text"
                value={eventSettings.ownerName || ''}
                onChange={handleOwnerNameChange}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder={isRtl ? 'הכנס שם בעל שמחה' : 'Enter owner name'}
              />
            </div>
          )}
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
          <div className="mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className="text-amber-500" />
            <h2 className="text-base font-semibold text-gray-800">{isRtl ? 'פרטי אירוע' : 'Event Details'}</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600" dir={languageDirection}>
                {isRtl ? 'אולם' : 'Event hall'}
              </label>
              <input
                type="text"
                value={eventSettings.eventHall || ''}
                onChange={handleEventHallChange}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder={isRtl ? 'הכנס שם אולם' : 'Enter hall name'}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600" dir={languageDirection}>
                {isRtl ? 'תאריך אירוע' : 'Event date'}
              </label>
              <input
                type="date"
                value={eventSettings.eventDate || ''}
                onChange={handleEventDateChange}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
          <div className="mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faLanguage} className="text-purple-500" />
            <h2 className="text-base font-semibold text-gray-800">{isRtl ? 'שפה' : 'Language'}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-48">
              <SelectDropdown
                value={languageDirection}
                onChange={handleLanguageChange}
                options={LANGUAGE_OPTIONS}
                placeholder={isRtl ? 'בחר שפה' : 'Select language'}
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              {languageDirection === LanguageDirection.HEB ? (
                <>
                  <FontAwesomeIcon icon={faStarOfDavid} className="text-blue-500" />
                  <span>Hebrew / עברית</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFlagUsa} className="text-red-500" />
                  <span>English</span>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Settings
