import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AppProvider from '../context/AppContext'
import { ProvidersProvider } from '@/context/ProvidersContext'
import { BudgetProvider } from '@/context/BudgetContext'
import { GuestsProvider } from '@/context/GuestsContext'
import AppLayout from '@/components/AppLayout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MazalTov - אפליקציה לניהול אירוע',
  description: 'MazalTov - managing events',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <ProvidersProvider>
            <BudgetProvider>
              <GuestsProvider>
                <AppLayout>{children}</AppLayout>
              </GuestsProvider>
            </BudgetProvider>
          </ProvidersProvider>
        </AppProvider>
      </body>
    </html>
  )
}
