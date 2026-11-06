'use client'

import Dashboard from '@/components/Dashboard'
import { TripsProvider } from '@/context/TripsContext'

const DashboardPage = () => (
  <TripsProvider>
    <Dashboard />
  </TripsProvider>
)

export default DashboardPage
