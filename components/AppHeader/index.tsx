'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRing } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import PageName from '@/components/PageName'
import EventDetails from './EventDetails'
import Logo from './Logo'

const AppHeader = () => {
  const { languageDirection } = useAppContext()

  return (
    <div className={`flex flex-row items-start justify-between mb-2`} dir={languageDirection}>
      <PageName />
      <div className="flex flex-col">
        <Logo />
        <EventDetails />
      </div>
    </div>
  )
}

export default AppHeader
