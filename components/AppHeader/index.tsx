'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRing } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import PageName from '@/components/PageName'
import EventDetails from './EventDetails'

const AppHeader = () => {
  const { languageDirection } = useAppContext()

  return (
    <div className={`flex flex-row items-start justify-between mb-2`} dir={languageDirection}>
      <PageName />
      <div className="flex flex-col">
        <div className="flex flex-row gap-1 items-center animate-fade-in-0.5">
          <FontAwesomeIcon icon={faRing} className="text-gray-300 animate-pulse max-w-8" size="2x" />
          <span className="text-2xl font-bold text-gray-800 rounded-md">MazalTov</span>
        </div>
        <EventDetails />
      </div>
    </div>
  )
}

export default AppHeader
