'use client'

import { TripsProvider } from '@/context/TripsContext'
import Trips from '@/components/Trips'

const TripsPage = () => {
  return (
    <TripsProvider>
      <Trips />
    </TripsProvider>
  )
}

export default TripsPage
