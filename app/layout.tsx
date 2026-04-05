import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AppProvider from '../context/AppContext'
import { ProvidersProvider } from '@/context/ProvidersContext'
import { BudgetProvider } from '@/context/BudgetContext'
import { GuestsProvider } from '@/context/GuestsContext'
import { ShoppingProvider } from '@/context/ShoppingContext'
import { GiftsProvider } from '@/context/GiftsContext'
import { PublicNotesProvider } from '@/context/PublicNotesContext'
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
            <GuestsProvider>
              <GiftsProvider>
                <ShoppingProvider>
                  <BudgetProvider>
                    <PublicNotesProvider>
                      <AppLayout>{children}</AppLayout>
                    </PublicNotesProvider>
                  </BudgetProvider>
                </ShoppingProvider>
              </GiftsProvider>
            </GuestsProvider>
          </ProvidersProvider>
        </AppProvider>
      </body>
    </html>
  )
}
